import * as React from 'react';
import { Button } from 'mft-ui';

const Row = ({ children }: { children: React.ReactNode }) => (
  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
    {children}
  </div>
);

export function Default() {
  return <Button>Iniciar treino</Button>;
}

export function Secondary() {
  return <Button variant="secondary">Cancelar</Button>;
}

export function Destructive() {
  return <Button variant="destructive">Excluir treino</Button>;
}

export function Outline() {
  return <Button variant="outline">Ver detalhes</Button>;
}

export function Ghost() {
  return (
    <div style={{ background: 'var(--background)', padding: 16, borderRadius: 8, display: 'inline-block' }}>
      <Button variant="ghost">Editar</Button>
    </div>
  );
}

export function AllVariants() {
  return (
    <Row>
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
    </Row>
  );
}

export function Sizes() {
  return (
    <Row>
      <Button size="sm">Pequeno</Button>
      <Button>Médio</Button>
      <Button size="lg">Grande</Button>
    </Row>
  );
}

export function Disabled() {
  return <Button disabled>Indisponível</Button>;
}
