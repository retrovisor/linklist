import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { commonIcons } from '@/utils/icons';

library.add(fas);

const IconModal = ({ currentIcon, onIconSelect, onClose }) => {
  console.log('IconModal rendered');
  console.log('Current Icon in Modal:', currentIcon);

  const isCustomIcon = currentIcon.startsWith('http');

  return (
    // Overlay container
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
      // Dialog box
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4">Select an Icon</h2>
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
                onClick={() => {
                  console.log('Icon selected:', `fa-${icon.iconName}`);
                  onIconSelect(`fa-${icon.iconName}`);
                }}
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
