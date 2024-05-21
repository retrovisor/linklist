import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { commonIcons } from '@/utils/icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Import the X icon

library.add(fas);

const IconModal = ({ currentIcon, onIconSelect, onClose, buttonRef }) => {
  const modalRef = useRef();

  // Click outside to close modal
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, onClose]);

  const isCustomIcon = currentIcon.startsWith('http');

  // Ensure modal is centered by updating only once and when opening
  useEffect(() => {
    window.scrollTo(0, modalRef.current.offsetTop - 100); // Ensure it's slightly in view
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-4" style={{ width: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">Select Icon</h2>
          <button onClick={onClose} className="p-2">
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>
        {isCustomIcon ? (
          <div>
            <p>Custom icon:</p>
            <img src={currentIcon} alt="Custom Icon" className="w-16 h-16" />
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {commonIcons.map((icon) => (
              <div
                key={icon.iconName}
                className="icon-container cursor-pointer"
                onClick={() => {
                  onIconSelect(`fa-${icon.iconName}`);
                  if (buttonRef && buttonRef.current) {
                    buttonRef.current.scrollIntoView({ behavior: 'smooth' });
                  }
                  onClose(); // Assuming you want to close the modal after selection
                }}
              >
                <FontAwesomeIcon icon={icon} className="icon" />
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded fixed bottom-5 right-5"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default IconModal;
