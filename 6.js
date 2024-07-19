// models/Habitacion.js
const mongoose = require('mongoose');

const habitacionSchema = new mongoose.Schema({
    numero: { type: String, required: true },
    tipo: { type: String, required: true },
    precioPorNoche: { type: Number, required: true },
    disponible: { type: Boolean, required: true }
});

const Habitacion = mongoose.model('Habitacion', habitacionSchema);
module.exports = Habitacion;

// models/Huesped.js
const huespedSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    reservas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reserva' }]
});

const Huesped = mongoose.model('Huesped', huespedSchema);
module.exports = Huesped;

// models/Reserva.js
const reservaSchema = new mongoose.Schema({
    huespedID: { type: mongoose.Schema.Types.ObjectId, ref: 'Huesped', required: true },
    habitacionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Habitacion', required: true },
    fechaEntrada: { type: Date, required: true },
    fechaSalida: { type: Date, required: true }
});

const Reserva = mongoose.model('Reserva', reservaSchema);
module.exports = Reserva;

// models/Servicio.js
const servicioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true }
});

const Servicio = mongoose.model('Servicio', servicioSchema);
module.exports = Servicio;

// script.js
const mongoose = require('mongoose');
const Habitacion = require('./models/Habitacion');
const Huesped = require('./models/Huesped');
const Reserva = require('./models/Reserva');
const Servicio = require('./models/Servicio');

mongoose.connect('mongodb://localhost:27017/hotel', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const habitacion1 = new Habitacion({
            numero: '101',
            tipo: 'Individual',
            precioPorNoche: 100,
            disponible: true
        });

        const habitacion2 = new Habitacion({
            numero: '202',
            tipo: 'Doble',
            precioPorNoche: 200,
            disponible: true
        });

        await Habitacion.insertMany([habitacion1, habitacion2]);

        const huesped1 = new Huesped({
            nombre: 'Andrea Torres',
            correo: 'andrea.torres@example.com',
            telefono: '1234567890'
        });

        const huesped2 = new Huesped({
            nombre: 'Roberto Díaz',
            correo: 'roberto.diaz@example.com',
            telefono: '0987654321'
        });

        await Huesped.insertMany([huesped1, huesped2]);

        const reserva1 = new Reserva({
            huespedID: huesped1._id,
            habitacionID: habitacion1._id,
            fechaEntrada: new Date(),
            fechaSalida: new Date(new Date().setDate(new Date().getDate() + 2))
        });

        await Reserva.insertMany([reserva1]);

        const servicio1 = new Servicio({
            nombre: 'Spa',
            descripcion: 'Acceso al spa del hotel',
            precio: 50
        });

        const servicio2 = new Servicio({
            nombre: 'Desayuno',
            descripcion: 'Desayuno buffet',
            precio: 15
        });

        await Servicio.insertMany([servicio1, servicio2]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
