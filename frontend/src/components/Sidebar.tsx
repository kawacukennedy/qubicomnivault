import React, { useState } from 'react';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface SidebarItem {
  label: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  items: SidebarItem[];
  userWidget?: {
    avatar: string;
    name: string;
    qScore: number;
  };
  collapsible?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  items,
  userWidget,
  collapsible = true,
  collapsed = false,
  onToggleCollapse,
  className,
}) => {
  const [activeItem, setActiveItem] = useState(0);

  return (
    <div
      className={cn(
        'bg-neutral-50 border-r border-neutral-200 transition-all duration-300',
        {
          'w-16': collapsed,
          'w-64': !collapsed,
        },
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        {!collapsed && (
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-neutral-900">Dashboard</h2>
            {collapsible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleCollapse}
                className="p-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </Button>
            )}
          </div>
        )}
        {collapsed && collapsible && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1 w-full justify-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        )}
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index}>
              <button
                onClick={() => {
                  setActiveItem(index);
                  item.onClick?.();
                }}
                className={cn(
                  'w-full flex items-center px-3 py-2 rounded-medium text-left transition-colors',
                  {
                    'bg-primary-100 text-primary-700': activeItem === index,
                    'text-neutral-700 hover:bg-neutral-100': activeItem !== index,
                    'justify-center': collapsed,
                  }
                )}
              >
                {item.icon && (
                  <span className="mr-3 w-5 h-5 flex-shrink-0">
                    {/* Placeholder for icon */}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </span>
                )}
                {!collapsed && <span className="text-sm">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Widget */}
      {userWidget && (
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center space-x-3">
            <Avatar src={userWidget.avatar} alt={userWidget.name} size={32} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {userWidget.name}
                </p>
                <p className="text-xs text-neutral-600">
                  Q-Score: {userWidget.qScore}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { Sidebar };