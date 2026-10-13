import {useState} from "react";
import {
  FaRegSmile,
  FaRegFrown,
  FaRegMeh,
  FaRegAngry,
  FaRegLaughBeam,
  FaRegTired,
} from "react-icons/fa";

const TradingFeedbackOptions = () =>
  // { setDisplayOptionsModal }
  {
    const [selectedOption, setSelectedOption] = useState("");

    const options = [
      {
        label: "I did great, stayed calm and won",
        emoji: <FaRegSmile className="text-green-500" />,
        value: "very_good",
      },
      {
        label: "Lost because I exited too early",
        emoji: <FaRegFrown className="text-red-500" />,
        value: "lost_early_exit",
      },
      {
        label: "Stayed neutral, neither won nor lost",
        emoji: <FaRegMeh className="text-yellow-500" />,
        value: "neutral",
      },
      {
        label: "Had a bad streak, very frustrating",
        emoji: <FaRegAngry className="text-red-600" />,
        value: "frustrated",
      },
      {
        label: "Learned a lot, excited for the next trades",
        emoji: <FaRegLaughBeam className="text-blue-500" />,
        value: "learned_a_lot",
      },
      {
        label: "Feeling tired and need a break",
        emoji: <FaRegTired className="text-gray-500" />,
        value: "tired_need_break",
      },
    ];

    //   const handleSubmit = () => {
    //     // Handle the selected option
    //     console.log("Selected Option:", selectedOption);
    //     // Close the modal
    //     setDisplayOptionsModal(false);
    //   };

    return (
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">How was your trading today?</h2>
        <ul className="space-y-4">
          {options.map(option => (
            <li
              key={option.value}
              onClick={() => setSelectedOption(option.value)}
              className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedOption === option.value ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              <span className="text-2xl mr-3">{option.emoji}</span>
              <span className="text-lg">{option.label}</span>
            </li>
          ))}
        </ul>

        {/* <button
        onClick={handleSubmit}
        className="mt-6 w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
      >
        Confirm
      </button> */}
      </div>
    );
  };

export default TradingFeedbackOptions;
