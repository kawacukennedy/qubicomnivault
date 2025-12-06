import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PieChart, Pie, ResponsiveContainer, Tooltip, LabelList } from 'recharts';
import { useWebSocket } from '../hooks/useWebSocket';
import { usePortfolioStore } from '../stores/portfolioStore';

const Dashboard = () => {
  const { setPortfolio, setPositions } = usePortfolioStore();
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
      { asset: 'oqAsset: Invoice #1234', collateral_value: 1000, loan_amount: 700, ltv: 0.7 },
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
                <div className="text-3xl font-bold">$12,345.67</div>
                <div className="text-green-600">+2.5% (24h)</div>
                <div className="mt-4 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'oqAssets', value: 70, fill: '#229FFF' },
                          { name: 'Stablecoins', value: 30, fill: '#FFB014' },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
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
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2">Asset</th>
                      <th className="text-left py-2">Collateral Value</th>
                      <th className="text-left py-2">Loan</th>
                      <th className="text-left py-2">LTV</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-neutral-100">
                      <td className="py-4">oqAsset: Invoice #1234</td>
                      <td>$1,000</td>
                      <td>$700</td>
                      <td>70%</td>
                      <td>
                        <Button size="sm" variant="outline">Repay</Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </div>
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