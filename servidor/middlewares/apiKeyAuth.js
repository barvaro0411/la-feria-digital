const apiKeyAuth = (req, res, next) => {
  // La clave debe venir en el header 'x-api-key'
  const apiKey = req.header('x-api-key');
  
  // Define esta clave en tu archivo .env como SCRAPER_API_KEY=tu_clave_secreta
  const validApiKey = process.env.SCRAPER_API_KEY || 'clave_secreta_por_defecto_123';

  if (!apiKey || apiKey !== validApiKey) {
    return res.status(403).json({ 
      success: false,
      msg: '⛔ Acceso denegado: API Key inválida o ausente' 
    });
  }

  next();
};

module.exports = apiKeyAuth;