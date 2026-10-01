import { permanentRedirect } from 'next/navigation';

// The site is a single page now; the old route points at its section.
export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  permanentRedirect(`/${locale}#skills`);
}
