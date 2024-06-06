'use client';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const CopyLinkButton = ({ uri }) => {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://fizz.link/${uri}`);
    setCopied(true);
    toast.success('링크가 클립보드에 복사되었습니다!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      className="flex items-center justify-center px-3 py-3 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      onClick={copyLink}
    >
      <FontAwesomeIcon icon={faCopy} className="mr-2" />
      <span>{copied ? '복사되었습니다!' : '링크 복사'}</span>
    </button>
  );
};

export default CopyLinkButton;
