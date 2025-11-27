const OpenAI = require('openai');

// Inicializar OpenAI (si tienes API key, sino usamos respuestas inteligentes simuladas)
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// Sistema de respuestas inteligentes con análisis de datos reales
class NubiIA {
  
  // Generar respuesta con contexto del usuario
  async generarRespuesta(pregunta, contextoUsuario) {
    const { transacciones, metas, presupuesto, estadisticas } = contextoUsuario;
    
    // Si hay OpenAI configurado, usar GPT
    if (openai) {
      return await this.usarOpenAI(pregunta, contextoUsuario);
    }
    
    // Sino, usar IA simulada inteligente
    return this.usarIASimulada(pregunta, contextoUsuario);
  }
  
  // Usar OpenAI GPT-4
  async usarOpenAI(pregunta, contexto) {
    try {
      const prompt = this.construirPrompt(pregunta, contexto);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Eres Nubi, un asistente financiero amigable y experto. Hablas en español de Chile. Das consejos prácticos sobre ahorro, presupuesto y finanzas personales. Eres motivador pero realista."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });
      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Error con OpenAI:', error);
      return this.usarIASimulada(pregunta, contexto);
    }
  }
  
  // Construir prompt con contexto
  construirPrompt(pregunta, contexto) {
    const { transacciones, metas, presupuesto, estadisticas } = contexto;
    
    let prompt = `Pregunta del usuario: ${pregunta}\n\n`;
    
    // Agregar contexto financiero
    if (estadisticas) {
      prompt += `Contexto financiero del usuario:\n`;
      prompt += `- Gastos este mes: $${estadisticas.totalGastos?.toLocaleString() || 0}\n`;
      prompt += `- Ingresos este mes: $${estadisticas.totalIngresos?.toLocaleString() || 0}\n`;
      prompt += `- Balance: $${estadisticas.balance?.toLocaleString() || 0}\n`;
      prompt += `- Ahorro con cupones: $${estadisticas.totalAhorro?.toLocaleString() || 0}\n\n`;
    }
    
    if (metas && metas.length > 0) {
      prompt += `Metas activas:\n`;
      metas.forEach(meta => {
        prompt += `- ${meta.nombre}: ${meta.progreso}% completado ($${meta.montoActual?.toLocaleString()}/$${meta.montoObjetivo?.toLocaleString()})\n`;
      });
      prompt += '\n';
    }
    
    if (presupuesto) {
      prompt += `Presupuesto mensual: ${presupuesto.porcentajeUsado}% usado\n\n`;
    }
    
    prompt += `Responde de forma concisa, amigable y con emojis apropiados. Máximo 3 párrafos.`;
    
    return prompt;
  }
  
