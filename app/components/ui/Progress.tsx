interface ProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  color?: 'blue' | 'yellow' | 'purple' | 'green' | 'orange' | 'pink';
}

export function Progress({ 
  value, 
  size = 'md', 
  showValue = false,
  color = 'blue'
}: ProgressProps) {
  // Ensure value is between 0 and 100
  const safeValue = Math.min(100, Math.max(0, value));
  
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    blue: 'bg-blue-500',
    yellow: 'bg-yellow-500',
    purple: 'bg-purple-500',
    green: 'bg-emerald-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500'
  };

  return (
    <div className="relative">
      <div className={`w-full bg-gray-100 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div
          className={`${colorClasses[color]} rounded-full h-full`}
          style={{ 
            width: `${safeValue}%`,
            transitionProperty: 'width',
            transitionDuration: '500ms',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showValue && (
        <span 
          className={`absolute right-0 -top-6 text-sm font-medium text-${color}-600`}
          style={{ 
            transitionProperty: 'opacity',
            transitionDuration: '150ms'
          }}
        >
          {Math.round(safeValue)}%
        </span>
      )}
    </div>
  );
} 