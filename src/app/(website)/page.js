import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import { getServerSession } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <div className="w-layout-hflex flex-block text-center">
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
          <div className="text-center mt-2">&ldquo;Best wishlist page I&apos;ve used&rdquo;</div>
        </div>
      </div>

      <section className="py-16 w-layout-hflex flex-block">
        <div className="max-w-md mb-8">
          <h1 className="text-5xl text-center font-bold">
            Your one link<br />for everything
          </h1>
          <h2 className="text-gray-500 text-xl text-center mt-6">
            Share your links, social profiles, contact info and more on a single page
          </h2>
          <div className="text-center font-bold">It&apos;s free! 🎉</div>
        </div>
        <div className="w-full flex justify-center mt-8"> {/* Add this div to center the form */}
          <HeroForm user={session?.user} />
        </div>
      </section>
    </main>
  );
}
