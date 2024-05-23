'use client';
import { savePageLink } from "@/actions/pageActions";
import SectionBox from "@/components/layout/SectionBox";
import { upload } from "@/libs/upload";
import { faCloudArrowUp, faGripLines, faIcons, faLink, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
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

  async function saveLink(link) {
    await savePageLink(link);
    toast.success('Link saved!');
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

  function removeLink(linkKeyToRemove) {
    setLinks(prevLinks =>
      [...prevLinks].filter(l => l.key !== linkKeyToRemove)
    );
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
                    onClick={() => removeLink(l.key)}
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
    </SectionBox>
  );
}
