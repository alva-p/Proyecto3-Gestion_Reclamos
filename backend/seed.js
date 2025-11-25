// Simple seeder for development
// Usage: set MONGO_URI=mongodb://localhost:27017/gestion_reclamos; node seed.js

require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_reclamos';

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to', MONGO_URI);

  const db = mongoose.connection.db;

  try {
    // Roles
    const rolesColl = db.collection('roles');
    const existingRoles = await rolesColl.find({ nombre: { $in: ['ADMIN', 'EMPLEADO', 'CLIENTE'] } }).toArray();
    if (existingRoles.length === 3) {
      console.log('Roles already exist');
    } else {
      const rolesToInsert = ['ADMIN', 'EMPLEADO', 'CLIENTE'].filter(r => !existingRoles.find(er => er.nombre === r)).map(r => ({ nombre: r }));
      if (rolesToInsert.length) {
        await rolesColl.insertMany(rolesToInsert);
        console.log('Inserted roles:', rolesToInsert.map(r => r.nombre));
      }
    }

    // Areas
    const areasColl = db.collection('areas');
    let soporte = await areasColl.findOne({ nombre: 'Soporte' });
    if (!soporte) {
      const res = await areasColl.insertOne({ nombre: 'Soporte' });
      soporte = { _id: res.insertedId, nombre: 'Soporte' };
      console.log('Created area Soporte');
    } else {
      console.log('Area Soporte already exists');
    }

    // Subareas
    const subareasColl = db.collection('subareas');
    let dbas = await subareasColl.findOne({ nombre: 'DBAs', area: soporte._id });
    if (!dbas) {
      const res = await subareasColl.insertOne({ nombre: 'DBAs', area: soporte._id });
      dbas = { _id: res.insertedId, nombre: 'DBAs' };
      console.log('Created subarea DBAs under Soporte');
    } else {
      console.log('Subarea DBAs already exists');
    }

    console.log('Seed finished');
  } catch (err) {
    console.error('Seed error', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
