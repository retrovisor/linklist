import {useFormStatus} from 'react-dom';

export default function SubmitButton({children, className=''}) {
  const {pending} = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={"btn-link text-white py-2 px-4 block !text-2xl mx-auto flex gap-2 items-center justify-center " + className}
    >
      {pending && (
        <span>절약...</span>
      )}
      {!pending && children}
    </button>
  );
}
