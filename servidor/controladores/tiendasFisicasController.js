// CÓDIGO para el NUEVO ARCHIVO: servidor/controladores/tiendasFisicasController.js

const TiendaFisica = require('../modelos/TiendaFisica');

// Función: Obtener todas las tiendas físicas
exports.obtenerTiendas = async (req, res) => {
    try {
        // En una aplicación real, aquí podrías usar un filtro $near para buscar
        // tiendas cerca de una coordenada, pero por simplicidad, obtenemos todas.
        const tiendas = await TiendaFisica.find();
        res.json(tiendas);
    } catch (error) {
        res.status(500).json({ msg: 'Error al obtener tiendas físicas', error: error.message });
    }
};

// Función de ejemplo para inicializar tiendas (solo para desarrollo)
exports.insertarTiendasDemo = async (req, res) => {
    try {
        const tiendasDemo = [
            {
                nombre: "Paris Mall Plaza Vespucio",
                tienda: "paris",
                direccion: "Av. Vicuña Mackenna 7110, La Florida",
                ubicacion: {
                    type: 'Point',
                    coordinates: [-70.5898, -33.5113] // [Longitud, Latitud]
                }
            },
            {
                nombre: "Falabella Costanera Center",
                tienda: "falabella",
                direccion: "Av. Andrés Bello 2447, Providencia",
                ubicacion: {
                    type: 'Point',
                    coordinates: [-70.6053, -33.4217]
                }
            }
        ];
        
        await TiendaFisica.deleteMany({}); // Limpiar antes de insertar
        const resultado = await TiendaFisica.insertMany(tiendasDemo);
        res.status(201).json({ msg: `Se insertaron ${resultado.length} tiendas demo.` });
    } catch (error) {
        res.status(500).json({ msg: 'Error al insertar tiendas demo', error: error.message });
    }
};