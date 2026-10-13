import { useState } from "react";

const DynamicTypeForm = ({ sections }: any) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<any>({});

  // Flatten questions from all sections for step navigation
  const questions = sections.flatMap((section: any) =>
    section.questions.map((question: any) => ({
      ...question,
      section: section.section,
    }))
  );

  const currentQuestion = questions[currentStep];


  const handleCheckboxChange = (key: string, value: string) => {
    const existingValues = answers[key] || [];
    const updatedValues = existingValues.includes(value)
      ? existingValues.filter((item: string) => item !== value)
      : [...existingValues, value];
    setAnswers({ ...answers, [key]: updatedValues });
  };


  const handleChange = (key: string, value: any) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    alert("Form submitted successfully!");
  };

  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{currentQuestion.section}</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {currentQuestion.label}
          </label>
          {currentQuestion.type === "text" && (
            <input
              type="text"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.key] || ""}
              onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
            />
          )}

          {currentQuestion.type === "email" && (
            <input
              type="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.key] || ""}
              onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
            />
          )}

          {currentQuestion.type === "tel" && (
            <input
              type="tel"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder={currentQuestion.placeholder}
              value={answers[currentQuestion.key] || ""}
              onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
            />
          )}
        </div>
        {/* Date Input */}
        {currentQuestion.type === "date" && (
          <input
            type="date"
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.key] || ""}
            onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
          />




          
        )}
        {currentQuestion.type === "radio" && (
  <div className="flex flex-col">
    {currentQuestion.options.map((option: string) => (
      <label key={option} className="flex items-center mb-2">
        <input
          type="radio"
          className="mr-2"
          value={option}
          checked={answers[currentQuestion.key] === option}
          onChange={() => handleChange(currentQuestion.key, option)}
        />
        {option}
      </label>
    ))}

    {/* Conditional rendering for certification details */}
    {currentQuestion.key === "certifications" && answers[currentQuestion.key] === "Yes" && (
      <div className="mt-4">
        <label htmlFor="certification_details" className="block mb-2">
         Please specify:
        </label>
        <input
          type="text"
          id="certification_details"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Enter certification details"
          value={answers["certification_details"] || ""}
          onChange={(e) => handleChange("certification_details", e.target.value)}
        />
      </div>
    )}

{currentQuestion.key === "has_network" && answers[currentQuestion.key] === "Yes" && (
      <div className="mt-4">
        <label htmlFor="network_size" className="block mb-2">
        If yes, how many traders are within your network?
        </label>
        <input
          type="text"
          id="network_size"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="Enter the size of your network"
          value={answers["network_size"] || ""}
          onChange={(e) => handleChange("network_size", e.target.value)}
        />
      </div>
    )}

{currentQuestion.key === "flexible_hours" && answers[currentQuestion.key] === "Yes" && (
      <div className="mt-4">
        <label htmlFor="start_date" className="block mb-2">
        What is your expected start date?
        </label>
        <input
          type="date"
          id="start_date"
          className="border border-gray-300 rounded px-3 py-2 w-full"
          placeholder="What is your expected start date?"
          value={answers["start_date"] || ""}
          onChange={(e) => handleChange("start_date", e.target.value)}
        />
      </div>
    )}



  </div>
)}

        {/* Textarea Input */}
        {currentQuestion.type === "textarea" && (
          <textarea
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder={currentQuestion.placeholder}
            value={answers[currentQuestion.key] || ""}
            onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
            rows={4} // Optional: Adjust the number of visible rows
          ></textarea>
        )}

        {currentQuestion.type === "select" && (
          <>
            <select
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={answers[currentQuestion.key] || ""}
              onChange={(e) => handleChange(currentQuestion.key, e.target.value)}
            >
              <option value="" disabled>
                Select an option
              </option>
              {currentQuestion.options.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {answers[currentQuestion.key] === "Other" && (
              <input
                type="text"
                className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Please specify"
                value={answers[`${currentQuestion.key}_other`] || ""}
                onChange={(e) =>
                  handleChange(`${currentQuestion.key}_other`, e.target.value)
                }
              />
            )}
          </>
        )}
        {currentQuestion.type === "checkbox" && (
          <div className="flex flex-col">
            {currentQuestion.options.map((option: string) => (
              <label key={option} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  value={option}
                  checked={answers[currentQuestion.key]?.includes(option)}
                  onChange={() =>
                    handleCheckboxChange(currentQuestion.key, option)
                  }
                />
                {option}
              </label>
            ))}
            {answers[currentQuestion.key]?.includes("Other") && (
              <input
                type="text"
                className="w-full mt-2 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Please specify"
                value={answers[`${currentQuestion.key}_other`] || ""}
                onChange={(e) =>
                  handleChange(`${currentQuestion.key}_other`, e.target.value)
                }
              />
            )}
          </div>
        )}



        <div className="flex justify-between mt-6">
          {currentStep > 0 && (
            <button
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
              onClick={handlePrevious}
            >
              Previous
            </button>
          )}

          {currentStep < questions.length - 1 ? (
            <button
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
              onClick={handleNext}
            >
              Next
            </button>
          ) : (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DynamicTypeForm;
