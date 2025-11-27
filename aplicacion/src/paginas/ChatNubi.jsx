import { useState, useRef, useEffect } from 'react';
import { enviarMensajeNubi } from '../servicios/finanzasApi';

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
    const mensajeEnviado = inputMensaje;
    setInputMensaje('');
    setEscribiendo(true);

    try {
      const res = await enviarMensajeNubi(mensajeEnviado);
      
      const nuevoMensajeNubi = {
        id: Date.now() + 1,
        tipo: 'nubi',
        texto: res.data.respuesta,
        timestamp: new Date()
      };

      setMensajes(prev => [...prev, nuevoMensajeNubi]);
    } catch (error) {
      console.error('Error al comunicarse con Nubi:', error);
      
      const nuevoMensajeNubi = {
        id: Date.now() + 1,
        tipo: 'nubi',
        texto: 'Lo siento, tuve un problema al procesar tu mensaje 😅 Por favor intenta de nuevo.',
        timestamp: new Date()
      };
      
      setMensajes(prev => [...prev, nuevoMensajeNubi]);
    } finally {
      setEscribiendo(false);
    }
  };

  const sugerenciasRapidas = [
    { emoji: '💰', texto: '¿Cuánto gasté?' },
    { emoji: '🎯', texto: 'Ver mis metas' },
    { emoji: '🎟️', texto: 'Cupones disponibles' },
    { emoji: '💡', texto: 'Dame un consejo' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header mejorado */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <img 
            src="/nubi-logo.jpg" 
            alt="Nubi" 
            className="h-14 w-14 rounded-full object-cover shadow-lg border-2 border-white"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Chat con Nubi</h1>
            <p className="text-sm text-blue-100">Tu asistente financiero inteligente</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              En línea
            </span>
          </div>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {mensajes.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.tipo === 'usuario' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-[75%] ${
                  msg.tipo === 'usuario' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  {msg.tipo === 'nubi' ? (
                    <img 
                      src="/nubi-logo.jpg" 
                      alt="Nubi" 
                      className="h-10 w-10 rounded-full object-cover shadow-lg border-2 border-blue-400"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg">
                      U
                    </div>
                  )}
                </div>

                {/* Mensaje */}
                <div className="flex flex-col gap-1">
                  <div
                    className={`px-5 py-3 rounded-2xl shadow-md ${
                      msg.tipo === 'usuario'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-base leading-relaxed">{msg.texto}</p>
                  </div>
                  <p className={`text-xs px-2 ${
                    msg.tipo === 'usuario' ? 'text-right text-gray-400' : 'text-left text-gray-500'
                  }`}>
                    {msg.timestamp.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Indicador de escritura */}
          {escribiendo && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[75%]">
                <img 
                  src="/nubi-logo.jpg" 
                  alt="Nubi" 
                  className="h-10 w-10 rounded-full object-cover shadow-lg border-2 border-blue-400"
                />
                <div className="bg-white px-5 py-3 rounded-2xl shadow-md">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
        <div className="px-4 pb-3 bg-gray-900">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-gray-400 mb-3 font-semibold">Sugerencias rápidas:</p>
            <div className="flex flex-wrap gap-2">
              {sugerenciasRapidas.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputMensaje(sug.texto)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-full text-sm transition shadow-md border border-gray-700 hover:border-blue-500"
                >
                  {sug.emoji} {sug.texto}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input mejorado */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-4 shadow-lg">
        <form onSubmit={enviarMensaje} className="max-w-4xl mx-auto">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-full px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner"
              disabled={escribiendo}
            />
            <button
              type="submit"
              disabled={!inputMensaje.trim() || escribiendo}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600"
            >
              {escribiendo ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando
                </span>
              ) : (
                'Enviar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
