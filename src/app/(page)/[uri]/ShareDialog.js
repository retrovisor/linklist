'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faFacebook } from "@fortawesome/free-brands-svg-icons"; // Correct import for brands icons
import { useState, useEffect } from "react";

// Declare the domain at the top
const DOMAIN = 'https://linklist-wheat.vercel.app'; // Replace with your domain

export default function ShareDialog({ uri }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Dynamically load the Kakao SDK script
    const kakaoScript = document.createElement('script');
    kakaoScript.src = 'https://developers.kakao.com/sdk/js/kakao.js';
    kakaoScript.async = true;
    document.body.appendChild(kakaoScript);

    kakaoScript.onload = () => {
      // Initialize Kakao SDK
      if (window.Kakao) {
        window.Kakao.init('YOUR_KAKAO_APP_KEY'); // Replace with your Kakao App Key
      }
    };

    return () => {
      document.body.removeChild(kakaoScript);
    };
  }, []);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const shareOnWhatsApp = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Check out my page on MomoFriends: ${DOMAIN}/${uri}`
    )}`;
    window.open(shareUrl, "_blank");
  };

  const shareOnFacebook = () => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      `${DOMAIN}/${uri}`
    )}`;
    window.open(shareUrl, "_blank");
  };

  const shareOnKakao = () => {
    if (window.Kakao) {
      window.Kakao.Link.sendDefault({
        objectType: 'feed',
        content: {
          title: 'MomoFriends',
          description: `Check out my page on MomoFriends: ${DOMAIN}/${uri}`,
          imageUrl: 'YOUR_IMAGE_URL', // Replace with your image URL
          link: {
            mobileWebUrl: `${DOMAIN}/${uri}`,
            webUrl: `${DOMAIN}/${uri}`
          }
        }
      });
    }
  };

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <button
          className="fixed-button bg-white text-blue-950 p-2 rounded-full flex items-center justify-center"
          onClick={openDialog}
        >
          <FontAwesomeIcon className="w-5 h-5" icon={faShare} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-black">Share your Nae.Link</h3>
            <div className="flex flex-col gap-4">
              <button
                className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
                onClick={shareOnWhatsApp}
              >
                <FontAwesomeIcon className="mr-2" icon={faWhatsapp} />
                WhatsApp
              </button>
              <button
                className="bg-blue-600 text-white text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
                onClick={shareOnFacebook}
              >
                <FontAwesomeIcon className="mr-2" icon={faFacebook} />
                Facebook
              </button>
              <button
                className="bg-yellow-400 text-black text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
                onClick={shareOnKakao}
              >
                <svg
                  className="mr-2 w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.477 2 2 5.867 2 10.5c0 2.464 1.511 4.657 3.864 6.083-.138.596-.753 3.248-.777 3.443 0 0-.015.132.066.183a.21.21 0 0 0 .214-.015c.28-.199 3.52-2.301 4.246-2.809.792.112 1.608.168 2.387.168 5.523 0 10-3.867 10-8.5S17.523 2 12 2zM8.5 11H6V8h2.5v3zm2.5-3h2V8h-2v3zm6.5 0h-1v3h-1.5V8H14v3h-1.5V8H12v3h-1.5V8H9v3H7.5V8H6v3H4.5V8H3v3h1.5v1.5H3v1h1.5v1.5H3v1h1.5V16H3v1.5H4.5V16H6v1.5H7.5V16H9v1.5h1.5V16H12v1.5h1.5V16H15v1.5h1.5V16H18v1.5h1.5V16H21v-1.5h-1.5V13H21v-1.5h-1.5V10H21v-1h-1.5V7.5H21v-1h-1.5V4.5H21v-1h-1.5V1h-1.5v1H18V.5h-1.5V1H15V.5h-1.5V1H12V.5H10.5V1H9V.5H7.5V1H6V.5H4.5V1H3v1h1.5V4.5H3v1h1.5v2.5z" />
                </svg>
                Kakao
              </button>
              {/* Add more share buttons if needed */}
            </div>
            <button
              className="mt-4 text-gray-500"
              onClick={closeDialog}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
