// CÓDIGO para el NUEVO ARCHIVO: servidor/controladores/alertasController.js

const Alerta = require('../modelos/Alerta');

// Función: Obtener todas las suscripciones de un usuario
exports.obtenerSuscripciones = async (req, res) => {
    try {
        // req.usuario viene del middleware de autenticación (JWT)
        const suscripciones = await Alerta.find({ usuario: req.usuario.id }).select('categoria -_id');
        // Devuelve un array simple de categorías: ['tecnologia', 'deporte']
        const categoriasSuscritas = suscripciones.map(alerta => alerta.categoria);
        res.json(categoriasSuscritas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener suscripciones', error: error.message });
    }
};

// Función: Suscribir/Cancelar una categoría
exports.toggleSuscripcion = async (req, res) => {
    try {
        const { categoria } = req.body;
        const usuarioId = req.usuario.id;
        
        // Buscar si ya existe la suscripción
        const alertaExistente = await Alerta.findOne({ usuario: usuarioId, categoria });

        if (alertaExistente) {
            // Si existe, la eliminamos (cancelar suscripción)
            await Alerta.deleteOne({ _id: alertaExistente._id });
            return res.json({ msg: `Suscripción a ${categoria} cancelada.`, activa: false });
        } else {
            // Si no existe, la creamos (suscribirse)
            const nuevaAlerta = new Alerta({ usuario: usuarioId, categoria });
            await nuevaAlerta.save();
            return res.status(201).json({ msg: `Suscrito a ${categoria} correctamente.`, activa: true });
        }
    } catch (error) {
        res.status(500).json({ msg: 'Error al gestionar la suscripción', error: error.message });
    }
};