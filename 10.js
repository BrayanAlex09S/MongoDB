// models/Plato.js
const mongoose = require('mongoose');

const platoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    categoria: { type: String, required: true }
});

const Plato = mongoose.model('Plato', platoSchema);
module.exports = Plato;

// models/Categoria.js
const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;

// models/Cliente.js
const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    ordenes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Orden' }]
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;

// models/Orden.js
const ordenSchema = new mongoose.Schema({
    clienteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    platos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Plato', required: true }],
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

const Orden = mongoose.model('Orden', ordenSchema);
module.exports = Orden;

// script.js
const mongoose = require('mongoose');
const Plato = require('./models/Plato');
const Categoria = require('./models/Categoria');
const Cliente = require('./models/Cliente');
const Orden = require('./models/Orden');

mongoose.connect('mongodb://localhost:27017/restaurante', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const categoria1 = new Categoria({
            nombre: 'Entradas',
            descripcion: 'Platos para iniciar la comida'
        });

        const categoria2 = new Categoria({
            nombre: 'Platos Principales',
            descripcion: 'Platos fuertes para el almuerzo o cena'
        });

        await Categoria.insertMany([categoria1, categoria2]);

        const plato1 = new Plato({
            nombre: 'Ensalada César',
            descripcion: 'Ensalada con lechuga, pollo, crutones y aderezo César',
            precio: 150,
            categoria: categoria1.nombre
        });

        const plato2 = new Plato({
            nombre: 'Filete de Res',
            descripcion: 'Filete de res a la parrilla con guarnición de papas',
            precio: 350,
            categoria: categoria2.nombre
        });

        await Plato.insertMany([plato1, plato2]);

        const cliente1 = new Cliente({
            nombre: 'Carlos Fernández',
            correo: 'carlos.fernandez@example.com',
            telefono: '1234567890'
        });

        const cliente2 = new Cliente({
            nombre: 'Laura Rodríguez',
            correo: 'laura.rodriguez@example.com',
            telefono: '0987654321'
        });

        await Cliente.insertMany([cliente1, cliente2]);

        const orden1 = new Orden({
            clienteID: cliente1._id,
            platos: [plato1._id, plato2._id],
            total: plato1.precio + plato2.precio,
            fecha: new Date()
        });

        await Orden.insertMany([orden1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
