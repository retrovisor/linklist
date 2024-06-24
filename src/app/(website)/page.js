import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import HeroForm from "@/components/forms/HeroForm";
import { getServerSession } from "next-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { getDictionary } from '@/libs/getDictionary';

export default async function Home({ params }) {
  const lang = params?.lang || 'en';
  const dict = await getDictionary(lang);
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
          <div className="text-center mt-1">{dict.home.testimonial}</div>
        </div>
      </div>
      <section className="pt-8 pb-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-5xl font-bold">
            {dict.home.title1} <br /> <span className="italic">{dict.home.title2}</span>
          </h1>
          <h2 className="text-gray-500 text-base mt-6">
            {dict.home.subtitle}
          </h2>
          <div className="font-bold mt-4 text-xl">{dict.home.freeMessage}</div>
        </div>
        <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} lang={lang} dict={dict} />

        </div>
      </section>
      <section className="py-16 bg-slate-200 px-6">
        <div className="max-w-md mb-8 mx-auto text-center">
          <img className="hero-links" src="/hero-links.png" alt="Hero Links" />
        </div>
      </section>
      <section className="pt-16 pb-12 fundo-home px-6">
        <div className="max-w-md mb-8 mx-auto text-center">
          <h1 className="text-5xl font-bold">
            {dict.home.designTitle}
          </h1>
          <h2 className="text-gray-500 text-base my-6">
            {dict.home.designDescription}
          </h2>
          <img className="hero-links" src="/templates.png" alt="Templates" />
        </div>
      </section>
      <section className="py-16 fundo-home px-6 colorido">
        <div className="max-w-md mb-8 mx-auto text-center">
          <h1 className="text-5xl font-bold text-white">
            {dict.home.usersTitle}
          </h1>
          <h2 className="text-gray-500 text-base mt-6 text-white">
            {dict.home.usersDescription}
          </h2>
          <div className="font-bold mt-4 text-xl text-white">{dict.home.freeMessage}</div>
        </div>
        <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} lang={lang} />
        </div>
      </section>
    </main>
  );
}
