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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
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
          {/* Portfolio Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Portfolio Value</h2>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-6 w-1/4" />
                <SkeletonChart />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 text-error-500">
                <p>{error.message}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </Button>
              </div>
            ) : (
              <>
                <div className="text-3xl font-bold mb-2">
                  ${portfolio?.totalValue.toLocaleString()}
                </div>
                <div className="text-success-600 mb-4">
                  +{(portfolio?.change24h || 0) * 100}% (24h)
                </div>
                 <Chart
                   type="bar"
                   data={(portfolio?.breakdown || []).map(item => ({ ...item, value: item.value || 0 }))}
                   dataKey="value"
                   height={200}
                 />
              </>
            )}
            </Card>
          </motion.div>

          {/* Positions Table */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">My Positions</h2>
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
                   label: 'Loan',
                   accessor: 'loan_amount',
                   render: (value) => `$${value?.toLocaleString() || '0'}`,
                 },
                {
                  id: 'ltv',
                  label: 'LTV',
                  accessor: 'ltv',
                  render: (value) => `${value}%`,
                },
                     {
                       id: 'actions',
                       label: 'Actions',
                       accessor: () => null,
                       render: (item) => (
                         <div className="space-x-2">
                           <Button
                             size="sm"
                             variant="solid"
                             onClick={() => {
                               setSelectedPosition(item);
                               setBorrowModalOpen(true);
                             }}
                           >
                             Borrow
                           </Button>
                           <Button size="sm" variant="outline">
                             Repay
                           </Button>
                           <Button size="sm" variant="outline">
                             Add Collateral
                           </Button>
                         </div>
                       ),
                     },
              ]}
              onRowClick={(item) => console.log('Row clicked', item)}
            />
          </Card>
        </div>

         {/* Activity Feed & Quick Actions */}
         <div className="lg:col-span-3 order-3 space-y-6">
           <ActivityFeed
             items={activityItems}
             filter={['all']}
             className="sticky top-6"
           />

           {/* Quick Actions */}
           <Card className="p-6">
             <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <Button
                 variant="solid"
                 className="w-full"
                 onClick={() => navigate('/app/tokenize')}
               >
                 Tokenize Asset
               </Button>
               <Button
                 variant="outline"
                 className="w-full"
                 onClick={() => navigate('/app/pools')}
               >
                 Provide Liquidity
               </Button>
               <Button
                 variant="outline"
                 className="w-full"
                 onClick={() => navigate('/app/governance')}
               >
                 Vote in Governance
               </Button>
               <Button
                 variant="outline"
                 className="w-full"
                 onClick={() => navigate('/app/settings')}
               >
                 Manage Settings
               </Button>
             </div>
           </Card>
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