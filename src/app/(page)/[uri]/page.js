import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { faDiscord, faFacebook, faGithub, faInstagram, faTelegram, faTiktok, faWhatsapp, faYoutube, faWeixin, faLine } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faLink, faLocationDot, faMobile, faPhone, faComment, faMugHot, faBookmark, fas } from "@fortawesome/free-solid-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons";

import mongoose from "mongoose";
import { btoa } from "next/dist/compiled/@edge-runtime/primitives";
import Image from "next/image";
import Link from "next/link";
import "@/styles/template1.css";
import "@/styles/template2.css";
import ShareDialog from "./ShareDialog";
 

library.add(fas, faBookmark, faLink, faLocationDot, faEnvelope, faPhone, faDiscord, faFacebook, faGithub, faInstagram, faTelegram, faTiktok, faWhatsapp, faYoutube, faShare, faComment, faMugHot, faWeixin, faLine);

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
  kakao: faComment,
  naver: faMugHot,
  wechat: faWeixin,
  line: faLine,
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

function getYouTubeVideoId(url) {
  const regex = /[?&]v=([^&#]*)/;
  const match = url.match(regex);
  return match ? match[1] : null;
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
    <div className={`w-full h-full bg-center bg-cover fixed top-0 z-10 bg-auto bg-no-repeat overflow-x-hidden text-white template ${template}`} style={
          page.bgType === 'color'
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }>
      <div className="bg-cover bg-center"></div>


<div className="fixed top-4 right-4 z-50">
  <ShareDialog uri={page.uri}>
    <button className="fixed-button bg-white text-slate-500 p-2 rounded-full flex items-center justify-center">
      <FontAwesomeIcon icon={faShareFromSquare} className="w-6 h-6" />
    </button>
  </ShareDialog>
</div>
 

      <div className="logo-container">
        <span class="bold pt-3">Fizz.link</span>
         
      </div>

      <div className="aspect-square w-24 h-24 mx-auto relative my-2">
        <Image
          className="rounded-full w-full h-full object-cover border-3 border-white shadow shadow-black/50"
          src={user.image}
          alt="avatar"
          width={90}
          height={90}
           unoptimized
        />
      </div>
      <h2 className="text-2xl text-center font-bold mb-1">{page.displayName}</h2>
      <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
        <FontAwesomeIcon className="h-4" icon={faLocationDot} />
        <span>{page.location}</span>
      </h3>
    
      <div className="flex gap-2 justify-center mt-4 pb-4">
        {Object.keys(page.buttons).map(buttonKey => (
          <Link key={buttonKey} href={buttonLink(buttonKey, page.buttons[buttonKey])}
                className="rounded-full bg-white text-blue-950 p-3 flex items-center justify-center">
            <FontAwesomeIcon className="w-8 h-8" icon={buttonsIcons[buttonKey]} />
          </Link>
        ))}
      </div>

      <div className="max-w-4xl p-5 text-center m-5 bg-black bg-opacity-25 m-5">
        <p>{page.bio}</p>
      </div>
      
      <div className="max-wid mx-auto px-5">
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
                  <FontAwesomeIcon icon={['fas', link.icon.replace('fa-', '')]} size="sm" className="text-white" />
                </div>
              )}
              {!link.icon && (
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faLink} size="sm" className="text-white" />
                </div>
              )}
            </div>
            <div className="flex items-center justify-center shrink grow-0 overflow-hidden ml-4">
              <div>
                <h3 className="text-black text-xl font-semibold">{link.title}</h3>
                  {link.subtitle && (
                  <p className="text-black/50 h-6 overflow-hidden">{link.subtitle}</p>
                    )}             
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

        <div className="max-wid mx-auto px-5">
  {page.youTubeVideos.map(video => (
    <div key={video.key} className="bg-white border-slate-950 border-2 shadow-lg mb-5 p-2">
      <div className="relative" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  ))}
</div>

      
      <div className="max-wid mx-auto px-5">
        {page.imageLinks.map(il => (
          <a
            key={il.key}
            href={il.linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border-slate-950 border-2 shadow-lg mb-5 block relative"
          >
            <div className="relative">
              <img
                src={il.url}
                alt={il.title}
                className="custom-image w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3 rounded-md	bg-black bg-opacity-50 text-white p-2">
                <h3 className="text-xl font-semibold">{il.title}</h3>
              </div>
            </div>
          </a>
        ))}
      </div>




      <footer className="text-center text-xs text-white p-6">
        <div className="text-center logo-container2">
          <span class="bold pt-2">Fizz.link</span>
         </div>
        <p>Created by Fizz.Link</p>
        <p>© Fizz.link All Rights Reserved</p>
      </footer>
    </div>
  );
}
