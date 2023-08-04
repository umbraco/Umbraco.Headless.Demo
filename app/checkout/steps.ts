import CheckoutConfirmationStep from 'components/checkout/checkout-confirmation-step';
import CheckoutDeliveryStep from 'components/checkout/checkout-delivery-step';
import CheckoutDetailsStep from 'components/checkout/checkout-details-step';
import CheckoutErrorStep from 'components/checkout/checkout-error-step';
import CheckoutOrderStep from 'components/checkout/checkout-order-step';
import CheckoutPayStep from 'components/checkout/checkout-pay-step';
import CheckoutPaymentStep from 'components/checkout/checkout-payment-step';
import CheckoutReviewStep from 'components/checkout/checkout-review-step';

export type CheckoutStep = {
  title: string;
  slug: string;
  status?: 'completed' | 'errored' | 'canceled';
  component: any;
  isHidden?: boolean;
};

export const steps: CheckoutStep[] = [
  { title: 'Order', slug: 'order', component: CheckoutOrderStep },
  { title: 'Details', slug: 'details', component: CheckoutDetailsStep },
  {
    title: 'Delivery',
    slug: 'delivery',
    component: CheckoutDeliveryStep
  },
  { title: 'Payment', slug: 'payment', component: CheckoutPaymentStep },
  { title: 'Review', slug: 'review', component: CheckoutReviewStep },
  {
    title: 'Pay',
    slug: 'pay',
    component: CheckoutPayStep,
    isHidden: true
  }, // Inline payments only
  {
    title: 'Confirmation',
    slug: 'confirmation',
    status: 'completed',
    component: CheckoutConfirmationStep,
    isHidden: true
  },
  { title: 'Error', slug: 'error', status: 'errored', component: CheckoutErrorStep, isHidden: true }
];
