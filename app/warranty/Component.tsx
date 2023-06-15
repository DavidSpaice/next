"use client"
import { useState } from 'react';
import { useRouter } from 'next/router';

const WarrantyForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    step1: '',
    step2: '',
    step3: '',
    step4: '',
    step5: '',
    step6: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you can submit the formData to your desired endpoint or perform any other action
    console.log(formData);
  };

  const handleNext = () => {
    const currentStep = Number(router.query.step) || 1;
    router.push(`/multi-step-form?step=${currentStep + 1}`);
  };

  const handlePrevious = () => {
    const currentStep = Number(router.query.step) || 1;
    router.push(`/multi-step-form?step=${currentStep - 1}`);
  };

  const renderForm = () => {
    const currentStep = Number(router.query.step) || 1;

    switch (currentStep) {
      case 1:
        return (
          <div>
            <h2>Step 1</h2>
            <input
              type="text"
              name="step1"
              value={formData.step1}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2>Step 2</h2>
            <input
              type="text"
              name="step2"
              value={formData.step2}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 3:
        return (
          <div>
            <h2>Step 3</h2>
            <input
              type="text"
              name="step3"
              value={formData.step3}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 4:
        return (
          <div>
            <h2>Step 4</h2>
            <input
              type="text"
              name="step4"
              value={formData.step4}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 5:
        return (
          <div>
            <h2>Step 5</h2>
            <input
              type="text"
              name="step5"
              value={formData.step5}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="button" onClick={handleNext}>
              Next
            </button>
          </div>
        );
      case 6:
        return (
          <div>
            <h2>Step 6</h2>
            <input
              type="text"
              name="step6"
              value={formData.step6}
              onChange={handleChange}
              required
            />
            <button type="button" onClick={handlePrevious}>
              Previous
            </button>
            <button type="submit">Submit</button>
          </div>
        );
      default:
        return null;
    }
  };

  return <form onSubmit={handleSubmit}>{renderForm()}</form>;
};

export default WarrantyForm;