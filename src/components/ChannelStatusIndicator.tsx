export interface ChannelStatusIndicatorProps {
  status: string;
  isPolling?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function ChannelStatusIndicator({ 
  status, 
  isPolling = false, 
  size = 'md' 
}: ChannelStatusIndicatorProps) {
  const getStatusColor = (status: string) => {
    const colors = {
      'CONNECTED': 'bg-green-900/20 text-green-400 border-green-600/30',
      'NOT_AUTHENTICATED': 'bg-yellow-900/20 text-yellow-400 border-yellow-600/30',
      'NOT_CONFIGURED': 'bg-red-900/20 text-red-400 border-red-600/30',
      'EXPIRED': 'bg-orange-900/20 text-orange-400 border-orange-600/30',
      'ERROR': 'bg-red-900/20 text-red-400 border-red-600/30'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-900/20 text-gray-400 border-gray-600/30';
  };

  const getStatusText = (status: string) => {
    const texts = {
      'CONNECTED': 'Conectado',
      'NOT_AUTHENTICATED': 'Não Autenticado',
      'NOT_CONFIGURED': 'Não Configurado',
      'EXPIRED': 'Expirado',
      'ERROR': 'Erro'
    };
    return texts[status as keyof typeof texts] || status;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      'CONNECTED': '✅',
      'NOT_AUTHENTICATED': '🔗',
      'NOT_CONFIGURED': '⚙️',
      'EXPIRED': '⏰',
      'ERROR': '❌'
    };
    return icons[status as keyof typeof icons] || '❓';
  };

  const getSizeClasses = (size: string) => {
    const sizes = {
      'sm': 'text-xs px-2 py-1',
      'md': 'text-sm px-3 py-1.5',
      'lg': 'text-base px-4 py-2'
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
  };

  return (
    <div className="relative inline-flex items-center">
      <span 
        className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${getStatusColor(status)} ${getSizeClasses(size)}`}
      >
        <span>{getStatusIcon(status)}</span>
        <span>{getStatusText(status)}</span>
        
        {isPolling && (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current"></div>
        )}
      </span>
    </div>
  );
} 