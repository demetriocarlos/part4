
// Función auxiliar para obtener el token del encabezado 'Authorization'
const getTokenFrom = request => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '');
    }
    return null;
  };
  
  // Middleware para extraer el token del encabezado y asignarlo al campo 'request.token'
  const tokenExtractor = (request, response, next) => {
    request.token = getTokenFrom(request); // Extrae el token usando la función auxiliar
    next();// Llama a 'next' para pasar el control al siguiente middleware
  };
  
  module.exports = tokenExtractor;
  