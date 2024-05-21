import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { commonIcons } from '@/utils/icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons'; // Ensure the X icon is imported

library.add(fas);

const IconModal = ({ currentIcon, onIconSelect, onClose }) => {
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">图标选择器</h2>
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
                className={`cursor-pointer ${currentIcon === `fa-${icon.iconName}` ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={() => onIconSelect(`fa-${icon.iconName}`)}
              >
                <FontAwesomeIcon icon={icon} size="2x" />
              </div>
            ))}
          </div>
        )}
        <button
          className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default IconModal;
