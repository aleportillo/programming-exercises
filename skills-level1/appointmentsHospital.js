import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';

/*
 *
 * The Valencia Hospital is developing an application to manage appointments. 
 * Design an algorithm for this application with the following features:
 * 
 * - It must have a login and validate the data; after the third failed attempt, it should be locked.
 * - The user can schedule an appointment for: 
 *   General Medicine, Emergency Care, Clinical Analysis, Cardiology, Neurology, 
 *   Nutrition, Physiotherapy, Traumatology, and Internal Medicine. There are 3 doctors for each specialty.
 * - The user can only book one appointment per specialist. An error message 
 *   should be displayed if the user tries to choose two appointments with the 
 *   same doctor or the same specialty. As a developer, you can choose the doctors' names.
 * - The maximum limit for appointments, in general, is 3.
 * - Upon selecting a specialty, it will display if the user prefers a morning 
 *   or afternoon appointment and show available hours. As a developer, 
 *   you can choose the hours.
 * - Display available specialists.
 * - The user can choose their preferred specialist.
 * - The basic process is: Login -> Choose specialty -> Choose doctor -> Choose time slot.
 *
 */

const hospitalData = [
    {
      "specialty": "Medicina General",
      "doctors": [
        {
          "name": "Dr. Juan Pérez",
          "schedules": ["Lunes 9:00 - 12:00", "Miércoles 14:00 - 17:00", "Viernes 10:00 - 13:00"]
        },
        {
          "name": "Dra. Ana Rodríguez",
          "schedules": ["Martes 8:00 - 11:00", "Jueves 16:00 - 19:00", "Sábado 9:00 - 12:00"]
        },
        {
          "name": "Dr. Carlos Gómez",
          "schedules": ["Lunes 14:00 - 17:00", "Miércoles 10:00 - 13:00", "Viernes 8:00 - 11:00"]
        }
      ]
    },
    {
      "specialty": "Urgencias",
      "doctors": [
        {
          "name": "Dr. Laura Martínez",
          "schedules": ["Lunes 18:00 - 21:00", "Miércoles 12:00 - 15:00", "Viernes 17:00 - 20:00"]
        },
        {
          "name": "Dr. Andrés Sánchez",
          "schedules": ["Martes 9:00 - 12:00", "Jueves 15:00 - 18:00", "Sábado 10:00 - 13:00"]
        },
        {
          "name": "Dra. Javier García",
          "schedules": ["Lunes 10:00 - 13:00", "Miércoles 16:00 - 19:00", "Viernes 9:00 - 12:00"]
        }
      ]
    },
    {
      "specialty": "Análisis Clínicos",
      "doctors": [
        {
          "name": "Dra. María López",
          "schedules": ["Martes 14:00 - 17:00", "Jueves 10:00 - 13:00", "Sábado 11:00 - 14:00"]
        },
        {
          "name": "Dr. Pablo Hernández",
          "schedules": ["Lunes 16:00 - 19:00", "Miércoles 8:00 - 11:00", "Viernes 14:00 - 17:00"]
        },
        {
          "name": "Dra. Sergio Torres",
          "schedules": ["Martes 12:00 - 15:00", "Jueves 18:00 - 21:00", "Sábado 12:00 - 15:00"]
        }
      ]
    },
    {
      "specialty": "Cardiología",
      "doctors": [
        {
          "name": "Dr. Martín González",
          "schedules": ["Lunes 9:00 - 12:00", "Miércoles 15:00 - 18:00", "Viernes 13:00 - 16:00"]
        },
        {
          "name": "Dra. Isabel Ramírez",
          "schedules": ["Martes 11:00 - 14:00", "Jueves 9:00 - 12:00", "Sábado 14:00 - 17:00"]
        },
        {
          "name": "Dr. Ana Jiménez",
          "schedules": ["Lunes 13:00 - 16:00", "Miércoles 11:00 - 14:00", "Viernes 16:00 - 19:00"]
        }
      ]
    },
    {
      "specialty": "Neurología",
      "doctors": [
        {
          "name": "Dra. Laura Herrera",
          "schedules": ["Martes 10:00 - 13:00", "Jueves 14:00 - 17:00", "Sábado 13:00 - 16:00"]
        },
        {
          "name": "Dr. Alejandro Ruiz",
          "schedules": ["Lunes 14:00 - 17:00", "Miércoles 9:00 - 12:00", "Viernes 12:00 - 15:00"]
        },
        {
          "name": "Dra. Daniel Flores",
          "schedules": ["Martes 16:00 - 19:00", "Jueves 11:00 - 14:00", "Sábado 14:00 - 17:00"]
        }
      ]
    },
    {
      "specialty": "Nutrición",
      "doctors": [
        {
          "name": "Dra. Patricia Castro",
          "schedules": ["Lunes 10:00 - 13:00", "Miércoles 14:00 - 17:00", "Viernes 9:00 - 12:00"]
        },
        {
          "name": "Dr. Francisco Mendoza",
          "schedules": ["Martes 8:00 - 11:00", "Jueves 13:00 - 16:00", "Sábado 11:00 - 14:00"]
        },
        {
          "name": "Dra. Eduardo López",
          "schedules": ["Lunes 16:00 - 19:00", "Miércoles 12:00 - 15:00", "Viernes 10:00 - 13:00"]
        }
      ]
    },
    {
      "specialty": "Fisioterapia",
      "doctors": [
        {
          "name": "Dr. Carlos Soto",
          "schedules": ["Martes 14:00 - 17:00", "Jueves 10:00 - 13:00", "Sábado 12:00 - 15:00"]
        },
        {
          "name": "Dra. Sofia Ortega",
          "schedules": ["Lunes 8:00 - 11:00", "Miércoles 16:00 - 19:00", "Viernes 11:00 - 14:00"]
        },
        {
          "name": "Dr. Natalia Ramírez",
          "schedules": ["Martes 12:00 - 15:00", "Jueves 14:00 - 17:00", "Sábado 9:00 - 12:00"]
        }
      ]
    },
    {
      "specialty": "Traumatología",
      "doctors": [
        {
          "name": "Dra. Beatriz González",
          "schedules": ["Lunes 13:00 - 16:00", "Miércoles 11:00 - 14:00", "Viernes 16:00 - 19:00"]
        },
        {
          "name": "Dr. Ricardo Moreno",
          "schedules": ["Martes 9:00 - 12:00", "Jueves 15:00 - 18:00", "Sábado 10:00 - 13:00"]
        },
        {
          "name": "Dra. Luisa Sánchez",
          "schedules": ["Lunes 18:00 - 21:00", "Miércoles 14:00 - 17:00", "Viernes 17:00 - 20:00"]
        }
      ]
    },
    {
      "specialty": "Medicina Interna",
      "doctors": [
        {
          "name": "Dr. Javier García",
          "schedules": ["Martes 10:00 - 13:00", "Jueves 16:00 - 19:00", "Sábado 9:00 - 12:00"]
        },
        {
          "name": "Dra. Claudia Martínez",
          "schedules": ["Lunes 8:00 - 11:00", "Miércoles 12:00 - 15:00", "Viernes 11:00 - 14:00"]
        },
        {
          "name": "Dr. Manuel Soto",
          "schedules": ["Martes 14:00 - 17:00", "Jueves 10:00 - 13:00", "Sábado 13:00 - 16:00"]
        }
      ]
    }
]

