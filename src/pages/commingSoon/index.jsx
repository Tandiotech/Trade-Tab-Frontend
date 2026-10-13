/* eslint-disable react/prop-types */
import DateCountDown from "../../component/dateCounDown";

function ComingSoon({text = "Reward system"}) {
  return (
    <section className="py-52 min-h-screen relative   bg-center bg-dark dark:bg-dark">
      <div className="px-5 lg:px-0">
        <div className="max-w-[752px] m-auto">
          <div className="text-center mb-10">
            <h1 className="text-black dark:text-white font-semibold font-poppins sm:text-[48px] text-4xl mb-4">
              Very soon
            </h1>
            <p className="sm:text-xl text-base text-bgray-600 dark:text-bgray-50 text-center lg:px-5 px-0">
              {text}
            </p>
          </div>
          <div className="max-w-[564px] m-auto">
            <DateCountDown />
          </div>
        </div>
        <div className="max-w-[462px] m-auto mt-14">
          {/* <form action="">
            <div className="relative">
              <label
                htmlFor="news"
                className="block text-bgray-900 font-semibold text-xl mb-4 dark:text-white"
              >
                Let me know
              </label>
              <input
                type="text"
                className="py-5 px-7 bg-bgray-200 rounded-lg border-0 focus:border focus:border-success-300 focus:ring-0 h-[60px] w-full"
                placeholder="Email"
              />
              <button
                aria-label="none"
                className="absolute py-5 px-7 text-white h-[60px] font-semibold text-base rounded-r-lg bg-success-300 right-0"
              >
                Suscribe
              </button>
            </div>
          </form> */}
        </div>
      </div>
    </section>
  );
}

export default ComingSoon;
