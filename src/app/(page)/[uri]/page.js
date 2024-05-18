import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import {
  faDiscord,
  faFacebook,
  faGithub,
  faInstagram,
  faTelegram,
  faTiktok,
  faWhatsapp,
  faYoutube
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faLocationDot, faMobile, faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";
import Image from "next/image";
import Link from "next/link";
import "@/styles/template1.css";
import "@/styles/template2.css";

export const buttonsIcons = {
  email: faEnvelope,
  mobile: faPhone,
  instagram: faInstagram,
  facebook: faFacebook,
  discord: faDiscord,
  tiktok: faTiktok,
  youtube: faYoutube,
  whatsapp: faWhatsapp,
  github: faGithub,
  telegram: faTelegram,
};

function buttonLink(key, value) {
  if (key === 'mobile') {
    return 'tel:' + value;
  }
  if (key === 'email') {
    return 'mailto:' + value;
  }
  return value;
}

export default async function UserPage({ params }) {
  const uri = params.uri;

  await mongoose.connect(process.env.MONGO_URI);

  const page = await Page.findOne({ uri });

  if (!page) {
    console.log("Page not found for URI:", uri);
    return <div>Page not found</div>;
  }

  const user = await User.findOne({ email: page.owner });

  if (!user) {
    console.log("User not found for email:", page.owner);
    return <div>User not found</div>;
  }

  await Event.create({ uri: uri, page: uri, type: 'view' });

  const template = page.template || "template1"; // Default to template1 if not specified

  return (
    <div className={`text-white min-h-screen template ${template}`} style={
          page.bgType === 'color'
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }>
      <div
        className="bg-cover bg-center"></div>

 <div className="logo-container">
  <svg class="logo" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 97">

    <path d="M0 0 C130.68 0 261.36 0 396 0 C396 32.01 396 64.02 396 97 C265.32 97 134.64 97 0 97 C0 64.99 0 32.98 0 0 Z" fill="transparent"/>
    <path d="M0 0 C2.02165045 1.79708961 2.89978782 3.27526422 3.2718811 5.96624756 C3.38187475 8.49038622 3.38919539 10.9970001 3.36328125 13.5234375 C3.36402901 14.93008163 3.36402901 14.93008163 3.36479187 16.36514282 C3.3624515 18.35396436 3.35272515 20.34278886 3.33618164 22.33154297 C3.31285496 25.32938181 3.31558823 28.3263138 3.32226562 31.32421875 C3.30755459 40.77160763 3.0264131 49.89236463 1.46118164 59.22363281 C0.73520071 63.59412257 0.61049476 67.9318951 0.44140625 72.35546875 C0 75 0 75 -1.36328125 76.8515625 C-3 78 -3 78 -5.75 78.1875 C-14.7680518 74.89244261 -18.83814777 64.15546256 -22.8125 56.125 C-28.26837196 45.25145354 -34.03792903 34.60308242 -40 24 C-40.00142502 24.57549591 -40.00285004 25.15099182 -40.00431824 25.743927 C-40.02404127 31.7467585 -40.07837033 37.74857668 -40.15258789 43.75097656 C-40.17575071 45.98950932 -40.19015955 48.22815079 -40.19555664 50.46679688 C-40.20485837 53.68948989 -40.24587802 56.91047701 -40.29296875 60.1328125 C-40.28706978 61.62846237 -40.28706978 61.62846237 -40.28105164 63.15432739 C-40.37531927 67.66791315 -40.49928065 71.00986388 -43.3371582 74.65576172 C-46 77 -46 77 -49.3125 77.375 C-50.6428125 77.189375 -50.6428125 77.189375 -52 77 C-57.4464078 69.64734947 -57.78068018 62.95551688 -57 54 C-56.83326782 53.37711594 -56.66653564 52.75423187 -56.49475098 52.11247253 C-55.93240037 49.71136517 -55.8465259 47.52945514 -55.81054688 45.0637207 C-55.78547058 43.59749016 -55.78547058 43.59749016 -55.7598877 42.10163879 C-55.74631226 41.0536058 -55.73273682 40.00557281 -55.71875 38.92578125 C-55.70034058 37.84620651 -55.68193115 36.76663177 -55.66296387 35.65434265 C-55.58424195 31.03325337 -55.51631179 26.41202106 -55.44775391 21.79077148 C-55.39619029 18.41903102 -55.3388981 15.04742226 -55.28125 11.67578125 C-55.26767456 10.62167557 -55.25409912 9.56756989 -55.2401123 8.48152161 C-55.22339478 7.51349106 -55.20667725 6.54546051 -55.18945312 5.5480957 C-55.17692505 4.6919014 -55.16439697 3.83570709 -55.15148926 2.9535675 C-55 1 -55 1 -54 0 C-49.19605606 -0.68627771 -46.67392984 0.5092391 -42.84179688 3.36816406 C-39.50088088 6.32822272 -37.08240782 9.90330883 -34.5625 13.5625 C-33.99901855 14.36171875 -33.43553711 15.1609375 -32.85498047 15.984375 C-29.0778529 21.36572567 -25.39626224 26.80933257 -21.78125 32.30078125 C-19.92334789 35.11615485 -18.03748279 37.90891332 -16.125 40.6875 C-15.29355469 41.89986328 -15.29355469 41.89986328 -14.4453125 43.13671875 C-13.12311095 45.118709 -13.12311095 45.118709 -11 46 C-11.02094727 44.85523193 -11.04189453 43.71046387 -11.06347656 42.53100586 C-11.13617801 38.26144037 -11.18190879 33.99192901 -11.21972656 29.72192383 C-11.23977361 27.87808006 -11.2670188 26.03429932 -11.30175781 24.19067383 C-11.35058208 21.5319051 -11.37303772 18.87398085 -11.390625 16.21484375 C-11.41127014 15.39789536 -11.43191528 14.58094696 -11.45318604 13.73924255 C-11.45540104 8.01866166 -10.30509663 4.69912217 -7 0 C-4.24438552 -1.37780724 -2.90228766 -0.92023755 0 0 Z" fill="#050505" transform="translate(64,10)"/>
</svg>
</div>

          
      <div className="aspect-square w-24 h-24 mx-auto relative -top-16 -mb-12">
        <Image
          className="rounded-full w-full h-full object-cover"
          src={user.image}
          alt="avatar"
          width={90} height={90}
        />
      </div>
      <h2 className="text-2xl text-center mb-1">{page.displayName}</h2>
      <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
        <FontAwesomeIcon className="h-4" icon={faLocationDot} />
        <span>{page.location}</span>
      </h3>
    
      <div className="flex gap-2 justify-center mt-4 pb-4">
        {Object.keys(page.buttons).map(buttonKey => (
          <Link key={buttonKey} href={buttonLink(buttonKey, page.buttons[buttonKey])}
                className="rounded-full bg-white text-blue-950 p-2 flex items-center justify-center">
            <FontAwesomeIcon className="w-5 h-5" icon={buttonsIcons[buttonKey]} />
          </Link>
        ))}
      </div>

            <div className="max-w-xs mx-auto text-center my-2">
        <p>{page.bio}</p>
      </div>
      <div className="max-w-2xl mx-auto p-4 px-4">
        {page.links.map(link => (
          <Link
            key={link.url}
            target="_blank"
            ping={process.env.URL + 'api/click?url=' + btoa(link.url) + '&page=' + page.uri}
            className="bg-white border-slate-950 border-2 shadow-lg mb-4 p-2 block flex"
            href={link.url}>
            <div className="relative overflow-hidden w-16">
              <div className="w-16 h-16 bg-blue-700 aspect-square relative flex items-center justify-center aspect-square">
                {link.icon && (
                  <Image
                    className="w-full h-full object-cover"
                    src={link.icon}
                    alt={'icon'} width={64} height={64} />
                )}
                {!link.icon && (
                  <FontAwesomeIcon icon={faLink} className="w-8 h-8" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-center shrink grow-0 overflow-hidden ml-4">
              <div>
                <h3 className="text-black text-xl font-semibold">{link.title}</h3>
                <p className="text-white/50 h-6 overflow-hidden">{link.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
