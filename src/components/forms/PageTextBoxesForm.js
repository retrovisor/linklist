'use client';

import { savePageTextBox, deleteTextBox } from "@/actions/pageActions";
import SectionBox from "@/components/layout/SectionBox";
import { faGripLines, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

export default function PageTextBoxesForm({ page, user }) {
  const [textBoxes, setTextBoxes] = useState(page.textBoxes || []);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [textBoxToDelete, setTextBoxToDelete] = useState(null);

  async function saveTextBox(textBox) {
  const response = await savePageTextBox(textBox);
  if (response.success) {
    toast.success('Text box saved!');
  } else {
    toast.error('Failed to save text box. Please try again.');
  }
}

  async function confirmDeleteTextBox() {
    if (textBoxToDelete) {
      await deleteTextBox(textBoxToDelete.key);
      setTextBoxes(prevTextBoxes => prevTextBoxes.filter(tb => tb.key !== textBoxToDelete.key));
      setShowDeleteConfirmation(false);
      setTextBoxToDelete(null);
      toast.success('Text box deleted!');
    }
  }

  function addNewTextBox() {
    setTextBoxes(prev => [
      ...prev,
      {
        key: Date.now().toString(),
        title: '',
        text: '',
      },
    ]);
  }

  function handleTextBoxChange(keyOfTextBoxToChange, prop, ev) {
    setTextBoxes(prev => {
      const newTextBoxes = [...prev];
      newTextBoxes.forEach(textBox => {
        if (textBox.key === keyOfTextBoxToChange) {
          textBox[prop] = ev.target.value;
        }
      });
      return newTextBoxes;
    });
  }

  function removeTextBox(textBox) {
    setTextBoxToDelete(textBox);
    setShowDeleteConfirmation(true);
  }

  return (
    <SectionBox>
  <div class="inline-block p-2">
            <h2 class="text-2xl font-bold mb-4 border-b-4 border-cyan-200">✍️ Text Boxes</h2>
    </div>      
    
    <button
        onClick={addNewTextBox}
        type="button"
        className="text-blue-500 text-lg flex add_button gap-2 items-center cursor-pointer"
      >
        <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
        <span>Add new</span>
      </button>
      <div className="">
        <ReactSortable handle={'.handle'} list={textBoxes} setList={setTextBoxes}>
          {textBoxes.map(tb => (
            <div key={tb.key} className="mt-6">
              <div className="handle">
                <FontAwesomeIcon
                  className="text-gray-500 mr-2 cursor-ns-resize"
                  icon={faGripLines}
                />
              </div>
              <div>
  <label className="input-label">Title:</label>
  <input
    value={tb.title}
    onChange={ev => handleTextBoxChange(tb.key, 'title', ev)}
    type="text"
    placeholder="Title"
  />
  <label className="input-label">Text:</label>
  <textarea
    value={tb.text}
    onChange={ev => handleTextBoxChange(tb.key, 'text', ev)}
    placeholder="Text"
    rows={3}
    className="min-h-[90px]"
  ></textarea>
  <div className="flex items-center mt-2">
    <button
      onClick={() => removeTextBox(tb)}
      type="button"
      className="bg-red-500 text-white px-4 py-2 rounded mr-2 flex items-center"
    >
      <FontAwesomeIcon icon={faTrash} className="mr-2" />
      Remove
    </button>
    <button
      onClick={() => saveTextBox(tb)}
      type="button"
      className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
    >
      <FontAwesomeIcon icon={faSave} className="mr-2" />
      Save Text Box
    </button>
  </div>
</div>

            </div>
          ))}
        </ReactSortable>
      </div>

      {showDeleteConfirmation && (
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
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Delete Text Box</h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this text box? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="button"
                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                onClick={confirmDeleteTextBox}
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
      )}
    </SectionBox>
  );
}
