import ProtoTypes from 'prop-types';

function FaqTab({ title, desc, id, activeId, handleActive }) {
  const isActive = activeId?.find(item => item === id);
  return (
    <div className='transition '>
      <div
        className='accordion-header border-b border-teal-300 cursor-pointer transition flex space-x-5 items-center h-16'
        onClick={() => handleActive(id)}
      >
        <i className={`fas ${isActive ? 'fa-minus' : 'fa-plus'} text-success-300 text-xl`}></i>
        <h2 className='title transition-all text-white md:text-lg text-sm font-bold '>{title}</h2>
      </div>
      <div
        style={{
          maxHeight: isActive ? '300px' : 0,
        }}
        className='accordion-content lg:pl-8 pl-4 pt-0 overflow-hidden max-h-0 space-y-4'
      >
        <div className='flex flex-row  my-2 rounded bg-bgray-900 shadow-lg w-full lg:w-2/3 pr-2 py-2'>
          <div className='flex h-[93] w-1 bg-success-300 rounded'></div>
          <div className='flex-1'>
            <p className='text-teal-300 pl-4 lg:text-base text-base lg:leading-7'>{desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
FaqTab.propTypes = {
  title: ProtoTypes.string,
  desc: ProtoTypes.string,
  id: ProtoTypes.number,
  activeId: ProtoTypes.array,
  handleActive: ProtoTypes.func,
};
export default FaqTab;
