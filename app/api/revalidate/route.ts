import { VALIDATION_TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest): Promise<Response> {
  const collectionWebhooks = ['collections/update'];
  const productWebhooks = ['products/update'];
  const pageWebhooks = ['products/update'];

  const topic = headers().get('x-topic') || 'unknown';
  const isCollectionUpdate = collectionWebhooks.includes(topic);
  const isProductUpdate = productWebhooks.includes(topic);
  const isPageUpdate = pageWebhooks.includes(topic);

  const secret = req.nextUrl.searchParams.get('secret');

  if (!secret || secret !== process.env.REVALIDATION_SECRET) {
    console.error('Invalid revalidation secret.');
    return NextResponse.json({ status: 200 });
  }

  if (!isCollectionUpdate && !isProductUpdate && !isProductUpdate) {
    // We don't need to revalidate anything for any other topics.
    return NextResponse.json({ status: 200 });
  }

  if (isCollectionUpdate) {
    revalidateTag(VALIDATION_TAGS.collections);
  }

  if (isProductUpdate) {
    revalidateTag(VALIDATION_TAGS.products);
  }

  if (isPageUpdate) {
    revalidateTag(VALIDATION_TAGS.products);
  }

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}
