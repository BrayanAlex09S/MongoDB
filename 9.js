// models/Libro.js
const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    isbn: { type: String, required: true },
    categoria: { type: String, required: true },
    disponible: { type: Boolean, required: true }
});

const Libro = mongoose.model('Libro', libroSchema);
module.exports = Libro;

// models/Usuario.js
const usuarioSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    prestamos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Prestamo' }]
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
module.exports = Usuario;

// models/Prestamo.js
const prestamoSchema = new mongoose.Schema({
    usuarioID: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    libroID: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro', required: true },
    fechaPrestamo: { type: Date, required: true },
    fechaDevolucion: { type: Date, required: true }
});

const Prestamo = mongoose.model('Prestamo', prestamoSchema);
module.exports = Prestamo;

// models/Categoria.js
const categoriaSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;

// script.js
const mongoose = require('mongoose');
const Libro = require('./models/Libro');
const Usuario = require('./models/Usuario');
const Prestamo = require('./models/Prestamo');
const Categoria = require('./models/Categoria');

mongoose.connect('mongodb://localhost:27017/biblioteca', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const categoria1 = new Categoria({
            nombre: 'Ciencia Ficción',
            descripcion: 'Libros de ciencia ficción'
        });

        const categoria2 = new Categoria({
            nombre: 'Romance',
            descripcion: 'Libros de romance'
        });

        await Categoria.insertMany([categoria1, categoria2]);

        const libro1 = new Libro({
            titulo: 'Dune',
            autor: 'Frank Herbert',
            isbn: '9780441013593',
            categoria: categoria1.nombre,
            disponible: true
        });

        const libro2 = new Libro({
            titulo: 'Orgullo y Prejuicio',
            autor: 'Jane Austen',
            isbn: '9780141439518',
            categoria: categoria2.nombre,
            disponible: true
        });

        await Libro.insertMany([libro1, libro2]);

        const usuario1 = new Usuario({
            nombre: 'Carlos Fernández',
            correo: 'carlos.fernandez@example.com',
            telefono: '1234567890'
        });

        const usuario2 = new Usuario({
            nombre: 'Laura Rodríguez',
            correo: 'laura.rodriguez@example.com',
            telefono: '0987654321'
        });

        await Usuario.insertMany([usuario1, usuario2]);

        const prestamo1 = new Prestamo({
            usuarioID: usuario1._id,
            libroID: libro1._id,
            fechaPrestamo: new Date(),
            fechaDevolucion: new Date(new Date().setDate(new Date().getDate() + 14))
        });

        await Prestamo.insertMany([prestamo1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
