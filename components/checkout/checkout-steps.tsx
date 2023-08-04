import { CheckoutStep } from 'app/checkout/steps';
import clsx from 'clsx';
import CheckoutStepLink from './checkout-step-link';

export default function CheckoutSteps({
  steps,
  currentStep,
  className
}: {
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  className?: string;
}) {
  const visibleSteps = steps.filter((step) => !step.isHidden);
  const currentStepIndex = visibleSteps.findIndex((step) => step.slug === currentStep.slug);
  return (
    <div
      className={clsx(
        'checkout-steps-counter flex w-full flex-row justify-center md:justify-between',
        className
      )}
    >
      {visibleSteps.map((step, idx) => (
        <CheckoutStepLink
          key={step.slug}
          title={step.title}
          href={`/checkout/${step.slug}`}
          state={
            idx === currentStepIndex ? 'active' : idx > currentStepIndex ? 'incomplete' : 'complete'
          }
        />
      ))}
    </div>
  );
}
