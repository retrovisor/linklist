'use client';
import grabUsername from "@/actions/grabUsername";
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";
import { useState } from 'react';

export default function UsernameForm({ desiredUsername }) {
  const [taken, setTaken] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get('username');
    console.log('Desired username (client-side):', username); // Log the desired username from the client-side

    const result = await grabUsername(formData);
    setTaken(result === false);
    if (result) {
      window.location.href = '/select-template?created=' + username;
    }
  }

  return (
    <div className="py-12 w-full max-w-lg mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        사용자 이름을 선택하세요
      </h1>

      <form className="flex flex-col sm:flex-row items-stretch sm:space-x-4 space-y-4 sm:space-y-0" onSubmit={handleSubmit}>
        <input
          name="username"
          className="!bg-white border rounded-md flex-1 !py-4 !px-4 sm:py-4 sm:px-6 !w-auto !mb-0 !p-0 mx-8"
          defaultValue={desiredUsername}
          type="text"
          placeholder="사용자 이름"
        />
        {taken && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-center">
            이 사용자 이름은 사용 중입니다.
          </div>
        )}
        <SubmitButton>
          계속하기
        </SubmitButton>
      </form>
    </div>
  );
}
