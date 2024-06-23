import { getDictionary } from '@/libs/getDictionary';
import Link from 'next/link';

export default async function PricingPage({ params: { lang } }) {
  const dict = await getDictionary(lang);

  return (
    <div className="bg-blue-950 text-white min-h-screen">
      <div className="h-36 bg-gray-400 bg-cover bg-center">
        <h1 className="text-4xl text-center pt-12">{dict.pricing.title}</h1>
      </div>
      <div className="max-w-xs mx-auto text-center my-4">
        <p>{dict.pricing.content}</p>
        {/* Add more pricing content as needed */}
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        <Link href={`/${lang}`}>
          <a className="bg-indigo-800 p-2 block flex items-center justify-center text-white">
            {dict.common.backToHome}
          </a>
        </Link>
      </div>
    </div>
  );
}
