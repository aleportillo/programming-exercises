import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';


/*
 *
 * Create an university enrollment system with the following characteristics:
 * - The system has a login with a username and password.
 * - Upon logging in, a menu displays the available programs: 
 *   Computer Science, Medicine, Marketing, and Arts.
 * - The user must input their first name, last name, and chosen program.
 * - Each program has only 5 available slots. The system will store the data of 
 *   each registered user, and if it exceeds the limit, it should display a message 
 *   indicating the program is unavailable.
 * - If login information is incorrect three times, the system should be locked.
 * - The user must choose a campus from three cities: London, Manchester, Liverpool.
 * - In London, there is 1 slot per program; in Manchester, there are 3 slots 
 *   per program, and in Liverpool, there is 1 slot per program.
 * - If the user selects a program at a campus that has no available slots, 
 *   the system should display the option to enroll in the program at another campus.
 *
 */

const users = [
    {
        user: 'user1',
        password: '1234567',
        name: 'John',
        lastName: 'Doe',
        programId: '',
        campus: ''
    },
    {
        user: 'user2',
        password: '1234567',
        name: 'John',
        lastName: 'Doe',
        programId: '',
        campus: ''
    }
];

const programs = {
    computer : {
        name: 'Computacion',
        campus: { london : 1, manchester: 3, liverpool: 1},
        students: []
    },
    medicine : {
        name: 'Medicina',
        campus: { london : 1, manchester: 3, liverpool: 1},
        students: []
    },
    marketing : {
        name: 'Marketing',
        campus: { london : 1, manchester: 3, liverpool: 1},
        students: []
    },
    arts: {
        name: 'Artes',
        campus: { london : 1, manchester: 3, liverpool: 1},
        students: []
    }
}

const s = p.spinner();

let currentUser = {};

export const mainUniversity = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a UNIVERSIDAD ◈')}`);

    const isUserExists = await loginUser();
    
    if(!isUserExists) return;
    
    p.note('Inicia el camino al exito', `Hola! ${currentUser.user}`);
    
    universityMenu();
}

const backMenu = async () => {
    const isUserBackMenu = await p.select({
        message: 'Deseas volver al menu?',
        options: [
          { value: true, label: 'Volver al menu' },
          { value: false, label: 'Salir' },
        ],
    });
    
    if(!isUserBackMenu){
        p.outro(color.cyan('Vuelve pronto :)'));
        return;
    }
    
    universityMenu();
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

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}

const universityMenu = async () => {
    
    const basicOptions = [
        { value: 'register', label: 'Registrarse a programa' },
        { value: 'logout', label: 'Salir del sistema' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    switch(action){
        case 'register': register(); break;
        case 'logout': logout(); break;
        default: p.cancel('La opción seleccionada no está disponible'); shippingMenu(); break;
    }
}

const register = async () => {
    
    if(currentUser.programId){
        p.note('Ya estas registrado en un programa', 'Error');
        backMenu();
    }
    
    const campusOptions = [
        { value: 'london', label : 'london' },
        { value: 'manchester', label : 'manchester' },
        { value: 'liverpool', label : 'liverpool' },
    ];
    
    const programOptions = [
        { value: 'computer', label : 'Computacion' },
        { value: 'medicine', label : 'Medicina' },
        { value: 'marketin', label : 'Marketing' },
        { value: 'arts', label : 'Artes' },
    ];
    
    const data = await p.group({
        name: () => p.text({ 
            message: 'Nombre: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }
        }), 
        lastName: () => p.text({ 
            message: 'Apellido: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }   
        }),
        program : () => p.select({
            message: 'Programa',
            options: programOptions
        })
    });
    
    if(programs[data.program].students.length === 5){
        p.note('Ya no hay cupos disponibles para ese programa', 'Error');
        backMenu();
    }
    
    data.campus = await p.select({
        message: 'Ingrese un campus',
        options: campusOptions
    });

    if(programs[data.program].campus[data.campus] === 0){
        p.note('Ya no hay cupos disponibles en ese campus', 'Error');
        backMenu();
    };
    
    s.start('Registrando datos'); 
    await sleep(300);
        
    programs[data.program].students.push(currentUser.user);
    programs[data.program].campus[data.campus] -= 1;
    
    currentUser.programId = data.program;
    currentUser.campus = data.campus;
    
    currentUser.name = data.name;
    currentUser.lastName = data.lastName;
        
    s.stop(color.green('Datos registrados :)'));
    
    backMenu();
}