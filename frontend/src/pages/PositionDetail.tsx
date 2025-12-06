import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PositionDetail = () => {
  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Summary Banner */}
        <div className="bg-white rounded-large p-8 shadow-medium mb-8">
          <h1 className="text-3xl font-bold mb-4">oqAsset: Invoice #1234</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-neutral-600">Collateral Value</p>
              <p className="text-2xl font-semibold">$1,000</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">Loan Amount</p>
              <p className="text-2xl font-semibold">$700</p>
            </div>
            <div>
              <p className="text-sm text-neutral-600">LTV</p>
              <p className="text-2xl font-semibold">70%</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LTV Chart */}
          <Card>
            <CardHeader>
              <CardTitle>LTV Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '2024-01-01', ltv: 0.65 },
                    { date: '2024-01-02', ltv: 0.67 },
                    { date: '2024-01-03', ltv: 0.69 },
                    { date: '2024-01-04', ltv: 0.68 },
                    { date: '2024-01-05', ltv: 0.70 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="ltv" stroke="#229FFF" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full">Add Collateral</Button>
              <Button variant="outline" className="w-full">Repay</Button>
              <Button variant="outline" className="w-full">Close Position</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PositionDetail;