const users = [
    {
        user: 'user1',
        password: '1234567',
        appointmentsId: [],
    },
    {
        user: 'user2',
        password: '1234567',
        appointmentsId: [],
    },
];

const allApointments = [];

let currentUser = {};

const s = p.spinner();

export const mainHospital = async () => {
    p.intro(`${color.cyan('◈ Bienvenido al hospital de Valencia ◈')}`);
    
    const isUserExists = await loginUser();
    
    if(!isUserExists) return;
    
    hospitalMenu();
}

const hospitalMenu = async () => {
    
    
    const basicOptions = [
        { value: 'register', label: 'Registrar una cita' },
        { value: 'logout', label: 'Salir del sistema' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    switch(action){
        case 'register': createAppointment(); break;
        case 'logout': logout(); break;
        default: p.cancel('La opción seleccionada no está disponible'); hospitalMenu(); break;
    }
    
}

const loginUser = async () => {

    p.intro('Ingresa las credenciales para acceder al sistema');

    let intents = 0;

    while (intents < 3){
        const group = await p.group({
            user: () => p.text({ message: 'Usuario: ' }), 
            password: () => p.text({ message: 'Contraseña: ' })
        });
        
        s.start('Verificando credenciales'); 
        await sleep(300);
        
        currentUser = users.find(u => u.user === group.user && u.password === group.password) || {};
        
        if(Object.keys(currentUser).length){
            s.stop('Verificación exitosa!');
            return true;
        } else {
            intents ++;
            s.stop('Credenciales incorrectas intenta nuevamente');
        }
    }
    
    p.cancel('El sistema se ha bloqueado por seguridad, contacta a un administrador')
    return false;
}

const createAppointment = async () =>{
    if(currentUser.appointmentsId.length === 3){
        p.note('Llego al maximo de citas, no puede agendar mas', 'Error');
        hospitalMenu();
        return;
    }
    
    currentUser.appointments = allApointments?.filter(app => app.user === currentUser.user);
    
    const specialty = await selectedSpecialty();
    const doctor = await selectedDoctor(specialty.doctors);
    const schedule = await selectedSchedule(doctor.schedules);
    
    const appointment = {
        specialty: specialty.specialty,
        doctor: doctor.name,
        schedule,
        _id: getId,
        user: currentUser.user
    }
    
    allApointments.push(appointment);
    
    currentUser.appointmentsId.push(appointment._id);
    
    p.note('La cita se registro correctamente', 'Felicidades');
    
    hospitalMenu();
}

const selectedSpecialty = async () => {
    
    const userSpecialty = currentUser.appointments?.map(app => app.specialty);

    const specialtyParse = 
        structuredClone(hospitalData).map(spec => {
            return {
                ...spec,
                label: spec.specialty,
                value: spec
            }
        }).filter(spec => !userSpecialty.includes(spec.label));
    
    return await p.select({
        message: 'Selecciona una de las especialidades disponibles',
        options: specialtyParse,
    });
}

const selectedDoctor = async (doctors) => {
    const userDoctor = currentUser.appointments?.map(app => app.doctor);
    const doctorsParse = structuredClone(doctors).map(doctor => {
        return {
            ...doctor,
            label: doctor.name,
            value: doctor
        }
    }).filter(spec => !userDoctor.includes(spec.label));
    
    return await p.select({
        message: 'Selecciona uno de los doctores disponibles',
        options: doctorsParse,
    });
}

const selectedSchedule = async (schedules) => {
    const userSchedule = currentUser.appointments?.map(app => app.schedule);
    const schedulesParse = structuredClone(schedules).map(schedule => {
        return {
            ...schedule,
            label: schedule,
            value: schedule
        }
    }).filter(spec => !userSchedule.includes(spec.label));
    
    return await p.select({
        message: 'Selecciona uno de los horarios disponibles',
        options: schedulesParse,
    });
}

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}

const getId = () => {
    return `${new Date().valueOf()}`;
}