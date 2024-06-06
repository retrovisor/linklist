'use client';
import {savePageSettings} from "@/actions/pageActions";
import SubmitButton from "@/components/buttons/SubmitButton";
import RadioTogglers from "@/components/formItems/radioTogglers";
import SectionBox from "@/components/layout/SectionBox";
import {upload} from "@/libs/upload";
import {faCloudArrowUp, faImage, faPalette, faSave, faUpload} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Image from "next/image";
import {useState} from "react";
import toast from "react-hot-toast";


export default function PageSettingsForm({ page, user }) {
  const [bgType, setBgType] = useState(page.bgType);
  const [bgColor, setBgColor] = useState(page.bgColor);
  const [bgImage, setBgImage] = useState(page.bgImage);
  const [avatar, setAvatar] = useState(page.avatar || user?.image);


  async function saveBaseSettings(formData) {
    const result = await savePageSettings(formData);
    if (result) {
      toast.success('저장됐습니다!');
    }
  }

  async function handleCoverImageChange(ev) {
  await upload(ev, async (link) => {
    setBgImage(link);
    setBgType('image'); // Update bgType to 'image'
    const formData = new FormData();
    formData.append('bgImage', link);
    formData.append('bgType', 'image'); // Add bgType to the form data
    await savePageSettings(formData);
    toast.success('배경 이미지가 저장되었습니다!');
  });
}

  async function handleAvatarImageChange(ev) {
  await upload(ev, async (link) => {
    setAvatar(link);
    const formData = new FormData();
    formData.append('avatar', link);
    await savePageSettings(formData);
    toast.success('아바타 이미지가 저장되었습니다!');
  });
}
  return (
    <div>
      <SectionBox>
        <form action={saveBaseSettings}>
<div
            className="pb-8 -m-4 min-h-[250px] flex justify-center items-center bg-cover bg-center"
            style={
              bgType === 'color'
                ? {backgroundColor:bgColor}
                : {backgroundImage:`url(${bgImage})`}
            }
          >
            <div>
              <RadioTogglers
                defaultValue={page.bgType}
                options={[
                  {value:'color', icon: faPalette, label: '색상'},
                  {value:'image', icon: faImage, label: '영상'},
                ]}
                onChange={val => setBgType(val)}
              />
              {bgType === 'color' && (
                <div className="bg-gray-200 shadow text-gray-700 p-2 mt-2">
                  <div className="flex gap-2 justify-center">
                    <span>배경 색상:</span>
                   <input
                  type="color"
                  name="bgColor"
                  onChange={async (ev) => {
                    setBgColor(ev.target.value);
                    await savePageSettings(new FormData(ev.target.form));
                    toast.success('배경 이미지가 저장되었습니다!');
                  }}
                  defaultValue={page.bgColor}
                />
                  </div>
                </div>
              )}
              {bgType === 'image' && (
                <div className="flex justify-center">
                  <label
                    className="shadow px-4 py-2 bg-white mt-2 flex gap-2"
                  >
                    <input type="hidden" name="bgImage" value={bgImage}/>
                    <input
                      type="file"
                      onChange={handleCoverImageChange}
                      className="hidden"/>
                    <div className="flex gap-2 items-center bg-white cursor-pointer">
                      <FontAwesomeIcon
                        icon={faCloudArrowUp}
                        className="text-gray-700" />
                      <span>Change image</span>
                    </div>
                  </label>
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center -mb-14">
            <div className="relative -top-16 w-[128px] h-[128px]">
              <div className="overflow-hidden h-full rounded-full border-4 border-white shadow shadow-black/50">
               

                    <Image
  className="w-full h-full object-cover"
  src={avatar || 'https://fizz.link/avatar.png'}

                

  alt="avatar"
  width={128}
  height={128}
  unoptimized
/>
    
              </div>
              <label
                htmlFor="avatarIn"
                className="absolute bottom-0 -right-2 bg-white p-2 rounded-full shadow shadow-black/50 aspect-square flex items-center cursor-pointer">
                <FontAwesomeIcon size={'xl'} icon={faCloudArrowUp} />
              </label>
              <input onChange={handleAvatarImageChange} id="avatarIn" type="file" className="hidden"/>
              <input type="hidden" name="avatar" value={avatar}/>
            </div>
          </div>
          <div className="p-0">
            <label className="input-label" htmlFor="nameIn">디스플레이 이름</label>
            <input
              type="text"
              id="nameIn"
              name="displayName"
              defaultValue={page.displayName}
              placeholder="내 이름"/>
            <label className="input-label" htmlFor="locationIn">위치</label>
            <input
              type="text"
              id="locationIn"
              name="location"
              defaultValue={page.location}
              placeholder="내 위치"/>
            <label className="input-label" htmlFor="bioIn">바이오</label>
            <textarea
              rows={2}
              className="min-h-[70px]"
              name="bio"
              defaultValue={page.bio}
              id="bioIn"
              placeholder="여기에 당신의 바이오를 입력하세요..." />
            <div className="max-w-[200px] mx-auto">
              <SubmitButton>
                <FontAwesomeIcon icon={faSave} />
                <span>구하다</span>
              </SubmitButton>
            </div>
          </div>
        </form>
      </SectionBox>
    </div>
  );
}
