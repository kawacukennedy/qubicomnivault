import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDisconnect } from 'wagmi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Sidebar } from '../components/Sidebar';
import { ActivityFeed } from '../components/ActivityFeed';
import { Chart } from '../components/ui/Chart';
import { SkeletonChart, Skeleton } from '../components/ui/Skeleton';
import { useWebSocket } from '../hooks/useWebSocket';
import { usePortfolioSummary, usePositions } from '../services/api';
import BorrowModal from '../components/BorrowModal';

interface Portfolio {
  totalValue: number;
  change24h: number;
  breakdown: { name: string; value: number }[];
}

interface Position {
  id: string;
  asset: string;
  collateral_value: number;
  loan_amount: number;
  ltv: number;
  status: string;
  interest_rate: number;
  created_at: string;
}

interface ActivityItem {
  id: string;
  type: 'transaction' | 'alert' | 'update' | 'governance' | 'liquidity';
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  metadata?: any;
}

const Dashboard = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<any>(null);
  const navigate = useNavigate();
  const { disconnect } = useDisconnect();

  // Real API calls
  const { data: portfolioData, isLoading: portfolioLoading, error: portfolioError, refetch: refetchPortfolio } = usePortfolioSummary();
  const { data: positionsData, isLoading: positionsLoading, error: positionsError, refetch: refetchPositions } = usePositions();

  useWebSocket('ws://localhost:3001'); // Assume backend WS

  // Transform API data to component format
  const portfolio: Portfolio | null = portfolioData ? {
    totalValue: portfolioData.total_value_usd,
    change24h: portfolioData.change_24h_percentage,
    breakdown: portfolioData.breakdown.map((item: any) => ({
      name: item.name,
      value: item.value * 100, // Convert to percentage for chart
    })),
  } : null;

  const positions: Position[] = positionsData || [];

  // Mock activity data for now (will be replaced with real API)
  const activityItems: ActivityItem[] = [
    {
      id: '1',
      type: 'transaction',
      title: 'Interest Accrued',
      description: 'Interest accrued on position',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      amount: 5.23,
    },
    {
      id: '2',
      type: 'alert',
      title: 'Position Liquidated',
      description: 'Position was liquidated due to high LTV',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const isLoading = portfolioLoading || positionsLoading;
  const error = portfolioError || positionsError;

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    disconnect();
    navigate('/connect');
  };

  const sidebarItems = [
    {
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
        </svg>
      ),
      onClick: () => {}
    },
    {
      label: 'My Positions',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      onClick: () => {}
    },
    {
      label: 'Pools',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      onClick: () => window.location.href = '/app/pools'
    },
    {
      label: 'Tokenize',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: () => window.location.href = '/app/tokenize'
    },
    {
      label: 'Governance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: () => window.location.href = '/app/governance'
    },
    {
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      onClick: () => window.location.href = '/app/settings'
    },
    {
      label: 'Logout',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
      onClick: handleLogout
    },
  ];

  const userWidget = {
    avatar: '',
    name: 'Alice',
    qScore: 72,
  };

  return (
    <motion.div
      className="min-h-screen bg-neutral-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dashboard Header */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">
                Welcome back, {userWidget.name}!
              </h1>
              <p className="text-neutral-600 mt-1">
                Here's what's happening with your portfolio today.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-neutral-500">Q-Score</div>
                <div className="text-lg font-semibold text-primary-600">{userWidget.qScore}/100</div>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold text-primary-600">
                  {userWidget.name.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6 lg:p-8">
        {/* Sidebar */}
        <div className="lg:col-span-3 order-2 lg:order-1">
          <Sidebar
            items={sidebarItems}
            userWidget={userWidget}
            collapsible
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="sticky top-6"
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary-600">
                {positions.length}
              </div>
              <div className="text-sm text-neutral-600">Active Positions</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-success-600">
                ${positions.reduce((sum, pos) => sum + (pos.collateral_value || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600">Total Collateral</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-warning-600">
                ${positions.reduce((sum, pos) => sum + (pos.loan_amount || 0), 0).toLocaleString()}
              </div>
              <div className="text-sm text-neutral-600">Outstanding Loans</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-accent-600">
                {positions.length > 0 ? (positions.reduce((sum, pos) => sum + (pos.interest_rate || 0), 0) / positions.length).toFixed(1) : '0'}%
              </div>
              <div className="text-sm text-neutral-600">Avg Interest Rate</div>
            </Card>
          </motion.div>

          {/* Portfolio Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">Portfolio Overview</h2>
                  <p className="text-neutral-600 mt-1">Your total portfolio value and performance</p>
                </div>
                <div className="mt-4 lg:mt-0 flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/app/tokenize')}
                  >
                    Add Asset
                  </Button>
                  <Button
                    variant="solid"
                    size="sm"
                    onClick={() => navigate('/app/pools')}
                  >
                    View Pools
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <Skeleton className="h-12 w-48" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                  <SkeletonChart />
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center h-48 text-error-500">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-4 text-error-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <p className="text-lg font-medium mb-2">Unable to load portfolio data</p>
                    <p className="text-sm text-neutral-600 mb-4">{error.message}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.reload()}
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                    <div>
                      <div className="text-4xl font-bold text-neutral-900 mb-1">
                        ${portfolio?.totalValue.toLocaleString() || '0'}
                      </div>
                      <div className={`text-lg font-medium ${(portfolio?.change24h || 0) >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                        {(portfolio?.change24h || 0) >= 0 ? '+' : ''}{(portfolio?.change24h || 0) * 100}% (24h)
                      </div>
                    </div>
                    <div className="flex-1 lg:ml-8">
                      <Chart
                        type="bar"
                        data={(portfolio?.breakdown || []).map(item => ({ ...item, value: item.value || 0 }))}
                        dataKey="value"
                        height={120}
                      />
                    </div>
                  </div>

                  {portfolio?.breakdown && portfolio.breakdown.length > 0 && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-neutral-200">
                      {portfolio.breakdown.slice(0, 4).map((item, index) => (
                        <div key={index} className="text-center">
                          <div className="text-sm font-medium text-neutral-600">{item.name}</div>
                          <div className="text-lg font-semibold text-neutral-900">{item.value.toFixed(1)}%</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Positions Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-neutral-900">My Positions</h2>
                  <p className="text-neutral-600 mt-1">Manage your collateralized positions</p>
                </div>
                {positions.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/app/positions')}
                    className="mt-4 sm:mt-0"
                  >
                    View All
                  </Button>
                )}
              </div>

              {positions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 mx-auto mb-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No positions yet</h3>
                  <p className="text-neutral-600 mb-6">Start by tokenizing an asset to create your first position.</p>
                  <Button onClick={() => navigate('/app/tokenize')}>
                    Tokenize Your First Asset
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table
                    data={positions}
                    columns={[
                      { id: 'asset', label: 'Asset', accessor: 'asset' },
                      {
                        id: 'collateral_value',
                        label: 'Collateral Value',
                        accessor: 'collateral_value',
                        render: (value) => `$${value?.toLocaleString() || '0'}`,
                      },
                      {
                        id: 'loan_amount',
                        label: 'Loan Amount',
                        accessor: 'loan_amount',
                        render: (value) => `$${value?.toLocaleString() || '0'}`,
                      },
                      {
                        id: 'ltv',
                        label: 'LTV',
                        accessor: 'ltv',
                        render: (value) => {
                          const ltv = value || 0;
                          const color = ltv > 80 ? 'text-error-600' : ltv > 60 ? 'text-warning-600' : 'text-success-600';
                          return <span className={`font-medium ${color}`}>{ltv}%</span>;
                        },
                      },
                      {
                        id: 'status',
                        label: 'Status',
                        accessor: 'status',
                        render: (value) => {
                          const status = value || 'active';
                          const variants = {
                            active: 'success',
                            at_risk: 'warning',
                            liquidated: 'error'
                          } as const;
                          return (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                              ${status === 'active' ? 'bg-success-100 text-success-800' :
                                status === 'at_risk' ? 'bg-warning-100 text-warning-800' :
                                'bg-error-100 text-error-800'}`}>
                              {status.replace('_', ' ')}
                            </span>
                          );
                        },
                      },
                      {
                        id: 'actions',
                        label: 'Actions',
                        accessor: () => null,
                        render: (item) => (
                          <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                            <Button
                              size="sm"
                              variant="solid"
                              onClick={() => {
                                setSelectedPosition(item);
                                setBorrowModalOpen(true);
                              }}
                              className="w-full sm:w-auto"
                            >
                              Borrow
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/app/positions/${item.id}`)}
                              className="w-full sm:w-auto"
                            >
                              Manage
                            </Button>
                          </div>
                        ),
                      },
                    ]}
                    onRowClick={(item) => navigate(`/app/positions/${item.id}`)}
                  />
                </div>
              )}
            </Card>
          </motion.div>
        </div>

          {/* Activity Feed & Quick Actions */}
          <div className="lg:col-span-3 order-3 space-y-6">
            {/* Activity Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {activityItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-medium">
                      <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        item.type === 'transaction' ? 'bg-success-500' :
                        item.type === 'alert' ? 'bg-error-500' :
                        'bg-primary-500'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-neutral-600 mt-1">
                          {item.description}
                        </p>
                        <p className="text-xs text-neutral-500 mt-1">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {activityItems.length === 0 && (
                    <div className="text-center py-8 text-neutral-500">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <p className="text-sm">No recent activity</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={() => {/* Could navigate to full activity page */}}
                >
                  View All Activity
                </Button>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    variant="solid"
                    className="w-full justify-start"
                    onClick={() => navigate('/app/tokenize')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Tokenize Asset
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/app/pools')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Provide Liquidity
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/app/governance')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vote in Governance
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate('/app/settings')}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage Settings
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>
      </div>

      {selectedPosition && (
        <BorrowModal
          isOpen={borrowModalOpen}
          onClose={() => setBorrowModalOpen(false)}
          oqAssetId={selectedPosition.asset_id || selectedPosition.id} // Adjust based on actual data structure
          maxBorrowAmount={selectedPosition.collateral_value * 0.7} // 70% LTV max
          onSuccess={() => {
            refetchPositions();
            refetchPortfolio();
          }}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;