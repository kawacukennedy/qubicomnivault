import React from 'react';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';

interface ActivityItem {
  id: string;
  type: 'transaction' | 'alert' | 'update' | 'governance' | 'liquidity';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  metadata?: any;
}

interface ActivityFeedProps {
  items: ActivityItem[];
  filter?: ('all' | 'alerts' | 'transactions')[];
  className?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
  items,
  filter = ['all'],
  className,
}) => {
  const filteredItems = items.filter((item) => {
    if (filter.includes('all')) return true;
    if (filter.includes('alerts') && item.type === 'alert') return true;
    if (filter.includes('transactions') && item.type === 'transaction') return true;
    return false;
  });

  const getBadgeVariant = (type: string) => {
    switch (type) {
      case 'alert':
        return 'warning';
      case 'transaction':
        return 'success';
      default:
        return 'neutral';
    }
  };

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-3 p-3 rounded-medium bg-neutral-50 hover:bg-neutral-100 transition-colors"
          >
            <Badge variant={getBadgeVariant(item.type)} className="mt-1">
              {item.type}
            </Badge>
            <div className="flex-1">
              <p className="text-sm font-medium text-neutral-900">
                {item.title}
              </p>
              <p className="text-xs text-neutral-600">{item.description}</p>
              <p className="text-xs text-neutral-500 mt-1">
                {new Date(item.timestamp).toLocaleString()}
                {item.amount && (
                  <span className="ml-2 font-mono">
                    ${item.amount.toLocaleString()}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export { ActivityFeed };