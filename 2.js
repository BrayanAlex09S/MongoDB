// models/Estudiante.js
const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    grado: { type: String, required: true },
    cursos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }]
});

const Estudiante = mongoose.model('Estudiante', estudianteSchema);
module.exports = Estudiante;

// models/Profesor.js
const profesorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    cursos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Curso' }]
});

const Profesor = mongoose.model('Profesor', profesorSchema);
module.exports = Profesor;

// models/Curso.js
const cursoSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    profesorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Profesor', required: true },
    estudiantes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante' }]
});

const Curso = mongoose.model('Curso', cursoSchema);
module.exports = Curso;

// models/Inscripcion.js
const inscripcionSchema = new mongoose.Schema({
    estudianteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Estudiante', required: true },
    cursoID: { type: mongoose.Schema.Types.ObjectId, ref: 'Curso', required: true },
    fechaInscripcion: { type: Date, required: true }
});

const Inscripcion = mongoose.model('Inscripcion', inscripcionSchema);
module.exports = Inscripcion;

// script.js
const mongoose = require('mongoose');
const Estudiante = require('./models/Estudiante');
const Profesor = require('./models/Profesor');
const Curso = require('./models/Curso');
const Inscripcion = require('./models/Inscripcion');

mongoose.connect('mongodb://localhost:27017/escolar', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const profesor1 = new Profesor({
            nombre: 'Ana Gómez',
            especialidad: 'Matemáticas'
        });

        const profesor2 = new Profesor({
            nombre: 'Luis Martínez',
            especialidad: 'Historia'
        });

        await Profesor.insertMany([profesor1, profesor2]);

        const curso1 = new Curso({
            nombre: 'Álgebra',
            descripcion: 'Curso de álgebra básica',
            profesorID: profesor1._id
        });

        const curso2 = new Curso({
            nombre: 'Historia Mundial',
            descripcion: 'Curso de historia mundial',
            profesorID: profesor2._id
        });

        await Curso.insertMany([curso1, curso2]);

        const estudiante1 = new Estudiante({
            nombre: 'Carlos Fernández',
            edad: 15,
            grado: '10°',
            cursos: [curso1._id]
        });

        const estudiante2 = new Estudiante({
            nombre: 'Laura Rodríguez',
            edad: 16,
            grado: '11°',
            cursos: [curso2._id]
        });

        await Estudiante.insertMany([estudiante1, estudiante2]);

        const inscripcion1 = new Inscripcion({
            estudianteID: estudiante1._id,
            cursoID: curso1._id,
            fechaInscripcion: new Date()
        });

        await Inscripcion.insertMany([inscripcion1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
