import { useEffect, useState } from "react";
import TraderDNA from "../../component/3d/TraderDNA";
import { analyzeInstitutionalTrading } from "@/services/analyzeTraderDNA";
import { calculateInstitutionalScore } from "./calculateInstitutionalScore";
import { FaInfoCircle } from "react-icons/fa";
import { OFFICIAL_TELEGRAM } from "@/utils/GlobalVars";

export default function TraderDNAPushNotification({ trades }: any) {
  const [dnaAnalysis, setDnaAnalysis] = useState<any>(null);
  const [institutionalScore, setInstitutionalScore] = useState<number>(0);
  const CPA_THRESHOLD = 65; // Umbral para mostrar la opción de CPA partnership
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  const renderContactButton = (score: number, threshold: number) => {
    if (score > threshold) {
      return (
        <button
          className="bg-teal-600 hover:bg-teal-500 text-sm px-4 py-2 rounded"
          onClick={() => window.open(OFFICIAL_TELEGRAM, "_blank")}
        >
            Join Partnership
        </button>
      );
    }
    return null; // Return nothing if the condition isn't met
  };
  




  useEffect(() => {
    if (trades) {
      const analysis = analyzeInstitutionalTrading(trades);
      setDnaAnalysis(analysis);

      // Calculamos un puntaje institucional basado en las métricas de DNA
      const score:any = calculateInstitutionalScore(analysis.summary.metrics);
      setInstitutionalScore(score);
    }
  }, [trades]);

  if (!dnaAnalysis || institutionalScore <= CPA_THRESHOLD) return null; // Hide component for low scores

  const { summary } = dnaAnalysis;

  return (

    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Notification Card */}
      <div className="animate-glow bg-gray-900 text-white w-80 md:w-96 rounded-lg shadow-lg overflow-hidden animate-slide-in">

      {/* Header */}
      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-teal-700 via-teal-600 to-indigo-500">
        <div className="w-16 h-16 ">
          <TraderDNA />
        </div>
        <div className="flex flex-col">
          <h2 className="text-lg font-bold">Institutional Score</h2>
          <p
            className={`text-sm font-semibold ${
              institutionalScore >= CPA_THRESHOLD
                ? "text-green-400"
                : "text-yellow-400"
            }`}
          >
            {`Score: ${institutionalScore}/100`}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
      {/* Mensaje principal */}
      <p className="text-sm mb-2">
        {institutionalScore >= CPA_THRESHOLD
          ? "You're eligible for a TT partnership. Leverage your trading skills to grow your network with TradeTab."
          : "Keep improving your trading to unlock partnership opportunities."}
      </p>

      {/* Botón de info */}
      <button
        onClick={toggleExpand}
        className="flex items-center gap-1 text-blue-500 hover:text-blue-400 text-xs"
      >
        <FaInfoCircle/> {isExpanded ? "Hide Details" : "View Details"}
      </button>

      {/* Lista expandible */}
      {isExpanded && (
        <ul className="text-xs list-disc list-inside space-y-1 mt-2">
          <li className="text-gray-300">
            Consistent Profits:{" "}
            <span className="text-gray-400">
              {summary.metrics.consistentProfitTrades}
            </span>
          </li>
          <li className="text-gray-300">
            Large Profit Trades:{" "}
            <span className="text-gray-400">
              {summary.metrics.largeProfitTrades}
            </span>
          </li>
          <li className="text-gray-300">
            Multi-Market Exposure:{" "}
            <span className="text-gray-400">
              {summary.metrics.differentMarkets}
            </span>
          </li>
          <li className="text-gray-300">
            High Volume Trades:{" "}
            <span className="text-gray-400">
              {summary.metrics.highVolumeTrades}
            </span>
          </li>
          <li className="text-gray-300">
            High Pip Trades:{" "}
            <span className="text-gray-400">
              {summary.metrics.highPipTrades}
            </span>
          </li>
          <li className="text-gray-300">
            Win Streak:{" "}
            <span className="text-gray-400">{summary.metrics.winStreak}</span>
          </li>
        </ul>
      )}
    </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 p-4 border-t border-gray-700">
        <button
          className="bg-gray-700 hover:bg-gray-600 text-sm px-4 py-2 rounded"
          onClick={() => setDnaAnalysis(null)}
        >
          Dismiss
        </button>
        {renderContactButton(institutionalScore, CPA_THRESHOLD)}
      </div>
    </div>
    </div>

  );
}

