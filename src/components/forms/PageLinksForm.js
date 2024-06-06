'use client';
import { savePageLink, deletePageLink } from "@/actions/pageActions";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/libs/upload";
import { faExclamationTriangle, faGripLines, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState, useEffect } from "react";
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
  const [newLinkRef, setNewLinkRef] = useState(null);

  useEffect(() => {
    if (newLinkRef) {
      const element = document.querySelector(`[data-key="${newLinkRef}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setNewLinkRef(null);
      }
    }
  }, [newLinkRef]);

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
      toast.success('링크가 저장되었습니다!');
    }
  }

  function addNewLink() {
    setLinks(prev => {
      const newLink = {
        key: Date.now().toString(),
        title: '',
        subtitle: '',
        icon: '',
        url: '',
      };
      setNewLinkRef(newLink.key);
      return [...prev, newLink];
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
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold border-b-4 border-cyan-200 inline-block">🔗 링크</h2>
    <button
      onClick={addNewLink}
      type="button"
      className="text-blue-500 add_button text-lg flex gap-2 items-center cursor-pointer"
    >
      <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
      <span>새로운 걸 더하다</span>
    </button>
  </div>
     
<div className="">
  <ReactSortable handle={'.handle'} list={links} setList={setLinks}>
    {links.map(l => (
      <div key={l.key} className="mt-4" data-key={l.key}>
        <div className="handle">
          <FontAwesomeIcon
            className="text-gray-500 mr-2 cursor-ns-resize"
            icon={faGripLines}
          />
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center w-full">
            <div className="text-center w-16 flex-shrink-0">
              <div
                className="bg-gray-100 inline-block relative aspect-square overflow-hidden w-16 h-16 inline-flex justify-center items-center cursor-pointer"
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
                {!l.icon && 
            <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon size="2x" className="text-white" icon={faLink} />
                </div>
                  }
              </div>
            </div>
            <div className="flex-1 ml-2">
              <div>
                <label className="input-label">제목:</label>
                <input
                  value={l.title}
                  onChange={ev => handleLinkChange(l.key, 'title', ev)}
                  type="text"
                  placeholder="title"
                />
              </div>
              <div>
                <label className="input-label">부제목:</label>
                <input
                  value={l.subtitle}
                  onChange={ev => handleLinkChange(l.key, 'subtitle', ev)}
                  type="text"
                  placeholder="부제목 (optional)"
                />
              </div>
            </div>
          </div>
          <div className="w-full">
            <label className="input-label">URL:</label>
            <input
              value={l.url}
              onChange={ev => handleLinkChange(l.key, 'url', ev)}
              type="text"
              placeholder="https://"
            />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <button
            onClick={() => removeLink(l)}
            type="button"
            className="bg-red-500 text-white px-4 py-2 rounded mr-2 flex items-center"
          >
            <FontAwesomeIcon icon={faTrash} className="mr-2" />
            제거
          </button>
          <button
            onClick={() => saveLink(l)}
            type="button"
            className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
          >
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            링크 저장
          </button>
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
  // Assuming showDeleteConfirmation is true and the modal should be displayed
<div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
  <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
  <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3 className="text-base font-semibold leading-6 text-gray-900">링크 삭제</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              이 링크를 정말로 삭제하시겠습니까? 이 행동은 취소할 수 없습니다.
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
        삭제
      </button>
      <button
        type="button"
        className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
        onClick={() => setShowDeleteConfirmation(false)}
      >
        취소
      </button>
    </div>
  </div>
</div>

)}

            

    </SectionBox>
  );
}
