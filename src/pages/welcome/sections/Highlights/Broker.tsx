export interface BrokerProps {
  firstName: string;
  lastName: string;
}

const Broker = ({ firstName, lastName }: BrokerProps) => {
  return (
    <div className='flex gap-3 items-center'>
      <img
        className='max-w-full w-14 h-14'
        src='/assets/img/images/about_img01.png'
        alt='Broker logo'
      />
      <div>
        <a target="_blank" href="https://tradetab.com/share/66a2fdbdbcd4ec0c4a5cb2e8/yes">
        <p className='font-poppins antialiased text-white'>{firstName}</p>
        <p className='font-poppins antialiased text-white'>{lastName}</p>
        </a>
      </div>
    </div>
  );
};

export default Broker;
