import * as React from 'react';
import { EmptyState, Button } from 'mft-ui';

const wrap = { background: 'var(--background)', padding: 16, borderRadius: 8, display: 'inline-block' } as const;

export function Default() {
  return (
    <div style={wrap}>
      <EmptyState
        title="Nenhum treino encontrado"
        description="Você ainda não tem treinos cadastrados."
        style={{ maxWidth: 400 }}
      />
    </div>
  );
}

export function WithAction() {
  return (
    <div style={wrap}>
      <EmptyState
        title="Comece seu primeiro treino"
        description="Crie um plano e registre seu progresso."
        action={<Button>Criar treino</Button>}
        style={{ maxWidth: 400 }}
      />
    </div>
  );
}

export function WithDescription() {
  return (
    <div style={wrap}>
      <EmptyState
        title="Sem exercícios aqui"
        description="Adicione exercícios ao seu plano de treino para começar a acompanhar seu progresso."
        style={{ maxWidth: 400 }}
      />
    </div>
  );
}
