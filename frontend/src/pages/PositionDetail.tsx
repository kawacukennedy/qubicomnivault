
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Banner } from '../components/ui/Banner';
import { Chart } from '../components/ui/Chart';
import { Skeleton } from '../components/ui/Skeleton';
import BorrowModal from '../components/BorrowModal';
import { usePositionDetails, usePositionLtvHistory } from '../services/api';

const PositionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);

  const { data: position, isLoading: positionLoading } = usePositionDetails(id || '');
  const { data: ltvHistory, isLoading: ltvLoading } = usePositionLtvHistory(id || '');

  const ltvData = ltvHistory || [
    { name: 'Jan 1', ltv: 65 },
    { name: 'Jan 2', ltv: 67 },
    { name: 'Jan 3', ltv: 69 },
    { name: 'Jan 4', ltv: 68 },
    { name: 'Jan 5', ltv: 70 },
  ];

  const metrics = position ? [
    { label: 'Collateral Value', value: `$${position.collateral_value?.toLocaleString() || '0'}` },
    { label: 'Loan Amount', value: `$${position.loan_amount?.toLocaleString() || '0'}` },
    { label: 'LTV', value: `${position.ltv?.toFixed(1) || '0'}%` },
  ] : [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy': return { label: 'Healthy', variant: 'success' as const };
      case 'at_risk': return { label: 'At Risk', variant: 'warning' as const };
      case 'liquidated': return { label: 'Liquidated', variant: 'error' as const };
      default: return { label: 'Unknown', variant: 'neutral' as const };
    }
  };

  if (positionLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-32 mb-6" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Position Not Found</h1>
            <p className="text-neutral-600">The requested position could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Summary Banner */}
        <Banner
          title={position.asset || 'Position Details'}
          statusBadge={getStatusBadge(position.status)}
          metrics={metrics}
          className="mb-6 sm:mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* LTV Chart */}
          <div>
            {ltvLoading ? (
              <Skeleton className="h-64" />
            ) : (
              <Chart
                type="line"
                data={ltvData}
                dataKey="ltv"
                height={260}
                className="bg-white p-6 rounded-medium shadow-subtle"
              />
            )}
          </div>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-4">
              <Button
                className="w-full"
                variant="solid"
                onClick={() => setBorrowModalOpen(true)}
                disabled={position.ltv >= 80}
              >
                Borrow More
              </Button>
              <Button className="w-full" variant="outline">
                Add Collateral
              </Button>
              <Button className="w-full" variant="outline">
                Repay
              </Button>
              <Button className="w-full" variant="outline">
                Close Position
              </Button>
            </div>
          </Card>

          {/* History */}
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Transaction History</h3>
            <div className="space-y-3">
              {/* Mock history items - in real implementation, fetch from API */}
              <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                <div>
                  <p className="font-medium">Loan Created</p>
                  <p className="text-sm text-neutral-600">Initial borrowing of $700</p>
                </div>
                <span className="text-sm text-neutral-500">Jan 15, 2024</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-200">
                <div>
                  <p className="font-medium">Interest Accrued</p>
                  <p className="text-sm text-neutral-600">$2.45 interest added</p>
                </div>
                <span className="text-sm text-neutral-500">Jan 14, 2024</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">Collateral Added</p>
                  <p className="text-sm text-neutral-600">$200 additional collateral</p>
                </div>
                <span className="text-sm text-neutral-500">Jan 10, 2024</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <BorrowModal
        isOpen={borrowModalOpen}
        onClose={() => setBorrowModalOpen(false)}
        oqAssetId={position.oqAsset_id || position.id}
        maxBorrowAmount={(position.collateral_value || 0) * 0.7 - (position.loan_amount || 0)}
        onSuccess={() => {
          // Refetch data
          window.location.reload();
        }}
      />
    </div>
  );
};

export default PositionDetail;