import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="flex">
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
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* Portfolio Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Portfolio Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$12,345.67</div>
                <div className="text-green-600">+2.5% (24h)</div>
                <div className="mt-4">
                  <div className="w-full bg-neutral-200 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <div className="text-sm text-neutral-600 mt-2">70% oqAssets, 30% Stablecoins</div>
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
        <aside className="w-80 bg-white shadow-subtle min-h-screen p-6">
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
    </div>
  );
};

export default Dashboard;