import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CopyLinkButton = ({ uri }) => {
  const copyLink = () => {
    navigator.clipboard.writeText(`https://yoursite.com/${uri}`);
    // You can show a success message or perform any other actions here
  };

  return (
    <button
      className="flex items-center text-blue-500 hover:text-blue-700"
      onClick={copyLink}
    >
      <FontAwesomeIcon icon={faLink} className="mr-1" />
      <span>Copy Link</span>
    </button>
  );
};

export default CopyLinkButton;
