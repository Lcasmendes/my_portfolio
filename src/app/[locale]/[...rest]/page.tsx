import { notFound } from 'next/navigation';

// Catch-all for unmatched routes within a locale -> renders the localized 404.
export default function CatchAllPage() {
  notFound();
}
