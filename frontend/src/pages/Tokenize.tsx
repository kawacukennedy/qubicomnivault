import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Stepper } from '../components/ui/Stepper';
import { Modal, ModalHeader, ModalTitle, ModalContent, ModalFooter } from '../components/ui/Modal';
import { useTokenize, useValuation, useMint } from '../services/api';
import { useWebSocket } from '../hooks/useWebSocket';

const steps = [
  { id: 'upload', label: 'Upload Documents' },
  { id: 'valuation', label: 'Automatic Valuation' },
  { id: 'mint', label: 'Mint oqAsset' },
];

const tokenizeSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title too long'),
  amount: z.number().min(1, 'Amount must be positive'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type TokenizeForm = z.infer<typeof tokenizeSchema>;

const Tokenize = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [valuationJobId, setValuationJobId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [showMintModal, setShowMintModal] = useState(false);
  const navigate = useNavigate();

  // API hooks
  const tokenizeMutation = useTokenize();
  const { data: valuationData, isLoading: valuationLoading } = useValuation(valuationJobId || '');
  const mintMutation = useMint();

  const { joinValuationRoom } = useWebSocket('ws://localhost:3001'); // For real-time valuation updates

  // Join valuation room when jobId is available
  useEffect(() => {
    if (valuationJobId) {
      joinValuationRoom(valuationJobId);
    }
  }, [valuationJobId, joinValuationRoom]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<TokenizeForm>({
    resolver: zodResolver(tokenizeSchema),
  });

  const formData = watch();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: TokenizeForm) => {
    if (currentStep === 0) {
      // Upload documents
      const formDataToSend = new FormData();
      formDataToSend.append('title', data.title);
      formDataToSend.append('amount', data.amount.toString());
      formDataToSend.append('due_date', data.dueDate);

      // Add file (mock for now - in real implementation, get from file input)
      const mockFile = new File(['mock content'], 'invoice.pdf', { type: 'application/pdf' });
      formDataToSend.append('documents', mockFile);

      try {
        const result = await tokenizeMutation.mutateAsync(formDataToSend);
        setValuationJobId(result.valuation_job_id);
        setDocumentId(result.document_id);
        handleNext();
      } catch (error) {
        console.error('Tokenization failed:', error);
      }
    } else if (currentStep === 1) {
      // Valuation step - just proceed to mint
      handleNext();
    } else if (currentStep === 2) {
      // Mint step
      setShowMintModal(true);
    }
  };

  const handleMintConfirm = async () => {
    setShowMintModal(false);
    if (documentId && valuationData) {
      try {
        await mintMutation.mutateAsync({
          document_id: documentId,
          accepted_value_usd: valuationData.suggested_value_usd,
        });
        navigate('/app');
      } catch (error) {
        console.error('Mint failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stepper */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
          className="mb-8"
        />

        <Card className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {currentStep === 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Upload Documents</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Invoice Title
                    </label>
                    <Input
                      placeholder="Acme Invoice #1234"
                      {...register('title')}
                      variant={errors.title ? 'error' : 'default'}
                    />
                    {errors.title && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.title.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amount (USD)
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
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      {...register('dueDate')}
                      variant={errors.dueDate ? 'error' : 'default'}
                    />
                    {errors.dueDate && (
                      <p className="text-error-500 text-sm mt-1">
                        {errors.dueDate.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Upload Invoice PDF
                    </label>
                    <Input type="file" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Automatic Valuation</h2>
                {valuationLoading ? (
                  <Card className="p-6 bg-neutral-50">
                    <p className="text-center">Processing valuation...</p>
                  </Card>
                ) : valuationData ? (
                  <Card className="p-6 bg-neutral-50">
                    <h3 className="text-lg font-semibold mb-2">Valuation</h3>
                    <p className="text-2xl font-bold text-primary-600 mb-2">
                      ${valuationData.suggested_value_usd?.toFixed(2)}
                    </p>
                    <p className="text-sm text-neutral-600 mb-2">
                      Confidence: {(valuationData.confidence * 100).toFixed(1)}%
                    </p>
                    <p className="text-sm text-neutral-600">
                      Oracle Sources: {valuationData.oracle_sources?.map((s: any) => s.name).join(', ')}
                    </p>
                    {valuationData.manual_review_required && (
                      <p className="text-warning-600 text-sm mt-2">
                        Manual review required due to low confidence
                      </p>
                    )}
                  </Card>
                ) : (
                  <Card className="p-6 bg-neutral-50">
                    <p className="text-center">Waiting for valuation...</p>
                  </Card>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Mint oqAsset</h2>
                <Card className="p-6 bg-neutral-50 mb-6">
                  <h3 className="text-lg font-semibold mb-2">Confirm Mint</h3>
                  <p className="mb-2">
                    You are about to mint oqAsset for Invoice #{formData?.title}.
                  </p>
                  <p className="mb-2">Amount: ${valuationData?.suggested_value_usd?.toFixed(2) || formData?.amount}</p>
                  <p className="text-sm text-neutral-600">
                    Gas Estimate: 0.01 ETH (~$25)
                  </p>
                </Card>
                <Button
                  type="submit"
                  size="lg"
                  disabled={mintMutation.isLoading}
                  onClick={() => setShowMintModal(true)}
                >
                  {mintMutation.isLoading ? 'Minting...' : 'Confirm Mint'}
                </Button>
              </div>
            )}
          </form>
        </Card>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          {currentStep < steps.length - 1 && (
            <Button onClick={handleNext}>Next</Button>
          )}
        </div>

        <Modal
          isOpen={showMintModal}
          onClose={() => setShowMintModal(false)}
        >
          <ModalHeader>
            <ModalTitle>Confirm Mint</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <p className="mb-4">
              Are you sure you want to mint this oqAsset? This will initiate an
              on-chain transaction.
            </p>
          </ModalContent>
          <ModalFooter>
            <Button
              variant="outline"
              onClick={() => setShowMintModal(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleMintConfirm} disabled={mintMutation.isLoading}>
              {mintMutation.isLoading ? 'Minting...' : 'Confirm'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
};

export default Tokenize;