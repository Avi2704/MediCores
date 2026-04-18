'use client';

import { AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Severity } from '@/types/health';

interface Props {
  severity: Severity;
  title: string;
  message: string;
  onDismiss?: () => void;
}

const config = {
  [Severity.CRITICAL]: {
    icon: AlertCircle,
    containerClass: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
    titleClass: 'text-red-800',
  },
  [Severity.WARNING]: {
    icon: AlertTriangle,
    containerClass: 'bg-amber-50 border-amber-200 text-amber-800',
    iconClass: 'text-amber-500',
    titleClass: 'text-amber-800',
  },
  [Severity.NORMAL]: {
    icon: Info,
    containerClass: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
    titleClass: 'text-green-800',
  },
};

export default function HealthAlert({ severity, title, message, onDismiss }: Props) {
  const { icon: Icon, containerClass, iconClass, titleClass } = config[severity];

  return (
    <div className={`flex items-start gap-3 rounded-xl border p-4 ${containerClass}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
      <div className="flex-1 min-w-0">
        <p className={`font-semibold text-sm ${titleClass}`}>{title}</p>
        <p className="text-sm mt-0.5 opacity-90">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="p-0.5 rounded hover:bg-black/10 transition-colors flex-shrink-0"
        >
          <X className="w-3.5 h-3.5 opacity-60" />
        </button>
      )}
    </div>
  );
}
