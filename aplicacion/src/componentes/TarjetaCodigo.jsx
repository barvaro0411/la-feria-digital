import React, { useState } from 'react';
import { votarCodigo, verificarCodigo } from '../servicios/api';

function TarjetaCodigo({ codigo: initialCodigo }) {
    const [codigo, setCodigo] = useState(initialCodigo);
    const [cargando, setCargando] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(codigo.codigo)
            .then(() => alert('¡Código copiado al portapapeles! 📋'))
            .catch(() => alert('Error al copiar'));
    };
    
    const handleVote = async () => {
        if (cargando) return;
        setCargando(true);

        // Actualización optimista (feedback instantáneo)
        const yaVoto = codigo.yaVoto; // Necesitamos que el backend nos diga si ya votó, o lo manejamos localmente
        // Por simplicidad del MVP, asumimos toggle local visual
        setCodigo(prev => ({
            ...prev,
            likesCount: prev.likesCount + (prev.yaVoto ? -1 : 1),
            yaVoto: !prev.yaVoto
        }));

        try {
            const res = await votarCodigo(codigo._id, 1); // El backend maneja la lógica de toggle
            setCodigo(prev => ({
                ...prev,
                likesCount: res.data.likesCount,
                yaVoto: res.data.yaVoto
            }));
        } catch (error) {
            // Revertir si falla
            setCodigo(initialCodigo);
            alert('Debes iniciar sesión para votar.');
        } finally {
            setCargando(false);
        }
    };

    const handleVerify = async () => {
        if (cargando) return;
        setCargando(true);
        
        try {
            const res = await verificarCodigo(codigo._id);
            setCodigo(prev => ({
                ...prev,
                verificado: res.data.verificado,
                likesCount: res.data.likesCount // Actualiza los votos extra por verificación
            }));
        } catch (error) {
            alert('Error al verificar. Intenta nuevamente.');
        } finally {
            setCargando(false);
        }
    };

    // Determinar nombre e inicial del creador
    const creadorNombre = codigo.creador?.nombre || 'Nubi Bot';
    const creadorInicial = creadorNombre.charAt(0).toUpperCase();
    const esBot = !codigo.creador;

    return (
        <div className="bg-nubi-card rounded-xl border border-gray-700 overflow-hidden shadow-lg hover:shadow-nubi-blue/20 transition-all duration-300 flex flex-col h-full">
            
            {/* Encabezado: Usuario y Tienda */}
            <div className="p-4 flex justify-between items-center bg-black/20 border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-inner ${esBot ? 'bg-gradient-to-br from-gray-600 to-gray-800' : 'bg-gradient-to-br from-nubi-blue to-blue-400'}`}>
                        {esBot ? '🤖' : creadorInicial}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Por</span>
                        <span className="text-xs font-bold text-gray-200 truncate max-w-[100px]">{creadorNombre}</span>
                    </div>
                </div>
                <span className="px-2 py-1 rounded text-xs font-bold bg-nubi-blue/20 text-blue-300 uppercase tracking-wider border border-nubi-blue/30">
                    {codigo.tienda}
                </span>
            </div>

            {/* Cuerpo de la Tarjeta */}
            <div className="p-5 flex-grow flex flex-col justify-between">
                <div>
                    <h3 className="text-xl font-black text-white mb-2 leading-tight">{codigo.descuento}</h3>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2 min-h-[40px]">
                        {codigo.descripcion || '¡Aprovecha este descuento exclusivo!'}
                    </p>
                </div>

                {/* Caja del Código */}
                <div 
                    onClick={handleCopy}
                    className="group relative bg-black/40 border border-dashed border-gray-600 rounded-lg p-3 flex justify-between items-center cursor-pointer hover:border-nubi-orange transition-colors mt-2"
                >
                    <div className="flex flex-col">
                        <span className="text-[10px] text-gray-500 group-hover:text-nubi-orange transition-colors">CÓDIGO</span>
                        <code className="text-nubi-orange font-mono text-lg tracking-widest font-bold truncate">
                            {codigo.codigo}
                        </code>
                    </div>
                    <div className="bg-gray-800 p-2 rounded text-gray-400 group-hover:text-white group-hover:bg-nubi-orange group-hover:shadow-lg transition-all">
                        📋
                    </div>
                </div>
            </div>

            {/* Pie: Interacciones */}
            <div className="px-5 py-3 bg-black/40 border-t border-gray-700 flex justify-between items-center">
                
                {/* Botón Like */}
                <button 
                    onClick={handleVote}
                    disabled={cargando}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all ${
                        codigo.yaVoto 
                        ? 'bg-nubi-blue/20 text-nubi-blue' 
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                >
                    <span className={`text-lg ${codigo.yaVoto ? 'scale-110' : ''}`}>👍</span>
                    <span className="font-bold text-sm">{codigo.likesCount || 0}</span>
                </button>

                {/* Estado Verificación */}
                {codigo.verificado ? (
                    <div className="flex items-center gap-1.5 text-nubi-orange text-xs font-bold bg-nubi-orange/10 px-2 py-1 rounded-full border border-nubi-orange/20">
                        <span>✨</span> Verificado
                    </div>
                ) : (
                    <button 
                        onClick={handleVerify}
                        disabled={cargando}
                        className="text-xs font-medium text-gray-500 hover:text-nubi-orange hover:underline transition-colors"
                    >
                        ¿Funciona? Verificar
                    </button>
                )}
            </div>
        </div>
    );
}

export default TarjetaCodigo;