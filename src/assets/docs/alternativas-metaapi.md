Sí, para obtener el historial de trades de cuentas de MetaTrader (MT4/MT5) puedes utilizar varias alternativas dependiendo de tus necesidades específicas y las herramientas disponibles. Aquí hay un desglose:

---

### **1. Uso de MetaQuotes Manager API**
- **Precisión**: Es correcto que para utilizar las APIs oficiales de MetaQuotes necesitarás credenciales específicas de un broker. Estas credenciales suelen ser otorgadas a brokers que operan servidores MetaTrader y no a usuarios finales. 
- **Limitación**: Si no tienes acceso a estas credenciales, no podrás interactuar directamente con los servidores MetaTrader para extraer datos históricos.
- **Ventaja**: Si logras obtener acceso, esta es la opción más robusta para integraciones profundas.

---

### **2. Alternativa con MetaApi**
- **Problema**: Si ya estás utilizando MetaApi pero tienes problemas con costos y soporte, es válido buscar otras opciones.
- **Ventaja**: MetaApi te ofrece una solución SaaS que simplifica el acceso al historial de trades sin necesidad de credenciales administrativas de un broker.
- **Alternativas similares a MetaApi**:
  - **OneZero Financial**: Similar a MetaApi, proporciona acceso a datos MT4/MT5.
  - **MT-Bridge** o **MT5 Gateway**: Opciones para integrar datos con plataformas personalizadas.

---

### **3. Scripts/Expert Advisors en MT4/MT5**
- Puedes desarrollar o usar scripts personalizados (MQL4/MQL5) que extraigan el historial de trades directamente desde la cuenta.
- **Cómo funciona**:
  - Creas un *Expert Advisor* (EA) o un *Script* que use funciones como `AccountHistory` para obtener los datos.
  - Los datos pueden enviarse a tu servidor (por ejemplo, vía HTTP o WebSocket) para procesarlos.
- **Ventaja**: No necesitas credenciales de un broker, solo acceso a la cuenta del cliente.
- **Desventaja**: Es necesario que los clientes instalen el EA o Script en sus terminales.

---

### **4. Uso de archivos de log locales**
- Las plataformas MT4/MT5 almacenan datos de trades en archivos de log locales en el dispositivo del cliente.
- Puedes extraer estos datos directamente desde:
  - **MT4**: Archivos `.log` o `.hst` (en la carpeta del terminal MetaTrader).
  - **MT5**: Archivos similares pero con formato más complejo.
- **Ventaja**: No requiere interacción directa con el servidor.
- **Desventaja**: Necesitas acceso al sistema del cliente y desarrollar herramientas para parsear estos logs.

---

### **5. Web Terminal o API de terceros**
- Algunos brokers ofrecen *Web Terminals* o APIs propias para acceder al historial de cuentas, sin necesidad de utilizar soluciones como MetaApi.
- Investiga si el broker con el que trabajas ya tiene una solución API propia.

---

### **6. Costos y Flexibilidad**
Si quieres evitar costos elevados y dependencias externas:
- **Opción 1**: Desarrollar tu propio sistema basado en Scripts/EAs o procesar los archivos locales.
- **Opción 2**: Explorar brokers que ofrezcan integraciones nativas para reducir la dependencia de APIs como MetaApi.

---

### **Recomendación Final**
Para maximizar autonomía y minimizar costos:
1. Evalúa si puedes desarrollar un sistema basado en Scripts o EAs para extraer datos directamente desde las cuentas de los usuarios.
2. Si necesitas un servicio API más confiable, busca alternativas como **OneZero** o consulta con brokers que ofrezcan APIs nativas.

Si necesitas apoyo técnico para implementar alguna de estas opciones, puedo ayudarte con el diseño o desarrollo del sistema.