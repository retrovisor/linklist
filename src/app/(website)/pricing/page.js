import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-blue-950 text-white min-h-screen">
      <div className="h-36 bg-gray-400 bg-cover bg-center">
        <h1 className="text-4xl text-center pt-12">Pricing Page</h1>
      </div>
      <div className="max-w-xs mx-auto text-center my-4">
        <p>Welcome to the Pricing page. Here you will find information about our website and mission.</p>
        {/* Add more static content as needed */}
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        <Link href="/">
          <a className="bg-indigo-800 p-2 block flex items-center justify-center text-white">Go back to Home</a>
        </Link>
      </div>
    </div>
  );
}
