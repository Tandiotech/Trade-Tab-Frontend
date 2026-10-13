<!-- ------------------ -->
# Prompts
Estoy jalando datos de un sheets de google que contiene datos de brokers. El tema es que el codigo actual no funciona porque el acomodo de datos es diferente en la tabla. Lo que el team hizo es lo siguiente: En la columna A de forma vertical, acomodaron todos los valores key de los brokers. Entonces la casilla A1 es 'Broker Name', la casilla A2 es 'Summary', la casilla A3 es 'Website' y asi continuamos.  Por el otro lado, en la casilla B1 tenemos el nombre del primer Forex Broker que se llama 'IG Markets' y en la casilla B2 tenemos: "IG Markets is a prominent online trading platform renowned for offering a wide array of financial instruments and services...".
Adapta el siguiente codigo para leer correctamente los datos de los brokers:   




# prompts reportes

El reporte debe ser en ingles
- 25 diciembre: 
    - Nuevo link para el back office con mejoras y capacidades de filtrado basicas(https://delicate-horse-e9cc59.netlify.app/)
    - Nuevos KPIS en Slack para saber cuando un usuario nuevo se registra y el total de usuarios
    - Nuevos KPIS en Slack para saber cuando una nueva cuenta a sido conectada





Quiero construir un mapeo para un CRM para este sistema, el cual sera el encargado de enviar correos electronicos a los clientes cuando sus cuentas de trading cumplen con ciertas caracteristicas, un concepto que llamaremos "SLT" o Straight Line Trading, donde los usuarios definen parametros como la ganancia semanal(0.5% por ejemplo)


Quiero construir un mapeo para un CRM para este sistema, el cual sera el encargado de enviar correos electronicos a los clientes cuando sus cuentas de trading cumplen con ciertas caracteristicas, un concepto que llamaremos "SLT" o Straight Line Trading, donde los usuarios definen parametros como la ganancia semanal(0.5% por ejemplo)




# 
Este es el formato de fecha que viene en 'trade.closeTime'
closeTime:"2024-01-16 17:08:10.000"

date: 2024-08-06 VS trade.:  2024-08-05 19:32:32.000

const date = new Date(new Date(trade.closeTime).getTime() * 60 * 60 * 1000).toISOString().split('T')[0];

