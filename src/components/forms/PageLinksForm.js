'use client';
import { savePageLink, deletePageLink } from "@/actions/pageActions";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/libs/upload";
import { faExclamationTriangle, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import IconModal from "./IconModal";
import { commonIcons } from '@/utils/icons';

export default function PageLinksForm({ page, user }) {
  const [links, setLinks] = useState(page.links || []);
  const [showIconModal, setShowIconModal] = useState(false);
  const [currentIconKey, setCurrentIconKey] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);

  async function saveLink(link) {
    await savePageLink(link);
    toast.success('Link saved!');
  }

  async function confirmDeleteLink() {
    if (linkToDelete) {
      await deletePageLink(linkToDelete.key);
      setLinks(prevLinks => prevLinks.filter(l => l.key !== linkToDelete.key));
      setShowDeleteConfirmation(false);
      setLinkToDelete(null);
      toast.success('Link deleted!');
    }
  }

  function addNewLink() {
    setLinks(prev => {
      return [...prev, {
        key: Date.now().toString(),
        title: '',
        subtitle: '',
        icon: '',
        url: '',
      }];
    });
  }

  function handleUpload(ev, linkKeyForUpload) {
    if (ev && ev.target.files && ev.target.files.length > 0) {
      // User uploaded a custom image
      upload(ev, uploadedImageUrl => {
        setLinks(prevLinks => {
          const newLinks = [...prevLinks];
          newLinks.forEach((link, index) => {
            if (link.key === linkKeyForUpload) {
              link.icon = uploadedImageUrl;
            }
          });
          return newLinks;
        });
      });
    }
  }

  function handleIconSelect(icon) {
    console.log('Selected Icon:', icon); // Debug log
    setLinks((prevLinks) => {
      const newLinks = [...prevLinks];
      newLinks.forEach((link) => {
        if (link.key === currentIconKey) {
          link.icon = icon;
        }
      });
      return newLinks;
    });
    setShowIconModal(false);
  }

  function handleLinkChange(keyOfLinkToChange, prop, ev) {
    setLinks(prev => {
      const newLinks = [...prev];
      newLinks.forEach((link) => {
        if (link.key === keyOfLinkToChange) {
          link[prop] = ev.target.value;
        }
      });
      return newLinks;
    })
  }

  function removeLink(link) {
    setLinkToDelete(link);
    setShowDeleteConfirmation(true);
  }

  return (
    <SectionBox>
      <h2 className="text-2xl font-bold mb-4">Links</h2>
      <button
        onClick={addNewLink}
        type="button"
        className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer"
      >
        <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
        <span>Add new</span>
      </button>
      <div className="">
        <ReactSortable handle={'.handle'} list={links} setList={setLinks}>
          {links.map(l => (
            <div key={l.key} className="mt-8 md:flex gap-2 items-center">
              <div className="handle">
                <FontAwesomeIcon
                  className="text-gray-500 mr-2 cursor-ns-resize"
                  icon={faGripLines}
                />
              </div>
              <div className="text-center">
                <div
                  className="bg-gray-300 inline-block relative aspect-square overflow-hidden w-16 h-16 inline-flex justify-center items-center cursor-pointer"
                  onClick={() => {
                    console.log('Change Icon Clicked', l.key); // Debug log
                    setCurrentIconKey(l.key);
                    setShowIconModal(true);
                  }}
                >
                  {l.icon && l.icon.startsWith('http') && (
                    <Image
                      className="w-full h-full object-cover"
                      src={l.icon}
                      alt={'icon'}
                      width={64}
                      height={64}
                    />
                  )}
                  {l.icon && !l.icon.startsWith('http') && (
                    <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={['fas', l.icon.replace('fa-', '')]} size="2x" className="text-white" />
                    </div>
                  )}
                  {!l.icon && <FontAwesomeIcon size="xl" icon={faLink} />}
                </div>
              </div>
              <div className="grow">
                <label className="input-label">Title:</label>
                <input
                  value={l.title}
                  onChange={ev => handleLinkChange(l.key, 'title', ev)}
                  type="text"
                  placeholder="title"
                />
                <label className="input-label">Subtitle:</label>
                <input
                  value={l.subtitle}
                  onChange={ev => handleLinkChange(l.key, 'subtitle', ev)}
                  type="text"
                  placeholder="subtitle (optional)"
                />
                <label className="input-label">URL:</label>
                <input
                  value={l.url}
                  onChange={ev => handleLinkChange(l.key, 'url', ev)}
                  type="text"
                  placeholder="url"
                />
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => removeLink(l)}
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Remove
                  </button>
                  <button
                    onClick={() => saveLink(l)}
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    Save Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ReactSortable>
      </div>
      {showIconModal && (
        <IconModal
          currentIcon={links.find((l) => l.key === currentIconKey)?.icon || ''}
          onIconSelect={handleIconSelect}
          onClose={() => setShowIconModal(false)}
          onUpload={(ev) => handleUpload(ev, currentIconKey)}
        />
      )}

{showDeleteConfirmation && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 transition-opacity" aria-hidden="true">
        <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
        &#8203;
      </span>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete Link
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this link? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={confirmDeleteLink}
          >
            Delete
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}

            

    </SectionBox>
  );
}
