import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Sidebar } from '../components/Sidebar';
import { ActivityFeed } from '../components/ActivityFeed';
import { Chart } from '../components/ui/Chart';
import { useWebSocket } from '../hooks/useWebSocket';

const Dashboard = () => {
  const [portfolio, setPortfolio] = useState<any>(null);
  const [positions, setPositions] = useState<any[]>([]);
  const [activityItems, setActivityItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useWebSocket('ws://localhost:3001'); // Assume backend WS

  useEffect(() => {
    // Mock loading data
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPortfolio({
          totalValue: 12345.67,
          change24h: 0.025,
          breakdown: [
            { name: 'oqAssets', value: 70 },
            { name: 'Stablecoins', value: 20 },
            { name: 'LP Tokens', value: 10 },
          ],
        });
        setPositions([
          { id: '1', asset: 'oqAsset: Invoice #1234', collateral_value: 1000, loan_amount: 700, ltv: 70 },
        ]);
        setActivityItems([
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
        ]);
      } catch (err) {
        setError('Failed to load portfolio data');
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const sidebarItems = [
    { label: 'Overview', onClick: () => {} },
    { label: 'My Positions', onClick: () => {} },
    { label: 'Pools', onClick: () => window.location.href = '/app/pools' },
    { label: 'Tokenize', onClick: () => window.location.href = '/app/tokenize' },
    { label: 'Governance', onClick: () => window.location.href = '/app/governance' },
    { label: 'Settings', onClick: () => window.location.href = '/app/settings' },
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
              <div className="flex items-center justify-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-48 text-error-500">
                <p>{error}</p>
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
                  data={portfolio?.breakdown || []}
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
                  render: (value) => `$${value.toLocaleString()}`,
                },
                {
                  id: 'loan_amount',
                  label: 'Loan',
                  accessor: 'loan_amount',
                  render: (value) => `$${value.toLocaleString()}`,
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
                  render: () => (
                    <div className="space-x-2">
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

        {/* Activity Feed */}
        <div className="lg:col-span-3 order-3">
          <ActivityFeed
            items={activityItems}
            filter={['all']}
            className="sticky top-6"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;