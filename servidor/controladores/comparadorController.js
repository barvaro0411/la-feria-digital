// CÓDIGO para el NUEVO ARCHIVO: servidor/controladores/comparadorController.js

const Codigo = require('../modelos/Codigo'); 

// Función auxiliar para simular la aplicación del mejor cupón
const aplicarMejorCupon = (precio, codigosDisponibles) => {
    let mejorDescuento = 0;
    let mejorCodigo = null;

    if (!codigosDisponibles || codigosDisponibles.length === 0) {
        return { precioFinal: precio, codigoAplicado: null };
    }

    // Lógica simplificada: Encuentra el código con el mayor porcentaje (asume el formato "X% en...")
    for (const codigo of codigosDisponibles) {
        const match = codigo.descuento.match(/(\d+)%/);
        if (match) {
            const porcentaje = parseInt(match[1]);
            if (porcentaje > mejorDescuento) {
                mejorDescuento = porcentaje;
                mejorCodigo = codigo;
            }
        }
    }

    if (mejorCodigo) {
        const precioFinal = precio * (1 - (mejorDescuento / 100));
        return { 
            precioOriginal: precio,
            precioFinal: Math.round(precioFinal),
            codigoAplicado: mejorCodigo.codigo,
            descuentoAplicado: mejorDescuento + '%'
        };
    }

    return { 
        precioOriginal: precio,
        precioFinal: precio, 
        codigoAplicado: null,
        descuentoAplicado: '0%' 
    };
};


// Controlador principal para la búsqueda de precios
exports.buscarPrecios = async (req, res) => {
    const { producto, categoria } = req.query;

    if (!producto) {
        return res.status(400).json({ msg: 'Debe especificar un producto para comparar.' });
    }

    // 1. Simulación de Scraper/Base de Datos de Precios
    const resultadosBrutos = [
        {
            tienda: 'falabella',
            precio: Math.floor(Math.random() * 200000) + 50000,
            link: `https://www.falabella.cl/search?q=${producto}`,
            categoria: categoria || 'tecnologia'
        },
        {
            tienda: 'ripley',
            precio: Math.floor(Math.random() * 200000) + 60000,
            link: `https://www.ripley.cl/search?q=${producto}`,
            categoria: categoria || 'tecnologia'
        },
        {
            tienda: 'paris',
            precio: Math.floor(Math.random() * 200000) + 70000,
            link: `https://www.paris.cl/search?q=${producto}`,
            categoria: categoria || 'tecnologia'
        }
    ];

    // 2. Aplicar el Mejor Cupón de la Plataforma a cada resultado
    const resultadosFinales = [];

    for (const resultado of resultadosBrutos) {
        // Buscar el mejor cupón disponible para esta tienda y categoría
        const codigosDisponibles = await Codigo.find({ 
            tienda: resultado.tienda, 
            categoria: resultado.categoria,
            verificado: true // Solo aplicamos cupones verificados
        }).select('codigo descuento'); 
        
        const precioConCupon = aplicarMejorCupon(resultado.precio, codigosDisponibles);

        resultadosFinales.push({
            tienda: resultado.tienda,
            precioBruto: resultado.precio,
            link: resultado.link,
            ...precioConCupon
        });
    }

    // 3. Ordenar por precio final ascendente
    resultadosFinales.sort((a, b) => a.precioFinal - b.precioFinal);

    res.json({ producto, resultados: resultadosFinales });
};