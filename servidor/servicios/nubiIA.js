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
  
  // Usar OpenAI GPT-4 (o 3.5)
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
  
  // IA Simulada MEJORADA (analiza datos reales con Regex)
  usarIASimulada(pregunta, contexto) {
    const p = pregunta.toLowerCase(); // Normalizar texto
    const { transacciones, metas, presupuesto, estadisticas } = contexto;
    
    // 1. Intención: GASTOS (Detecta: gasté, gasto, compras, salidas, debitado)
    if (/gast(o|é)|compr(a|e)|salida|debitado|cu[aá]nto me queda/.test(p)) {
      const totalGastos = estadisticas?.totalGastos || 0;
      const balance = estadisticas?.balance || 0;
      
      if (balance < 0) {
        return `⚠️ Ojo con tus finanzas. Este mes llevas gastados $${totalGastos.toLocaleString()} y estás en números rojos por $${Math.abs(balance).toLocaleString()}.\n\n` +
               `¡Frena un poco! Revisa tus categorías más altas en el dashboard. 📊`;
      } else {
        return `📊 Resumen de gastos: Llevas $${totalGastos.toLocaleString()} este mes.\n` +
               `Aún tienes un saldo a favor de $${balance.toLocaleString()}. ¡Vas bien! ✅`;
      }
    }
    
    // 2. Intención: AHORRO (Detecta: ahorr(ar/o), guardar, reserva)
    if (/ahorr(o|ar)|guardar|reserva/.test(p)) {
      const totalAhorro = estadisticas?.totalAhorro || 0;
      const metasActivas = metas?.length || 0;
      
      return `💰 Has ahorrado un total de $${totalAhorro.toLocaleString()} gracias a cupones.\n` +
             `Actualmente tienes ${metasActivas} metas de ahorro activas. ¿Quieres crear una nueva? 🎯`;
    }
    
    // 3. Intención: METAS (Detecta: meta, objetivo, sueño)
    if (/meta|objetivo|sueño/.test(p)) {
      if (!metas || metas.length === 0) {
        return `Aún no tienes metas definidas. 🏁\n` +
               `Establecer un objetivo (como "Viaje" o "Notebook") te ayuda a enfocarte. ¡Crea una ahora!`;
      }
      // Muestra la meta más cercana a completarse
      const metaTop = metas.sort((a, b) => b.progreso - a.progreso)[0];
      return `Tu meta más avanzada es "${metaTop.nombre}" con un ${metaTop.progreso}% completado. 🚀\n` +
             `¡Te falta poco! Sigue así.`;
    }

    // 4. Intención: PRESUPUESTO (Detecta: presupuesto, limite, tope)
    if (/presupuesto|limite|tope/.test(p)) {
       if (!presupuesto) {
        return `No tienes un presupuesto configurado 📊\n\n` +
               `Crear un presupuesto te ayudará a controlar tus gastos y evitar sorpresas. ¿Quieres que te ayude a crear uno?`;
      }
      const porcentaje = parseFloat(presupuesto.porcentajeUsado);
      if (porcentaje > 90) {
        return `⚠️ ¡Alerta! Has usado el ${porcentaje}% de tu presupuesto mensual. Prioriza gastos esenciales.`;
      }
      return `👍 Has usado el ${porcentaje}% de tu presupuesto mensual. Sigues dentro del rango saludable.`;
    }

    // 5. Intención: SALUDO (Detecta: hola, buenos dias, hey)
    if (/hola|buen(a|o)s|hey|qué tal/.test(p)) {
      return `¡Hola! 👋 Soy Nubi. Estoy aquí para cuidar tu bolsillo.\n` +
             `Pregúntame sobre tus gastos, metas o pídeme un consejo financiero.`;
    }
    
    // Respuesta por defecto (Fallback con sugerencias claras)
    return `Mmm, no estoy seguro de entender eso 🤔.\n\n` +
           `Intenta preguntarme cosas como:\n` +
           `• "¿Cuánto he gastado este mes?"\n` +
           `• "¿Cómo van mis metas?"\n` +
           `• "Dame un consejo de ahorro"`;
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