import { useState, useRef, useEffect } from 'react';

export default function ChatNubi() {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: 'nubi',
      texto: '¡Hola! 👋 Soy Nubi, tu asistente financiero con IA. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }
  ]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const mensajesEndRef = useRef(null);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [mensajes]);

  const respuestasNubi = {
    'hola': '¡Hola! 😊 ¿Cómo puedo ayudarte con tus finanzas hoy?',
    'gastos': 'Veo que este mes has gastado más de lo habitual. Te recomiendo revisar tu presupuesto en la sección de Finanzas 💰',
    'ahorro': '¡Excelente pregunta! Para ahorrar más, te sugiero:\n\n1. Usa más cupones de descuento 🎟️\n2. Establece metas de ahorro claras 🎯\n3. Revisa tu presupuesto mensual 📊',
    'presupuesto': 'Tu presupuesto actual está al 78%. Te estás acercando al límite en la categoría de Alimentación 🍔. ¿Quieres que te ayude a ajustarlo?',
    'cupones': 'Tengo 12 cupones nuevos disponibles para ti hoy. Los mejores son:\n\n🎟️ Falabella: 20% off\n🎟️ Ripley: $10.000 descuento\n🎟️ Lider: 2x1 en productos seleccionados',
    'metas': 'Actualmente tienes 2 metas activas:\n\n🎯 Vacaciones: 45% completado\n🎯 Notebook nuevo: 12% completado\n\n¡Sigue así! 💪',
    'consejo': 'Aquí va mi consejo del día: 💡\n\n"Antes de comprar algo, espera 24 horas. Si aún lo quieres, probablemente lo necesites. Si no, acabas de ahorrar dinero."',
    'ayuda': 'Puedo ayudarte con:\n\n💰 Ver tus gastos\n🎯 Revisar tus metas\n🎟️ Encontrar cupones\n📊 Analizar tu presupuesto\n💡 Darte consejos financieros\n\n¿Qué te gustaría hacer?'
  };

  const obtenerRespuesta = (mensaje) => {
    const mensajeLower = mensaje.toLowerCase();
    
    for (const [palabra, respuesta] of Object.entries(respuestasNubi)) {
      if (mensajeLower.includes(palabra)) {
        return respuesta;
      }
    }
    
    return 'Interesante pregunta 🤔. Aún estoy aprendiendo sobre eso. ¿Puedes ser más específico o preguntar sobre gastos, ahorro, cupones o presupuesto?';
  };

  const enviarMensaje = async (e) => {
    e.preventDefault();
    if (!inputMensaje.trim()) return;

    const nuevoMensajeUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      texto: inputMensaje,
      timestamp: new Date()
    };

    setMensajes([...mensajes, nuevoMensajeUsuario]);
    setInputMensaje('');
    setEscribiendo(true);

    setTimeout(() => {
      const respuesta = obtenerRespuesta(inputMensaje);
      const nuevoMensajeNubi = {
        id: Date.now() + 1,
        tipo: 'nubi',
        texto: respuesta,
        timestamp: new Date()
      };

      setMensajes(prev => [...prev, nuevoMensajeNubi]);
      setEscribiendo(false);
    }, 1500);
  };

  const sugerenciasRapidas = [
    { emoji: '💰', texto: '¿Cuánto gasté?' },
    { emoji: '🎯', texto: 'Ver mis metas' },
    { emoji: '🎟️', texto: 'Cupones disponibles' },
    { emoji: '💡', texto: 'Dame un consejo' }
  ];

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Header */}
      <div className="bg-panda-dark/80 backdrop-blur-sm border-b border-gray-700 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <img src="/nubi-logo.jpg" alt="Nubi" className="h-12 w-12 rounded-full" />
          <div>
            <h1 className="text-xl font-bold text-white">Chat con Nubi</h1>
            <p className="text-sm text-gray-400">Tu asistente financiero inteligente ☁️</p>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-[80%] ${
                  msg.tipo === 'usuario' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div className="flex-shrink-0">
                  {msg.tipo === 'nubi' ? (
                    <img src="/nubi-logo.jpg" alt="Nubi" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                      U
                    </div>
                  )}
                </div>

                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.tipo === 'usuario'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white/10 text-white backdrop-blur-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.texto}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {msg.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {escribiendo && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <img src="/nubi-logo.jpg" alt="Nubi" className="h-8 w-8 rounded-full" />
                <div className="bg-white/10 backdrop-blur-sm px-4 py-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={mensajesEndRef} />
        </div>
      </div>

      {/* Sugerencias rápidas */}
      {mensajes.length === 1 && (
        <div className="px-4 pb-2">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 mb-2">Sugerencias:</p>
            <div className="flex flex-wrap gap-2">
              {sugerenciasRapidas.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMensaje(sug.texto)}
                  className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm transition"
                >
                  {sug.emoji} {sug.texto}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="bg-panda-dark/80 backdrop-blur-sm border-t border-gray-700 p-4">
        <form onSubmit={enviarMensaje} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              placeholder="Pregúntale a Nubi sobre tus finanzas..."
              className="flex-1 bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 border border-gray-600 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!inputMensaje.trim()}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
