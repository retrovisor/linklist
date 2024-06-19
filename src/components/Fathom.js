'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as FathomClient from 'fathom-client';

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    FathomClient.load('FIEGHTLD', {
      auto: false,
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;
    FathomClient.trackPageview({
      url: pathname + searchParams.toString(),
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function FathomTracker() {
  return <TrackPageView />;
}
