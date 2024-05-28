import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import {getServerSession} from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return (
    <main>
      <section className="py-16">
        <div className="max-w-md mb-8">
          <h1 className="text-5xl font-bold">
            Your one link<br />for everything
          </h1>
          <h2 className="text-gray-500 text-xl mt-6">
            Share your links, social profiles, contact info and more on a single page
          </h2>
        </div>
        <HeroForm user={session?.user} />
      </section>

  <section className="py-16">
        <div className="max-w-md mb-8">
          <h1 className="text-5xl font-bold bg-blue-200">
            Bilu-bily
          </h1>
          <h2 className="text-gray-500 text-xl mt-6">
            Share your links, social profiles, contact info and more on a single page
          </h2>
        </div>
        <HeroForm user={session?.user} />
      </section>
    </main>
  )
}
