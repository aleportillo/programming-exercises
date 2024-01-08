import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';


/*
 *
 * Create an online shipping system with the following features:
 * - The system has a login that locks after the third failed attempt.
 * - Display a menu that allows: Sending a package, exiting the system.
 * - To send a package, sender and recipient details are required.
 * - The system assigns a random package number to each sent package.
 * - The system calculates the shipping price. $2 per kg.
 * - The user must input the total weight of their package, and the system should display the amount to pay.
 * - The system should ask if the user wants to perform another operation. If the answer is yes, it should return to the main menu. If it's no, it should close the system.
 *
 */

const users = [
    {
        user: 'user1',
        password: '1234567',
        shipping : [],
    },
    {
        user: 'user2',
        password: '1234567',
        shipping : [],
    },
];

const s = p.spinner();

let currentUser = {};

export const mainShipping = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a ENVIOS.com ◈')}`);

    const isUserExists = await loginUser();
    
    if(!isUserExists) return;
    
    p.note('Envios.com realiza envios internacionales', `Hola! ${currentUser.user}`);
    
    shippingMenu();
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
    
    shippingMenu();
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

const shippingMenu = async () => {
    
    const basicOptions = [
        { value: 'sending', label: 'Enviar un paquete' },
        { value: 'view', label: 'Ver envios' },
        { value: 'logout', label: 'Salir del sistema' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    
    switch(action){
        case 'sending': sending(); break;
        case 'logout': logout(); break;
        case 'view': view(); break;
        default: p.cancel('La opción seleccionada no está disponible'); shippingMenu(); break;
    }
}

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}

const sending = async () => {
    const recipient = await p.group({
        name: () => p.text({ 
            message: 'Nombre del detinatario: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }
        }), 
        lastname: () => p.text({ 
            message: 'Apellido del detinatario: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }    
        }),
        address: () => p.text({ 
            message: 'Direccion del detinatario: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }
        })
    });
    
    const sender = await p.group({
        name: () => p.text({ 
            message: 'Nombre del remitente: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }
        }), 
        lastname: () => p.text({ 
            message: 'Apellido del remitente: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }       
        }),
        address: () => p.text({ 
            message: 'Direccion del remitente: ',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
            }     
        })
    });
    
    const pack = await p.group({
        weight : () => p.text({ 
            message: 'Peso del paquete: ',
            validate(value) {
                if (isNaN(value)) return `El valor ingresado debe ser numerico`;
                if (value <= 0) return `El deposito debe ser mayor a $0`;
            }
        }), 
        fragile: () => p.select({ 
            message: 'El paquete es fragil: ',
            options: [
                {label: 'Si', value: true},
                {label: 'No', value: false}
            ]
        })
    });
    
    let message = `De: ${sender.name} ${sender.lastname} \n`;
    message += `Envio desde : ${sender.address} \n`;
    message += `Para: ${recipient.name} ${recipient.lastname} \n`;
    message += `Envio a : ${recipient.address }\n`;
    message += `\nPaquete de : ${pack.weight }kg\n`;
    message += `Paquete fragil : ${pack.fragile ? 'Si' : 'No' }\n`;
    message += `Precio de envio : $${pack.weight / 2 }\n`;
    
    p.note(message,'Resumen del envio')
    
    const isPackSending = await p.select({ 
        message: 'Desea realizar el envio',
        options: [
            {label: 'Si', value: true},
            {label: 'No', value: false}
        ]
    });
    
    if(!isPackSending){
        backMenu();
        return;
    } 
    
    s.start('Registrando envio'); 
    await sleep(300);
    
    pack.id = getId();
    
    currentUser.shipping.push(
        {
            sender: sender,
            recipient: recipient,
            pack: pack
        }
    );
    
    s.stop(color.green('Envio registrado correctamente :)'));
    
    backMenu();
}

const getId = () => {
    return `${new Date().valueOf()}${Math.floor(Math.random())}`;
}

const view = () => {
    
    if(!currentUser.shipping.length){
        p.note('Aun no se realizan envios','Envios realizados');
        backMenu();
    }
    
    let message = '';
    currentUser.shipping?.forEach((element, idx )=> { 
        const {sender, recipient, pack} = element; 
        message += `ID DEL ENVIO: ${pack.id}\n`;      
        message += `De: ${sender.name} ${sender.lastname} \n`;
        message += `Envio desde : ${sender.address} \n`;
        message += `Para: ${recipient.name} ${recipient.lastname} \n`;
        message += `Envio a : ${recipient.address }\n`;
        message += `\nPaquete de : ${pack.weight }kg\n`;
        message += `Paquete fragil : ${pack.fragile ? 'Si' : 'No' }\n`;
        message += `Precio de envio : $${pack.weight / 2 }\n`;
        if(idx+1 === currentUser.shipping.length) return;
        message += `\n------------------------------------\n\n`;
    });
    
    p.note(message,'Envios realizados');
    backMenu();
}