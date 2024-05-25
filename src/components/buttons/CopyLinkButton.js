'use client';

import { faLink } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const CopyLinkButton = ({ uri }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://yoursite.com/${uri}`);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="flex items-center text-blue-500 hover:text-blue-700"
      onClick={copyLink}
    >
      <FontAwesomeIcon icon={faLink} className="mr-1" />
      <span>{copied ? 'Copied!' : 'Copy Link'}</span>
    </button>
  );
};

export default CopyLinkButton;
