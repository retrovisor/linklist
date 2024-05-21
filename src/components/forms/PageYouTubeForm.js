'use client';

import { saveYouTubeVideos } from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import SectionBox from "@/components/layout/SectionBox";
import { faGripLines, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

export default function PageYouTubeForm({ page, user }) {
  const [youTubeVideos, setYouTubeVideos] = useState(page.youTubeVideos || []);

async function save() {
  await saveYouTubeVideos(youTubeVideos);
  toast.success('Saved!');
}

  function addNewYouTubeVideo() {
    setYouTubeVideos(prev => [
      ...prev,
      {
        key: Date.now().toString(),
        url: '',
      },
    ]);
  }

  function handleYouTubeVideoChange(keyOfVideoToChange, ev) {
    setYouTubeVideos(prev => {
      const newYouTubeVideos = [...prev];
      newYouTubeVideos.forEach(video => {
        if (video.key === keyOfVideoToChange) {
          video.url = ev.target.value;
        }
      });
      return newYouTubeVideos;
    });
  }

  function removeYouTubeVideo(videoKeyToRemove) {
    setYouTubeVideos(prevYouTubeVideos =>
      [...prevYouTubeVideos].filter(video => video.key !== videoKeyToRemove)
    );
  }

  return (
    <SectionBox>
      <form action={save}>
        <h2 className="text-2xl font-bold mb-4">YouTube Videos</h2>
        <button
          onClick={addNewYouTubeVideo}
          type="button"
          className="text-blue-500 text-lg flex gap-2 items-center cursor-pointer"
        >
          <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
          <span>Add new</span>
        </button>
        <div className="">
          <ReactSortable handle={'.handle'} list={youTubeVideos} setList={setYouTubeVideos}>
            {youTubeVideos.map(video => (
              <div key={video.key} className="mt-8">
                <div className="handle">
                  <FontAwesomeIcon
                    className="text-gray-500 mr-2 cursor-ns-resize"
                    icon={faGripLines}
                  />
                </div>
                <div>
                  <label className="input-label">YouTube Video URL:</label>
                  <input
                    value={video.url}
                    onChange={ev => handleYouTubeVideoChange(video.key, ev)}
                    type="text"
                    placeholder="YouTube Video URL"
                  />
                  <button
                    onClick={() => removeYouTubeVideo(video.key)}
                    type="button"
                    className="bg-gray-300 py-2 px-3 mb-2 h-full flex gap-2 items-center justify-center"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Remove this video</span>
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
