// models/Menu.js
const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    disponible: { type: Boolean, required: true }
});

const Menu = mongoose.model('Menu', menuSchema);
module.exports = Menu;

// models/Mesero.js
const meseroSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    turno: { type: String, required: true },
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }]
});

const Mesero = mongoose.model('Mesero', meseroSchema);
module.exports = Mesero;

// models/Pedido.js
const pedidoSchema = new mongoose.Schema({
    clienteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    meseroID: { type: mongoose.Schema.Types.ObjectId, ref: 'Mesero', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Menu', required: true }],
    total: { type: Number, required: true },
    fecha: { type: Date, default: Date.now }
});

const Pedido = mongoose.model('Pedido', pedidoSchema);
module.exports = Pedido;

// models/Cliente.js
const clienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    pedidos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Pedido' }]
});

const Cliente = mongoose.model('Cliente', clienteSchema);
module.exports = Cliente;

// script.js
const mongoose = require('mongoose');
const Menu = require('./models/Menu');
const Mesero = require('./models/Mesero');
const Pedido = require('./models/Pedido');
const Cliente = require('./models/Cliente');

mongoose.connect('mongodb://localhost:27017/restaurante', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const menu1 = new Menu({
            nombre: 'Hamburguesa',
            descripcion: 'Hamburguesa con queso y papas fritas',
            precio: 150,
            disponible: true
        });

        const menu2 = new Menu({
            nombre: 'Ensalada César',
            descripcion: 'Ensalada con pollo y aderezo César',
            precio: 100,
            disponible: true
        });

        await Menu.insertMany([menu1, menu2]);

        const mesero1 = new Mesero({
            nombre: 'Miguel Sánchez',
            turno: 'Mañana'
        });

        const mesero2 = new Mesero({
            nombre: 'Luisa Ramírez',
            turno: 'Tarde'
        });

        await Mesero.insertMany([mesero1, mesero2]);

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

        const pedido1 = new Pedido({
            clienteID: cliente1._id,
            meseroID: mesero1._id,
            items: [menu1._id],
            total: menu1.precio
        });

        await Pedido.insertMany([pedido1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
