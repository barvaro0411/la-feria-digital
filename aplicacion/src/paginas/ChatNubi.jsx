import { useState, useRef, useEffect } from 'react';
import { enviarMensajeNubi } from '../servicios/finanzasApi';

const SUGERENCIAS_BASE = [
  { emoji: '💰', texto: '¿Cuánto gasté este mes?' },
  { emoji: '🎯', texto: '¿Cómo van mis metas?' },
  { emoji: '📊', texto: 'Resumen rápido de mis finanzas' },
  { emoji: '🎟️', texto: '¿Cuánto ahorré con cupones?' },
  { emoji: '💡', texto: 'Dame un consejo para ahorrar' },
];

export default function ChatNubi() {
  const [mensajes, setMensajes] = useState([
    {
      id: 1,
      tipo: 'nubi',
      texto: '¡Hola! 👋 Soy Nubi, tu asistente financiero. Puedo analizar tus gastos, metas, presupuesto y cupones. ¿En qué te ayudo hoy?',
      timestamp: new Date(),
      error: false,
    }
  ]);
  const [inputMensaje, setInputMensaje] = useState('');
  const [escribiendo, setEscribiendo] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [ultimoContexto, setUltimoContexto] = useState(null); // 'gastos' | 'metas' | 'presupuesto' | 'cupones'
  const mensajesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [mensajes, escribiendo]);

  const scrollToBottom = () => {
    mensajesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const enviarMensaje = async (e) => {
    e?.preventDefault();
    if (!inputMensaje.trim() || enviando) return;

    const textoUsuario = inputMensaje.trim();

    const nuevoMensajeUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      texto: textoUsuario,
      timestamp: new Date(),
      error: false,
    };

    setMensajes(prev => [...prev, nuevoMensajeUsuario]);
    setInputMensaje('');
    setEscribiendo(true);
    setEnviando(true);

    try {
      const res = await enviarMensajeNubi(textoUsuario);
      const respuesta = res.data?.respuesta || 'He recibido tu mensaje y estoy analizando tus finanzas.';

      const nuevoMensajeNubi = {
        id: Date.now() + 1,
        tipo: 'nubi',
        texto: respuesta,
        timestamp: new Date(),
        error: false,
      };

      setMensajes(prev => [...prev, nuevoMensajeNubi]);
      detectarContexto(textoUsuario);
    } catch (error) {
      console.error('Error al comunicarse con Nubi:', error);

      const nuevoMensajeNubi = {
        id: Date.now() + 1,
        tipo: 'nubi',
        texto: 'Ups, tuve un problema al procesar tu mensaje 😅. Revisa tu conexión e intenta de nuevo.',
        timestamp: new Date(),
        error: true,
      };

      setMensajes(prev => [...prev, nuevoMensajeNubi]);
    } finally {
      setEscribiendo(false);
      setEnviando(false);
    }
  };

  const detectarContexto = (texto) => {
    const t = texto.toLowerCase();
    if (t.includes('gasto') || t.includes('compr') || t.includes('transaccion')) {
      setUltimoContexto('gastos');
    } else if (t.includes('meta') || t.includes('ahorro')) {
      setUltimoContexto('metas');
    } else if (t.includes('presupuesto') || t.includes('limite')) {
      setUltimoContexto('presupuesto');
    } else if (t.includes('cupon') || t.includes('descuento')) {
      setUltimoContexto('cupones');
    } else {
      setUltimoContexto(null);
    }
  };

  const sugerenciasContextuales = () => {
    switch (ultimoContexto) {
      case 'gastos':
        return [
          { emoji: '📂', texto: 'Muéstrame gastos por categoría' },
          { emoji: '📆', texto: 'Comparar gastos con el mes pasado' },
        ];
      case 'metas':
        return [
          { emoji: '🎯', texto: '¿Qué meta estoy más cerca de cumplir?' },
          { emoji: '📈', texto: 'Recomiéndame cuánto aportar a mis metas' },
        ];
      case 'presupuesto':
        return [
          { emoji: '⚠️', texto: '¿En qué categoría estoy cerca del límite?' },
          { emoji: '🔧', texto: 'Ayúdame a ajustar mi presupuesto' },
        ];
      case 'cupones':
        return [
          { emoji: '🛒', texto: '¿Qué cupones me conviene usar hoy?' },
          { emoji: '📍', texto: 'Tiendas con mejores descuentos cerca de mí' },
        ];
      default:
        return SUGERENCIAS_BASE.slice(0, 4);
    }
  };

  const manejarSugerencia = (texto) => {
    setInputMensaje(texto);
  };

  const placeholderEjemplo = () => {
    switch (ultimoContexto) {
      case 'gastos':
        return 'Ej: ¿Cuánto gasté en comida este mes?';
      case 'metas':
        return 'Ej: ¿Voy bien con mis metas de ahorro?';
      case 'presupuesto':
        return 'Ej: ¿Qué tan ajustado está mi presupuesto?';
      case 'cupones':
        return 'Ej: ¿Con qué cupones ahorro más hoy?';
      default:
        return 'Pregúntame algo sobre tus finanzas...';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
          <img 
            src="/nubi-logo.jpg" 
            alt="Nubi" 
            className="h-14 w-14 rounded-full object-cover shadow-lg border-2 border-white"
          />
          <div>
            <h1 className="text-2xl font-bold text-white">Chat con Nubi</h1>
            <p className="text-sm text-blue-100">
              Tu asistente financiero inteligente. Pregunta sobre gastos, metas, presupuesto y cupones.
            </p>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              En línea
            </span>
            <span className="text-xs text-blue-100">
              Respuestas basadas en tus datos reales
            </span>
          </div>
        </div>
      </div>

      {/* Panel resumen rápido (opcional, sin datos aún) */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="bg-gray-800/60 rounded-xl px-3 py-2 text-gray-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Gasto mes</span>
              <span>💸</span>
            </div>
            <p className="text-sm font-bold text-white">Pregunta a Nubi</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl px-3 py-2 text-gray-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Metas</span>
              <span>🎯</span>
            </div>
            <p className="text-sm font-bold text-white">Pide un resumen</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl px-3 py-2 text-gray-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Presupuesto</span>
              <span>💼</span>
            </div>
            <p className="text-sm font-bold text-white">Revisa tu estado</p>
          </div>
          <div className="bg-gray-800/60 rounded-xl px-3 py-2 text-gray-300">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Cupones</span>
              <span>🎟️</span>
            </div>
            <p className="text-sm font-bold text-white">Busca ahorros</p>
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
                className={`flex gap-3 max-w-[80%] ${
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
                    className={`px-5 py-3 rounded-2xl shadow-md text-sm md:text-base leading-relaxed ${
                      msg.tipo === 'usuario'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                        : msg.error
                        ? 'bg-red-500/15 border border-red-500/40 text-red-100'
                        : 'bg-white text-gray-900'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.texto}</p>
                    {msg.error && (
                      <button
                        onClick={() => setInputMensaje(mensajes.find(m => m.id === msg.id - 1)?.texto || '')}
                        className="mt-2 text-xs font-semibold underline decoration-dotted"
                      >
                        Reintentar mensaje
                      </button>
                    )}
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
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Nubi está analizando tus finanzas...
                  </p>
                </div>
              </div>
            </div>
          )}

          <div ref={mensajesEndRef} />
        </div>
      </div>

      {/* Sugerencias rápidas */}
      <div className="px-4 pb-3 bg-gray-900 border-t border-gray-800">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-gray-400 mb-2 font-semibold">
            Sugerencias rápidas {ultimoContexto && `(basadas en ${ultimoContexto})`}
          </p>
          <div className="flex flex-wrap gap-2">
            {sugerenciasContextuales().map((sug, idx) => (
              <button
                key={idx}
                onClick={() => manejarSugerencia(sug.texto)}
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2.5 rounded-full text-xs md:text-sm transition shadow-md border border-gray-700 hover:border-blue-500"
              >
                {sug.emoji} {sug.texto}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="bg-gray-900 border-t border-gray-800 px-4 py-4 shadow-lg">
        <form onSubmit={enviarMensaje} className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={inputMensaje}
              onChange={(e) => setInputMensaje(e.target.value)}
              placeholder={placeholderEjemplo()}
              className="flex-1 bg-gray-800 text-white placeholder-gray-500 border border-gray-700 rounded-full px-5 md:px-6 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner text-sm md:text-base"
              disabled={enviando}
            />
            <button
              type="submit"
              disabled={!inputMensaje.trim() || enviando}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 md:px-8 py-3.5 rounded-full font-bold hover:from-blue-700 hover:to-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-purple-600 text-sm md:text-base"
            >
              {enviando ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Enviando
                </span>
              ) : (
                'Enviar'
              )}
            </button>
          </div>
          <p className="mt-2 text-[11px] text-gray-500 text-center md:text-left">
            Tip: Pregunta cosas como "¿Cuánto gasté este mes?", "¿Qué meta estoy más cerca de cumplir?" o "¿Cómo está mi presupuesto?".
          </p>
        </form>
      </div>
    </div>
  );
}
