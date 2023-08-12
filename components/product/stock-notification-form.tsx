'use client'

import { CheckCircleIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LoadingDots from "components/loading-dots";
import { ProductVariant } from "lib/umbraco/types";
import { useState, useTransition } from "react";
import { submitStockNotificationForm } from "../form-actions";

export default function StockNotificationForm({
    variant,
    className
  }: {
    variant?: ProductVariant;
    className?: string;
  }) {
    
    const [status, setStatus] = useState<string>();
    const [email, setEmail] = useState<string>('');
    const [isPending, startTransition] = useTransition();

    const doSetStatus= (val:string) => {
      if (val) {
        setStatus(val);
        setTimeout(() => setStatus(undefined), 2000)
      }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      startTransition(async () => {
        const res = await submitStockNotificationForm(email!, variant!.id);
        if (!res) { // If successful the response will be null
          setEmail('')
          doSetStatus("success")
        } else {
          doSetStatus("error")
        }
      });
    }
    
    return (<form className={clsx('flex w-full gap-4', className)} onSubmit={handleSubmit}>
        <input type="email" name="email" 
          className="text-md form-input flex-1 rounded-md border-gray-200 px-4 py-3 outline-umb-blue md:text-xl"
          placeholder="Your email"
          required={true} 
          value={email}
          onChange={(e) => setEmail(e.target.value)}/>
        <button type="submit" className={clsx(
          'btn btn-lg outline-umb-blue bg-umb-blue text-white hover:bg-umb-green px-4 lg:px-8 whitespace-nowrap',
          {
            'cursor-not-allowed': isPending
          }
        )}>
          {!status && (<span>Notify Me</span>)}
          {isPending ? <LoadingDots className="bg-white" /> : null}
          {status === 'success' && (<CheckCircleIcon className="inline-block stroke-2 text-white w-8 h-8 -my-1" />)}
          {status === 'error' && (<CheckCircleIcon className="inline-block stroke-2 text-white w-8 h-8 -my-1" />)}
        </button>
    </form>)
}