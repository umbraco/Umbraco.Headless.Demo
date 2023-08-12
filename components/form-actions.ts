'use server';

import { submitStockNotificationForm as doSubmitStockNotificationForm } from "lib/umbraco";
import { UmbracoFormsResponse } from "lib/umbraco/types";

export const submitStockNotificationForm = async (
    email: string,
    productReference: string
): Promise<UmbracoFormsResponse> => {
    return await doSubmitStockNotificationForm(email, productReference);
};