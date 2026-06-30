import * as React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Button, Badge } from 'mft-ui';

export function Default() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Treino de Peito</CardTitle>
        <CardDescription>Terça-feira · 45 min</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
          4 exercícios · 12 séries
        </p>
      </CardContent>
    </Card>
  );
}

export function WithFooter() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <CardTitle>Plano Semanal</CardTitle>
        <CardDescription>5 treinos planejados esta semana</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
          Segunda, Terça, Quarta, Sexta, Sábado
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Ver plano</Button>
      </CardFooter>
    </Card>
  );
}

export function WithBadge() {
  return (
    <Card style={{ maxWidth: 360 }}>
      <CardHeader>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <CardTitle>Supino Reto</CardTitle>
          <Badge variant="success">Concluído</Badge>
        </div>
        <CardDescription>Peito · 3×10</CardDescription>
      </CardHeader>
      <CardContent>
        <p style={{ fontSize: 14, color: 'var(--muted-foreground)' }}>
          80 kg · PR alcançado
        </p>
      </CardContent>
    </Card>
  );
}
