// models/Vehiculo.js
const mongoose = require('mongoose');

const vehiculoSchema = new mongoose.Schema({
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    año: { type: Number, required: true },
    clienteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    reparaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reparacion' }]
});

const Vehiculo = mongoose.model('Vehiculo', vehiculoSchema);
module.exports = Vehiculo;

// models/Cliente.js
const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    vehiculos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo' }]
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;

// models/Mecanico.js
const mecanicoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    reparaciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reparacion' }]
});

const Mecanico = mongoose.model('Mecanico', mecanicoSchema);
module.exports = Mecanico;

// models/Reparacion.js
const reparacionSchema = new mongoose.Schema({
    vehiculoID: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehiculo', required: true },
    mecanicoID: { type: mongoose.Schema.Types.ObjectId, ref: 'Mecanico', required: true },
    descripcion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true }
});

const Reparacion = mongoose.model('Reparacion', reparacionSchema);
module.exports = Reparacion;

// script.js
const mongoose = require('mongoose');
const Vehiculo = require('./models/Vehiculo');
const Cliente = require('./models/Cliente');
const Mecanico = require('./models/Mecanico');
const Reparacion = require('./models/Reparacion');

mongoose.connect('mongodb://localhost:27017/taller', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const cliente1 = new Cliente({
            nombre: 'Ana López',
            correo: 'ana.lopez@example.com',
            telefono: '1234567890'
        });

        const cliente2 = new Cliente({
            nombre: 'Jorge Martínez',
            correo: 'jorge.martinez@example.com',
            telefono: '0987654321'
        });

        await Cliente.insertMany([cliente1, cliente2]);

        const vehiculo1 = new Vehiculo({
            marca: 'Toyota',
            modelo: 'Corolla',
            año: 2020,
            clienteID: cliente1._id
        });

        const vehiculo2 = new Vehiculo({
            marca: 'Honda',
            modelo: 'Civic',
            año: 2018,
            clienteID: cliente2._id
        });

        await Vehiculo.insertMany([vehiculo1, vehiculo2]);

        const mecanico1 = new Mecanico({
            nombre: 'Carlos Ramírez',
            especialidad: 'Motores'
        });

        const mecanico2 = new Mecanico({
            nombre: 'Luisa Fernández',
            especialidad: 'Transmisiones'
        });

        await Mecanico.insertMany([mecanico1, mecanico2]);

        const reparacion1 = new Reparacion({
            vehiculoID: vehiculo1._id,
            mecanicoID: mecanico1._id,
            descripcion: 'Cambio de aceite',
            fechaInicio: new Date(),
            fechaFin: new Date(new Date().setDate(new Date().getDate() + 1))
        });

        await Reparacion.insertMany([reparacion1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
