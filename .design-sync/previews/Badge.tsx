import * as React from 'react';
import { Badge } from 'mft-ui';

export function Default() {
  return <Badge>Novo</Badge>;
}

export function Secondary() {
  return <Badge variant="secondary">Em progresso</Badge>;
}

export function Success() {
  return <Badge variant="success">Concluído</Badge>;
}

export function Warning() {
  return <Badge variant="warning">Pendente</Badge>;
}

export function Destructive() {
  return <Badge variant="destructive">Atrasado</Badge>;
}

export function Outline() {
  return <Badge variant="outline">Rascunho</Badge>;
}

export function AllVariants() {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', padding: 16 }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="success">Concluído</Badge>
      <Badge variant="warning">Pendente</Badge>
      <Badge variant="destructive">Atrasado</Badge>
      <Badge variant="outline">Rascunho</Badge>
    </div>
  );
}
