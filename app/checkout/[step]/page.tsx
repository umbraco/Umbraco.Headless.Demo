import BaseLayout from 'components/layout/base-layout';
import Headline from 'components/layout/headline';
import { getCountries } from 'lib/umbraco';
import type { Metadata } from 'next';
import { steps } from '../steps';

export const runtime = 'edge';

export async function generateMetadata({
  params
}: {
  params: { step: string };
}): Promise<Metadata> {
  const currentStepIndex = steps.findIndex((s) => s.slug === params.step);
  const currentStep = steps[currentStepIndex];
  return {
    title: `${currentStep!.title} - Checkout`,
    description: ''
  };
}

export default async function CheckoutStepPage({ params }: { params: { step: string } }) {
  const currentStepIndex = steps.findIndex((s) => s.slug === params.step);
  const currentStep = steps[currentStepIndex];
  const nextStep = currentStepIndex + 1 < steps.length ? steps[currentStepIndex + 1] : undefined;

  const DynamicTag = currentStep!.component;
  const dynamicProps: any = {
    steps: steps,
    currentStep: currentStep,
    nextStep: nextStep,
    mode: process.env.UMBRACO_COMMERCE_CHECKOUT_MODE
  };

  if (params.step === 'details') {
    dynamicProps.countries = await getCountries();
  }

  return (
    <BaseLayout
      asideStyle={'NARROW'}
      aside={
        <Headline
          title="Get your swag on"
          description="With this demo store you are sure to loose your head over all the umbmazing headless features we have on offer 😉"
        />
      }
      className={'bg-umb-gray'}
    >
      <DynamicTag {...dynamicProps} />
    </BaseLayout>
  );
}
