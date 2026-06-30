import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Label } from 'mft-ui';

export function Default() {
  return (
    <div style={{ width: 240 }}>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Selecione um músculo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="chest">Peito</SelectItem>
          <SelectItem value="back">Costas</SelectItem>
          <SelectItem value="legs">Pernas</SelectItem>
          <SelectItem value="arms">Braços</SelectItem>
          <SelectItem value="shoulders">Ombros</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

export function WithLabel() {
  return (
    <div style={{ background: 'var(--background)', padding: 16, borderRadius: 8, display: 'inline-block' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 240 }}>
        <Label>Grupo muscular</Label>
        <Select defaultValue="chest">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="chest">Peito</SelectItem>
            <SelectItem value="back">Costas</SelectItem>
            <SelectItem value="legs">Pernas</SelectItem>
            <SelectItem value="arms">Braços</SelectItem>
            <SelectItem value="shoulders">Ombros</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

export function WithValue() {
  return (
    <div style={{ width: 240 }}>
      <Select defaultValue="legs">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="chest">Peito</SelectItem>
          <SelectItem value="back">Costas</SelectItem>
          <SelectItem value="legs">Pernas</SelectItem>
          <SelectItem value="arms">Braços</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
