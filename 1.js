// models/Libro.js
const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    autorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true },
    genero: { type: String, required: true },
    fechaPublicacion: { type: Date, required: true },
    disponible: { type: Boolean, required: true }
});

const Libro = mongoose.model('Libro', libroSchema);
module.exports = Libro;

// models/Autor.js
const autorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    nacionalidad: { type: String, required: true },
    fechaNacimiento: { type: Date, required: true },
    libros: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Libro' }]
});

const Autor = mongoose.model('Autor', autorSchema);
module.exports = Autor;

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

// script.js
const mongoose = require('mongoose');
const Libro = require('./models/Libro');
const Autor = require('./models/Autor');
const Usuario = require('./models/Usuario');
const Prestamo = require('./models/Prestamo');

mongoose.connect('mongodb://localhost:27017/biblioteca', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const autor1 = new Autor({
            nombre: 'Gabriel García Márquez',
            nacionalidad: 'Colombiana',
            fechaNacimiento: new Date('1927-03-06')
        });

        const autor2 = new Autor({
            nombre: 'J.K. Rowling',
            nacionalidad: 'Británica',
            fechaNacimiento: new Date('1965-07-31')
        });

        await Autor.insertMany([autor1, autor2]);

        const libro1 = new Libro({
            titulo: 'Cien Años de Soledad',
            autorID: autor1._id,
            genero: 'Realismo mágico',
            fechaPublicacion: new Date('1967-05-30'),
            disponible: true
        });

        const libro2 = new Libro({
            titulo: 'Harry Potter y la Piedra Filosofal',
            autorID: autor2._id,
            genero: 'Fantasía',
            fechaPublicacion: new Date('1997-06-26'),
            disponible: true
        });

        await Libro.insertMany([libro1, libro2]);

        const usuario1 = new Usuario({
            nombre: 'Juan Pérez',
            correo: 'juan.perez@example.com',
            telefono: '1234567890'
        });

        const usuario2 = new Usuario({
            nombre: 'María López',
            correo: 'maria.lopez@example.com',
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
