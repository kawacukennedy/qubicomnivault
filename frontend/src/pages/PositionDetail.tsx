
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Banner } from '../components/ui/Banner';
import { Chart } from '../components/ui/Chart';

const PositionDetail = () => {
  const ltvData = [
    { name: 'Jan 1', ltv: 65 },
    { name: 'Jan 2', ltv: 67 },
    { name: 'Jan 3', ltv: 69 },
    { name: 'Jan 4', ltv: 68 },
    { name: 'Jan 5', ltv: 70 },
  ];

  const metrics = [
    { label: 'Collateral Value', value: '$1,000' },
    { label: 'Loan Amount', value: '$700' },
    { label: 'LTV', value: '70%' },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Summary Banner */}
        <Banner
          title="oqAsset: Invoice #1234"
          statusBadge={{ label: 'Healthy', variant: 'success' }}
          metrics={metrics}
          className="mb-6 sm:mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* LTV Chart */}
          <div>
            <Chart
              type="line"
              data={ltvData}
              dataKey="ltv"
              height={260}
              className="bg-white p-6 rounded-medium shadow-subtle"
            />
          </div>

          {/* Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-4">
              <Button className="w-full" variant="solid">
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
        </div>
      </div>
    </div>
  );
};

export default PositionDetail;