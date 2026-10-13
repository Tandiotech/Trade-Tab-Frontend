import React from 'react';
import { AccountStatus } from './types';

const StatusDot = ({ status }: { status: AccountStatus }) => {
  const color = {
    ok: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-rose-500',
  }[status];
  return <span className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />;
};

export default StatusDot;
