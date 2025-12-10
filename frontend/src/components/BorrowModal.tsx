import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from './ui/Modal';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { useCreateLoan } from '../services/api';

const borrowSchema = z.object({
  amount: z.number().min(1, 'Amount must be positive'),
});

type BorrowForm = z.infer<typeof borrowSchema>;

interface BorrowModalProps {
  isOpen: boolean;
  onClose: () => void;
  oqAssetId: string;
  maxBorrowAmount: number;
  onSuccess?: () => void;
}

const BorrowModal: React.FC<BorrowModalProps> = ({
  isOpen,
  onClose,
  oqAssetId,
  maxBorrowAmount,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createLoanMutation = useCreateLoan();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BorrowForm>({
    resolver: zodResolver(borrowSchema),
  });

  const amount = watch('amount') || 0;
  const ltv = maxBorrowAmount > 0 ? (amount / maxBorrowAmount) * 100 : 0;

  const onSubmit = async (data: BorrowForm) => {
    setIsSubmitting(true);
    try {
      await createLoanMutation.mutateAsync({
        oqAsset_id: oqAssetId,
        amount_usd: data.amount,
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Borrow failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>
        <ModalTitle>Borrow Against Collateral</ModalTitle>
      </ModalHeader>
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Borrow Amount (USD)
            </label>
            <Input
              type="number"
              placeholder="1000.00"
              {...register('amount', { valueAsNumber: true })}
              variant={errors.amount ? 'error' : 'default'}
            />
            {errors.amount && (
              <p className="text-error-500 text-sm mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div className="bg-neutral-50 p-4 rounded-medium">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-600">Max Borrow:</span>
                <p className="font-semibold">${maxBorrowAmount.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-neutral-600">Est. LTV:</span>
                <p className={`font-semibold ${ltv > 80 ? 'text-warning-600' : 'text-success-600'}`}>
                  {ltv.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className="text-sm text-neutral-600">
            <p>• Interest accrues daily at variable rates</p>
            <p>• Maintain LTV below 80% to avoid liquidation</p>
            <p>• Gas fees apply for on-chain transaction</p>
          </div>
        </form>
      </ModalContent>
      <ModalFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || amount > maxBorrowAmount}
        >
          {isSubmitting ? 'Borrowing...' : 'Confirm Borrow'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default BorrowModal;