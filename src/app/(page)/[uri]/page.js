import { Page } from "@/models/Page";
import { User } from "@/models/User";
import { Event } from "@/models/Event";
import { faDiscord, faFacebook, faGithub, faInstagram, faTelegram, faTiktok, faWhatsapp, faYoutube, faWeixin, faLine, faPinterest, faTwitch, faSoundcloud, faTwitter } from "@fortawesome/free-brands-svg-icons";
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
  pinterest: faPinterest,
  twitch: faTwitch,
  soundcloud: faSoundcloud,
  twitter: faTwitter,
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
  console.log("UserPage function started for URI:", uri);

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    return <div>Error connecting to the database</div>;
  }

  try {
    const page = await Page.findOne({ uri });
    console.log("Page data:", page);

    if (!page) {
      console.log("Page not found for URI:", uri);
      return <div>Page not found</div>;
    }

    const user = await User.findOne({ email: page.owner });
    console.log("User data:", user);

    if (!user) {
      console.log("User not found for email:", page.owner);
      return <div>User not found</div>;
    }

    await Event.create({ uri: uri, page: uri, type: 'view' });
    console.log("Event created");

    const pageData = page.toObject(); // Convert the page object to a plain JavaScript object
    const template = pageData.template || "template1"; // Default to template1 if not specified

    return (
      <div className={`w-full h-full bg-center bg-cover fixed top-0 z-10 bg-auto bg-no-repeat overflow-x-hidden text-white template ${template}`} style={
        pageData.bgType === 'color'
          ? { backgroundColor: pageData.bgColor }
          : { backgroundImage: `url(${pageData.bgImage})` }
      }>
        <div className="bg-cover bg-center"></div>

        <div className="fixed top-4 right-4 z-50">
          <ShareDialog uri={pageData.uri}>
            <button className="fixed-button bg-white text-slate-500 p-2 rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faShareFromSquare} className="w-6 h-6" />
            </button>
          </ShareDialog>
        </div>

        <div className="logo-container">
          <a href="https://fizz.link/" className="bold pt-3 block">
            Fizz.link
          </a>
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
        <h2 className="text-2xl text-center font-bold mb-1">{pageData.displayName}</h2>
        <h3 className="text-md flex gap-2 justify-center items-center text-white/70">
          <FontAwesomeIcon className="h-4" icon={faLocationDot} />
          <span>{pageData.location}</span>
        </h3>

        <div className="flex gap-2 justify-center mt-4 pb-4 button-container">
          {pageData.buttons && Object.keys(pageData.buttons).map(buttonKey => (
            <Link key={buttonKey} href={buttonLink(buttonKey, pageData.buttons[buttonKey])}
              className="rounded-full bg-white text-blue-950 p-3 flex items-center justify-center button">
              <FontAwesomeIcon className="w-8 h-8" icon={buttonsIcons[buttonKey]} />
            </Link>
          ))}
        </div>

        <div className="max-w-4xl p-5 text-center m-5 bg-black bg-opacity-25 m-5 bio">
          <p>{pageData.bio}</p>
        </div>

        <div className="max-wid mx-auto px-5">
          {pageData.links.map(link => (
            <Link
              key={link.url}
              target="_blank"
              ping={process.env.URL + 'api/click?url=' + btoa(link.url) + '&page=' + pageData.uri}
              className="bg-white border-slate-950 border-2 shadow-lg mb-5 p-2 block flex link-item"
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
                  {link.subtitle && (
                    <p className="text-black/50 h-6 overflow-hidden">{link.subtitle}</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="max-wid mx-auto px-5">
          {pageData.textBoxes.map(textBox => (
            <div key={textBox.key} className="bg-white border-slate-950 border-2 shadow-lg mb-5 p-2 text-box">
              <h3 className="text-black text-xl font-semibold">{textBox.title}</h3>
              <p className="text-black">{textBox.text}</p>
            </div>
          ))}
        </div>

        <div className="max-wid mx-auto px-5">
          {pageData.youTubeVideos.map(video => (
            <div key={video.key} className="bg-white border-slate-950 border-2 shadow-lg mb-5 p-2 video-wrapper">
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
          {pageData.imageLinks.map(il => (
            <a
              key={il.key}
              href={il.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white border-slate-950 border-2 shadow-lg mb-5 block relative image-link"
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
            <a href="https://fizz.link/" className="bold pt-2 inline-block">
              Fizz.link
            </a>
          </div>

          <p>Created by Fizz.Link</p>
          <p>© Fizz.link All Rights Reserved</p>
        </footer>
      </div>
    );
  } catch (error) {
    console.error("Error in UserPage:", error);
    return <div>An error occurred while loading the page</div>;
  }
}
