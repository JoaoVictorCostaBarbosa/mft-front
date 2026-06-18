import * as React from 'react';
import { PageHeader, PageHeaderTitle, PageHeaderDescription, PageHeaderActions, Button, Badge } from 'mft-ui';

export function Default() {
  return (
    <div style={{ background: 'var(--background)', padding: '16px 20px', minWidth: 320 }}>
      <PageHeader>
        <PageHeaderTitle>Meus Treinos</PageHeaderTitle>
      </PageHeader>
    </div>
  );
}

export function WithDescription() {
  return (
    <div style={{ background: 'var(--background)', padding: '16px 20px', minWidth: 320 }}>
      <PageHeader>
        <PageHeaderTitle>Dashboard</PageHeaderTitle>
        <PageHeaderDescription>Acompanhe seu progresso desta semana</PageHeaderDescription>
      </PageHeader>
    </div>
  );
}

export function WithActions() {
  return (
    <div style={{ background: 'var(--background)', padding: '16px 20px', minWidth: 360 }}>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <PageHeaderTitle>Exercícios</PageHeaderTitle>
          <Badge variant="secondary">42 exercícios</Badge>
        </div>
        <PageHeaderDescription>Biblioteca completa de exercícios</PageHeaderDescription>
        <PageHeaderActions>
          <Button size="sm">Adicionar</Button>
          <Button size="sm" variant="outline">Filtrar</Button>
        </PageHeaderActions>
      </PageHeader>
    </div>
  );
}