  // IA Simulada inteligente (analiza datos reales)
  usarIASimulada(pregunta, contexto) {
    const preguntaLower = pregunta.toLowerCase();
    const { transacciones, metas, presupuesto, estadisticas } = contexto;
    
    // Análisis de gastos
    if (preguntaLower.includes('gasto') || preguntaLower.includes('gasté') || preguntaLower.includes('cuánto')) {
      const totalGastos = estadisticas?.totalGastos || 0;
      const balance = estadisticas?.balance || 0;
      
      if (balance < 0) {
        return `Este mes has gastado $${totalGastos.toLocaleString()} y tus gastos superan tus ingresos por $${Math.abs(balance).toLocaleString()} 😟\n\n` +
               `Te recomiendo:\n` +
               `1. Revisa las categorías donde más gastas 📊\n` +
               `2. Usa más cupones de descuento 🎟️\n` +
               `3. Ajusta tu presupuesto para el próximo mes 💡`;
      } else {
        return `¡Bien hecho! 👏 Este mes has gastado $${totalGastos.toLocaleString()} y tienes un balance positivo de $${balance.toLocaleString()}\n\n` +
               `Considera destinar parte de ese balance a tus metas de ahorro 🎯`;
      }
    }
    
    // Análisis de ahorro
    if (preguntaLower.includes('ahorro') || preguntaLower.includes('ahorrar')) {
      const totalAhorro = estadisticas?.totalAhorro || 0;
      
      if (totalAhorro > 0) {
        return `¡Excelente! 🎉 Has ahorrado $${totalAhorro.toLocaleString()} usando cupones este mes.\n\n` +
               `Para seguir ahorrando:\n` +
               `• Revisa diariamente los cupones disponibles\n` +
               `• Compara precios antes de comprar\n` +
               `• Establece metas de ahorro claras`;
      } else {
        return `Aún no has usado cupones este mes 🎟️\n\n` +
               `Tengo ${contexto.cuponesDisponibles || 10} cupones disponibles para ti. ¡Úsalos para ahorrar en tus próximas compras!`;
      }
    }
    
    // Análisis de metas
    if (preguntaLower.includes('meta')) {
      if (!metas || metas.length === 0) {
        return `No tienes metas de ahorro activas 🎯\n\n` +
               `Te recomiendo crear al menos una meta. Las personas con metas claras ahorran 40% más que quienes no las tienen.\n\n` +
               `¿Qué te gustaría lograr? 💭`;
      }
      
      const metasTexto = metas.map(m => 
        `• ${m.icono} ${m.nombre}: ${m.progreso}% ($${m.montoActual?.toLocaleString()}/$${m.montoObjetivo?.toLocaleString()})`
      ).join('\n');
      
      return `Tienes ${metas.length} meta${metas.length > 1 ? 's' : ''} activa${metas.length > 1 ? 's' : ''} 🎯\n\n${metasTexto}\n\n` +
             `${metas[0].progreso < 30 ? '¡Sigue así! Cada pequeño aporte cuenta 💪' : '¡Vas muy bien! 🚀'}`;
    }
    
    // Análisis de presupuesto
    if (preguntaLower.includes('presupuesto')) {
      if (!presupuesto) {
        return `No tienes un presupuesto configurado 📊\n\n` +
               `Crear un presupuesto te ayudará a controlar tus gastos y evitar sorpresas. ¿Quieres que te ayude a crear uno?`;
      }
      
      const porcentaje = parseFloat(presupuesto.porcentajeUsado);
      
      if (porcentaje > 90) {
        return `⚠️ ¡Alerta! Has usado el ${porcentaje}% de tu presupuesto mensual.\n\n` +
               `Te quedan $${(presupuesto.totalPresupuesto - presupuesto.totalGastado).toLocaleString()} para el resto del mes.\n\n` +
               `Prioriza solo gastos esenciales los próximos días 🛡️`;
      } else if (porcentaje > 75) {
        return `Has usado el ${porcentaje}% de tu presupuesto 📊\n\n` +
               `Te estás acercando al límite. Te recomiendo moderar tus gastos el resto del mes 💡`;
      } else {
        return `¡Vas bien! 👍 Has usado el ${porcentaje}% de tu presupuesto mensual.\n\n` +
               `Sigues dentro del rango saludable. Mantén el control 💪`;
      }
    }
    
    // Consejos generales
    if (preguntaLower.includes('consejo') || preguntaLower.includes('ayuda')) {
      const consejos = [
        `💡 Consejo del día:\n\nAntes de comprar algo, espera 24 horas. Si aún lo quieres después, probablemente lo necesites. Si no, acabas de ahorrar dinero.`,
        
        `💡 Consejo del día:\n\nLa regla 50/30/20:\n• 50% necesidades\n• 30% gustos\n• 20% ahorro\n\n¿Qué tal si revisamos cómo está tu distribución actual?`,
        
        `💡 Consejo del día:\n\nAutomatiza tu ahorro. Separa un porcentaje de tus ingresos apenas los recibas. Lo que no ves, no lo gastas 🎯`,
        
        `💡 Consejo del día:\n\nCompara precios antes de comprar. Usa cupones siempre que puedas. Pequeños ahorros suman grandes resultados 📈`
      ];
      
      return consejos[Math.floor(Math.random() * consejos.length)];
    }
    
    // Respuesta por defecto
    return `Interesante pregunta 🤔\n\n` +
           `Puedo ayudarte con:\n` +
           `💰 Ver tus gastos del mes\n` +
           `🎯 Revisar tus metas de ahorro\n` +
           `🎟️ Encontrar cupones\n` +
           `📊 Analizar tu presupuesto\n` +
           `💡 Darte consejos financieros\n\n` +
           `¿Sobre qué tema específico te gustaría hablar?`;
  }
  
  // Análisis proactivo (para notificaciones)
  analizarSituacionFinanciera(contexto) {
    const alertas = [];
    const { presupuesto, metas, estadisticas } = contexto;
    
    // Alerta de presupuesto
    if (presupuesto && parseFloat(presupuesto.porcentajeUsado) > 80) {
      alertas.push({
        tipo: 'presupuesto',
        urgencia: presupuesto.porcentajeUsado > 90 ? 'alta' : 'media',
        mensaje: `Has usado el ${presupuesto.porcentajeUsado}% de tu presupuesto mensual`,
        accion: 'Ver presupuesto'
      });
    }
    
    // Alerta de metas estancadas
    if (metas) {
      metas.forEach(meta => {
        if (meta.progreso < 10 && this.diasDesdeCreacion(meta) > 30) {
          alertas.push({
            tipo: 'meta',
            urgencia: 'baja',
            mensaje: `Tu meta "${meta.nombre}" lleva un mes sin avances`,
            accion: 'Agregar fondos'
          });
        }
      });
    }
    
    // Alerta de balance negativo
    if (estadisticas && estadisticas.balance < 0) {
      alertas.push({
        tipo: 'balance',
        urgencia: 'alta',
        mensaje: 'Tus gastos superan tus ingresos este mes',
        accion: 'Ver análisis'
      });
    }
    
    return alertas;
  }
  
  diasDesdeCreacion(meta) {
    const ahora = new Date();
    const creacion = new Date(meta.createdAt);
    return Math.floor((ahora - creacion) / (1000 * 60 * 60 * 24));
  }
}

module.exports = new NubiIA();
