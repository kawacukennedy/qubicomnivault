import { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Chart } from '../components/ui/Chart';

const Pools = () => {
  const [pools, setPools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Mock data
    const loadPools = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setPools([
        {
          id: '1',
          name: 'oqAsset/USDC',
          tvl: 2500000,
          apr: 12.5,
          volume24h: 150000,
          myLiquidity: 5000,
        },
        {
          id: '2',
          name: 'oqAsset/DAI',
          tvl: 1800000,
          apr: 10.2,
          volume24h: 95000,
          myLiquidity: 0,
        },
        {
          id: '3',
          name: 'USDC/Stable',
          tvl: 5000000,
          apr: 8.7,
          volume24h: 300000,
          myLiquidity: 10000,
        },
      ]);
      setIsLoading(false);
    };
    loadPools();
  }, []);

  const poolChartData = [
    { name: 'oqAsset/USDC', value: 25 },
    { name: 'oqAsset/DAI', value: 18 },
    { name: 'USDC/Stable', value: 50 },
    { name: 'Others', value: 7 },
  ];

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Liquidity Pools</h1>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Total TVL</h3>
            <p className="text-xl sm:text-2xl font-bold text-primary-600">$9.3M</p>
          </Card>
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">My Liquidity</h3>
            <p className="text-xl sm:text-2xl font-bold text-success-600">$15K</p>
          </Card>
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">24h Volume</h3>
            <p className="text-xl sm:text-2xl font-bold text-accent-600">$545K</p>
          </Card>
          <Card className="p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2">Avg APR</h3>
            <p className="text-xl sm:text-2xl font-bold text-warning-600">10.5%</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pools Table */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Available Pools</h2>
              {isLoading ? (
                <div className="flex items-center justify-center h-48">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <Table
                  data={pools}
                  columns={[
                    { id: 'name', label: 'Pool', accessor: 'name' },
                    {
                      id: 'tvl',
                      label: 'TVL',
                      accessor: 'tvl',
                      render: (value) => `$${value.toLocaleString()}`,
                    },
                    {
                      id: 'apr',
                      label: 'APR',
                      accessor: 'apr',
                      render: (value) => `${value}%`,
                    },
                    {
                      id: 'volume24h',
                      label: '24h Volume',
                      accessor: 'volume24h',
                      render: (value) => `$${value.toLocaleString()}`,
                    },
                    {
                      id: 'myLiquidity',
                      label: 'My Liquidity',
                      accessor: 'myLiquidity',
                      render: (value) => value > 0 ? `$${value.toLocaleString()}` : '-',
                    },
                    {
                      id: 'actions',
                      label: 'Actions',
                      accessor: () => null,
                      render: (item) => (
                        <div className="space-x-2">
                          <Button size="sm" variant="outline">
                            {item.myLiquidity > 0 ? 'Add' : 'Provide'}
                          </Button>
                          {item.myLiquidity > 0 && (
                            <Button size="sm" variant="outline">
                              Remove
                            </Button>
                          )}
                        </div>
                      ),
                    },
                  ]}
                />
              )}
            </Card>
          </div>

          {/* Pool Distribution Chart */}
          <div>
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Pool Distribution</h2>
              <Chart
                type="pie"
                data={poolChartData}
                dataKey="value"
                height={300}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pools;