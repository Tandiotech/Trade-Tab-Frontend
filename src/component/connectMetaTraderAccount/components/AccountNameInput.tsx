export default function AccountNameInput({
  accountName,
  setAccountName,
  formErrors,
  canBeUsed,
}: {
  accountName: string;
  setAccountName: (accountName: string) => void;
  formErrors: any;
  canBeUsed: boolean;
}) {
  return (

    <div className='mt-2'>
      <label className='text-[11px] font-medium text-gray-400 tracking-wider flex items-center gap-1.5 mb-2'>
        <span className='uppercase'>Account Nickname</span>
        <span className='text-[10px] text-gray-500 font-normal normal-case'>— optional</span>
      </label>
      <input
        className={`border rounded-lg bg-darkblack-600 text-white p-3 w-full text-[13px] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-200 ${
          canBeUsed ? (accountName.length >= 4 ? 'border-teal-500/50 focus:border-teal-500' : 'border-gray-700/50 focus:border-teal-500') : 'border-gray-700/50 focus:border-teal-500'
        }`}
        value={accountName}
        onChange={e => setAccountName(e.target.value.replace(/[^a-zA-Z0-9._-]/g, ''))}
        placeholder='e.g. My Pepperstone Live'
        autoComplete='off'
        name='mt-account-name'
        data-form-type='other'
        data-lpignore='true'
        data-1p-ignore='true'
      />
      <div className='text-[11px] text-gray-500 mt-1.5'>
        Helps you identify this account in your dashboard.
      </div>
      {formErrors.accountName && (
        <p className='text-red-400 text-[11px] mt-1.5'>{formErrors.accountName}</p>
      )}
    </div>
  );
}
