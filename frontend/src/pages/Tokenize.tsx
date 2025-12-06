import { useState } from 'react';
import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Stepper } from '../components/ui/Stepper';

const steps = ['Upload Documents', 'Automatic Valuation', 'Mint oqAsset'];

// const tokenizeSchema = z.object({
//   title: z.string().min(1, 'Title is required').max(120, 'Title too long'),
//   amount: z.number().min(1, 'Amount must be positive'),
//   dueDate: z.string().min(1, 'Due date is required'),
// });

const Tokenize = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    watch,
  } = useForm();

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

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Stepper */}
        <div className="mb-8">
          <Stepper
            steps={steps.map(label => ({ label }))}
            currentStep={currentStep}
          />
        </div>

        <Card>
          <CardContent className="p-8">
            {currentStep === 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Upload Documents</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Invoice Title</label>
                    <Input
                      placeholder="Acme Invoice #1234"
                      {...register('title')}
                    />
                    {/* {errors.title?.message && <p className="text-error-500 text-sm mt-1">{errors.title.message}</p>} */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                    <Input
                      type="number"
                      placeholder="1000.00"
                      {...register('amount', { valueAsNumber: true })}
                    />
                    {/* {errors.amount?.message && <p className="text-error-500 text-sm mt-1">{errors.amount.message}</p>} */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Input
                      type="date"
                      {...register('dueDate')}
                    />
                    {/* {errors.dueDate?.message && <p className="text-error-500 text-sm mt-1">{errors.dueDate.message}</p>} */}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Invoice PDF</label>
                    <Input type="file" />
                  </div>
                </form>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Automatic Valuation</h2>
                <div className="bg-neutral-50 p-6 rounded-medium">
                  <h3 className="text-lg font-semibold mb-2">Valuation</h3>
                  <p>Suggested Value: $950.00</p>
                  <p>Confidence: 87%</p>
                  <p>Oracle Sources: Chainlink, Custom API</p>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Mint oqAsset</h2>
                <div className="bg-neutral-50 p-6 rounded-medium mb-6">
                  <h3 className="text-lg font-semibold mb-2">Confirm Mint</h3>
                  <p>You are about to mint oqAsset for Invoice #{formData?.title}.</p>
                  <p>Amount: ${formData?.amount}</p>
                  <p>Gas Estimate: 0.01 ETH</p>
                </div>
                <Button size="lg">Confirm Mint</Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrev} disabled={currentStep === 0}>
            Previous
          </Button>
          <Button onClick={handleNext} disabled={currentStep === steps.length - 1}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tokenize;