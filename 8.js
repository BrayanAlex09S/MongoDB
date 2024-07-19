// models/Pelicula.js
const mongoose = require('mongoose');

const peliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    genero: { type: String, required: true },
    duracion: { type: Number, required: true },
    clasificacion: { type: String, required: true }
});

const Pelicula = mongoose.model('Pelicula', peliculaSchema);
module.exports = Pelicula;

// models/Sala.js
const salaSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    capacidad: { type: Number, required: true },
    funciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Funcion' }]
});

const Sala = mongoose.model('Sala', salaSchema);
module.exports = Sala;

// models/Funcion.js
const funcionSchema = new mongoose.Schema({
    peliculaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Pelicula', required: true },
    salaID: { type: mongoose.Schema.Types.ObjectId, ref: 'Sala', required: true },
    horario: { type: Date, required: true }
});

const Funcion = mongoose.model('Funcion', funcionSchema);
module.exports = Funcion;

// models/Cliente.js
const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    boletos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Boleto' }]
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;

// models/Boleto.js
const boletoSchema = new mongoose.Schema({
    clienteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    funcionID: { type: mongoose.Schema.Types.ObjectId, ref: 'Funcion', required: true },
    asiento: { type: String, required: true },
    precio: { type: Number, required: true }
});

const Boleto = mongoose.model('Boleto', boletoSchema);
module.exports = Boleto;

// script.js
const mongoose = require('mongoose');
const Pelicula = require('./models/Pelicula');
const Sala = require('./models/Sala');
const Funcion = require('./models/Funcion');
const Cliente = require('./models/Cliente');
const Boleto = require('./models/Boleto');

mongoose.connect('mongodb://localhost:27017/cine', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const pelicula1 = new Pelicula({
            titulo: 'Avengers: Endgame',
            genero: 'Acción',
            duracion: 180,
            clasificacion: 'PG-13'
        });

        const pelicula2 = new Pelicula({
            titulo: 'Toy Story 4',
            genero: 'Animación',
            duracion: 100,
            clasificacion: 'G'
        });

        await Pelicula.insertMany([pelicula1, pelicula2]);

        const sala1 = new Sala({
            numero: 1,
            capacidad: 100
        });

        const sala2 = new Sala({
            numero: 2,
            capacidad: 200
        });

        await Sala.insertMany([sala1, sala2]);

        const funcion1 = new Funcion({
            peliculaID: pelicula1._id,
            salaID: sala1._id,
            horario: new Date()
        });

        await Funcion.insertMany([funcion1]);

        const cliente1 = new Cliente({
            nombre: 'Andrea Torres',
            correo: 'andrea.torres@example.com',
            telefono: '1234567890'
        });

        const cliente2 = new Cliente({
            nombre: 'Roberto Díaz',
            correo: 'roberto.diaz@example.com',
            telefono: '0987654321'
        });

        await Cliente.insertMany([cliente1, cliente2]);

        const boleto1 = new Boleto({
            clienteID: cliente1._id,
            funcionID: funcion1._id,
            asiento: 'A1',
            precio: 150
        });

        await Boleto.insertMany([boleto1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
