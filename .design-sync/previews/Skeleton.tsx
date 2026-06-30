import * as React from 'react';
import { Skeleton } from 'mft-ui';

export function Text() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 280 }}>
      <Skeleton style={{ height: 20, width: '75%' }} />
      <Skeleton style={{ height: 16, width: '50%' }} />
    </div>
  );
}

export function Card() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: 320, padding: 20, border: '1px solid var(--border)', borderRadius: 12, background: 'var(--card)' }}>
      <Skeleton style={{ height: 20, width: '60%' }} />
      <Skeleton style={{ height: 14, width: '40%' }} />
      <Skeleton style={{ height: 14, width: '80%' }} />
    </div>
  );
}

export function List() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 320 }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Skeleton style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <Skeleton style={{ height: 16, width: '70%' }} />
            <Skeleton style={{ height: 12, width: '50%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
