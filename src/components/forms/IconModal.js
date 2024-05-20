import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { commonIcons } from '@/utils/icons';

const IconModal = ({ currentIcon, onIconSelect, onClose, onUpload }) => {
  console.log('IconModal rendered');
  console.log('Current Icon in Modal:', currentIcon);

  const isCustomIcon = currentIcon.startsWith('http');

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-xl font-bold mb-4">Select an Icon</h2>
        {isCustomIcon ? (
          <div>
            <p>Custom icon:</p>
            <img src={currentIcon} alt="Custom Icon" className="w-16 h-16" />
            <div>
              <input
                onChange={onUpload}
                id="upload-icon"
                type="file"
                accept="image/*"
                className="hidden"
              />
              <label htmlFor="upload-icon" className="border mt-2 p-2 flex items-center gap-1 text-gray-600 cursor-pointer mb-2 justify-center">
                <FontAwesomeIcon icon={faCloudArrowUp} />
                <span>Upload icon</span>
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4">
            {commonIcons.map((icon) => (
              <div
                key={icon}
                className={`cursor-pointer ${currentIcon === `fa-${icon}` ? 'text-blue-500' : 'text-gray-500'}`}
                onClick={() => {
                  console.log('Icon selected:', `fa-${icon}`);
                  onIconSelect(`fa-${icon}`);
                }}
              >
                <FontAwesomeIcon icon={['fas', icon]} size="2x" />
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
