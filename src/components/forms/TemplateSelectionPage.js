'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";

export default function TemplateSelectionPage() {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const router = useRouter();

  async function handleSubmit(event) {
    event.preventDefault();

    // Call an API route to save the template selection
    const response = await fetch('/api/save-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ template: selectedTemplate }),
    });

    if (response.ok) {
      router.push('/account');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1 className="text-4xl font-bold text-center mb-2">
        Choose Your Template
      </h1>
      <div className="max-w-xs mx-auto">
        <label className="block p-2 mx-auto border w-full mb-2 text-center">
          <input
            type="radio"
            name="template"
            value="template1"
            checked={selectedTemplate === 'template1'}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          />
          Template 1
        </label>
        <label className="block p-2 mx-auto border w-full mb-2 text-center">
          <input
            type="radio"
            name="template"
            value="template2"
            checked={selectedTemplate === 'template2'}
            onChange={(e) => setSelectedTemplate(e.target.value)}
          />
          Template 2
        </label>
        <SubmitButton>
          <span>Save Template</span>
          <RightIcon />
        </SubmitButton>
      </div>
    </form>
  );
}
