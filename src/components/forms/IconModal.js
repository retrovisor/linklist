import { commonIcons } from '@/utils/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

const IconModal = ({ currentIcon, onIconSelect, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4">Select an Icon</h2>
        <div className="grid grid-cols-5 gap-4">
          {commonIcons.map((icon) => (
            <div
              key={icon}
              className={`cursor-pointer ${currentIcon === `fa-${icon.replace('fa', '')}` ? 'text-blue-500' : 'text-gray-500'}`}
              onClick={() => onIconSelect(`fa-${icon.replace('fa', '')}`)}
            >
              <FontAwesomeIcon icon={`fa-solid fa-${icon.replace('fa', '')}`} size="2x" />
            </div>
          ))}
        </div>
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
