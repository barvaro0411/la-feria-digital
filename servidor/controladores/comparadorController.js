// CÓDIGO para: servidor/controladores/comparadorController.js

const Codigo = require('../modelos/Codigo'); 

// Función auxiliar para simular la aplicación del mejor cupón
const aplicarMejorCupon = (precio, codigosDisponibles) => {
    let mejorDescuento = 0;
    let mejorCodigo = null;

    if (!codigosDisponibles || codigosDisponibles.length === 0) {
        return { precioFinal: precio, codigoAplicado: null };
    }

    // Lógica simplificada: Encuentra el código con el mayor porcentaje
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

    // 1. Simulación de Scraper (DATOS ESTÁTICOS DE EJEMPLO, NO RANDOM)
    // Esto genera confianza al mostrar precios consistentes durante la demo.
    
    // Precio base simulado según la longitud del nombre del producto (para variar sin ser random)
    const precioBase = producto.length * 10000 + 50000; 

    const resultadosBrutos = [
        {
            tienda: 'falabella',
            precio: precioBase, 
            link: `https://www.falabella.cl/search?q=${producto}`,
            categoria: categoria || 'tecnologia'
        },
        {
            tienda: 'ripley',
            precio: precioBase + 15000, // Siempre un poco más caro en este ejemplo
            link: `https://www.ripley.cl/search?q=${producto}`,
            categoria: categoria || 'tecnologia'
        },
        {
            tienda: 'paris',
            precio: precioBase - 5000, // Siempre un poco más barato
            link: `https://www.paris.cl/search?q=${producto}`,
            categoria: categoria || 'tecnologia'
        }
    ];

    // 2. Aplicar el Mejor Cupón de la Plataforma a cada resultado
    const resultadosFinales = [];

    for (const resultado of resultadosBrutos) {
        // Buscar el mejor cupón disponible en BD para esta tienda y categoría
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

    // 3. Ordenar por precio final ascendente (el más barato primero)
    resultadosFinales.sort((a, b) => a.precioFinal - b.precioFinal);

    res.json({ producto, resultados: resultadosFinales });
};