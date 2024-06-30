// components/buttons/LogoutButton.js
'use client';

import { useTranslation } from 'react-i18next';
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { signOut } from "next-auth/react";

export default function LogoutButton({
  className = 'flex items-center gap-2 border p-2 px-4 logout',
  iconLeft = false,
  iconClasses = '',
}) {
  const { t } = useTranslation('common');

  return (
    <button
      className={className}
      onClick={() => signOut()}>
      {iconLeft && (
        <FontAwesomeIcon icon={faRightFromBracket} className={iconClasses} />
      )}
      <span>{t('header.logout')}</span>
      {!iconLeft && (
        <FontAwesomeIcon icon={faRightFromBracket} className={iconClasses} />
      )}
    </button>
  );
}
