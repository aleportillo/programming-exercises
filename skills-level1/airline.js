import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';

const services = {
    "destinations": ["Turquía", "Grecia", "Líbano", "España", "Portugal"],
    "conditions": ["Economía", "Primera Clase"],
    "additional_luggage": "Equipaje adicional disponible por un cargo extra",
    "meal_options": ["Regular", "Vegetariano", "Kosher"]
}

const allReservations = [];

const users = [
    {
        user: 'user1',
        password: '1234567',
        "attempts": {
            "max_attempts": 3,
            "failed_attempts": 0,
            "lock_after_failures": false
        },
        "reservations" : []
    },
    {
        user: 'user2',
        password: '1234567',
        "attempts": {
            "max_attempts": 3,
            "failed_attempts": 0,
            "lock_after_failures": false
        },
        "reservations" : []
    },
];

let currentUser = { };

const s = p.spinner();

export const mainAirline = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a la aerolina ◈')}`);
    
    const isUserExists = await loginUser();
    
    if(!isUserExists) return; 

    airlineMenu();
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
        
        currentUser = users.find(u => u.user === group.user && u.password === group.password) || {};
        
        if(Object.keys(currentUser).length){
            s.stop('Verificación exitosa!');
            return true;
        } else {
            const userAccount = users.find(u => u.user === group.user) || {};
            if(userAccount?.attempts){
                userAccount.attempts.failed_attempts ++;
                intents = userAccount.attempts.failed_attempts;
            } else {
                intents = 0;
            }
            s.stop('Credenciales incorrectas intenta nuevamente');
        }
        
        if(intents < 3){
            const isUserLeave = await selectOption('Desea salir: ', [{label: 'Si', value: true}, {label: 'No', value: false}]);
            
            if(isUserLeave) return false;
        }
        
    }
    
    p.cancel('El sistema se ha bloqueado por seguridad, contacta a un administrador')
    return false;
}

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}

const airlineMenu = async () => {
    
    const basicOptions = [
        { value: 'reserve', label: 'Hacer reservacion' },
        { value: 'show', label: 'Ver mis reservaciones' },       
        { value: 'logout', label: 'Salir' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    
    switch(action){
        case 'reserve': reserve(); break;
        case 'show': show(); break;
        case 'logout': logout(); break;
        default: p.cancel('La opción seleccionada no está disponible'); airlineMenu(); break;
    }
}

const reserve = async () => {
    const reservationData = {};
    
    let destinations = parseOptions(services.destinations);
    
    reservationData.destination = await selectOption('Destino: ', destinations);
    
    destinations = destinations.filter(des => des.value !== reservationData.destination)
    
    reservationData.origin = await selectOption('Origen: ', destinations);
    
    const dateRegExp = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{2}$/;
    
    reservationData.outbound_date = await p.text({
        message: 'Fecha de ida (00/00/00): ',
        validate(value) {
            if(!dateRegExp.test(value)) return 'Formato de fecha no valido';
        }
    });
    
    reservationData.return_date = await p.text({
        message: 'Fecha de regreso (00/00/00): ',
        validate(value) {
            const return_date = new Date(value).valueOf();
            const outbound_date = new Date(reservationData.outbound_date).valueOf();
            if( return_date < outbound_date  ) return 'La fecha de regreso debe ser posterior';
        }
    });
    
    reservationData.condition = await selectOption('Condicion: ', parseOptions(services.conditions));
    
    p.note('El bolso de mano no tiene costo, \npero puede agregar mas equipaje a su reserva', 'Equipaje');
    
    reservationData.additional_luggage = await selectOption('Desea agregar equipaje: ', [{label: 'Si', value: true}, {label: 'No', value: false}]);
    
    reservationData.meal = await selectOption('Comida durante el vuelo: ', parseOptions(services.meal_options));
    
    p.note('Ingrese los siguientes datos para finalizar', 'Informacion personal');
    
    reservationData.userData = await p.group({
        name: () => p.text({ message: 'Nombre: ' }), 
        passport: () => p.text({ message: 'Pasaporte: ' })
    });
    
    reservationData.userData.origin = reservationData.origin;
    reservationData.userData.destination = reservationData.destination;
    
    let printReservation = `Nombre: ${reservationData.userData.name}\n`;
    printReservation += `Pasaporte: ${reservationData.userData.passport }\n`;
    printReservation += `Pais Origen: ${reservationData.origin }\n`;
    printReservation += `Pais Destino: ${reservationData.destination }\n`;
    printReservation += `Tipo de vuelo: ${reservationData.condition }\n`;
    printReservation += `Tipo de comida: ${reservationData.meal }\n`;
    printReservation += `Equipaje extra : ${reservationData.additional_luggage ? 'Si' : 'No' }\n`;
    printReservation += color.yellow(`Boleto de salida: ${reservationData.outbound_date }\n`);
    printReservation += color.yellow(`Boleto de regreso : ${reservationData.return_date }\n`);
    
    p.note(printReservation, 'Resumen de la reservacion');
    
    const isUserAgree = await selectOption('Confirmar reservacion', [{label: 'Si', value: true}, {label: 'No', value: false}]);
    
    if(!isUserAgree){
        p.note('Reservacion cancelada', 'Cancelada');
        airlineMenu();
        return;
    }
    
    saveReservation(reservationData);
}

const show = () => {
    
    const userReservations = allReservations.filter(res => res.userid === currentUser.username);
    
    if(userReservations.length === 0){
        p.note('Aun no hay reservaciones', 'Mis reservaciones');
        airlineMenu();
        return;
    }
    
    let printReservation = '';
    
    userReservations.forEach((res, idx) => {
        printReservation += `Nombre: ${res.userData.name}\n`;
        printReservation += `Pasaporte: ${res.userData.passport }\n`;
        printReservation += `Pais Origen: ${res.origin }\n`;
        printReservation += `Pais Destino: ${res.destination }\n`;
        printReservation += `Tipo de vuelo: ${res.condition }\n`;
        printReservation += `Tipo de comida: ${res.meal }\n`;
        printReservation += `Equipaje extra : ${res.additional_luggage ? 'Si' : 'No' }\n`;
        printReservation += color.yellow(`Boleto de salida: ${res.outbound_date }\n`);
        printReservation += color.yellow(`Boleto de regreso : ${res.return_date }\n`);
        if(userReservations.length === idx  + 1) return;
        printReservation += '-----------------------------------------\n';
    })
    
    p.note(printReservation, 'Mis reservaciones')
    
    airlineMenu();
    
}

const saveReservation = (data) =>{
    data.id = getId();
    data.userid = currentUser.username;
    
    allReservations.push({...data});
    currentUser.reservations.push(data.id);
    
    p.note('Reservacion guardada', 'Reservacion');
    
    airlineMenu();
    
}

const getId = () => {
    return `${new Date().valueOf()}${Math.floor(Math.random())}`;
}

const selectOption = async (label, options) => {
    return await p.select({
        message: label,
        options: options,
    });
}

const parseOptions = (options) =>{
    return options.map(op => {
        return {            
            label: op,
            value: op
        }
    })
}
