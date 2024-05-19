'use client';

import { saveTextBoxes } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

export default function PageTextBoxesForm({ page, user }) {
  const [textBoxes, setTextBoxes] = useState(page.textBoxes || []);

  async function save() {
    await saveTextBoxes(textBoxes);
    toast.success('Saved!');
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

  function removeTextBox(textBoxKeyToRemove) {
    setTextBoxes(prevTextBoxes =>
      [...prevTextBoxes].filter(tb => tb.key !== textBoxKeyToRemove)
    );
  }

  return (
    <SectionBox>
      <form action={save}>
        <h2 className="text-2xl font-bold mb-4">Text Boxes</h2>
        <button
          onClick={addNewTextBox}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer"
        >
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
        </button>
        <div className="">
          <ReactSortable handle={'.handle'} list={textBoxes} setList={setTextBoxes}>
            {textBoxes.map(tb => (
              <div key={tb.key} className="mt-8">
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
                  ></textarea>
                  <button
                    onClick={() => removeTextBox(tb.key)}
                    type="button"
                    className="bg-gray-300 py-2 px-3 mb-2 h-full flex gap-2 items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Remove this text box</span>
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
