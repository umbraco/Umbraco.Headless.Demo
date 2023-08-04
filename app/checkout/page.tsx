import { RedirectType } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';
import { steps } from './steps';

export const runtime = 'edge';

export default async function CheckoutPage() {
  // Next should support optional route params but it's either conflicting with
  // the default "page" route, or it's just not working so instead we'll create
  // a root cart page and just have it redirect to the first step
  redirect(`/checkout/${steps[0]?.slug}`, RedirectType.replace);
}
