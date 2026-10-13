
export default function JoinNow() {
  return (
    <div className="bg-joinnow min-h-screen flex flex-col items-center justify-center text-center p-6">

      <div className="max-w-2xl bg-slate-200 rounded-2xl px-12 py-12 shadow-2xl justify-center">
        <img className="h-24 justify-center mx-auto mb-2 " src="/logo.png" />
        <p className="text-2xl md:text-4xl font-bold text-slate-700 mb-4 md:mb-12 italic ">
          Message us to speed up your application!
        </p>

        <a
          href="https://dm.wa.link/7b00ew"
          target="_blank"
          rel="noopener noreferrer"
        >

          <div className="overflow-hidden relative max-w-sm mx-auto bg-green-500 shadow-lg ring-1 ring-black/5 rounded-xl flex items-center gap-6 ">

        

            <img className="absolute -left-6 w-32 h-32 rounded-full shadow-lg " src="/assets/img/icon/whatsapp.png" />

            <div className="flex flex-col py-4 pl-32">
              <p className="text-slate-100 text-xl leading-5 md:leading-10 md:text-3xl font-bold text-center">Contact Now!</p>
             
            </div>
            <span className="relative -mt-10 ml-10 flex h-4 w-4    ">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-100 opacity-75 "></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-200"></span>
            </span>


          </div>
        </a>
        <p className="text-green-700 mt-6 text-sm md:text-xl">
          Click the button to chat with us on WhatsApp
        </p>
      </div>
    </div>
  );
}
