import {useState} from "react";
import {MdOutlineKeyboardArrowDown} from "react-icons/md";

export default function DateRangeSelector({
  options = [
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    // , "Custom Range"
  ],
  defaultOption = "This Week",
  onSelect,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultOption);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = option => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  return (
    <div className="relative z-10">
      <div
        className="flex items-center space-x-2  rounded-md border shadow-xl justify-center h-10 cursor-pointer hover:bg-slate-700"
        onClick={toggleDropdown}
      >
        <span>{selectedOption}</span>
        <MdOutlineKeyboardArrowDown />
      </div>
      {isOpen && (
        <div className="absolute mt-1 p-1 bg-darkblack-600 rounded-xl shadow-lg w-full">
          {options.map((option, index) => (
            <div
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-400"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
