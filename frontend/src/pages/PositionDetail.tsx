import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
              <div className="h-64 bg-neutral-100 rounded-medium flex items-center justify-center">
                <p>Chart Placeholder</p>
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