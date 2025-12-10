import { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Table } from '../components/ui/Table';
import { Chart } from '../components/ui/Chart';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { usePools, useProvideLiquidity, useRemoveLiquidity } from '../services/api';

const Pools = () => {
  const [liquidityModal, setLiquidityModal] = useState<{
    isOpen: boolean;
    type: 'provide' | 'remove';
    poolId: string;
    poolName: string;
  }>({ isOpen: false, type: 'provide', poolId: '', poolName: '' });
  const [amount, setAmount] = useState('');

  const { data: pools, isLoading } = usePools();
  const provideLiquidityMutation = useProvideLiquidity();
  const removeLiquidityMutation = useRemoveLiquidity();

  const poolChartData = pools ? pools.map((pool: any) => ({
    name: pool.name,
    value: pool.tvl || 0,
  })) : [];

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                       render: (value) => `$${value?.toLocaleString() || '0'}`,
                     },
                     {
                       id: 'apr',
                       label: 'APR',
                       accessor: 'apr',
                       render: (value) => `${value?.toFixed(2) || '0'}%`,
                     },
                     {
                       id: 'volume24h',
                       label: '24h Volume',
                       accessor: 'volume24h',
                       render: (value) => `$${value?.toLocaleString() || '0'}`,
                     },
                      {
                        id: 'myLiquidity',
                        label: 'My Liquidity',
                        accessor: 'myLiquidity',
                        render: (value) => (value && value > 0) ? `$${value.toLocaleString()}` : '-',
                      },
                      {
                        id: 'actions',
                        label: 'Actions',
                        accessor: () => null,
                         render: (item) => {
                          if (!item) return null;
                          const myLiquidity = item.myLiquidity || 0;
                          return (
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setLiquidityModal({
                                  isOpen: true,
                                  type: 'provide',
                                  poolId: item.id,
                                  poolName: item.name,
                                })}
                                className="w-full sm:w-auto"
                              >
                                {myLiquidity > 0 ? 'Add' : 'Provide'}
                              </Button>
                              {myLiquidity > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setLiquidityModal({
                                    isOpen: true,
                                    type: 'remove',
                                    poolId: item.id,
                                    poolName: item.name,
                                  })}
                                  className="w-full sm:w-auto"
                                >
                                  Remove
                                </Button>
                              )}
                            </div>
                          );
                        },
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

      <Modal
        isOpen={liquidityModal.isOpen}
        onClose={() => setLiquidityModal({ ...liquidityModal, isOpen: false })}
      >
        <ModalHeader>
          <ModalTitle>
            {liquidityModal.type === 'provide' ? 'Provide Liquidity' : 'Remove Liquidity'}
          </ModalTitle>
        </ModalHeader>
        <ModalContent>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600">
              {liquidityModal.type === 'provide'
                ? `Add liquidity to ${liquidityModal.poolName} pool`
                : `Remove liquidity from ${liquidityModal.poolName} pool`
              }
            </p>
            <div>
              <label className="block text-sm font-medium mb-2">Amount (USD)</label>
              <Input
                type="number"
                placeholder="1000.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={() => setLiquidityModal({ ...liquidityModal, isOpen: false })}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              if (!amount) return;
              try {
                if (liquidityModal.type === 'provide') {
                  await provideLiquidityMutation.mutateAsync({
                    poolId: liquidityModal.poolId,
                    amount: parseFloat(amount),
                  });
                } else {
                  await removeLiquidityMutation.mutateAsync({
                    poolId: liquidityModal.poolId,
                    amount: parseFloat(amount),
                  });
                }
                setLiquidityModal({ ...liquidityModal, isOpen: false });
                setAmount('');
                // Refetch pools data
                window.location.reload();
              } catch (error) {
                console.error('Liquidity operation failed:', error);
              }
            }}
            disabled={!amount || provideLiquidityMutation.isPending || removeLiquidityMutation.isPending}
          >
            {provideLiquidityMutation.isPending || removeLiquidityMutation.isPending
              ? 'Processing...'
              : 'Confirm'
            }
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Pools;