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

export const mainHotel = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a RH Hotels ◈')}`);

    hotelMenu();
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
        // case 'top': top(); break;
        // case 'compare': compare(); break;
        // case 'close': logout(); break;
        default: p.cancel('La opción seleccionada no está disponible'); shippingMenu(); break;
    }
}

const create = async () => {

    const countryOptions = hotels.map(country => { return {
        ...country,
        label: country.name,
        value: country 
    }});
    
    const country = await p.select({
        message: 'En que pais quieres reservar?',
        options: countryOptions,
    });

    // console.log(country.hotels);
    
    const cityOptions = country.hotels.map(city => { return {
        ...city,
        label: city.city,
        value: city 
    }});
    
    const city = await p.select({
        message: 'En que ciudad quieres reservar?',
        options: cityOptions,
    });
    
    const roomOptions = city.rooms.map(room => { return {
        ...room,
        label: room.type,
        value: room 
    }});
    
    const room = await p.select({
        message: 'Que tipo de habitacion desea?',
        options: roomOptions,
    });
    
    // console.log(room);
    
    if(room.available === 0) {
        console.log('Oops');
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
    message += `\nLugar: ${country.name}, ${city.city}`;
    message += `\nHabitacionn: ${room.type}`;
    message += `\nNoches: ${numberNights}`;
    message += `\nTotal: ${numberNights * room.price_per_night}`;
    
    p.note(message, 'Resume');
    
    const isUserAgree = await p.select({
        message: 'Confirmar reservacion',
        options: [
            {value: true, label: 'Si' },
            {value: false, label: 'No' }
        ]
    });
    
    if(!isUserAgree){
        hotelMenu();
        return;
    }
    
}