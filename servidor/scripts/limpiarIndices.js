const mongoose = require('mongoose');
require('dotenv').config();

async function limpiarIndices() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    
    // Listar todas las colecciones
    const collections = await db.listCollections().toArray();
    console.log('📦 Colecciones encontradas:', collections.map(c => c.name));

    // Buscar la colección de usuarios
    const usuariosCollection = collections.find(c => 
      c.name === 'usuarios' || c.name === 'Usuarios'
    );

    if (!usuariosCollection) {
      console.log('⚠️ No se encontró la colección de usuarios');
      process.exit(0);
    }

    const collection = db.collection(usuariosCollection.name);

    // Listar índices actuales
    const indices = await collection.indexes();
    console.log('📊 Índices actuales:', indices);

    // Eliminar índice viejo de "correo" si existe
    try {
      await collection.dropIndex('correo_1');
      console.log('✅ Índice "correo_1" eliminado');
    } catch (error) {
      console.log('⚠️ Índice "correo_1" no existe o ya fue eliminado');
    }

    // Crear índice nuevo de "email" si no existe
    try {
      await collection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Índice "email_1" creado');
    } catch (error) {
      console.log('⚠️ Índice "email_1" ya existe');
    }

    console.log('✅ Limpieza completada exitosamente');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

limpiarIndices();
