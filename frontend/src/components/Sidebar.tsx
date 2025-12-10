import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';

interface SidebarItem {
  label: string;
  icon?: React.ReactNode;
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
    <motion.div
      className={cn(
        'bg-neutral-50 border-r border-neutral-200 overflow-hidden',
        className
      )}
      animate={{
        width: collapsed ? 64 : 256,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30,
      }}
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
                 aria-label="Collapse sidebar"
                 className="p-1"
               >
                 <svg
                   className="w-4 h-4"
                   fill="none"
                   stroke="currentColor"
                   viewBox="0 0 24 24"
                   aria-hidden="true"
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
            aria-label="Expand sidebar"
            className="p-1 w-full justify-center"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      <nav className="flex-1 p-4" aria-label="Main navigation">
        <ul className="space-y-2" role="list">
          {items.map((item, index) => (
            <li key={index} role="listitem">
              <button
                onClick={() => {
                  setActiveItem(index);
                  item.onClick?.();
                }}
                aria-current={activeItem === index ? 'page' : undefined}
                aria-label={collapsed ? item.label : undefined}
                className={cn(
                  'w-full flex items-center px-3 py-3 rounded-medium text-left transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                  {
                    'bg-primary-100 text-primary-700 shadow-sm': activeItem === index,
                    'text-neutral-700 hover:bg-neutral-50 hover:shadow-sm': activeItem !== index,
                    'justify-center': collapsed,
                  }
                )}
              >
                {item.icon && (
                  <span className={cn("flex-shrink-0", collapsed ? "w-6 h-6" : "w-5 h-5 mr-3")} aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Widget */}
      {userWidget && (
        <div className="p-4 border-t border-neutral-200" role="region" aria-label="User profile">
          <div className="flex items-center space-x-3">
            <Avatar src={userWidget.avatar} alt={`${userWidget.name} avatar`} size={32} />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate" aria-label="User name">
                  {userWidget.name}
                </p>
                <p className="text-xs text-neutral-600" aria-label="Q-Score">
                  Q-Score: {userWidget.qScore}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export { Sidebar };