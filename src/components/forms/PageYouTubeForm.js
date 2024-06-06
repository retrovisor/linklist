'use client';

import { savePageYouTubeVideo, deletePageYouTubeVideo } from "@/actions/pageActions";
import SectionBox from "@/components/layout/SectionBox";
import { faGripLines, faPlus, faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import toast from "react-hot-toast";
import { ReactSortable } from "react-sortablejs";

export default function PageYouTubeForm({ page, user }) {
  const [youTubeVideos, setYouTubeVideos] = useState(page.youTubeVideos || []);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);

  async function saveYouTubeVideo(video) {
    const response = await savePageYouTubeVideo(video);
    if (response.success) {
      toast.success('유튜브 영상이 저장되었습니다!');
    } else {
      toast.error('YouTube 동영상을 저장하지 못했습니다. 다시 시도해 주세요.');
    }
  }

  async function confirmDeleteYouTubeVideo() {
    if (videoToDelete) {
      await deletePageYouTubeVideo(videoToDelete.key);
      setYouTubeVideos(prevYouTubeVideos => prevYouTubeVideos.filter(video => video.key !== videoToDelete.key));
      setShowDeleteConfirmation(false);
      setVideoToDelete(null);
      toast.success('유튜브 영상이 삭제되었습니다!');
    }
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

  function removeYouTubeVideo(video) {
    setVideoToDelete(video);
    setShowDeleteConfirmation(true);
  }

  return (

          <SectionBox>
  <div className="flex items-center justify-between mb-4">
    <h2 className="text-2xl font-bold border-b-4 border-cyan-200 inline-block">📺 유튜브 영상</h2>
    <button
      onClick={addNewYouTubeVideo}
      type="button"
      className="text-blue-500 add_button text-lg flex gap-2 items-center cursor-pointer"
    >
      <FontAwesomeIcon className="bg-blue-500 text-white p-1 rounded-full aspect-square" icon={faPlus} />
      <span>새로운 걸 더하다</span>
    </button>
  </div>

          
      <div className="estica">
        <ReactSortable handle={'.handle'} list={youTubeVideos} setList={setYouTubeVideos}>
          {youTubeVideos.map(video => (
            <div key={video.key} className="mt-4">
              <div className="handle">
                <FontAwesomeIcon
                  className="text-gray-500 mr-2 cursor-ns-resize"
                  icon={faGripLines}
                />
              </div>
              <div>
                <label className="input-label">YouTube 동영상 URL:</label>
                <input
                  value={video.url}
                  onChange={ev => handleYouTubeVideoChange(video.key, ev)}
                  type="text"
                  placeholder="https://"
                />
                <div className="flex items-center mt-2">
                  <button
                    onClick={() => removeYouTubeVideo(video)}
                    type="button"
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2 flex items-center"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    제거
                  </button>
                  <button
                    onClick={() => saveYouTubeVideo(video)}
                    type="button"
                    className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
                  >
                    <FontAwesomeIcon icon={faSave} className="mr-2" />
                    비디오 저장
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
                  <h3 className="text-base font-semibold leading-6 text-gray-900">Delete YouTube Video</h3>
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
                onClick={confirmDeleteYouTubeVideo}
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
