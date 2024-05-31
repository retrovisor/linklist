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
    const result = await grabUsername(formData);

    setTaken(result === false);
    if (result) {
      window.location.href = '/select-template?created=' + formData.get('username');
    }
  }

  return (
    <div className="w-full flex justify-center py-12 px-8">
  <div className="w-full max-w-xs mx-auto">
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
      <h1 className="text-4xl font-bold text-center mb-2">
        Grab your username
      </h1>
      <p className="text-center mb-6 text-gray-500">
        Choose your username
      </p>
      <input
        name="username"
        className="block bg-white border rounded-md py-4 px-6 w-full text-center"
        defaultValue={desiredUsername}
        type="text"
        placeholder="username"
      />
      {taken && (
        <div className="bg-red-200 border border-red-500 py-2 text-center">
          This username is taken
        </div>
      )}
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded">
        <span>Continue</span>
        <RightIcon />
      </button>
    </form>
  </div>
</div>

  );
}
