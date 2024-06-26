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
          <div className="text-center mt-1">&ldquo;제가 사용해 본 최고의 링크-인-바이오 도구입니다&rdquo;</div>
        </div>
      </div>

      <section className="pt-8 pb-12 px-6">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-5xl font-bold">
            모든 것을 하나의 <br /> <span className="italic">링크로 만드세요</span>
          </h1>
          <h2 className="text-gray-500 text-base mt-6">
            여러분의 링크, 소셜 프로필, 창작물, 연락처 정보 등을 한 공간에서 공유하세요
          </h2>
          <div className="font-bold mt-4 text-xl">무료입니다! 🎉</div>
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

                <section className="pt-16 pb-12 fundo-home px-6">
        <div className="max-w-md mb-8 mx-auto text-center">

 
              
          <h1 className="text-5xl font-bold">
           놀라울 정도로 쉽게 디자인하세요

          </h1>
          <h2 className="text-gray-500 text-base my-6">
템플릿으로 이용해서 빠르게 시작하세요. 스마트폰만으로 자신만의 페이지를 편집하세요. 좋아하는 디자인을 선택하고 한 번에 디자인을 변경하세요.

          </h2>

              <img class="hero-links" src="/templates.png" /> 

         </div>
         
      </section>

               <section className="py-16 fundo-home px-6 colorido">
        <div className="max-w-md mb-8 mx-auto text-center">

 
              
          <h1 className="text-5xl font-bold text-white">
           10,000명의 사용자가 함께합니다
          </h1>
          <h2 className="text-gray-500 text-base mt-6 text-white">
20개국+ 이상의 사용자들과 다양한 인기 플랫폼에서 이미 Fizz.link를 사용하고 있습니다. 그들의 프로필을 확인하고 페이지를 탐색하세요!
          </h2>
          <div className="font-bold mt-4 text-xl text-white">무료입니다! 🎉</div>
        </div>
              <div className="w-full flex justify-center mt-8 px-8">
          <HeroForm user={session?.user} />
        </div>
         
      </section>
              
    </main>
  );
}
