import { useState } from "react";

export default function HowToAvoidBeingScammed() {

    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveIndex(activeIndex === index ? null : index);
    };
  return (
    <div className="my-10 mx-4">
    <h1 className="font-bold text-2xl md:text-4xl text-teal-300">How to avoid being scammed</h1>
    <div className="mt-4">
        <h2 className="mb-4 text-slate-200 font-semibold">
            When dealing with forex brokers, it's essential to be vigilant and aware of potential scams. Here are five key things to watch out for:
        </h2>

        <div className="space-y-4">
            <div>
                <button
                    className="w-full text-left bg-slate-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-teal-500"
                    onClick={() => toggleAccordion(1)}
                >
                    1. Unregulated Brokers
                </button>
                {activeIndex === 1 && (
                    <div className="accordion-content mt-2 p-4 bg-slate-900 text-white rounded">
                        Always check whether the broker is regulated by a reputable financial authority, such as the Financial Conduct Authority (FCA) in the UK, the Commodity Futures Trading Commission (CFTC) in the US, or the Australian Securities and Investments Commission (ASIC). Unregulated brokers may not follow industry standards, making it easier for them to engage in fraudulent activities.
                    </div>
                )}
            </div>

            <div>
                <button
                    className="w-full text-left bg-slate-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-teal-400"
                    onClick={() => toggleAccordion(2)}
                >
                    2. Guaranteed Profits and Unrealistic Promises
                </button>
                {activeIndex === 2 && (
                    <div className="accordion-content mt-2 p-4 bg-slate-900 text-white rounded">
                        Be cautious of brokers who promise guaranteed returns or advertise extremely high profits with little or no risk. Forex trading inherently carries risks, and any broker claiming otherwise is likely not being honest.
                    </div>
                )}
            </div>

            <div>
                <button
                    className="w-full text-left bg-slate-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-teal-400"
                    onClick={() => toggleAccordion(3)}
                >
                    3. Difficulty Withdrawing Funds
                </button>
                {activeIndex === 3 && (
                    <div className="accordion-content mt-2 p-4 bg-slate-900 text-white rounded">
                        One of the most common signs of a scam is when a broker makes it difficult or impossible for you to withdraw your funds. They may impose excessive withdrawal fees, require unnecessary documentation, or simply ignore your requests. Legitimate brokers usually have straightforward withdrawal processes.
                    </div>
                )}
            </div>

            <div>
                <button
                    className="w-full text-left bg-slate-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-teal-400"
                    onClick={() => toggleAccordion(4)}
                >
                    4. Pressure to Deposit More Money
                </button>
                {activeIndex === 4 && (
                    <div className="accordion-content mt-2 p-4 bg-slate-900 text-white rounded">
                        Scammers often pressure traders to deposit more money, claiming it will help secure better returns. They might use aggressive sales tactics or suggest that you're missing out on a significant opportunity if you don't act quickly. Always be cautious if you feel pressured to increase your investment.
                    </div>
                )}
            </div>

            <div>
                <button
                    className="w-full text-left bg-slate-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring focus:ring-teal-400"
                    onClick={() => toggleAccordion(5)}
                >
                    5. Manipulated Trading Platforms
                </button>
                {activeIndex === 5 && (
                    <div className="accordion-content mt-2 p-4 bg-slate-900 text-white rounded">
                        Some fraudulent brokers manipulate their trading platforms to create the illusion of profitable trades or to execute trades in a way that benefits them. Watch out for unusual slippage, price discrepancies, or frequent platform glitches, as these can be signs of manipulation. Always conduct thorough research before choosing a forex broker and ensure they are well-reviewed and properly regulated.
                    </div>
                )}
            </div>
        </div>
    </div>
</div>
  )
}
