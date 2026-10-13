
export default function BrokerResume() {
  return (
    <div className="w-full max-h-full bg-darkblack-700 rounded-xl col-span-7">
    <div className=" rounded-t-xl bg-[#02C686] flex items-center justify-center py-4 text-white shadow-xl">
        <h2 className="font-bold">BROKER REVIEWS</h2>
    </div>
    <div className="space-y-4 py-4 px-4">
      
        <h3 className="text-center  font-semibold text-[#02C686] text-sm">Start now with 30 USD!*</h3>
        <div className="text-white space-y-4">
            <p>This broker offers its clients multiple additional incentives to start trading and keep on trading, starting with a $30 no deposit bonus. In other words.</p>
            <p>
            We give you $30 worth of credit just for opening your first Real Account, allowing you to test our products and services by starting to trade with no investment and no risk. * "Clients registered under Trading Point of Financial Instruments Ltd (XMCY) and Trading Point of Financial Instruments Pty Ltd (XMAU) are not eligible for bonus promotions. Clients registered under XM Global Limited (XMBZ) are eligible for the bonus offered.”
            </p>
        </div>
        <div>
            <form action="" className="space-y-4">
                <label htmlFor="name" className="flex flex-col text-white  "> Enter Your Full Name
                    <input type="text" placeholder="..."  className="my-2 rounded-lg bg-transparent checked:border-none focus:border-none focus:ring-2 focus:ring-Purple-500 appearance-none" id="name"/>
                </label>
                {/* <label htmlFor="email" className="flex flex-col text-white  "> Enter Your Email
                    <input type="email" placeholder="...@gmail.com"  className="my-2 rounded-lg bg-transparent checked:border-none focus:border-none focus:ring-2 focus:ring-Purple-500 appearance-none" id="email"/>
                </label> */}
                <label htmlFor="phone" className="flex flex-col text-white  "> Phone Number
                    <input type="tel" placeholder="+00 000000"  className="my-2 rounded-lg bg-transparent checked:border-none focus:border-none focus:ring-2 focus:ring-Purple-500 appearance-none" id="phone"/>
                </label>
                <div className="flex items-center space-x-3 text-white">
                    <input type="checkbox" className="my-2 rounded-lg bg-transparent checked:border-none focus:border-none focus:ring-0  checked:bg-green-600 checked:focus:bg-green-600 appearance-none cursor-pointer checked:hover:bg-green-500" />
                    <p>I hereby accept that my data is sent to XM Group and agree to the terms and conditions of FXStreet and XM Group</p>
                </div>
                <div className="w-full ">
                <button className="w-full border-lg bg-green-600 py-4 rounded-xl text-white shadow-xl hover:bg-green-500 duration-300">
                    Call Me Now
                </button>
                </div>
            </form>
        </div>
    </div>
    
  </div>
  )
}
