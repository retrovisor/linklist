'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/router';
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";

export default function TemplateSelectionPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const templates = [
    { name: 'Template 1', image: '/template1.jpg' },
    { name: 'Template 2', image: '/template2.jpg' },
    // Add more templates as needed
  ];

  async function handleSubmit(event) {
    event.preventDefault();

    // Call an API route to save the template selection
    const response = await fetch('/api/save-template', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ template: templates[selectedTemplate].name }),
    });

    if (response.ok) {
      window.location.href = '/account';
    }
  }

  function handlePrevTemplate() {
    setSelectedTemplate((prevTemplate) => (prevTemplate === 0 ? templates.length - 1 : prevTemplate - 1));
  }

  function handleNextTemplate() {
    setSelectedTemplate((prevTemplate) => (prevTemplate === templates.length - 1 ? 0 : prevTemplate + 1));
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <form onSubmit={handleSubmit}>
        <h1 className="text-4xl font-bold text-center mb-2">Choose Your Template</h1>
        <div className="max-w-xs mx-auto">
          <div className="relative">
            <button
              type="button"
              className="absolute left-0 top-1/2 transform -translate-y-1/2"
              onClick={handlePrevTemplate}
            >
              {'<'}
            </button>
            <div className="block p-2 mx-auto border w-full mb-2 text-center">
              <img src={templates[selectedTemplate].image} alt={templates[selectedTemplate].name} />
              <p>{templates[selectedTemplate].name}</p>
            </div>
            <button
              type="button"
              className="absolute right-0 top-1/2 transform -translate-y-1/2"
              onClick={handleNextTemplate}
            >
              {'>'}
            </button>
          </div>
          <SubmitButton>
            <span>Save Template</span>
            <RightIcon />
          </SubmitButton>
        </div>
      </form>
    </Suspense>
  );
}
