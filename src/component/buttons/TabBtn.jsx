import ProtoTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

function TabBtn({ title, link, text, children }) {
  const { pathname: location } = useLocation();
  const path = location.split('/')[location.split('/').length - 1];

  return (
    <Link
      to={link}
      className={`tab flex gap-x-4 p-4 rounded-lg transition-all  duration-300   ${
        path === link ? 'bg-[#0f766e]' : path === 'settings' && link === '' ? 'bg-[#0f766e]' : ' '
      } `}
    >
      <div
        className={`w-12 transition-all h-12 shrink-0 rounded-full inline-flex items-center justify-center bg-bgray-100 git add. dark:bg-darkblack-500 duration-300${
          path === link || (path === 'settings' && link === '') ? ' bg-success-300' : ''
        }`}
      >
        {children}
      </div>
      <div>
        <h4 className='text-base font-bold text-white capitalize '>{title}</h4>
        <p className='text-sm font-medium text-white/50 mt-0.5'>{text}</p>
      </div>
    </Link>
  );
}

TabBtn.propTypes = {
  title: ProtoTypes.string,
  link: ProtoTypes.string,
  text: ProtoTypes.string,
  children: ProtoTypes.node,
};

export default TabBtn;
