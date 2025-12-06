import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PieChart, Pie, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { useWebSocket } from '../hooks/useWebSocket';
import { usePortfolioStore } from '../stores/portfolioStore';
import { Table } from '../components/ui/Table';

const Dashboard = () => {
  const { portfolio, positions, setPortfolio, setPositions } = usePortfolioStore();
  useWebSocket('ws://localhost:3001'); // Assume backend WS

  useEffect(() => {
    // Mock real-time data
    setPortfolio({
      totalValue: 12345.67,
      change24h: 0.025,
      breakdown: [
        { name: 'oqAssets', value: 70 },
        { name: 'Stablecoins', value: 30 },
      ],
    });
    setPositions([
      { asset: 'oqAsset: Invoice #1234', collateral_value: 1000, loan_amount: 700, ltv: 70 },
    ]);
  }, [setPortfolio, setPositions]);

  return (
    <motion.div
      className="min-h-screen bg-neutral-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-subtle min-h-screen sticky top-0">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Dashboard</h2>
            <nav className="space-y-2">
              <a href="#" className="block px-4 py-2 rounded-medium bg-primary-50 text-primary-700">Overview</a>
              <a href="#" className="block px-4 py-2 rounded-medium text-neutral-600 hover:bg-neutral-100">My Positions</a>
              <a href="#" className="block px-4 py-2 rounded-medium text-neutral-600 hover:bg-neutral-100">Pools</a>
              <a href="/app/tokenize" className="block px-4 py-2 rounded-medium text-neutral-600 hover:bg-neutral-100">Tokenize</a>
              <a href="#" className="block px-4 py-2 rounded-medium text-neutral-600 hover:bg-neutral-100">Governance</a>
              <a href="/app/settings" className="block px-4 py-2 rounded-medium text-neutral-600 hover:bg-neutral-100">Settings</a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 order-2 lg:order-1">
            {/* Portfolio Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">${portfolio?.totalValue.toLocaleString()}</div>
                <div className="text-green-600">+{(portfolio?.change24h || 0) * 100}% (24h)</div>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={portfolio?.breakdown || []}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        fill="#229FFF"
                      >
                        <LabelList dataKey="name" position="outside" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Positions Table */}
            <Card>
              <CardHeader>
                <CardTitle>My Positions</CardTitle>
              </CardHeader>
              <CardContent>
                <Table
                  data={positions}
                  columns={[
                    { id: 'asset', label: 'Asset', accessor: 'asset' },
                    { id: 'collateral_value', label: 'Collateral Value', accessor: 'collateral_value', render: (value) => `$${value}` },
                    { id: 'loan_amount', label: 'Loan', accessor: 'loan_amount', render: (value) => `$${value}` },
                    { id: 'ltv', label: 'LTV', accessor: 'ltv', render: (value) => `${value}%` },
                    { id: 'actions', label: 'Actions', accessor: () => null, render: () => <Button size="sm" variant="outline">Repay</Button> },
                  ]}
                  onRowClick={(item) => console.log('Row clicked', item)}
                />
              </CardContent>
            </Card>
        </main>

        {/* Activity Feed */}
        <aside className="w-full lg:w-80 bg-white shadow-subtle min-h-screen p-6 order-3 lg:order-2">
          <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 rounded-medium">
              <p className="text-sm">Interest accrued: $5.23</p>
              <p className="text-xs text-neutral-500">2 hours ago</p>
            </div>
            <div className="p-4 bg-neutral-50 rounded-medium">
              <p className="text-sm">Position liquidated</p>
              <p className="text-xs text-neutral-500">1 day ago</p>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};

export default Dashboard;