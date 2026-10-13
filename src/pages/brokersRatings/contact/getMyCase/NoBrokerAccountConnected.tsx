
const NoBrokerAccountConnected = () => {
  return (
    <div className="w-full max-h-full bg-darkblack-700 rounded-xl col-span-7">
      <div className="rounded-t-xl bg-emerald-600  bg-opacity-50 flex items-center justify-center py-4 text-white shadow-xl">
        <h2 className="font-bold">NO ACCOUNT CONNECTED</h2>
      </div>
      <div className="space-y-4 py-4 px-4 mt-14">
        <p className="text-xl md:text-2xl font-bold text-green-600 mb-4 md:mb-12 italic">
          It seems that you don't have a connected account with this broker.
        </p>

        <p className="text-white mb-4">
          To proceed with your inquiry or to get help with setting up an account, please contact our support team. We can assist you in opening a new account or troubleshooting any issues you may encounter during the process.
        </p>

        <div className="text-center">
          <a
            href="/accounts"
            // target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 bg-green-600 py-3 px-6 rounded-xl text-white shadow-xl hover:bg-green-500 duration-300"
          >
            Connect Account
          </a>
        </div>
      </div>
    </div>
  );
};

export default NoBrokerAccountConnected;
