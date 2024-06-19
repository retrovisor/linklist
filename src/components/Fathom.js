// Fathom.js
'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import * as Fathom from 'fathom-client';

function TrackPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    Fathom.load('FIEGHTLD', {
      auto: false,
    });
  }, []);

  useEffect(() => {
    if (!pathname) return;

    Fathom.trackPageview({
      url: pathname + searchParams.toString(),
      referrer: document.referrer,
    });
  }, [pathname, searchParams]);

  return null;
}

export default function Fathom() {
  return <TrackPageView />;
}








 
