import * as React from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter, Button } from 'mft-ui';

// Use Dialog (root) for context only — no DialogContent/DialogPortal so the card
// renders inline without any portal or position:fixed behavior.
const cardClass =
  'relative grid w-full max-w-lg gap-4 rounded-lg border border-border bg-background/90 p-5 text-foreground shadow-lg backdrop-blur-xl';

export function Open() {
  return (
    <div style={{ background: 'var(--background)', padding: 32, borderRadius: 12, display: 'inline-block', minWidth: 380 }}>
      <Dialog open={true}>
        <div className={cardClass}>
          <DialogHeader>
            <DialogTitle>Excluir treino</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este treino? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">Cancelar</Button>
            <Button variant="destructive">Excluir</Button>
          </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}

export function Confirm() {
  return (
    <div style={{ background: 'var(--background)', padding: 32, borderRadius: 12, display: 'inline-block', minWidth: 380 }}>
      <Dialog open={true}>
        <div className={cardClass}>
          <DialogHeader>
            <DialogTitle>Concluir sessão?</DialogTitle>
            <DialogDescription>
              Você está prestes a finalizar o treino de hoje.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary">Continuar</Button>
            <Button>Finalizar</Button>
          </DialogFooter>
        </div>
      </Dialog>
    </div>
  );
}
