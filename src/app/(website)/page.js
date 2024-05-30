import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import { getServerSession } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <div className="w-layout-hflex flex-block text-center pt-8">
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
          <div className="text-center mt-1">&ldquo;Best link-in-bio tool I&apos;ve used&rdquo;</div>
        </div>
      </div>

      <section className="pt-8 pb-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-5xl font-bold">
            Your one link<br />for <span className="italic">everything</span>
          </h1>
          <h2 className="text-gray-500 text-base mt-6">
            Share your links, social profiles, creations, contact info and more on a single page
          </h2>
          <div className="font-bold mt-4 text-xl">It&apos;s free! 🎉</div>
        </div>
        <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} />
        </div>
      </section>


      <section className="py-16 bg-slate-200 px-6">
        <div className="max-w-md mb-8 mx-auto text-center">

<img class="hero-links" src="/hero-links.png" /> 

              
           
         </div>
         
      </section>

                <section className="py-16 fundo-home px-6">
        <div className="max-w-md mb-8 mx-auto text-center">

 
              
          <h1 className="text-5xl font-bold">
           Amazingly easy design

          </h1>
          <h2 className="text-gray-500 text-base mt-6">
Get started quickly with templates. Edit your own page with just your smartphone.  Simply select your favorite design and set it to change the design all at once.

          </h2>
         </div>
         
      </section>

               <section className="py-16 fundo-home px-6 colorido">
        <div className="max-w-md mb-8 mx-auto text-center">

 
              
          <h1 className="text-5xl font-bold text-white">
           Join 10 000 users
          </h1>
          <h2 className="text-gray-500 text-base mt-6 text-white">
Users from 20+ countries and all popular platforms are already using Fizz.link. Check out their profiles and discover their pages!
          </h2>
          <div className="font-bold mt-4 text-xl text-white">It&apos;s free! 🎉</div>
        </div>
              <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} />
        </div>
         
      </section>
              
    </main>
  );
}
