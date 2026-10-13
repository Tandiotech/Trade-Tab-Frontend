/**
 * isLikelyBrokerServerName:
 * Verifica si un string 'serverName' luce como un servidor de broker.
 */
export function isLikelyBrokerServerName(serverName: string): boolean {
  // 1. Permitir sólo letras, dígitos, espacios y guiones
  const basicPattern = /^[A-Za-z0-9\s\-]+$/;
  if (!basicPattern.test(serverName)) {
    return false;
  }

  // 2. Buscar al menos una palabra clave típica de servidores
  //    (puedes ajustar la lista de 'keywords' según tus necesidades).
  const keywords = ['live', 'demo', 'pro', 'real', 'server', 'mt4', 'mt5'];
  const lowerName = serverName.toLowerCase();
  const hasKeyword = keywords.some(kw => lowerName.includes(kw));
  if (!hasKeyword) {
    return false;
  }

  // 3. (Opcional) Exigir una longitud mínima o más validaciones.
  //    Por ejemplo, que tenga al menos 5 caracteres (arbitrario).
  if (serverName.length < 5) {
    return false;
  }

  return true;
}
