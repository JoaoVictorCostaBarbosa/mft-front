import * as React from 'react';
import { PageContainer, PageHeader, PageHeaderTitle, Card, CardHeader, CardTitle, CardContent } from 'mft-ui';

export function Default() {
  return (
    <div style={{ background: 'var(--background)', height: 400, overflow: 'hidden' }}>
      <PageContainer style={{ minHeight: 'auto', maxWidth: '100%', background: 'var(--background)' }}>
        <PageHeader>
          <PageHeaderTitle>Dashboard</PageHeaderTitle>
        </PageHeader>
        <Card>
          <CardHeader><CardTitle>Resumo semanal</CardTitle></CardHeader>
          <CardContent>
            <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>3 treinos concluídos</p>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}

export function Structure() {
  return (
    <div style={{ background: 'var(--background)', height: 300, overflow: 'hidden', position: 'relative' }}>
      <PageContainer style={{ minHeight: 'auto', maxWidth: '100%', background: 'var(--background)', paddingTop: 16, paddingBottom: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ height: 40, background: 'var(--card)', borderRadius: 8, display: 'flex', alignItems: 'center', paddingLeft: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--foreground)', fontWeight: 600 }}>Cabeçalho da página</span>
          </div>
          <div style={{ height: 80, background: 'var(--card)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 13, color: 'var(--muted-foreground)' }}>Conteúdo principal</span>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
