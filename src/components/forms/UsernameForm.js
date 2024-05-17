'use client';

import grabUsername from "@/actions/grabUsername";
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function UsernameForm({ desiredUsername }) {
  const [taken, setTaken] = useState(false);
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const result = await grabUsername(formData);

    setTaken(result === false);
    if (result) {
      router.push('/select-template?created=' + formData.get('username'));
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold text-center mb-2">
        Grab your username
      </h1>
      <p className="text-center mb-6 text-gray-500">
        Choose your username
      </p>
      <div className="max-w-xs mx-auto">
        <input
          name="username"
          className="block p-2 mx-auto border w-full mb-2 text-center"
          defaultValue={desiredUsername}
          type="text"
          placeholder="username"
        />
        {taken && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-center">
            This username is taken
          </div>
        )}
        <SubmitButton>
          <span>Claim your username</span>
          <RightIcon />
        </SubmitButton>
      </div>
    </form>
  );
}
