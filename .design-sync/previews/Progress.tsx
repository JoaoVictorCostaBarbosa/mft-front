import * as React from 'react';
import { Progress } from 'mft-ui';

export function Default() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <Progress value={60} />
    </div>
  );
}

export function Empty() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <Progress value={0} />
    </div>
  );
}

export function Full() {
  return (
    <div style={{ width: 320, padding: 16 }}>
      <Progress value={100} />
    </div>
  );
}

export function Steps() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, padding: 16 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span>Treinos concluídos</span>
          <span>3/5</span>
        </div>
        <Progress value={60} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span>Meta semanal</span>
          <span>80%</span>
        </div>
        <Progress value={80} />
      </div>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
          <span>Séries realizadas</span>
          <span>12/20</span>
        </div>
        <Progress value={40} />
      </div>
    </div>
  );
}
