import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import { getServerSession } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <div className="w-layout-hflex flex-block text-center py-6">
        <div>
          <div className="testimonial1-item">
            <div className="testimonial1-logo-wrap flex items-center">
              {[...Array(5)].map((_, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faStar}
                  color="#feae32"
                  className="star-rating w-6 h-6 mr-1"
                />
              ))}
            </div>
          </div>
          <div className="text-center mt-2">&ldquo;Best link-in-bio tool I&apos;ve used&rdquo;</div>
        </div>
      </div>

      <section className="py-14 px-6">
        <div className="max-w-md mb-8 mx-auto text-center">
          <h1 className="text-5xl font-bold">
            Your one link<br />for <span className="italic">everything</span>
          </h1>
          <h2 className="text-gray-500 text-xl mt-6">
            Share your links, social profiles, creations, contact info and more on a single page
          </h2>
          <div className="font-bold mt-4 text-xl">It&apos;s free! 🎉</div>
        </div>
        <div className="w-full flex justify-center mt-8">
          <HeroForm user={session?.user} />
        </div>
      </section>


      <section className="py-16 bg-slate-200 px-6">
        <div className="max-w-md mb-8 mx-auto text-center">
          <h1 className="text-5xl font-bold">
           Join 10 000 creators
          </h1>
          <h2 className="text-gray-500 text-xl mt-6">
Creators from 80+ countries and all popular platforms are already using Throne. Check out their profiles and discover their Wishlists!
          </h2>
          <div className="font-bold mt-4 text-xl">It&apos;s free! 🎉</div>
        </div>
         
      </section>
              
    </main>
  );
}
