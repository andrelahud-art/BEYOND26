'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Step1 from './application/Step1';
import Step2 from './application/Step2';
import Step3 from './application/Step3';
import Step4 from './application/Step4';
import Step5 from './application/Step5';
import {
  companionApplicationStep1Schema,
  companionApplicationStep2Schema,
  companionApplicationStep3Schema,
  companionApplicationStep4Schema,
  companionApplicationStep5Schema,
  CompanionApplicationStep1,
  CompanionApplicationStep2,
  CompanionApplicationStep3,
  CompanionApplicationStep4,
  CompanionApplicationStep5,
} from '@/lib/validation/schemas';
import { ZodError } from 'zod';

export type ApplicationData = {
  step1: Partial<CompanionApplicationStep1>;
  step2: Partial<CompanionApplicationStep2>;
  step3: Partial<CompanionApplicationStep3>;
  step4: Partial<CompanionApplicationStep4>;
  step5: Partial<CompanionApplicationStep5>;
};

const STEPS = [
  { number: 1, title: 'Basic Info', description: 'Tell us about yourself' },
  { number: 2, title: 'Languages & City', description: 'Where and how you speak' },
  { number: 3, title: 'Service Zones', description: 'Where you can work' },
  { number: 4, title: 'Service Offerings', description: 'What you offer' },
  { number: 5, title: 'Documents', description: 'ID, selfie, and video' },
];

export default function CompanionApplicationForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ApplicationData>({
    step1: {},
    step2: {},
    step3: {},
    step4: {},
    step5: {},
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = async (step: number): Promise<boolean> => {
    try {
      setErrors({});
      switch (step) {
        case 1:
          companionApplicationStep1Schema.parse(formData.step1);
          break;
        case 2:
          companionApplicationStep2Schema.parse(formData.step2);
          break;
        case 3:
          companionApplicationStep3Schema.parse(formData.step3);
          break;
        case 4:
          companionApplicationStep4Schema.parse(formData.step4);
          break;
        case 5:
          companionApplicationStep5Schema.parse(formData.step5);
          break;
      }
      return true;
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const field = err.path.join('.');
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleNext = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    const isValid = await validateStep(currentStep);
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/companions/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData.step1,
          ...formData.step2,
          ...formData.step3,
          ...formData.step4,
          ...formData.step5,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to submit application' });
        return;
      }

      router.push('/dashboard/companion?status=application-submitted');
    } catch (err) {
      setErrors({ submit: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepDataChange = (step: number, data: any) => {
    setFormData((prev) => ({
      ...prev,
      [`step${step}`]: { ...prev[`step${step}` as keyof ApplicationData], ...data },
    }));
  };

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      {/* Progress indicator */}
      <div className="mb-12">
        <div className="flex justify-between gap-2">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (step.number < currentStep) setCurrentStep(step.number);
                }}
                disabled={step.number > currentStep}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-sm font-semibold transition ${
                  step.number < currentStep
                    ? 'cursor-pointer bg-primary text-primary-foreground'
                    : step.number === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                }`}
              >
                {step.number}
              </button>
              <div className="mt-2 text-center">
                <p className="text-xs font-medium">{step.title}</p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <Card className="p-8">
        {currentStep === 1 && (
          <Step1 data={formData.step1} onChange={(data) => handleStepDataChange(1, data)} />
        )}
        {currentStep === 2 && (
          <Step2 data={formData.step2} onChange={(data) => handleStepDataChange(2, data)} />
        )}
        {currentStep === 3 && (
          <Step3 data={formData.step3} onChange={(data) => handleStepDataChange(3, data)} />
        )}
        {currentStep === 4 && (
          <Step4 data={formData.step4} onChange={(data) => handleStepDataChange(4, data)} />
        )}
        {currentStep === 5 && (
          <Step5 data={formData.step5} onChange={(data) => handleStepDataChange(5, data)} />
        )}

        {/* Errors */}
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-900">Please fix the following errors:</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              {Object.entries(errors).map(([key, value]) => (
                <li key={key} className="text-sm text-red-800">
                  {value}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Button
            type="button"
            variant="secondary"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          {currentStep < 5 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          )}
        </div>
      </Card>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        You'll be contacted by ops for a live interview within 2-3 business days.
      </p>
    </div>
  );
}
