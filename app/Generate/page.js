// app/Generate/page.js

import { Suspense } from 'react';
import GenerateForm from './GenerateForm'; // Import the component that uses useSearchParams()

// This page component is a Server Component by default
export default function GeneratePage() {
  return (
    // Next.js will render this Fallback on the server, 
    // preventing the useSearchParams error during build/prerender.
    <Suspense fallback={<div>Loading form...</div>}>
      <GenerateForm />
    </Suspense>
  );
}