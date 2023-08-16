import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"

export default function CheckoutNotice({
    className
} : {
    className?: string
}) {
    return (process.env.NEXT_PUBLIC_DISABLE_DEMO_WARNINGS !== '1') && (
        <div className={clsx('border-2 border-red-500 bg-red-50 rounded-lg p-4', className)}>
            <h3 className="text-lg font-bold mb-2 text-red-600"><ExclamationTriangleIcon className="w-8 h-8 inline-block stroke-2 mr-1" /> Demo Store</h3>
            <p className="text-sm italic">Please note this is a demo project for showcasing Umbraco headless capabilities. Purchases made are test purchases only. No payments will be captured and no products will be shipped. Additionally, the Umbraco back office for this site is also publicly accessible so do NOT enter any personally identifiable details into any fields.</p>
        </div>
    )
}