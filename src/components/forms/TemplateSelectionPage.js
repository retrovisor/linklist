'use client';

import { useState, Suspense } from 'react';
import { useRouter } from 'next/router';
import SubmitButton from "@/components/buttons/SubmitButton";
import RightIcon from "@/components/icons/RightIcon";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { trackEvent } from "fathom-client";


export default function TemplateSelectionPage({ page, user }) {

  const [selectedTemplate, setSelectedTemplate] = useState(0);

  const templates = [
    { name: '템플릿 1', value: 'template2', image: '/template2.jpg' },
    { name: '템플릿 2', value: 'template3', image: '/template3.jpg' },
    { name: '템플릿 3', value: 'template1', image: '/template1.jpg' },
    
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
      body: JSON.stringify({ template: templates[selectedTemplate].value }),
    });

    if (response.ok) {
      window.location.href = '/account';
          trackEvent('Submit ThisTemplate');   

    }
  }

  function handlePrevTemplate() {
    setSelectedTemplate((prevTemplate) => (prevTemplate === 0 ? templates.length - 1 : prevTemplate - 1));
  }

  function handleNextTemplate() {
    setSelectedTemplate((prevTemplate) => (prevTemplate === templates.length - 1 ? 0 : prevTemplate + 1));
  }

  return (
    <Suspense fallback={<div>로드 중...</div>}>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-center my-5">템플릿 선택</h1>
        <div className="max-w-sm mx-auto">
          <div className="relative">
            <button
              type="button"
              className="absolute left-0 top-1/2 transform -translate-y-1/2 !text-4xl p-2 btn-seta"
              onClick={handlePrevTemplate}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div className="block px-8 pb-4 mx-auto w-full m-2 text-center">
              <img src={templates[selectedTemplate].image} alt={templates[selectedTemplate].name} />
              <p className="font-bold text-2xl pt-2">{templates[selectedTemplate].name}</p>
            </div>
            <button
              type="button"
              className="absolute right-0 top-1/2 transform -translate-y-1/2 !text-4xl p-2 btn-seta"
              onClick={handleNextTemplate}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <SubmitButton>
            <span>이 템플릿 사용</span>
            <RightIcon />
          </SubmitButton>
        </div>
      </form>
    </Suspense>
  );
}
