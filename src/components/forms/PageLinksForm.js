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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 className="text-base font-semibold leading-6 text-gray-900">Delete Link</h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this link? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
              onClick={confirmDeleteLink}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              onClick={() => setShowDeleteConfirmation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

            

    </SectionBox>
  );
}
