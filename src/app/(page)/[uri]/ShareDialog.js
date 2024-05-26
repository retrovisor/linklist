'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { useState, useEffect, useRef } from "react";

const DOMAIN = 'https://linklist-wheat.vercel.app';

function ShareDialog({ uri, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dialogRef.current && !dialogRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
          imageUrl: 'YOUR_IMAGE_URL',
          link: {
            mobileWebUrl: `${DOMAIN}/${uri}`,
            webUrl: `${DOMAIN}/${uri}`
          }
        }
      });
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${DOMAIN}/${uri}`)
      .then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      })
      .catch((err) => {
        console.error('Failed to copy link: ', err);
      });
  };

  const handleClick = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div onClick={handleClick}>
        {children}
      </div>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div ref={dialogRef} className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-xl font-semibold mb-4 text-black">Share your Nae.Link</h3>
            <div className="flex flex-col gap-4">
<button
  className="bg-green-500 text-white text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
  onClick={shareOnWhatsApp}
>
  <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
  WhatsApp
</button>
<button
  className="bg-blue-600 text-white text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
  onClick={shareOnFacebook}
>
  <FontAwesomeIcon icon={faFacebook} className="mr-2" />
  Facebook
</button>

              <button
                className="bg-yellow-400 text-black text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
                onClick={shareOnKakao}
              >
                Kakao
              </button>
              <button
                className="bg-gray-200 text-black text-lg font-bold px-6 py-4 rounded flex items-center justify-center"
                onClick={copyLink}
              >
                {copySuccess ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
            <button className="mt-4" onClick={handleClose}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ShareDialog;
