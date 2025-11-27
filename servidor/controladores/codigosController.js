const Codigo = require('../modelos/Codigo');
const Alerta = require('../modelos/Alerta'); 
const Usuario = require('../modelos/Usuario');

// Función auxiliar para notificar a los usuarios suscritos
const dispararAlerta = async (nuevoCodigo) => {
    try {
        const alertas = await Alerta.find({ categoria: nuevoCodigo.categoria }).populate('usuario');

        if (alertas.length > 0) {
            const correos = alertas.map(alerta => alerta.usuario.correo);

            console.log(`\n======================================================`);
            console.log(`🔔 ALERTA DISPARADA: Nuevo código de ${nuevoCodigo.tienda} (${nuevoCodigo.categoria})`);
            console.log(`CÓDIGOS: ${nuevoCodigo.codigo} (${nuevoCodigo.descuento})`);
            console.log(`ENVIANDO a ${correos.length} usuarios: ${correos.join(', ')}`);
            console.log(`======================================================\n`);
        }
    } catch (error) {
        console.error("Error al disparar la alerta:", error);
    }
};


// --- Funciones del Controlador ---

// Función: Obtener Códigos (con filtros y ordenamiento)
exports.obtenerCodigos = async (req, res) => {
    try {
        const { tienda, categoria, orden } = req.query;
        const filtros = {};
        let sort = { createdAt: -1 };

        if (tienda) {
            filtros.tienda = { $regex: new RegExp(tienda, 'i') }; 
        }
        if (categoria && categoria !== 'todos') {
            filtros.categoria = categoria;
        }

        if (orden === 'votos') {
            sort = { likesCount: -1, createdAt: -1 }; // Actualizado a likesCount
        } else if (orden === 'tienda') {
            sort = { tienda: 1, createdAt: -1 };
        }

        // Populamos el creador para mostrar su nombre y avatar en el frontend
        const codigos = await Codigo.find(filtros)
            .sort(sort)
            .populate('creador', 'nombre avatar reputacion');
            
        res.json(codigos);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener los códigos', error: error.message });
    }
};

// Función: Crear un solo Código (Disparar Alerta)
exports.crearCodigo = async (req, res) => {
    try {
        const { codigo, tienda, categoria, descuento, descripcion } = req.body;
        
        // req.usuario viene del middleware 'auth'
        const creadorId = req.usuario ? req.usuario.id : null;

        const nuevoCodigo = new Codigo({
            codigo,
            tienda,
            categoria,
            descuento,
            descripcion,
            creador: creadorId, // Asignamos el creador
            likes: [],
            likesCount: 0
        });

        await nuevoCodigo.save();
        
        // Recompensa inmediata por crear contenido (+5 puntos)
        if (creadorId) {
            await Usuario.findByIdAndUpdate(creadorId, { $inc: { reputacion: 5 } });
        }

        // Disparador de Alerta
        dispararAlerta(nuevoCodigo); 

        res.status(201).json({ msg: 'Código creado exitosamente', codigo: nuevoCodigo });

    } catch (error) {
        res.status(500).json({ msg: 'Error al crear el código', error: error.message });
    }
};

// Función: Votar un Código (SISTEMA DE LIKES SOCIALES)
exports.votarCodigo = async (req, res) => {
    try {
        const { id } = req.params; // ID del cupón
        const usuarioId = req.usuario.id; // ID del usuario que vota

        const codigo = await Codigo.findById(id);
        if (!codigo) {
            return res.status(404).json({ msg: 'Código no encontrado' });
        }

        // Verificar si el usuario ya dio like (está en el array)
        const yaVoto = codigo.likes.includes(usuarioId);

        if (yaVoto) {
            // Si ya votó, QUITAMOS el like (Toggle Off)
            codigo.likes = codigo.likes.filter(uid => uid.toString() !== usuarioId);
            codigo.likesCount = Math.max(0, codigo.likesCount - 1);
            
            // Castigo de reputación al creador (revertir puntos)
            if (codigo.creador) {
                await Usuario.findByIdAndUpdate(codigo.creador, { $inc: { reputacion: -2 } });
            }
        } else {
            // Si no ha votado, AGREGAMOS el like (Toggle On)
            codigo.likes.push(usuarioId);
            codigo.likesCount += 1;

            // Premio de reputación al creador (+2 puntos)
            if (codigo.creador) {
                await Usuario.findByIdAndUpdate(codigo.creador, { $inc: { reputacion: 2 } });
            }
        }

        await codigo.save();

        // Devolvemos el estado actual para actualizar el frontend
        res.json({ 
            likesCount: codigo.likesCount, 
            yaVoto: !yaVoto, // Retorna el nuevo estado (si ahora tiene like o no)
            msg: yaVoto ? 'Like eliminado' : 'Like agregado' 
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al registrar el voto', error: error.message });
    }
};

// Función: Verificar un Código
exports.verificarCodigo = async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar marca el código y suma reputación extra
        const codigoActualizado = await Codigo.findByIdAndUpdate(
            id,
            { 
                $set: { verificado: true }, 
                $inc: { likesCount: 5 } // Bonificación visual de "5 likes" por verificación
            },
            { new: true }
        );

        if (!codigoActualizado) {
            return res.status(404).json({ msg: 'Código no encontrado' });
        }

        // Bonificación grande al creador por verificación oficial (+10 pts)
        if (codigoActualizado.creador) {
            await Usuario.findByIdAndUpdate(codigoActualizado.creador, { $inc: { reputacion: 10 } });
        }

        res.json({
            verificado: codigoActualizado.verificado,
            likesCount: codigoActualizado.likesCount,
            msg: 'Código verificado oficialmente. Reputación otorgada.'
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al verificar el código', error: error.message });
    }
};

// Función: Inserción Masiva del Scraper
exports.insertarCodigosScraper = async (req, res) => {
    try {
        const codigosArray = req.body;
        if (!Array.isArray(codigosArray) || codigosArray.length === 0) {
            return res.status(400).json({ msg: 'Debe enviar un array de códigos' });
        }

        // Mapeamos para asegurar estructura
        const codigosLimpios = codigosArray.map(c => ({
            ...c,
            likes: [],
            likesCount: 0,
            // Scraper no tiene creador usuario, o podríamos asignar un usuario "bot"
            creador: null 
        }));

        const resultado = await Codigo.insertMany(codigosLimpios);
        
        // Disparador de Alerta
        resultado.forEach(dispararAlerta); 

        res.status(201).json({ 
            msg: `Se insertaron ${resultado.length} códigos exitosamente.`, 
            count: resultado.length 
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error al insertar códigos del scraper', error: error.message });
    }
};