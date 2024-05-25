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

  function addNewLink() {
    setLinks([...links, { key: Date.now().toString(), title: '', subtitle: '', icon: '', url: '' }]);
  }

  async function saveLink(link) {
    await savePageLink(link);
    toast.success('Link saved!');
  }

  async function confirmDeleteLink() {
    if (linkToDelete) {
      await deletePageLink(linkToDelete.key);
      setLinks(links => links.filter(l => l.key !== linkToDelete.key));
      setShowDeleteConfirmation(false);
      setLinkToDelete(null);
      toast.success('Link deleted!');
    }
  }

  function handleUpload(ev, linkKey) {
    if (ev.target.files && ev.target.files.length > 0) {
      upload(ev, url => {
        setLinks(links => links.map(l => l.key === linkKey ? { ...l, icon: url } : l));
      });
    }
  }

  function handleIconSelect(icon) {
    setLinks(links => links.map(l => l.key === currentIconKey ? { ...l, icon } : l));
    setShowIconModal(false);
  }

  function handleLinkChange(linkKey, prop, value) {
    setLinks(links => links.map(l => l.key === linkKey ? { ...l, [prop]: value } : l));
  }

  function removeLink(link) {
    setLinkToDelete(link);
    setShowDeleteConfirmation(true);
  }

  return (
    <SectionBox>
      <h2 className="text-2xl font-bold mb-4 border-b-4 border-cyan-200">🔗 Links</h2>
      <button onClick={addNewLink} className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer">
        <FontAwesomeIcon icon={faPlus} className="bg-blue-500 text-white p-1 rounded-full" />
        Add new
      </button>
      <ReactSortable list={links} setList={setLinks} handle=".handle">
        {links.map(link => (
          <div key={link.key} className="bg-white shadow rounded p-3 mb-4">
            <div className="flex flex-col md:flex-row items-center">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faGripLines} className="text-gray-500 mr-2 cursor-move" />
                <div onClick={() => { setCurrentIconKey(link.key); setShowIconModal(true); }}
                     className="bg-gray-300 w-16 h-16 rounded-full flex items-center justify-center overflow-hidden mr-4">
                  {link.icon ? (
                    <Image src={link.icon} alt="icon" width={64} height={64} className="object-cover" />
                  ) : (
                    <FontAwesomeIcon icon={faLink} size="2x" className="text-gray-700" />
                  )}
                </div>
              </div>
              <div className="flex-grow">
                <label>Title:</label>
                <input type="text" value={link.title} onChange={(e) => handleLinkChange(link.key, 'title', e.target.value)} 
                       className="input input-bordered w-full mb-2" />
                <label>Subtitle (optional):</label>
                <input type="text" value={link.subtitle} onChange={(e) => handleLinkChange(link.key, 'subtitle', e.target.value)} 
                       className="input input-bordered w-full mb-2" />
              </div>
            </div>
            <label>URL:</label>
            <input type="text" value={link.url} onChange={(e) => handleLinkChange(link.key, 'url', e.target.value)} 
                   className="input input-bordered w-full mb-4" />
            <div className="flex justify-between">
              <button onClick={() => removeLink(link)} className="btn btn-error">
                <FontAwesomeIcon icon={faTrash} /> Remove
              </button>
              <button onClick={() => saveLink(link)} className="btn btn-success">
                <FontAwesomeIcon icon={faSave} /> Save Link
              </button>
            </div>
          </div>
        ))}
      </ReactSortable>
      {showIconModal && <IconModal currentIcon={links.find(l => l.key === currentIconKey)?.icon} 
                                   onIconSelect={handleIconSelect} onClose={() => setShowIconModal(false)} 
                                   onUpload={(ev) => handleUpload(ev, currentIconKey)} />}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded shadow-lg p-5 m-4 max-w-sm max-h-full text-center">
              <h3 className="text-lg font-bold">Confirm Deletion</h3>
              <p>Are you sure you want to delete this link? This action cannot be undone.</p>
              <div className="mt-4">
                <button className="btn mr-2" onClick={() => setShowDeleteConfirmation(false)}>Cancel</button>
                <button className="btn btn-error" onClick={confirmDeleteLink}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionBox>
  );
}
