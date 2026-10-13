import { useEffect, useState } from 'react';
import { http } from '../utils/http_request';


export function useAccountCurrency(account: string | null) {

  const [accounCurrency, setAccountCurrency] = useState<string|null>(null);

  useEffect(() => {
    if (!account) return;
    const fetchAccount = async () => {
      try {
        const response = await http.get('/account/currency/' + account);

        if (response.status === 200) {
          setAccountCurrency(response.data.currency);
        } else {
          console.error('Failed to fetch account:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching account:', error);
        setAccountCurrency('USD'); // Default to USD on error
      }
    };

    fetchAccount();
  }, [account]);


  return { accounCurrency};
}
