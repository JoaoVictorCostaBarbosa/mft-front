import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from 'mft-ui';

export function Default() {
  return (
    <Tabs defaultValue="treinos" style={{ width: 360 }}>
      <TabsList>
        <TabsTrigger value="treinos">Treinos</TabsTrigger>
        <TabsTrigger value="progresso">Progresso</TabsTrigger>
        <TabsTrigger value="historico">Histórico</TabsTrigger>
      </TabsList>
      <TabsContent value="treinos">
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', padding: 8 }}>
          3 treinos esta semana
        </p>
      </TabsContent>
      <TabsContent value="progresso">
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', padding: 8 }}>
          Meta: 80% concluída
        </p>
      </TabsContent>
    </Tabs>
  );
}

export function TwoTabs() {
  return (
    <Tabs defaultValue="exercicios" style={{ width: 320 }}>
      <TabsList>
        <TabsTrigger value="exercicios">Exercícios</TabsTrigger>
        <TabsTrigger value="detalhes">Detalhes</TabsTrigger>
      </TabsList>
      <TabsContent value="exercicios">
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', padding: 8 }}>
          4 exercícios no treino
        </p>
      </TabsContent>
      <TabsContent value="detalhes">
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)', padding: 8 }}>
          45 minutos · Peito
        </p>
      </TabsContent>
    </Tabs>
  );
}
