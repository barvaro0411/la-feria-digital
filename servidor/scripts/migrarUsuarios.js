const mongoose = require('mongoose');
require('dotenv').config();

async function migrarUsuarios() {
  try {
    console.log('🔄 Conectando a MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('usuarios');

    // Contar usuarios antes de la migración
    const count = await collection.countDocuments({ correo: { $exists: true } });
    console.log(`📊 Usuarios con campo "correo": ${count}`);

    if (count === 0) {
      console.log('✅ No hay usuarios para migrar');
      await mongoose.connection.close();
      process.exit(0);
    }

    // Renombrar campo "correo" a "email"
    const result = await collection.updateMany(
      { correo: { $exists: true } },
      { $rename: { correo: 'email' } }
    );

    console.log(`✅ ${result.modifiedCount} usuarios migrados de "correo" a "email"`);

    // Eliminar índice viejo
    try {
      await collection.dropIndex('correo_1');
      console.log('✅ Índice "correo_1" eliminado');
    } catch (error) {
      console.log('⚠️ Índice "correo_1" ya estaba eliminado');
    }

    // Crear índice nuevo
    try {
      await collection.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Índice "email_1" creado');
    } catch (error) {
      console.log('⚠️ Índice "email_1" ya existe');
    }

    // Verificar resultado
    const usuariosConEmail = await collection.countDocuments({ email: { $exists: true } });
    console.log(`✅ Verificación: ${usuariosConEmail} usuarios con campo "email"`);

    console.log('🎉 Migración completada exitosamente');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error en la migración:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

migrarUsuarios();
