import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-white">About us</h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">At Fizz.link, we believe that every link you share is a chapter of your unique journey. We&apos;re more than just a tool; we&apos;re your creative space on the web where you can bring together all your important links, social profiles, and projects on one beautifully simple page. But it doesn&apos;t end there.</p>
        
        <p className="p-4 text-left">We understand that you&apos;re not just a set of links. You&apos;re a personality, an individual with preferences, passions, and stories to tell. Fizz.link invites you to express who you truly are. Here, you can share your favorite quotes, showcase your hobbies, or tell a little story about what makes you, well, you.</p>
        <p className="p-4 text-left">Whether you&apos;re a professional looking to consolidate your portfolio, a creator eager to share your latest works, or someone who just wants to make a personal statement on the digital expanse, Fizz.link is here to make sure that your digital presence resonates with both your work and your character.</p>
        <p className="p-4 text-left">Create, customize, and connect with Fizz.link – because every link should tell your story.</p>
      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {/* Content for the grid */}
      </div>
    </div>
  );
}
