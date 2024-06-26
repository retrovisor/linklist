'use client';

import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";

export default function ConfirmationDialog() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogProps, setDialogProps] = useState({});

  useEffect(() => {
    const handleShowConfirmationDialog = (event) => {
      setDialogProps(event.detail);
      setShowDialog(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener("showConfirmationDialog", handleShowConfirmationDialog);

    return () => {
      window.removeEventListener("showConfirmationDialog", handleShowConfirmationDialog);
    };
  }, []);

  const { onConfirm, onCancel } = dialogProps;

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    setShowDialog(false); // Close the dialog after confirming
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setShowDialog(false); // Close the dialog after canceling
  };

  if (!showDialog) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-gray-500 opacity-75"></div>
      <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-6 w-6 text-red-600" />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Delete Link</h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  이 링크를 정말로 삭제하시겠습니까? 이 행동은 취소할 수 없습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleConfirm}
          >
            삭제
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={handleCancel}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
}
