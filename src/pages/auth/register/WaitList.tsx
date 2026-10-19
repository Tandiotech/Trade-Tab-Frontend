
const ZohoForm = () => {
  const checkMandatory = () => {
    const mndFields = ['First Name', 'Last Name', 'Email', 'Mobile', 'Country'];
    const fldLangVal = ['First Name', 'Last Name', 'Email', 'Mobile', 'Country'];
    for (let i = 0; i < mndFields.length; i++) {
      const fieldObj = document.forms['WebToLeads6302306000000649004'][mndFields[i]];
      if (fieldObj) {
        if (fieldObj.value.trim().length === 0) {
          alert(`${fldLangVal[i]} cannot be empty.`);
          fieldObj.focus();
          return false;
        } else if (fieldObj.nodeName === 'SELECT' && fieldObj.options[fieldObj.selectedIndex].value === '-None-') {
          alert(`${fldLangVal[i]} cannot be none.`);
          fieldObj.focus();
          return false;
        } else if (fieldObj.type === 'checkbox' && !fieldObj.checked) {
          alert(`Please accept ${fldLangVal[i]}`);
          fieldObj.focus();
          return false;
        }
        if (fieldObj.name === 'Last Name') {
          name = fieldObj.value;
        }
      }
    }
    if (!validateEmail()) {
      return false;
    }
    document.querySelector('.crmWebToEntityForm .formsubmit').setAttribute('disabled', true);
  };

  const validateEmail = () => {
    const form = document.forms['WebToLeads6302306000000649004'];
    const emailFld = form.querySelectorAll('[ftype=email]');
    for (let i = 0; i < emailFld.length; i++) {
      const emailVal = emailFld[i].value;
      if (emailVal.trim().length !== 0) {
        const atpos = emailVal.indexOf('@');
        const dotpos = emailVal.lastIndexOf('.');
        if (atpos < 1 || dotpos < atpos + 2 || dotpos + 2 >= emailVal.length) {
          alert('Please enter a valid email address.');
          emailFld[i].focus();
          return false;
        }
      }
    }
    return true;
  };

  const handleTooltip = (e) => {
    const tooltip = e.target.nextElementSibling;
    tooltip.style.display = tooltip.style.display === 'none' ? 'block' : 'none';
  };

  return (

    <div className='h-screen bg-slate-950 py-20 bg-custom px-4'>
    <div id="crmWebToEntityForm" className="border-b-slate-950 text-center items-center justify-center" >
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="content-type" content="text/html;charset=UTF-8" />
      <form
        id="webform6302306000000649004"
        action="https://crm.zoho.com/crm/WebToLeadForm"
        name="WebToLeads6302306000000649004"
        method="POST"
        onSubmit={(e) => {
          document.charset = 'UTF-8';
          if (typeof (window as any).checkMandatory === 'function' && !(window as any).checkMandatory()) {
            e.preventDefault();
          }
        }}
        acceptCharset="UTF-8"
        className='mx-auto p-8 max-w-fit bg-slate-100 rounded-xl shadow-lg'
      >
        <input type="text" style={{ display: 'none' }} name="xnQsjsdp" value="5fa4d31aefa51ef33d68808eb3fec8dab9ab1c0dacf605ecf48b95dd451b864a" />
        <input type="hidden" name="zc_gad" id="zc_gad" value="" />
        <input type="text" style={{ display: 'none' }} name="xmIwtLD" value="f8ddb04eea4b2a6cb6ad0771795955763c7eef6cba71c074db6e862288fd51de86495ee738558862f06c29700c5342c5" />
        <input type="text" style={{ display: 'none' }} name="actionType" value="TGVhZHM=" />
        <input 
        type="text" style={{ display: 'none' }} 
        name="returnURL" 
        value="https&#x3a;&#x2f;&#x2f;tradetab.com&#x2f;joinnow" />


       
       <img src='/logo-lockup.png' className='w-96 mx-auto mb-4'/>
        <div className="text-2xl text-slate-700 font-bold mb-2" >Join to the Waitlist NOW!</div>
        <div className="zcwf_row">
        
          <div className="zcwf_col_fld">
            <input type="text" id="First_Name" name="First Name" placeholder='Firs Name' className='w-full rounded-full my-2'/>
            <div className="zcwf_col_help"></div>
          </div>
        </div>
        <div className="zcwf_row">
          
          <div className="zcwf_col_fld">
            <input type="text" id="Last_Name" name="Last Name" placeholder='Last Name' className='w-full rounded-full my-2'/>
            <div className="zcwf_col_help"></div>
          </div>
        </div>
        <div className="zcwf_row">
         
          <div className="zcwf_col_fld ">
            <input type="text"  autoComplete="false" id="Email" name="Email" placeholder='Email' className='w-full rounded-full my-2'/>
            <div className="zcwf_col_help"></div>
          </div>
        </div>
        <div className="zcwf_row">
          
          <div className="zcwf_col_fld">
            <input type="text" id="Mobile" name="Mobile" placeholder='Mobile' className='w-full rounded-full my-2'/>
            <div className="zcwf_col_help"></div>
          </div>
        </div>
        <div className="zcwf_row">
         
          <div className="mt-2 ">
            <input type="text" id="Country" name="Country"  placeholder='Country' className='w-full rounded-full my-2'/>
            <div className="zcwf_col_help"></div>
          </div>
        </div>
        <div className="zcwf_row wfrm_fld_dpNn">
         
          <div className="zcwf_col_fld invisible">
            <select className="zcwf_col_fld_slt" id="Lead_Source" name="Lead Source">
              <option value="-None-">-None-</option>
              <option value="Waitlist" selected>Waitlist</option>
            </select>
            <div className="zcwf_col_help"></div>
          </div>
        </div>
        <div className="zcwf_row">
          <div className="zcwf_col_lab"></div>
          <div className="zcwf_col_fld">
            <input
            type="submit" id="formsubmit" 
            className="bg-green-600 w-fit px-20 py-2 text-white rounded-full" 
            value="Submit" title="Submit" />
            {/* <input type="reset" className="zcwf_button" name="reset" value="Reset" title="Reset" /> */}
          </div>
        </div>
      </form>
    </div>
    </div>
  );
};

export default ZohoForm;
