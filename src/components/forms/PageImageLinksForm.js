'use client';

import { saveImageLinks } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { faGripLines, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";
import { upload } from "@/libs/upload";

export default function PageImageLinksForm({ page, user }) {
  const [imageLinks, setImageLinks] = useState(page.imageLinks || []);

  async function save(ev) {
    ev.preventDefault();
    const result = await saveImageLinks(imageLinks);
    if (result.success) {
      toast.success('Saved!');
    } else {
      toast.error(result.message || 'Failed to save');
    }
  }

  function addNewImageLink() {
    setImageLinks(prev => [
      ...prev,
      {
        key: Date.now().toString(),
        title: '',
        url: '',
        linkUrl: '',
      },
    ]);
  }

  function handleImageLinkChange(keyOfImageLinkToChange, prop, ev) {
    setImageLinks(prev => {
      const newImageLinks = [...prev];
      newImageLinks.forEach(imageLink => {
        if (imageLink.key === keyOfImageLinkToChange) {
          imageLink[prop] = ev.target.value;
        }
      });
      return newImageLinks;
    });
  }

  async function handleImageUpload(keyOfImageLinkToChange, ev) {
    const link = await upload(ev, (link) => {
      setImageLinks(prev => {
        const newImageLinks = [...prev];
        newImageLinks.forEach(imageLink => {
          if (imageLink.key === keyOfImageLinkToChange) {
            imageLink.url = link;
          }
        });
        return newImageLinks;
      });
    });
  }

  function removeImageLink(imageLinkKeyToRemove) {
    setImageLinks(prevImageLinks =>
      [...prevImageLinks].filter(il => il.key !== imageLinkKeyToRemove)
    );
  }

  return (
    <SectionBox>
      <form onSubmit={save}>
        <h2 className="text-2xl font-bold mb-4">Image Links</h2>
        <button
          onClick={addNewImageLink}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer"
        >
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
        </button>
        <div className="">
          <ReactSortable handle={'.handle'} list={imageLinks} setList={setImageLinks}>
            {imageLinks.map(il => (
              <div key={il.key} className="mt-8">
                <div className="handle">
                  <FontAwesomeIcon
                    className="text-gray-500 mr-2 cursor-ns-resize"
                    icon={faGripLines}
                  />
                </div>
                <div>
                  <label className="input-label">Title:</label>
                  <input
                    value={il.title}
                    onChange={ev => handleImageLinkChange(il.key, 'title', ev)}
                    type="text"
                    placeholder="Title"
                  />
                  <label className="input-label">Image:</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={ev => handleImageUpload(il.key, ev)}
                  />
                  <label className="input-label">Link URL:</label>
                  <input
                    value={il.linkUrl}
                    onChange={ev => handleImageLinkChange(il.key, 'linkUrl', ev)}
                    type="text"
                    placeholder="Link URL"
                  />
                  <button
                    onClick={() => removeImageLink(il.key)}
                    type="button"
                    className="bg-gray-300 py-2 px-3 mb-2 h-full flex gap-2 items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Remove this image link</span>
                  </button>
                </div>
              </div>
            ))}
          </ReactSortable>
        </div>
        <div className="border-t pt-4 mt-4">
          <SubmitButton className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}
