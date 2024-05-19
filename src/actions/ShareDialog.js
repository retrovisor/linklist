'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTelegram, faTwitter, faWhatsapp, faShare } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

export default function ShareDialog({ uri }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = () => {
    setIsOpen(true);
  };

  const closeDialog = () => {
    setIsOpen(false);
  };

  const shareOnWhatsApp = () => {
    const shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      `Check out my page on MomoFriends: ${process.env.URL}/${uri}`
    )}`;
    window.open(shareUrl, "_blank");
  };

  // Add more share functions for other platforms

  return (
    <>
      <button
        className="bg-white text-blue-950 p-2 rounded-full flex items-center justify-center"
        onClick={openDialog}
      >
        <FontAwesomeIcon className="w-5 h-5" icon={faShare} />
      </button>

      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Share</h3>
            <div className="flex flex-wrap gap-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={shareOnWhatsApp}
              >
                <FontAwesomeIcon className="mr-2" icon={faWhatsapp} />
                WhatsApp
              </button>
              {/* Add more share buttons */}
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
