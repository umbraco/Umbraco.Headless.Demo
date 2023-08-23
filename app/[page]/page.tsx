import UmbForm from 'components/form';
import Headline from "components/layout/headline";
import PageLayout from 'components/layout/page-layout';
import Prose from 'components/prose';
import { getPage } from 'lib/umbraco';
import { Metadata } from "next";
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const runtime = 'edge';

export const revalidate = 43200; // 12 hours in seconds

export async function generateMetadata({
  params
}: {
  params: { page: string };
}): Promise<Metadata> {
  const page = await getPage(params.page);

  if (!page) return notFound();

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || page.bodySummary,
    openGraph: {
      publishedTime: page.createdAt,
      modifiedTime: page.updatedAt,
      type: 'article'
    }
  };
}

export default async function Page({ 
  params 
}: { 
  params: { page: string } 
}) {
  const page = await getPage(params.page);

  if (!page) return notFound();

  return (
    <PageLayout asideStyle={'NARROW'} aside={
      <Headline title={page.sidebar.title} description={page.sidebar.description} />
    }>
      <div className="prose text-lg mx-auto sm:my-14">
        <div>
            <Link href='/' className='inline-block opacity-60 text-lg underline mb-2'>Back to products</Link>
            <h1 className="mb-8 text-5xl font-bold">{page.title}</h1>
        </div>
        <Prose className="mb-8" html={page.body} />
        {page.properties['form']?.form && (<UmbForm form={page.properties['form'].form} />)}
        <p className="italic opacity-60">
            {`This document was last updated on ${new Intl.DateTimeFormat(undefined, {
            year: 'numeric', 
            month: 'long',
            day: 'numeric'
            }).format(new Date())}.`}
        </p>
      </div>
    </PageLayout>
  );
}
