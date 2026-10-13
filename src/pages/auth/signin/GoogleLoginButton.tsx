import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { RUTE_USER_GOOGLE } from '../../../utils/Rutes';
import { toast } from 'react-toastify';
import { http } from '../../../utils/http_request';
import { useEffect, useState } from 'react';
import useAuthUser from '@/hook/useAuthUser';

interface GoogleLoginButtonProps {
  finalRoute?: string;
  userName?: string;
  /** When set, called after auth instead of navigating (parent shows splash and navigates). */
  openWelcome?: (user?: unknown) => void;
}

export default function GoogleLoginButton({
  finalRoute = '/accounts',
  userName = '',
  openWelcome,
}: GoogleLoginButtonProps) {
  const navigate = useNavigate();
  const { setToken } = useAuthUser();
  const [googleScriptLoaded, setGoogleScriptLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleScript = setInterval(() => {
      const script = document.querySelector(
        'script[src^="https://accounts.google.com/gsi/client"]'
      );
      if (script) {
        setGoogleScriptLoaded(true);
        clearInterval(checkGoogleScript);
      }
    }, 500);

    setTimeout(() => clearInterval(checkGoogleScript), 5000); // Give up after 5 seconds

    return () => clearInterval(checkGoogleScript);
  }, []);

  const sendToZohoCRM = async (data: any) => {
    try {
      const zohoData = new FormData();
      zohoData.append('First Name', data.firstName || 'GoogleUser');
      zohoData.append('Last Name', data.lastName || '');
      zohoData.append('CONTACTCF5', data.userName || userName || 'default_user');
      zohoData.append('Email', data.email);
      zohoData.append(
        'xnQsjsdp',
        '1bda492b77705c58a5525ebf7bb5b5608a1b5a407cf55bfd2780b84991fed0c7'
      );
      zohoData.append(
        'xmIwtLD',
        '0f7d559efaad631c7614f2645cba4741a86500308e4cff3e25dbb069a97991f315d8393cab87f69b36d08251d1e79391'
      );
      zohoData.append('actionType', 'Q29udGFjdHM=');
      zohoData.append('returnURL', 'null');

      const zohoResponse = await fetch('https://crm.zoho.com/crm/WebToContactForm', {
        method: 'POST',
        body: zohoData,
      });

      if (!zohoResponse.ok) {
        const errorText = await zohoResponse.text();
        console.error('Zoho CRM submission failed:', errorText);
      }
    } catch (error) {
      console.error('Error sending to Zoho CRM:', error);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    try {
      const response = await http.post(RUTE_USER_GOOGLE, {
        idToken,
        userName,
      });

      if (response.status !== 200) {
        throw new Error('Request error: ' + response.status);
      }

      toast.success('Login successful');
      setToken(response.data.user, response.data.token);
      await sendToZohoCRM(response.data.user);
      if (openWelcome) {
        openWelcome(response.data.user);
      } else {
        navigate(finalRoute, { replace: true });
      }
    } catch (error: any) {
      console.error('Login request failed:', error);
      const errorMsg =
        error.response?.data?.message || 'An unknown error occurred. Please try again.';
      toast.error(`Error: ${errorMsg}`);
    }
  };

  const handleGoogleError = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <div className='flex justify-center mt-4'>
      {googleScriptLoaded ? (
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          useOneTap
          theme='filled_blue'
          text='signin_with'
          shape='pill'
          size='large'
        />
      ) : (
        <div className='animate-pulse text-center text-sm text-[var(--tt-fg-3)]'>
          Loading Google sign-in…
        </div>
      )}
    </div>
  );
}

// import { GoogleLogin } from '@react-oauth/google';
// import { RUTE_USER_GOOGLE } from '../../../utils/Rutes';
// import { toast } from 'react-toastify';
// import AuthUser from '../../../hook/useAuthUser';
// import { http } from '../../../utils/http_request';

// export default function GoogleLoginButton({ finalRoute = '/accounts', userName = '',openWelcome=()=>{}}:any) {

//   const { setToken } = useAuthUser(); // Usa el hook AuthUser

//   const sendToZohoCRM = async (data: any) => {
//     try {
//       const zohoData = new FormData();
//       zohoData.append('First Name', data.firstName || 'GoogleUser');
//       zohoData.append('Last Name', data.lastName || '');
//       zohoData.append('CONTACTCF5', data.userName || userName || 'default_user');
//       zohoData.append('Email', data.email);
//       zohoData.append(
//         'xnQsjsdp',
//         '1bda492b77705c58a5525ebf7bb5b5608a1b5a407cf55bfd2780b84991fed0c7'
//       );
//       zohoData.append(
//         'xmIwtLD',
//         '0f7d559efaad631c7614f2645cba4741a86500308e4cff3e25dbb069a97991f315d8393cab87f69b36d08251d1e79391'
//       );
//       zohoData.append('actionType', 'Q29udGFjdHM=');
//       zohoData.append('returnURL', 'null');

//       const zohoResponse = await fetch('https://crm.zoho.com/crm/WebToContactForm', {
//         method: 'POST',
//         body: zohoData,
//       });

//       if (zohoResponse.ok) {
//         console.log('Zoho CRM submission successful');
//       } else {
//         const errorText = await zohoResponse.text();
//         console.error('Zoho CRM submission failed:', errorText);
//       }
//     } catch (error) {
//       console.error('Error sending to Zoho CRM:', error);
//     }
//   };

//   return (
//     <div className='flex justify-center mt-4 bottom-1 '>
//       <GoogleLogin
//         onSuccess={async credentialResponse => {
//           const idToken = credentialResponse.credential;

//           const loadingWaitTime = 4000;

//           try {
//             const response = await http.post(RUTE_USER_GOOGLE, {
//               idToken,
//               userName,
//             });

//             const responseStatus = response.status;

//             if (responseStatus !== 200) {
//               throw new Error('Error en la solicitud: ' + responseStatus);
//             }

//             toast.success('Login successful');

//             setToken(response.data.user, response.data.token);

//             // Enviar datos a Zoho CRM
//             await sendToZohoCRM(response.data.user);

//             openWelcome()

//             setTimeout(() => {
//               window.location.href = finalRoute;
//             }, loadingWaitTime);
//           } catch (error: any) {
//             console.error('Login request failed:', error);

//             if (error.response && error.response.status >= 400 && error.response.status < 500) {
//               toast.error(
//                 'Lack of information to proceed. Please verify your details. ' +
//                   error.response.data.message
//               );
//               return;
//             }

//             toast.error('There was an error in the request. Please try again.');
//           }
//         }}
//         onError={() => {
//           console.log('Login Failed');
//         }}
//       />
//     </div>
//   );
// }
