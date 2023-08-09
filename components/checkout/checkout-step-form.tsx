'use client';

import { CheckoutStep } from 'app/checkout/steps';
import { ReactNode } from 'react';
import CheckoutNotice from './checkout-notice';
import CheckoutSteps from './checkout-steps';

export default function CheckoutStepForm({
  children,
  steps,
  currentStep,
  onSubmit,
  heading,
  buttonContent,
  beforeButton
}: {
  children?: ReactNode;
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  onSubmit?: () => void;
  heading?: string;
  buttonContent?: ReactNode;
  beforeButton?: ReactNode;
}) {
  const formOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit();
    }
  };

  return (
    <form className={'flex flex-1 flex-col'} onSubmit={(e) => formOnSubmit(e)}>
      <div className={'border-b border-gray-200 px-8 py-4 md:py-8'}>
        <div className="mx-auto max-w-2xl">
          <CheckoutSteps steps={steps} currentStep={currentStep} />
        </div>
      </div>
      <div className={'flex-1 p-8'}>
        <div className="mx-auto max-w-2xl">
          <div className="xl:py-8">
            <CheckoutNotice className='mb-8 -mt-4' />
            {heading && <h1 className="text-2xl font-bold md:text-3xl">{heading}</h1>}
            {children}
          </div>
        </div>
      </div>
      <div
        className={'sticky bottom-0 left-0 right-0 border-t border-gray-200 bg-white p-4 md:p-8'}
      >
        <div className="mx-auto max-w-2xl">
          {beforeButton}
          <button
            type="submit"
            className="btn btn-lg block w-full bg-umb-green p-8 text-white transition-colors hover:bg-umb-blue"
          >
            {buttonContent || 'Continue'}
          </button>
        </div>
      </div>
    </form>
  );
}
