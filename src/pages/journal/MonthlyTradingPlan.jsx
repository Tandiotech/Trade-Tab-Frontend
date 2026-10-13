import { useState } from 'react';
import { FaDollarSign, FaRedoAlt, FaPercentage, FaEdit, FaSave } from 'react-icons/fa';

const MonthlyTradingPlan = () => {
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [dailyTarget, setDailyTarget] = useState(0);
  const [weeklyTarget, setWeeklyTarget] = useState(0);
  const [riskPercentage, setRiskPercentage] = useState("");
  const [dailyExpectation, setDailyExpectation] = useState("");
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(true); // Mode state

  const handleMonthlyTargetChange = (event) => {
    const value = Number(event.target.value);
    if (value < 0) {
      setError("Monthly target cannot be negative");
    } else {
      setError("");
      setMonthlyTarget(value);
      calculateTargets(value);
    }
  };

  const handleRiskChange = (event) => {
    const value = Number(event.target.value);
    if (value < 0 || value > 100) {
      setError("Risk percentage must be between 0 and 100");
    } else {
      setError("");
      setRiskPercentage(value);
    }
  };

  const handleDailyExpectationChange = (event) => {
    const value = Number(event.target.value);
    if (value < 0) {
      setError("Daily expectation cannot be negative");
    } else {
      setError("");
      setDailyExpectation(value);
    }
  };

  const calculateTargets = (monthlyTarget) => {
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const weeksInMonth = 4;

    const dailyTarget = monthlyTarget / daysInMonth;
    const weeklyTarget = monthlyTarget / weeksInMonth;

    setDailyTarget(dailyTarget);
    setWeeklyTarget(weeklyTarget);
  };

  const handleReset = () => {
    setMonthlyTarget("");
    setDailyTarget(0);
    setWeeklyTarget(0);
    setRiskPercentage("");
    setDailyExpectation("");
    setError("");
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="p-6 rounded-lg shadow-lg max-w-lg mx-auto bg-darkblack-600">
      <h2 className="text-2xl font-bold mb-4 text-center">Monthly Trading Plan</h2>

      {isEditing ? (
        <>
          <div className="mb-4">
            <label htmlFor="monthly-target" className="block text-lg font-medium mb-2">
              Monthly Profit Target (USD):
            </label>
            <div className="flex items-center">
              <FaDollarSign className="mr-2" />
              <input
                type="number"
                id="monthly-target"
                value={monthlyTarget}
                onChange={handleMonthlyTargetChange}
                min={0}
                className="w-full p-3 py-2 text-2xl border text-black border-gray-300 rounded-lg text-center"
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="risk-percentage" className="block text-lg font-medium mb-2">
              Risk Percentage (%):
            </label>
            <div className="flex items-center">
              <FaPercentage className="mr-2" />
              <input
                type="number"
                id="risk-percentage"
                value={riskPercentage}
                onChange={handleRiskChange}
                min={0}
                max={100}
                className="w-full p-3 py-2 text-2xl border text-black border-gray-300 rounded-lg text-center"
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="daily-expectation" className="block text-lg font-medium mb-2">
              Daily Profit Expectation (USD):
            </label>
            <div className="flex items-center">
              <FaDollarSign className="mr-2" />
              <input
                type="number"
                id="daily-expectation"
                value={dailyExpectation}
                onChange={handleDailyExpectationChange}
                min={0}
                className="w-full p-3 py-2 text-2xl border text-black border-gray-300 rounded-lg text-center"
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Daily Profit Target ($):</label>
            <input
              type="number"
              value={dailyTarget.toFixed(2)}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-100"
            />
          </div>

          <div className="mb-4">
            <label className="block text-lg font-medium mb-2">Weekly Profit Target ($):</label>
            <input
              type="number"
              value={weeklyTarget.toFixed(2)}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-lg text-center bg-gray-100"
            />
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleReset}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center mx-auto"
            >
              <FaRedoAlt className="mr-2" /> Reset
            </button>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200 flex items-center justify-center mx-auto"
            >
              <FaSave className="mr-2" /> Save Plan
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4">
            <h3 className="text-lg font-medium">Monthly Profit Target (USD):</h3>
            <p className="text-xl">{monthlyTarget}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Risk Percentage (%):</h3>
            <p className="text-xl">{riskPercentage}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Daily Profit Expectation (USD):</h3>
            <p className="text-xl">{dailyExpectation}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Daily Profit Target ($):</h3>
            <p className="text-xl">{dailyTarget.toFixed(2)}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium">Weekly Profit Target ($):</h3>
            <p className="text-xl">{weeklyTarget.toFixed(2)}</p>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={handleEdit}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200 flex items-center justify-center mx-auto"
            >
              <FaEdit className="mr-2" /> Edit Plan
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MonthlyTradingPlan;
