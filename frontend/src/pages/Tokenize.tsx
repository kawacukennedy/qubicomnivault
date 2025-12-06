import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

const steps = ['Upload Documents', 'Automatic Valuation', 'Mint oqAsset'];

const Tokenize = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    dueDate: '',
  });

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
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  index <= currentStep ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-600'
                }`}>
                  {index + 1}
                </div>
                <span className={`ml-2 ${index <= currentStep ? 'text-primary-700' : 'text-neutral-500'}`}>
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    index < currentStep ? 'bg-primary-500' : 'bg-neutral-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            {currentStep === 0 && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">Upload Documents</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Invoice Title</label>
                    <Input
                      placeholder="Acme Invoice #1234"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount (USD)</label>
                    <Input
                      type="number"
                      placeholder="1000.00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Due Date</label>
                    <Input
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Invoice PDF</label>
                    <Input type="file" />
                  </div>
                </div>
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
                  <p>You are about to mint oqAsset for Invoice #{formData.title}.</p>
                  <p>Amount: ${formData.amount}</p>
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