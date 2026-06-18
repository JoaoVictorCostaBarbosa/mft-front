import * as React from 'react';
import { Input, Label } from 'mft-ui';

const dark = { background: 'var(--background)', padding: 16, borderRadius: 8, display: 'inline-block' } as const;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 280 }}>
    <Label>{label}</Label>
    {children}
  </div>
);

export function Default() {
  return <Input placeholder="Nome do exercício" style={{ width: 280 }} />;
}

export function WithLabel() {
  return (
    <div style={dark}>
      <Field label="Nome do exercício">
        <Input placeholder="Ex: Supino reto" />
      </Field>
    </div>
  );
}

export function States() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Input placeholder="Normal" style={{ width: 280 }} />
      <Input placeholder="Com valor" value="Supino reto" readOnly style={{ width: 280 }} />
      <Input placeholder="Desabilitado" disabled style={{ width: 280 }} />
    </div>
  );
}

export function Types() {
  return (
    <div style={{ ...dark, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Field label="E-mail">
        <Input type="email" placeholder="joao@example.com" />
      </Field>
      <Field label="Senha">
        <Input type="password" placeholder="••••••••" />
      </Field>
      <Field label="Número">
        <Input type="number" placeholder="80" />
      </Field>
    </div>
  );
}
