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
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faLocationDot, faMobile, faPhone } from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";
import Image from "next/image";
import Link from "next/link";
import "@/styles/template1.css";
import "@/styles/template2.css";
import ShareDialog from "./ShareDialog";

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
      <div className="bg-cover bg-center"></div>

      <div className="fixed top-4 right-4 z-50">
        <ShareDialog uri={page.uri} />
      </div>

      <div className="logo-container">
        <svg className="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 97" fill="none">
          {/* SVG paths */}
        </svg>
      </div>

      <div className="aspect-square w-24 h-24 mx-auto relative my-2">
        <Image
          className="rounded-full w-full h-full object-cover"
          src={user.image}
          alt="avatar"
          width={90}
          height={90}
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

      <div className="max-wid mx-auto text-center p-5">
        <p>{page.bio}</p>
      </div>
      
      <div className="max-wid mx-auto pt-5 px-5">
        {page.links.map(link => (
          <Link
            key={link.url}
            target="_blank"
            ping={process.env.URL + 'api/click?url=' + btoa(link.url) + '&page=' + page.uri}
            className="bg-white border-slate-950 border-2 shadow-lg mb-5 p-2 block flex"
            href={link.url}
          >
            <div className="relative overflow-hidden w-16 h-16">
              {link.icon && link.icon.startsWith('http') && (
                <Image
                  className="w-full h-full object-cover"
                  src={link.icon}
                  alt="icon"
                  width={64}
                  height={64}
                />
              )}
              {link.icon && !link.icon.startsWith('http') && (
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={['fas', link.icon.replace('fa-', '')]} size="2x" className="text-white" />
                </div>
              )}
              {!link.icon && (
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faLink} size="2x" className="text-white" />
                </div>
              )}
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

      <div className="max-wid mx-auto px-5">
        {page.textBoxes.map(textBox => (
          <div key={textBox.key} className="bg-white border-slate-950 border-2 shadow-lg mb-5 p-2">
            <h3 className="text-black text-xl font-semibold">{textBox.title}</h3>
            <p className="text-black">{textBox.text}</p>
          </div>
        ))}
      </div>

      <footer className="text-center text-xs text-white p-6">
        <div className="text-center logo-container2">
          <svg className="logo2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 97" fill="none">
            {/* SVG paths */}
          </svg>
        </div>
        <p>Created by Nav.Link</p>
        <p>© Nav.link All Rights Reserved</p>
      </footer>
    </div>
  );
}
