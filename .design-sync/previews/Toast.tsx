import * as React from 'react';
import { Toast, ToastTitle, ToastDescription, ToastClose, ToastProvider, ToastViewport } from 'mft-ui';

const ToastStory = ({ title, description, variant }: { title: string; description?: string; variant?: string }) => (
  <ToastProvider>
    <Toast open={true} variant={variant as any}>
      <div style={{ flex: 1 }}>
        <ToastTitle>{title}</ToastTitle>
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>
      <ToastClose />
    </Toast>
    <ToastViewport />
  </ToastProvider>
);

export function Default() {
  return (
    <div style={{ position: 'relative', height: 100, width: 380 }}>
      <ToastStory title="Treino iniciado" description="Boa sorte na sessão de hoje!" />
    </div>
  );
}

export function Success() {
  return (
    <div style={{ position: 'relative', height: 100, width: 380 }}>
      <ToastStory title="Treino concluído!" description="Você completou todas as séries." />
    </div>
  );
}

export function Destructive() {
  return (
    <div style={{ position: 'relative', height: 100, width: 380 }}>
      <ToastStory title="Erro ao salvar" description="Verifique sua conexão e tente novamente." variant="destructive" />
    </div>
  );
}
