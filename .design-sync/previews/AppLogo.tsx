import * as React from 'react';
import { AppLogo } from 'mft-ui';

export function Default() {
  return (
    <div style={{ background: 'var(--background)', padding: 24, borderRadius: 12, display: 'inline-block' }}>
      <AppLogo />
    </div>
  );
}

export function Compact() {
  return (
    <div style={{ background: 'var(--background)', padding: 16, borderRadius: 12, display: 'inline-block' }}>
      <AppLogo showText={false} />
    </div>
  );
}

export function InHeader() {
  return (
    <div style={{ background: 'var(--background)', padding: '12px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 16, minWidth: 320 }}>
      <AppLogo />
    </div>
  );
}
