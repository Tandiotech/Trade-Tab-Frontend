export const sendToZohoCRM = async (data: any) => {
    const formData = new FormData();

    // ⚠️  SECURITY: Form auth tokens must come from env vars.
    //    The old hardcoded tokens have been removed — generate new ones in Zoho CRM → Web Forms.
    formData.append('xnQsjsdp', import.meta.env.VITE_ZOHO_FORM_TOKEN_1 ?? '');
    formData.append('xmIwtLD',  import.meta.env.VITE_ZOHO_FORM_TOKEN_2 ?? '');
    formData.append('actionType', 'Q29udGFjdHM=');
    formData.append('returnURL', 'https://example.com/success');

    formData.append('Last Name', data.userName);
    formData.append('Email', data.email);
    formData.append('Mobile', data.phone);
    formData.append('CONTACTCF6', data.country);
    formData.append('CONTACTCF7', data.country);

    try {
      const response = await fetch('https://crm.zoho.com/crm/WebToContactForm', {
        method: 'POST',
        body: formData,
      });

      const responseText = await response.text();

      if (!response.ok) {
        throw new Error(`Error al enviar datos a Zoho: ${responseText}`);
      }
    } catch (error) {
      console.error('Error al enviar a Zoho CRM:', error);
    }
  };