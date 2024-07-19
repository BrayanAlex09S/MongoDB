// models/Paciente.js
const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    edad: { type: Number, required: true },
    historialMedico: { type: String, required: true },
    citas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Cita' }]
});

const Paciente = mongoose.model('Paciente', pacienteSchema);
module.exports = Paciente;

// models/Doctor.js
const doctorSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    especialidad: { type: String, required: true },
    horarios: [{ type: String, required: true }]
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;

// models/Cita.js
const citaSchema = new mongoose.Schema({
    pacienteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
    doctorID: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    fecha: { type: Date, required: true },
    motivo: { type: String, required: true }
});

const Cita = mongoose.model('Cita', citaSchema);
module.exports = Cita;

// models/Tratamiento.js
const tratamientoSchema = new mongoose.Schema({
    pacienteID: { type: mongoose.Schema.Types.ObjectId, ref: 'Paciente', required: true },
    descripcion: { type: String, required: true },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true }
});

const Tratamiento = mongoose.model('Tratamiento', tratamientoSchema);
module.exports = Tratamiento;

// script.js
const mongoose = require('mongoose');
const Paciente = require('./models/Paciente');
const Doctor = require('./models/Doctor');
const Cita = require('./models/Cita');
const Tratamiento = require('./models/Tratamiento');

mongoose.connect('mongodb://localhost:27017/hospital', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('Conectado a MongoDB');
        
        const doctor1 = new Doctor({
            nombre: 'Dr. Juan Pérez',
            especialidad: 'Cardiología',
            horarios: ['Lunes 9-12', 'Miércoles 9-12']
        });

        const doctor2 = new Doctor({
            nombre: 'Dra. María Gómez',
            especialidad: 'Pediatría',
            horarios: ['Martes 14-17', 'Jueves 14-17']
        });

        await Doctor.insertMany([doctor1, doctor2]);

        const paciente1 = new Paciente({
            nombre: 'Carlos Fernández',
            edad: 45,
            historialMedico: 'Hipertensión'
        });

        const paciente2 = new Paciente({
            nombre: 'Laura Rodríguez',
            edad: 30,
            historialMedico: 'Diabetes'
        });

        await Paciente.insertMany([paciente1, paciente2]);

        const cita1 = new Cita({
            pacienteID: paciente1._id,
            doctorID: doctor1._id,
            fecha: new Date(),
            motivo: 'Chequeo de rutina'
        });

        await Cita.insertMany([cita1]);

        const tratamiento1 = new Tratamiento({
            pacienteID: paciente2._id,
            descripcion: 'Tratamiento para diabetes',
            fechaInicio: new Date(),
            fechaFin: new Date(new Date().setMonth(new Date().getMonth() + 3))
        });

        await Tratamiento.insertMany([tratamiento1]);

        console.log('Datos insertados');
        mongoose.connection.close();
    })
    .catch(err => {
        console.error('Error al conectar a MongoDB', err);
    });
