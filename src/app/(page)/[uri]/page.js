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
import "../../styles/templates/template1.css";
import "../../styles/templates/template2.css";

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
  
  console.log("Connecting to database...");
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  
  console.log("Fetching page for URI:", uri);
  const page = await Page.findOne({ uri });

  if (!page) {
    console.log("Page not found for URI:", uri);
    return <div>Page not found</div>;
  }

  console.log("Fetching user for email:", page.owner);
  const user = await User.findOne({ email: page.owner });

  if (!user) {
    console.log("User not found for email:", page.owner);
    return <div>User not found</div>;
  }

  console.log("Creating view event for URI:", uri);
  await Event.create({ uri: uri, page: uri, type: 'view' });

  const template = page.template || "template1"; // Default to template1 if not specified

  return (
    <div className={`template ${template}`}>
      <div
        className="header-bg"
        style={
          page.bgType === 'color'
            ? { backgroundColor: page.bgColor }
            : { backgroundImage: `url(${page.bgImage})` }
        }
      ></div>
      <div className="avatar-container">
        <Image
          className="avatar"
          src={user.image}
          alt="avatar"
          width={256} height={256}
        />
      </div>
      <h2 className="display-name">{page.displayName}</h2>
      <h3 className="location">
        <FontAwesomeIcon className="location-icon" icon={faLocationDot} />
        <span>{page.location}</span>
      </h3>
      <div className="bio">
        <p>{page.bio}</p>
      </div>
      <div className="buttons-container">
        {Object.keys(page.buttons).map(buttonKey => (
          <Link key={buttonKey} href={buttonLink(buttonKey, page.buttons[buttonKey])}
                className="button">
            <FontAwesomeIcon className="button-icon" icon={buttonsIcons[buttonKey]} />
          </Link>
        ))}
      </div>
      <div className="links-container">
        {page.links.map(link => (
          <Link
            key={link.url}
            target="_blank"
            ping={process.env.URL + 'api/click?url=' + btoa(link.url) + '&page=' + page.uri}
            className="link"
            href={link.url}>
            <div className="link-icon-container">
              <div className="link-icon-wrapper">
                {link.icon && (
                  <Image
                    className="link-icon"
                    src={link.icon}
                    alt={'icon'} width={64} height={64} />
                )}
                {!link.icon && (
                  <FontAwesomeIcon icon={faLink} className="default-link-icon" />
                )}
              </div>
            </div>
            <div className="link-content">
              <div>
                <h3>{link.title}</h3>
                <p className="link-subtitle">{link.subtitle}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
