// models/Miembro.js
const mongoose = require('mongoose');

const miembroSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    correo: { type: String, required: true },
    telefono: { type: String, required: true },
    inscripciones: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Inscripcion' }]
});

const Miembro = mongoose.model('Miembro', miembroSchema);
module.exports = Miembro;

// models/Clase.js
const claseSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    horario: { type: String, required: true },
    instructorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', required: true }
});

const Clase = mongoose.model('Clase', claseSchema);
module.exports = Clase;

// models/Instructor.js
const instructorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    clases: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Clase' }]
});

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;

// models/Inscripcion.js
const inscripcionSchema = new mongoose.Schema({
    miembroID: { type: mongoose.Schema.Types.ObjectId, ref: 'Miembro', required: true },
    claseID: { type: mongoose.Schema.Types.ObjectId, ref: 'Clase', required: true },
    fechaInscripcion: { type: Date, required: true }
});

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);
module.exports = Inscripcion;

// script.js
const mongoose = require('mongoose');
const Miembro = require('./models/Miembro');
const Clase = require('./models/Clase');
const Instructor = require('./models/Instructor');
const Inscripcion = require('./models/Inscripcion');

mongoose.connect('mongodb://localhost:27017/gimnasio', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const instructor1 = new Instructor({
            nombre: 'Juan Pérez',
            especialidad: 'Yoga'
        });

        const instructor2 = new Instructor({
            nombre: 'María López',
            especialidad: 'Crossfit'
        });

        await Instructor.insertMany([instructor1, instructor2]);

        const clase1 = new Clase({
            nombre: 'Yoga para principiantes',
            descripcion: 'Clase de yoga para principiantes',
            horario: 'Lunes y Miércoles 8-9 AM',
            instructorID: instructor1._id
        });

        const clase2 = new Clase({
            nombre: 'Crossfit avanzado',
            descripcion: 'Clase de crossfit para avanzados',
            horario: 'Martes y Jueves 6-7 PM',
            instructorID: instructor2._id
        });

        await Clase.insertMany([clase1, clase2]);

        const miembro1 = new Miembro({
            nombre: 'Carlos Fernández',
            correo: 'carlos.fernandez@example.com',
            telefono: '1234567890'
        });

        const miembro2 = new Miembro({
            nombre: 'Laura Rodríguez',
            correo: 'laura.rodriguez@example.com',
            telefono: '0987654321'
        });

        await Miembro.insertMany([miembro1, miembro2]);

        const inscripcion1 = new Inscripcion({
            miembroID: miembro1._id,
            claseID: clase1._id,
            fechaInscripcion: new Date()
        });

        await Inscripcion.insertMany([inscripcion1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
