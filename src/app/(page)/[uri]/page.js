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
        <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 396 97" fill="none">


    
<path d="M0 0 C3.92246287 5.88369431 3.19285724 13.32189648 3.1875 20.1875 C3.18741943 21.17347168 3.18733887 22.15944336 3.18725586 23.17529297 C3.10207105 34.71200641 2.22992716 46.19689548 1.25830078 57.68847656 C1.07916641 59.98505366 0.9340461 62.28443899 0.81591797 64.58496094 C0.75162598 65.7402832 0.68733398 66.89560547 0.62109375 68.0859375 C0.57267334 69.12540527 0.52425293 70.16487305 0.47436523 71.23583984 C-0.05637537 74.32850329 -0.81816664 75.76956548 -3 78 C-6.04522461 78.6920965 -7.94280061 78.64601418 -10.65087891 76.99121094 C-15.98079589 72.66055775 -18.65482741 67.73972638 -21.625 61.625 C-22.65158945 59.5836 -23.68031266 57.54327192 -24.7109375 55.50390625 C-25.24170898 54.44574707 -25.77248047 53.38758789 -26.31933594 52.29736328 C-29.19139773 46.66254827 -32.22231021 41.11479417 -35.25 35.5625 C-35.82314941 34.50820801 -36.39629883 33.45391602 -36.98681641 32.36767578 C-38.3228411 29.91084977 -39.66052387 27.45494541 -41 25 C-41.00364563 25.57771652 -41.00729126 26.15543304 -41.01104736 26.75065613 C-41.05289276 32.76948112 -41.12225243 38.787545 -41.20751953 44.8059082 C-41.23572642 47.05127344 -41.25694232 49.29673791 -41.27099609 51.54223633 C-41.29242892 54.77216389 -41.33908271 58.00089856 -41.390625 61.23046875 C-41.39246796 62.73386055 -41.39246796 62.73386055 -41.39434814 64.2676239 C-41.48577753 68.62889408 -41.59362603 71.3032112 -43.82324219 75.1262207 C-46 77 -46 77 -49.4375 77.75 C-53.84559352 76.82198031 -54.59306867 75.60213748 -56.98806763 72.00875854 C-58.60871237 68.79166216 -58.5417079 65.72177799 -58.33984375 62.22265625 C-58.31800522 61.45953629 -58.29616669 60.69641632 -58.27366638 59.91017151 C-58.22491392 58.20798278 -58.16609662 56.5060615 -58.09881592 54.80450439 C-57.95413781 50.69838052 -57.91313093 46.59216086 -57.86123657 42.48397827 C-57.80090267 37.95811452 -57.71432276 33.43289606 -57.62768555 28.9074707 C-57.56150147 25.38434597 -57.50243271 21.86114093 -57.44335938 18.33789062 C-57.40147595 16.09895017 -57.3591745 13.86001748 -57.31640625 11.62109375 C-57.29969376 10.56715927 -57.28298126 9.51322479 -57.26576233 8.42735291 C-57.24581711 7.46446854 -57.22587189 6.50158417 -57.20532227 5.50952148 C-57.18977798 4.66002426 -57.1742337 3.81052704 -57.15821838 2.93528748 C-57 1 -57 1 -56 0 C-52.18167674 -0.53590502 -49.51716844 -0.81717406 -46.078125 1.03515625 C-32.69327875 11.84812089 -23.42605909 29.86091136 -14 44 C-13.95512451 42.88028809 -13.91024902 41.76057617 -13.86401367 40.60693359 C-13.693204 36.43536984 -13.50441329 32.26477738 -13.31030273 28.09423828 C-13.22892902 26.29236856 -13.15237143 24.49027439 -13.08081055 22.68798828 C-12.97683394 20.09072434 -12.85530789 17.49477227 -12.73046875 14.8984375 C-12.6880732 13.69808365 -12.6880732 13.69808365 -12.64482117 12.47348022 C-12.39276754 7.66007513 -11.63360084 4.17940118 -9 0 C-5.85135005 -1.57432497 -3.35512575 -0.71895552 0 0 Z " fill="#131313" transform="translate(65,10)"/>
<path d="M0 0 C2.4375 2.375 2.4375 2.375 4 5 C4 5.99 4 6.98 4 8 C4.72703125 7.4225 5.4540625 6.845 6.203125 6.25 C12.57111189 1.5474866 17.37275949 -1.24575225 25.42578125 -0.65625 C28.11635512 0.02966261 29.27943688 0.59000958 31.125 2.625 C34.12682846 8.02829123 35.25185036 12.77987016 35.6328125 18.9296875 C35.71660156 20.21875 35.80039062 21.5078125 35.88671875 22.8359375 C35.9663201 24.18228137 36.04574501 25.52863569 36.125 26.875 C36.21150587 28.2448382 36.29873852 29.61463071 36.38671875 30.984375 C36.59829241 34.32253721 36.80246634 37.66098244 37 41 C38.98 40.505 38.98 40.505 41 40 C40.52171836 47.49307896 37.55083772 53.96143003 32 59.125 C29 61 29 61 26.375 61.1875 C23.08387306 59.54193653 21.47839549 57.28386685 20 54 C19.35686526 50.6765842 19.25768864 47.38652804 19.171875 44.0078125 C19.1331427 43.06187225 19.0944104 42.11593201 19.05450439 41.1413269 C18.93546974 38.13624512 18.84237411 35.13100764 18.75 32.125 C18.67358834 30.08066441 18.59548183 28.03639141 18.515625 25.9921875 C18.32411563 20.99530343 18.15585461 15.99811806 18 11 C13.19002534 12.10347296 13.19002534 12.10347296 9.12890625 14.68359375 C7.60272404 17.81517178 7.30058624 20.59731777 6.9375 24.0625 C6.86007568 24.75279297 6.78265137 25.44308594 6.70288086 26.15429688 C6.26794641 30.0972344 5.90185243 34.04596965 5.5390625 37.99609375 C5.45922119 38.82939209 5.37937988 39.66269043 5.29711914 40.52124023 C5.14480575 42.13043679 5.00275896 43.74065044 4.87280273 45.35180664 C4.37375277 50.68665648 3.23638746 55.10925947 1 60 C-1.8125 61.3125 -1.8125 61.3125 -5 61 C-7.97581547 59.22277687 -10.42660336 57.14679328 -12 54 C-12.01616761 52.57634242 -11.96504939 51.15160972 -11.87890625 49.73046875 C-11.83040527 48.85156982 -11.7819043 47.9726709 -11.73193359 47.06713867 C-11.67602051 46.11685791 -11.62010742 45.16657715 -11.5625 44.1875 C-11.1552641 36.35111771 -10.88564972 28.53492224 -10.875 20.6875 C-10.87056885 19.84791748 -10.8661377 19.00833496 -10.86157227 18.14331055 C-10.87409765 12.69150161 -11.31637977 7.40928073 -12 2 C-7.75834686 -1.21337359 -5.10471173 -1.48500705 0 0 Z " fill="#131313" transform="translate(295,28)"/>
<path d="M0 0 C1.95825873 -0.02694851 3.91662226 -0.04637218 5.875 -0.0625 C6.96554687 -0.07410156 8.05609375 -0.08570313 9.1796875 -0.09765625 C12 0 12 0 14 1 C15.16585806 4.99703054 15.11527143 8.91121512 15.09765625 13.05078125 C15.0962413 13.70958786 15.09482635 14.36839447 15.09336853 15.04716492 C15.087805 17.13565762 15.07525947 19.22404011 15.0625 21.3125 C15.05748028 22.73502449 15.0529182 24.15755066 15.04882812 25.58007812 C15.03784757 29.05342077 15.02060835 32.52669961 15 36 C15.4532666 35.67725098 15.9065332 35.35450195 16.37353516 35.02197266 C18.45198606 33.5485666 20.53834191 32.08675698 22.625 30.625 C23.33785156 30.11710937 24.05070312 29.60921875 24.78515625 29.0859375 C28.70686301 26.35153645 32.24302568 24.00735927 37 23 C39.875 24.375 39.875 24.375 42 26 C41.71937781 29.19761597 40.8787296 30.11763611 38.5234375 32.40234375 C37.48233853 33.25769893 36.43237339 34.10234669 35.375 34.9375 C34.56337402 35.59564697 34.56337402 35.59564697 33.73535156 36.26708984 C29.92520059 39.33365785 26.03990192 42.24552142 22 45 C26.32085802 50.4319358 31.16631754 55.03453664 36.32885742 59.64746094 C44.70653847 67.19966297 44.70653847 67.19966297 45.34765625 71.1328125 C44.82254031 74.80143073 44.56491592 76.48216041 41.75 79.0625 C38.47478923 80.17904913 37.26986159 80.07397213 34 79 C31.3515625 76.77734375 31.3515625 76.77734375 28.625 73.9375 C28.14820801 73.44523926 27.67141602 72.95297852 27.18017578 72.44580078 C23.31182411 68.420677 19.6158627 64.2526184 16 60 C15.505 59.505 15.505 59.505 15 59 C14.82984375 60.13179687 14.6596875 61.26359375 14.484375 62.4296875 C14.24051404 63.91161179 13.9956712 65.39337474 13.75 66.875 C13.64042969 67.62136719 13.53085937 68.36773437 13.41796875 69.13671875 C12.47210929 74.66252929 12.47210929 74.66252929 9.890625 76.5078125 C9.26671875 76.67023438 8.6428125 76.83265625 8 77 C8 77.66 8 78.32 8 79 C5.1875 78.8125 5.1875 78.8125 2 78 C-0.77827125 74.37766117 -1.37004555 71.71601984 -1.328125 67.20703125 C-1.32361328 66.03857666 -1.31910156 64.87012207 -1.31445312 63.66625977 C-1.29318359 62.39451904 -1.27191406 61.12277832 -1.25 59.8125 C-1.23795843 58.47388536 -1.22691626 57.13526141 -1.21679688 55.79663086 C-1.04214937 37.19545824 -0.50747839 18.59449414 0 0 Z " fill="#161616" transform="translate(344,7)"/>
<path d="M0 0 C2.67429892 2.11542125 3.78330629 3.70740084 5.26171875 6.7890625 C5.52514692 9.46827135 5.63660469 11.90283793 5.58984375 14.57421875 C5.58797058 15.31232285 5.58609741 16.05042694 5.58416748 16.81089783 C5.5774694 18.36494493 5.56359963 19.91897581 5.54296875 21.47290039 C5.51177438 23.84732807 5.50198914 26.22109063 5.49609375 28.59570312 C5.486924 30.10938307 5.47654831 31.62305629 5.46484375 33.13671875 C5.45846893 34.19778587 5.45846893 34.19778587 5.45196533 35.2802887 C5.40415721 38.58573919 5.2744333 41.6266127 4.26171875 44.7890625 C4.81601563 44.3559375 5.3703125 43.9228125 5.94140625 43.4765625 C7.02808594 42.64125 7.02808594 42.64125 8.13671875 41.7890625 C9.21566406 40.95375 9.21566406 40.95375 10.31640625 40.1015625 C12.26171875 38.7890625 12.26171875 38.7890625 14.26171875 38.7890625 C14.63867083 43.50096352 14.72486578 46.86276843 12.57421875 51.1640625 C10.18272589 53.87873008 8.62551918 55.45918791 5.26171875 56.7890625 C-0.8193795 56.7890625 -3.52184079 54.79982293 -7.73828125 50.7890625 C-8.19976562 51.2221875 -8.66125 51.6553125 -9.13671875 52.1015625 C-13.85087227 56.12629436 -17.17947543 57.6058129 -23.41015625 57.17578125 C-28.11200504 56.39476945 -30.77548359 54.75186016 -34.11328125 51.4140625 C-36.96870398 45.04427334 -36.70776201 38.06106005 -34.73828125 31.4140625 C-28.74283776 23.54504292 -21.90793346 20.26798154 -12.8359375 16.953125 C-9.90763139 16.09613729 -9.90763139 16.09613729 -8.73828125 14.7890625 C-8.69747342 12.78947886 -8.69573769 10.78860996 -8.73828125 8.7890625 C-14.28825381 8.59432662 -18.37048188 9.22752087 -23.73828125 10.7890625 C-26.07043969 10.86309928 -28.40688913 10.88422136 -30.73828125 10.7890625 C-28.88368053 5.22526034 -26.5706583 2.73918393 -21.36328125 0.0390625 C-14.87844691 -2.18361142 -6.32245774 -2.79595135 0 0 Z M-13.67578125 28.1015625 C-14.36542969 28.53082031 -15.05507812 28.96007812 -15.765625 29.40234375 C-18.94311459 31.63602455 -20.4927021 33.05232506 -21.73828125 36.7890625 C-21.97016747 39.51237738 -21.86921493 42.03945519 -21.73828125 44.7890625 C-21.07828125 45.4490625 -20.41828125 46.1090625 -19.73828125 46.7890625 C-15.34643791 46.55166556 -12.87996991 44.76093015 -9.73828125 41.7890625 C-7.51668817 38.37651231 -7.52600576 35.55373515 -7.61328125 31.5390625 C-7.64035156 29.92257813 -7.64035156 29.92257813 -7.66796875 28.2734375 C-7.69117188 27.45359375 -7.714375 26.63375 -7.73828125 25.7890625 C-10.34523351 25.7890625 -11.48092699 26.71598411 -13.67578125 28.1015625 Z " fill="#191919" transform="translate(113.73828125,29.2109375)"/>
<path d="M0 0 C3.00104048 2.16219543 4.43241297 3.60192641 5.62109375 7.16796875 C6.49119398 13.80248299 6.49119398 13.80248299 4.55078125 16.84765625 C-1.98386522 23.1852782 -12.29765188 26.4677287 -21.25390625 26.48046875 C-22.6306684 26.40299821 -24.00731939 26.31018398 -25.37890625 26.16796875 C-23.95764565 34.02421977 -23.95764565 34.02421977 -20.31640625 40.98046875 C-13.31599428 43.81042253 -6.25773436 41.05269569 0.39453125 38.30078125 C2.68763622 37.22228792 2.68763622 37.22228792 4.72265625 35.53515625 C6.62109375 34.16796875 6.62109375 34.16796875 9.62109375 34.16796875 C8.69932023 40.79540367 4.71418539 45.77039863 -0.515625 49.82421875 C-7.67423169 54.37608696 -13.9591738 54.85631181 -22.37890625 54.16796875 C-28.31501816 52.66479202 -31.63370618 49.21860795 -35.15234375 44.36328125 C-39.80183154 36.04158654 -39.62166585 25.31097665 -37.76171875 16.1171875 C-35.0754674 8.47444582 -29.53145724 2.78073872 -22.62890625 -1.33203125 C-15.23711735 -4.59140273 -6.94967777 -3.90078688 0 0 Z M-21.37890625 13.16796875 C-22.75145213 15.31777372 -22.75145213 15.31777372 -23.37890625 17.16796875 C-17.74273192 16.69828756 -13.16473084 15.26124562 -8.37890625 12.16796875 C-8.04890625 11.50796875 -7.71890625 10.84796875 -7.37890625 10.16796875 C-7.70890625 9.50796875 -8.03890625 8.84796875 -8.37890625 8.16796875 C-14.82005016 7.52385436 -17.02918763 8.71709388 -21.37890625 13.16796875 Z " fill="#181818" transform="translate(171.37890625,30.83203125)"/>
<path d="M0 0 C0.79575439 -0.0191748 1.59150879 -0.03834961 2.41137695 -0.05810547 C3.78555786 -0.09121826 3.78555786 -0.09121826 5.1875 -0.125 C9.333361 -0.22490027 12.22777911 0.24836544 16 2 C15.57294097 7.95634966 15.11729556 13.90558241 14.5234375 19.84765625 C13.10385671 34.22024208 12.42546311 48.56538563 12 63 C12.53109375 62.51789063 13.0621875 62.03578125 13.609375 61.5390625 C14.31578125 60.90742187 15.0221875 60.27578125 15.75 59.625 C16.44609375 58.99851563 17.1421875 58.37203125 17.859375 57.7265625 C19.84508688 56.12494817 21.67954093 55.03479932 24 54 C20.89154978 70.9787319 20.89154978 70.9787319 15.125 76.9375 C12.03509426 78.48245287 10.41534055 78.68306811 7 78 C1.42428202 73.7587548 0.04800521 68.6614385 -1 62 C-1.25996273 58.1139812 -1.25750987 54.24506701 -1.23046875 50.3515625 C-1.23001053 49.25838715 -1.22955231 48.16521179 -1.2290802 47.03890991 C-1.22607362 44.73784289 -1.21823549 42.43677762 -1.20581055 40.13574219 C-1.18759129 36.64250344 -1.18530101 33.14953128 -1.18554688 29.65625 C-1.18062896 27.40885191 -1.17479945 25.16145559 -1.16796875 22.9140625 C-1.16685593 21.88350739 -1.1657431 20.85295227 -1.16459656 19.79116821 C-1.12182779 13.1465834 -0.70756174 6.60671634 0 0 Z " fill="#1A1A1A" transform="translate(230,8)"/>
<path d="M0 0 C0.10155026 7.29561453 0.17152891 14.59104629 0.21972656 21.88720703 C0.23982241 24.36839611 0.26710384 26.84953795 0.30175781 29.33056641 C0.35036294 32.90018382 0.37298972 36.46917416 0.390625 40.0390625 C0.41127014 41.14553131 0.43191528 42.25200012 0.45318604 43.39199829 C0.45498238 49.57926146 0.14108515 53.27858976 -4 58 C-10.75 56.375 -10.75 56.375 -13 53 C-13.24291992 50.25463867 -13.24291992 50.25463867 -13.23046875 46.91796875 C-13.22917969 45.6851416 -13.22789062 44.45231445 -13.2265625 43.18212891 C-13.21367187 41.86390137 -13.20078125 40.54567383 -13.1875 39.1875 C-13.18064282 37.83512541 -13.17413455 36.48274901 -13.16796875 35.13037109 C-13.0940239 23.73878425 -12.66198177 12.37190114 -12 1 C-7.47397657 -0.83196187 -4.74659999 -0.95064958 0 0 Z " fill="#151515" transform="translate(272,29)"/>
<path d="M0 0 C2.72833791 3.15912811 4 4.90863791 4 9.125 C2.64414113 13.02309425 0.68308236 15.15845882 -3 17 C-9.26519337 17.5801105 -9.26519337 17.5801105 -12.375 15.125 C-15.0564025 11.61855058 -15.52066537 9.42565562 -15 5 C-10.84328756 -0.22558135 -6.28381442 -3.86696272 0 0 Z " fill="#151515" transform="translate(209,71)"/>
<path d="M0 0 C2.1015625 0.375 2.1015625 0.375 4.2265625 1.875 C5.51711293 5.56228696 5.24529503 8.65984122 4.1015625 12.375 C1.74075309 15.28061158 0.27469736 15.35373782 -3.4609375 15.8125 C-6.8984375 15.375 -6.8984375 15.375 -8.8359375 13.8125 C-10.62783094 9.70168563 -10.56484022 6.10764708 -8.9609375 1.9375 C-6.03407487 -0.27982018 -3.60025971 -0.18763569 0 0 Z " fill="#272727" transform="translate(268.8984375,4.625)"/>
<path d="M0 0 C0.33 0 0.66 0 1 0 C1.33 3.3 1.66 6.6 2 10 C3.32 9.67 4.64 9.34 6 9 C5.67 10.32 5.34 11.64 5 13 C3.35 12.67 1.7 12.34 0 12 C0 8.04 0 4.08 0 0 Z " fill="#909090" transform="translate(330,59)"/>
<path d="M0 0 C0.66 0.33 1.32 0.66 2 1 C0.5459375 2.3303125 0.5459375 2.3303125 -0.9375 3.6875 C-3.60122242 6.32615209 -4.7731363 8.14331715 -5 12 C-5.33 12 -5.66 12 -6 12 C-6.3125 9.3125 -6.3125 9.3125 -6 6 C-3.5625 3.1875 -3.5625 3.1875 -1 1 C-0.67 0.67 -0.34 0.34 0 0 Z " fill="#707070" transform="translate(200,70)"/>
</svg>
      </div>

      <div className="aspect-square w-24 h-24 mx-auto relative my-2">
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
      <div className="max-w-2xl mx-auto p-4 px-4">
        {page.textBoxes.map(textBox => (
          <div key={textBox.key} className="bg-white border-slate-950 border-2 shadow-lg mb-4 p-2">
            <h3 className="text-black text-xl font-semibold">{textBox.title}</h3>
            <p className="text-black">{textBox.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
