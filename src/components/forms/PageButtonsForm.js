'use client';
import { savePageButtons } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { ReactSortable } from "react-sortablejs";
import {
  faDiscord, faFacebook, faGithub, faInstagram,
  faTelegram, faTiktok, faWhatsapp, faYoutube,
  faKakao, faNaver, faWeixin, faLine, faPinterest, faTwitch, faSoundCloud, faTwitter // Assuming these icons are available
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faGripLines, faMobile, faMugHot, faComment, faN, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";

// Define all available buttons with their properties
export const allButtons = [
  { key: 'email', label: 'e-mail', icon: faEnvelope, placeholder: 'name@example.com' },
  { key: 'instagram', label: 'instagram', icon: faInstagram, placeholder: '@username' },
  { key: 'kakao', label: 'kakao', icon: faComment, placeholder: 'https://kakao.com/profile/{your_id}' },
  { key: 'naver', label: 'naver', icon: faMugHot, placeholder: 'https://blog.naver.com/{username}' },
  { key: 'tiktok', label: 'tiktok', icon: faTiktok, placeholder: '@username' },
  { key: 'facebook', label: 'facebook', icon: faFacebook, placeholder: 'https://' },
  { key: 'discord', label: 'discord', icon: faDiscord },
  { key: 'youtube', label: 'youtube', icon: faYoutube, placeholder: 'https://' },
  { key: 'telegram', label: 'telegram', icon: faTelegram, placeholder: '@username' },
  { key: 'wechat', label: 'wechat', icon: faWeixin, placeholder: 'WeChat ID: your_id' },
  { key: 'line', label: 'line', icon: faLine, placeholder: 'Line ID: your_id' },
  { key: 'pinterest', label: 'pinterest', icon: faPinterest, placeholder: 'https://www.pinterest.com/{username}' },
  { key: 'twitch', label: 'twitch', icon: faTwitch, placeholder: 'https://www.twitch.tv/{username}' },
  { key: 'soundcloud', label: 'soundcloud', icon: faSoundCloud, placeholder: 'https://soundcloud.com/{username}' },
  { key: 'twitter', label: 'twitter', icon: faTwitter, placeholder: 'https://twitter.com/{username}' }

];


// Helper function to capitalize the first letter of a string
function upperFirst(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export default function PageButtonsForm({ user, page }) {
  console.log('PageButtonsForm initialized with user:', user, 'and page:', page);

  // Ensure `page.buttons` is defined and use it to initialize `activeButtons`
  const pageSavedButtonsKeys = Object.keys(page.buttons || {});
  const pageSavedButtonsInfo = pageSavedButtonsKeys
    .map(k => allButtons.find(b => b.key === k))
    .filter(b => b !== undefined); // Filter out undefined buttons

  const [activeButtons, setActiveButtons] = useState(pageSavedButtonsInfo);
  console.log('Initial active buttons:', activeButtons);

  // Function to add a button to the profile
  function addButtonToProfile(button) {
    setActiveButtons(prevButtons => {
      // Prevent adding the same button more than once
      if (prevButtons.find(b => b.key === button.key)) return prevButtons;
      return [...prevButtons, button];
    });
  }

  // Function to save buttons (called on form submit)
  async function saveButtons(event) {
    event.preventDefault(); // Prevent page reload
    const formData = new FormData(event.target);
    console.log('Form data to be sent:', formData);
    try {
      const response = await savePageButtons(formData); // Send formData directly
      if (response.success) {
        toast.success('Settings saved!');
      } else {
        toast.error(response.message || 'Failed to save settings.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings. Please try again.');
    }
  }

  // Function to remove a button from the profile
  function removeButton({ key: keyToRemove }) {
    setActiveButtons(prevButtons => {
      return prevButtons.filter(button => button.key !== keyToRemove);
    });
  }

  // Filter available buttons to exclude those already added
  const availableButtons = allButtons.filter(b1 => !activeButtons.find(b2 => b1.key === b2.key));
  console.log('Available buttons:', availableButtons);

  return (
    <SectionBox>
      <form onSubmit={saveButtons}>
    <div class="inline-block p-2">

            <h2 class="text-2xl font-bold mb-4 border-b-4 border-cyan-200">⭐️ Social Links</h2>
    </div>
    
        <ReactSortable
          handle=".handle"
          list={activeButtons}
          setList={setActiveButtons}>
          {activeButtons.map(b => (
            <div key={b.key} className="mb-2 md:flex items-center">
              <div className="w-56 flex h-full text-gray-700 gap-2 items-center">
                <FontAwesomeIcon
                  icon={faGripLines}
                  className="cursor-pointer text-gray-400 handle p-2" />
                <FontAwesomeIcon icon={b.icon} />
                <span>{upperFirst(b.label)}:</span>
              </div>
              <div className="grow flex">
                <input
                  placeholder={b.placeholder}
                  name={b.key}
                  defaultValue={page.buttons ? page.buttons[b.key] : ''}
                  type="text" style={{ marginBottom: '0' }} />
                <button
                  onClick={() => removeButton(b)}
                  type="button"
                  className="py-2 px-4 bg-gray-300 cursor-pointer">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </ReactSortable>
        <div className="flex flex-wrap gap-2 mt-4">
          {availableButtons.map(b => (
            <button
              key={b.key}
              type="button"
              onClick={() => addButtonToProfile(b)}
              className="flex items-center gap-1 p-2 bg-gray-200">
              <FontAwesomeIcon icon={b.icon} />
              <span>{upperFirst(b.label)}</span>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          ))}
        </div>
        <div className="pt-4">
          <SubmitButton className="max-w-xs mx-auto">
            <FontAwesomeIcon icon={faSave} />
            <span>Save</span>
          </SubmitButton>
        </div>
      </form>
    </SectionBox>
  );
}
