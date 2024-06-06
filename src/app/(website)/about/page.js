import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="bg-white text-white min-h-screen">
      <div className="h-36 colorido bg-cover bg-center">
        <h1 className="text-5xl font-bold text-center text-white pt-12">About us</h1>
      </div>
      <div className="max-w-xl mx-auto text-center my-4 text-black px-4 text-left">
        <p className="p-4 text-left">Fizz.link에 오신 것을 환영합니다 – 여러분의 링크가 여러분의 이야기를 만나는 곳입니다.</p>

<p className="p-4 text-left">Fizz.link는 여러분이 공유하는 모든 링크가 여러분의 독특한 여정의 한 장이라고 믿습니다. 저희는 단순한 도구 이상의 존재입니다; 모든 중요한 링크, 소셜 프로필, 프로젝트를 아름답고 간단한 한 페이지에 모을 수 있는 창조적 공간입니다. 하지만 여기서 그치지 않습니다.</p>

<p className="p-4 text-left">저희는 여러분이 링크의 집합체가 아닌, 선호도, 열정, 이야기를 가진 개성 있는 개인이라는 것을 이해합니다. Fizz.link는 여러분이 진정한 자신을 표현할 수 있는 기회를 제공합니다. 여기서 여러분은 좋아하는 인용구를 공유하고, 취미를 전시하거나, 여러분을 특별하게 만드는 작은 이야기를 할 수 있습니다.</p>

<p className="p-4 text-left">직업적으로 포트폴리오를 통합하려는 전문가이든, 최신 작품을 공유하고자 하는 창작자이든, 디지털 공간에서 개인적인 성명을 하고자 하는 사람이든, Fizz.link는 여러분의 디지털 존재가 여러분의 작업과 성격을 모두 반영하도록 돕습니다.</p>

<p className="p-4 text-left">Fizz.link와 함께 만들고, 맞춤 설정하고, 연결하세요 – 모든 링크가 여러분의 이야기를 전해야 합니다.</p>

      </div>
      <div className="max-w-2xl mx-auto grid md:grid-cols-2 gap-6 p-4 px-8">
        {/* Content for the grid */}
      </div>
    </div>
  );
}
