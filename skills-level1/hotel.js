import * as p from '@clack/prompts';
import color from 'picocolors';

/*
 *
 * The RH Hotels chain has hired you to design the booking algorithm for their mobile application:
 * - Login; it should be locked after the third failed attempt.
 * - The RH Hotels chain exists in 5 countries: Spain, France, Portugal, Italy, and Germany.
 * - Each country has its own hotels located in: Madrid, Barcelona, Valencia, Munich, Berlin, Rome, Milan, 
 *   Paris, Marseille, Madeira, Lisbon, and Porto.
 * - All hotels have 24 rooms each: 6 VIP suites, 3 single rooms, 6 double rooms, 6 group rooms, and 3 luxury suites.
 * - The user can make reservations at any time of the year and at any hour, and book as many rooms as desired.
 * - Single rooms are priced at $100 per night, double rooms at $200 per night, group rooms at $350 per 
 *   night, VIP suites at $450 per night, and luxury suites at $550 per night, applicable
 *   at any time of the year.
 * The algorithm functions as follows: Login, choose country, choose city, choose room type, select 
 * the number of nights, collect user data (name, surname, ID/passport), print the total cost, and if 
 * the user agrees, print a confirmation message for the reservation. If not, return to the main menu.
 *
 */


const hotels = [
    {
        "name": "Spain",
        "hotels": [
            {
                "city": "Madrid",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Barcelona",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Valencia",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            }
        ]
    },
    {
        "name": "France",
        "hotels": [
            {
                "city": "Paris",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Marseille",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            }
        ]
    },
    {
        "name": "Portugal",
        "hotels": [
            {
                "city": "Madeira",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Lisbon",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Porto",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            }
        ]
    },
    {
        "name": "Italy",
        "hotels": [
            {
                "city": "Rome",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Milan",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            }
        ]
    },
    {
        "name": "Germany",
        "hotels": [
            {
                "city": "Munich",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            },
            {
                "city": "Berlin",
                "rooms": [
                    {
                        "type": "single",
                        "available": 3,
                        "price_per_night": 100
                    },
                    {
                        "type": "double",
                        "available": 6,
                        "price_per_night": 200
                    },
                    {
                        "type": "group",
                        "available": 6,
                        "price_per_night": 350
                    },
                    {
                        "type": "vip",
                        "available": 6,
                        "price_per_night": 450
                    },
                    {
                        "type": "luxury",
                        "available": 3,
                        "price_per_night": 550
                    }
                ]
            }
        ]
    }
];

const users = [
    {
        user: 'user1',
        password: '1234567',
        reservations: []
    },
    {
        user: 'user2',
        password: '1234567',
        reservations: []
    },
];

let currentUser = {};

const s = p.spinner();

export const mainHotel = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a RH Hotels ◈')}`);
    
    const isUserExists = await loginUser();
    
    if(!isUserExists) return;

    hotelMenu();
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
            intents ++;
            s.stop('Credenciales incorrectas intenta nuevamente');
        }
    }
    
    p.cancel('El sistema se ha bloqueado por seguridad, contacta a un administrador')
    return false;
}

const hotelMenu = async () => {
    
    const basicOptions = [
        { value: 'create', label: 'Hacer reservacion' },
        { value: 'show', label: 'Ver mis reservaciones' },       
        { value: 'logout', label: 'Salir' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    
    switch(action){
        case 'create': create(); break;
        case 'show': show(); break;
        default: p.cancel('La opción seleccionada no está disponible'); shippingMenu(); break;
    }
}

const create = async () => {

    const countryOptions = hotels.map((country, idx) => { return {
        ...country,
        label: country.name,
        value: idx, 
    }});
    
    const countryIdx = await p.select({
        message: 'En que pais quieres reservar?',
        options: countryOptions,
    });
    
    const cityOptions = countryOptions[countryIdx].hotels.map((city, idx) => { return {
        ...city,
        label: city.city,
        value: idx,
    }});
    
    const cityIdx = await p.select({
        message: 'En que ciudad quieres reservar?',
        options: cityOptions,
    });
    
    const roomOptions = cityOptions[cityIdx].rooms.map((room, idx) => { return {
        ...room,
        label: room.type,
        value: idx,
    }});
    
    const roomIdx = await p.select({
        message: 'Que tipo de habitacion desea?',
        options: roomOptions,
    });
    
    if(roomOptions[roomIdx].available === 0) {
        p.note('No hay habitaciones disponibles', 'Oops');
        hotelMenu();  
        return;
    }
    
    const numberNights = await p.text({
        message: 'Numero de noches',
        validate(value) {
            if (!value) return `Debes ingresar un dato`;
            if (isNaN(value)) return `Debes ingresar un numero`;
            if (value%1!==0) return `Debes ingresar un valor valido`;
        } 
    });
    
    let message = `Datos de la reservacion:`;
    message += `\nLugar: ${countryOptions[countryIdx].name}, ${cityOptions[cityIdx].city}`;
    message += `\nHabitacionn: ${roomOptions[roomIdx].type}`;
    message += `\nNoches: ${numberNights}`;
    message += `\nTotal: ${numberNights * roomOptions[roomIdx].price_per_night}`;
    
    p.note(message, 'Resume');
    
    const isUserAgree = await p.select({
        message: 'Confirmar reservacion',
        options: [
            {value: true, label: 'Si' },
            {value: false, label: 'No' }
        ]
    });
    
    if(!isUserAgree){
        p.note('Reservacion cancelada', 'Confirmacion');
        hotelMenu();
        return;
    }
    
    currentUser.reservations.push(
        {
            country: countryOptions[countryIdx].name,
            city: cityOptions[cityIdx].city,
            room: roomOptions[roomIdx].type,
            nights: numberNights,
            totalPrice: numberNights * roomOptions[roomIdx].price_per_night
        }
    );
    
    hotels[countryIdx].hotels[cityIdx].rooms[roomIdx].available --;

    p.note('Reservacion hecha exitosamente', 'Confirmacion');
    hotelMenu();
}

const show = async () => {
    
    let message = `Total de reservaciones: ${currentUser.reservations.length}\n`;
    
    if(currentUser.reservations.length !== 0){
        currentUser.reservations.forEach((res, idx) =>{
            message += `\nLugar: ${res.country}, ${res.city}`;
            message += `\nHabitacion: ${res.room}`;
            message += `\nNoches: ${res.nights}`;
            message += `\nTotal: ${res.totalPrice}`;
            if(idx + 1 === currentUser.reservations.length) return;
            message += '\n---------------------------';
        })
    }
    
    p.note(message, 'Resume');
    
    hotelMenu();    
}