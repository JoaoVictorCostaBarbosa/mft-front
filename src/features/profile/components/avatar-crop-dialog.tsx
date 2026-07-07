"use client";

import { Loader2, ZoomIn, ZoomOut } from "lucide-react";
import * as React from "react";
import Cropper, { type Area } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Lado do JPEG exportado; recortes menores mantêm o tamanho original.
const OUTPUT_MAX_SIZE_PX = 1024;

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Não foi possível carregar a imagem."));
    image.src = src;
  });
}

async function cropImageToFile(imageSrc: string, area: Area): Promise<File> {
  const image = await loadImage(imageSrc);
  const size = Math.min(Math.round(area.width), OUTPUT_MAX_SIZE_PX);

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Seu navegador não suporta o recorte de imagens.");
  }

  context.drawImage(
    image,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    size,
    size,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.9),
  );
  if (!blob) {
    throw new Error("Não foi possível gerar a imagem recortada.");
  }

  return new File([blob], "avatar.jpg", { type: "image/jpeg" });
}

type AvatarCropDialogProps = {
  file: File | null;
  isSubmitting: boolean;
  onCancel: () => void;
  onConfirm: (file: File) => Promise<void>;
};

export function AvatarCropDialog({
  file,
  isSubmitting,
  onCancel,
  onConfirm,
}: AvatarCropDialogProps) {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [crop, setCrop] = React.useState({ x: 0, y: 0 });
  const [zoom, setZoom] = React.useState(1);
  const [croppedArea, setCroppedArea] = React.useState<Area | null>(null);
  const [isCropping, setIsCropping] = React.useState(false);

  React.useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setCroppedArea(null);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const isBusy = isCropping || isSubmitting;

  async function handleConfirm() {
    if (!imageSrc || !croppedArea) return;

    setIsCropping(true);
    try {
      const croppedFile = await cropImageToFile(imageSrc, croppedArea);
      await onConfirm(croppedFile);
    } finally {
      setIsCropping(false);
    }
  }

  return (
    <Dialog open={file !== null} onOpenChange={(open) => !open && !isBusy && onCancel()}>
      <DialogContent showCloseButton={!isBusy}>
        <DialogHeader>
          <DialogTitle>Ajustar foto</DialogTitle>
          <DialogDescription>
            Arraste e use o zoom para escolher a parte da foto que será enviada.
          </DialogDescription>
        </DialogHeader>

        <div className="relative h-[300px] w-full overflow-hidden rounded-[20px] bg-black">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              minZoom={1}
              maxZoom={4}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) => setCroppedArea(croppedAreaPixels)}
            />
          ) : null}
        </div>

        <div className="flex items-center gap-3">
          <ZoomOut className="size-4 shrink-0 text-muted-foreground" />
          <input
            type="range"
            min={1}
            max={4}
            step={0.01}
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            disabled={isBusy}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary"
            aria-label="Zoom da foto"
          />
          <ZoomIn className="size-4 shrink-0 text-muted-foreground" />
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            disabled={isBusy}
            onClick={onCancel}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={isBusy || !croppedArea}
            onClick={() => void handleConfirm()}
          >
            {isBusy ? <Loader2 className="size-4 animate-spin" /> : "Salvar foto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
