'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWhatsapp, faFacebook, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

// Declare the domain at the top
const DOMAIN = 'https://yourdomain.com'; // Replace with your domain

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
            <h3 className="text-xl font-semibold mb-4">Share</h3>
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
                <FontAwesomeIcon className="mr-2" icon={faComment} />
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
