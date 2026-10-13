import PersonalInfoFrom from './PersonalInfoFrom';
// import UpdateProfile from "./UpdateProfile";

function PersonalInfo() {
  return (
    <div
      id='tab1'
      className='tab-pane active p-8 rounded-2xl bg-gradient-to-br from-darkblack-600 to-darkblack-700 border border-gray-700/50'
    >
      <PersonalInfoFrom />
    </div>
  );
}

export default PersonalInfo;
