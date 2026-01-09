
import React, { memo } from 'react';

interface StatusBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: string;
  unit?: string;
}

const StatusBar: React.FC<StatusBarProps> = memo(({ label, value, max, color, icon, unit = '%' }) => {
  const percentage = Math.max(0, Math.min(100, (value / max) * 100));
  const isCritical = percentage < 25;
  
  return (
    <div className="mb-3 hardware-accel">
      <div className="flex justify-between items-center mb-1.5">
        <span className="flex items-center gap-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          <span>{icon}</span> {label}
        </span>
        <span className={`text-[10px] font-mono font-bold ${isCritical ? 'text-red-500 animate-pulse' : 'text-slate-300'}`}>
          {value.toFixed(1)}{unit}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full transition-all duration-700 ease-out ${color} ${isCritical ? 'animate-pulse' : ''}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
});

export default StatusBar;
