'use server';

import { submitForm as doSubmitForm, submitStockNotificationForm as doSubmitStockNotificationForm } from "lib/umbraco";
import { UmbracoFormsResponse } from "lib/umbraco/types";

export const submitStockNotificationForm = async (
    email: string,
    productReference: string
): Promise<UmbracoFormsResponse> => {
    return await doSubmitStockNotificationForm(email, productReference);
};

export const submitForm = async (
    formId: string,
    data: any,
): Promise<UmbracoFormsResponse> => {
    return await doSubmitForm(formId, data);
};