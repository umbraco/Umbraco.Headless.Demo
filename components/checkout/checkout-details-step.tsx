'use client';

import { CheckoutStep } from 'app/checkout/steps';
import { updateCart as doUpdateCart } from 'components/cart-actions';
import { CartContext } from 'components/cart-context';
import LoadingDots from 'components/loading-dots';
import { Cart, CartUpdate, Country } from 'lib/umbraco/types';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState, useTransition } from 'react';
import CheckoutStepForm from './checkout-step-form';

export default function CheckoutDetailsStep({
  countries,
  steps,
  currentStep,
  nextStep
}: {
  countries: Country[];
  steps: CheckoutStep[];
  currentStep: CheckoutStep;
  nextStep?: CheckoutStep;
}) {
  const { currentCart, setCurrentCart } = useContext(CartContext);

  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [details, setDetails] = useState<any>({});
  const optional = <span className="font-normal text-gray-500">(optional)</span>;

  const getValue = (key: string): string => {
    if (details[key] !== undefined) {
      return details[key];
    }
    if (currentCart?.properties && currentCart.properties[key] !== undefined) {
      return currentCart?.properties[key]!;
    }
    return '';
  };

  const handleChange = (event: any) => {
    const name = event.target.name;
    const value =
      event.target.type === 'checkbox' ? (event.target.checked ? '1' : '0') : event.target.value;
    setDetails((v: any) => ({ ...v, [name]: value }));
  };

  const handleSubmit = () => {
    if (!currentCart || !details) return;
    startTransition(async () => {
      const model: CartUpdate = {
        customer: {
          firstName: details.firstName,
          lastName: details.lastName,
          email: details.email
        },
        billingAddress: {
          line1: details.billingAddressLine1,
          line2: details.billingAddressLine2,
          city: details.billingCity,
          zipCode: details.billingZipCode,
          country: details.billingCountry
        },
        properties: {
          marketingOptIn: details.marketingOptIn || '0',
          comments: details.comments || ''
        }
      };

      if (details.shippingSameAsBilling === '1') {
        model.shippingAddress = { sameAsBilling: true };
      } else {
        model.shippingAddress = {
          contact: {
            firstName: details.shippingFirstName,
            lastName: details.shippingLastName
          },
          line1: details.shippingAddressLine1,
          line2: details.shippingAddressLine2,
          city: details.shippingCity,
          zipCode: details.shippingZipCode,
          country: details.shippingCountry
        };
      }

      const res = await doUpdateCart(model);
      const cart = res as Cart;

      if (cart) {
        setCurrentCart(cart);
      } else {
        alert(res as Error);
        return;
      }

      router.push(`/checkout/${nextStep?.slug}`);
    });
  };

  useEffect(() => {
    setDetails({
      firstName: currentCart?.properties?.firstName || '',
      lastName: currentCart?.properties?.lastName || '',
      email: currentCart?.properties?.email || '',
      billingAddressLine1: currentCart?.properties?.billingAddressLine1 || '',
      billingAddressLine2: currentCart?.properties?.billingAddressLine2 || '',
      billingCity: currentCart?.properties?.billingCity || '',
      billingZipCode: currentCart?.properties?.billingZipCode || '',
      billingCountry: currentCart?.billingCountry?.code || countries[0]?.code,
      shippingFirstName: currentCart?.properties?.shippingFirstName || '',
      shippingLastName: currentCart?.properties?.shippingLastName || '',
      shippingAddressLine1: currentCart?.properties?.shippingAddressLine1 || '',
      shippingAddressLine2: currentCart?.properties?.shippingAddressLine2 || '',
      shippingCity: currentCart?.properties?.shippingCity || '',
      shippingZipCode: currentCart?.properties?.shippingZipCode || '',
      shippingSameAsBilling: currentCart?.properties?.shippingSameAsBilling || '1',
      shippingCountry: currentCart?.shippingCountry?.code || countries[0]?.code,
      marketingOptIn: currentCart?.properties?.marketingOptIn || '0',
      comments: currentCart?.properties?.comments || ''
    });
  }, [currentCart]);

  useEffect(() => {
    if (!currentCart) {
      router.replace('/');
    }
  }, [currentCart]);

  return (
    currentCart && (
      <CheckoutStepForm
        steps={steps}
        currentStep={currentStep}
        heading="Tell us about yourself"
        buttonContent={
          <>
            Continue to {nextStep?.title.toLowerCase()}
            {isPending && <LoadingDots className="bg-white" />}
          </>
        }
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <fieldset className="mt-14">
            <legend className="mb-8 block text-xl font-bold text-gray-500">Contact</legend>
            <div>
              <label htmlFor="email" className="mb-2 flex items-center justify-between font-bold">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                placeholder="Your email"
                required={true}
                value={getValue('email')}
                onChange={handleChange}
              />
              <label className="mt-4 flex items-center">
                <input
                  type="checkbox"
                  name="marketingOptIn"
                  className="mr-2 rounded border-gray-300 outline-umb-blue"
                  checked={getValue('marketingOptIn') === '1'}
                  onChange={handleChange}
                />
                <span className="font-bold">Keep me up to date on news and exclusive offers</span>
              </label>
            </div>
          </fieldset>

          <fieldset className="mt-14">
            <legend className="mb-8 block text-xl font-bold text-gray-500">Billing Address</legend>
            <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your first name"
                  required={true}
                  value={getValue('firstName')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your last name"
                  required={true}
                  value={getValue('lastName')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Company {optional}
                </label>
                <input
                  type="text"
                  name="company"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your company Name"
                  value={getValue('company')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="taxCode"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  VAT Number {optional}
                </label>
                <input
                  type="text"
                  name="taxCode"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your VAT number"
                  value={getValue('taxCode')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="billingAddressLine1"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Address 1
                </label>
                <input
                  type="text"
                  name="billingAddressLine1"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your address line 1"
                  required={true}
                  value={getValue('billingAddressLine1')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="billingAddressLine2"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Address 2 {optional}
                </label>
                <input
                  type="text"
                  name="billingAddressLine2"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your address line 2"
                  value={getValue('billingAddressLine2')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="billingZipCode"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Postal code
                </label>
                <input
                  type="text"
                  name="billingZipCode"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your postal code"
                  required={true}
                  value={getValue('billingZipCode')}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="billingCity"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  City
                </label>
                <input
                  type="text"
                  name="billingCity"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your city"
                  required={true}
                  value={getValue('billingCity')}
                  onChange={handleChange}
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="country"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Country
                </label>
                <select
                  name="country"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  placeholder="Your country"
                  required={true}
                  value={getValue('billingCountry')}
                  onChange={handleChange}
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
                <label className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    name="shippingSameAsBilling"
                    className="mr-2 rounded border-gray-300 outline-umb-blue"
                    checked={getValue('shippingSameAsBilling') === '1'}
                    onChange={handleChange}
                  />
                  <span className="font-bold">Shipping address is same as billing address</span>
                </label>
              </div>
            </div>
          </fieldset>

          {getValue('shippingSameAsBilling') === '0' && (
            <fieldset className="mt-14">
              <legend className="mb-8 block text-xl font-bold text-gray-500">
                Shipping Address
              </legend>
              <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2">
                <div>
                  <label
                    htmlFor="shippingFirstName"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    Contact First Name
                  </label>
                  <input
                    type="text"
                    name="shippingFirstName"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Contact first name"
                    required={true}
                    value={getValue('shippingFirstName')}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingLastName"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    Contact Last Name
                  </label>
                  <input
                    type="text"
                    name="shippingLastName"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Contact last name"
                    required={true}
                    value={getValue('shippingLastName')}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingAddressLine1"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    Address 1
                  </label>
                  <input
                    type="text"
                    name="shippingAddressLine1"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Shipping Address line 1"
                    required={true}
                    value={getValue('shippingAddressLine1')}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingAddressLine2"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    Address 2 {optional}
                  </label>
                  <input
                    type="text"
                    name="shippingAddressLine2"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Shipping Address line 2"
                    value={getValue('shippingAddressLine2')}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingZipCode"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    Postal code
                  </label>
                  <input
                    type="text"
                    name="shippingZipCode"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Shipping Postal code"
                    required={true}
                    value={getValue('shippingZipCode')}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="shippingCity"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    name="shippingCity"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Shipping City"
                    required={true}
                    value={getValue('shippingCity')}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="shippingCountry"
                    className="mb-2 flex items-center justify-between font-bold"
                  >
                    Country
                  </label>
                  <select
                    name="shippingCountry"
                    className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                    placeholder="Shipping Country"
                    required={true}
                    value={getValue('shippingCountry')}
                    onChange={handleChange}
                  >
                    {countries.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
          )}

          <fieldset className="mt-14">
            <div>
              <div>
                <legend className="mb-8 block text-xl font-bold text-gray-500">Comments</legend>
                <label
                  htmlFor="comments"
                  className="mb-2 flex items-center justify-between font-bold"
                >
                  Anything we should know? {optional}
                </label>
                <textarea
                  name="comments"
                  className="w-full rounded border-gray-300 text-lg outline-umb-blue placeholder:text-gray-300"
                  rows={4}
                  placeholder=""
                  value={getValue('comments')}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </fieldset>
        </div>
      </CheckoutStepForm>
    )
  );
}
