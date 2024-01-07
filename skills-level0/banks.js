import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';


/*
 *
 *  Create an online banking system with the following features:
 *  - Users must be able to log in with a username and password.
 *  - If the user enters the wrong credentials three times, the system must lock them out.
 *  - The initial balance in the bank account is $2000.
 *  - The system must allow users to deposit, withdraw, view, and transfer money.
 *  - The system must display a menu for users to perform transactions.
 * 
 */

const users = [
    {
        user: 'user1',
        password: '1234567',
        balance: 2000,
        movements : [],
        type: 'admin'
    },
    {
        user: 'user2',
        password: '1234567',
        balance: 2000,
        movements : [],
        type: 'user'
    },
];

const s = p.spinner();

let currentUser = {};

export const mainBank = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a BANCANET ◈')}`);

    const isUserExists = await loginUser();
    
    if(!isUserExists) return;
    
    p.note('Bienvenido a BANCANET', `Hola! ${currentUser.user}`);
    
    bankMenu();
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
    
    bankMenu();
}

const bankMenu = async () => {
    
    const userOptions = [
        { value: 'deposit', label: 'Depositar' },
        { value: 'withdraw', label: 'Retirar' },
        { value: 'view', label: 'Ver balance e historial'},
        { value: 'transfer', label: 'Transferir'},        
    ]
    
    if(currentUser.type === 'admin') userOptions.push({
        value: 'newUser', label: 'Crear nuevo usuario'
    });
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: userOptions,
    });
    
    switch(action){
        case 'deposit': depositMoney(); break;
        case 'withdraw': withdrawMoney(); break;
        case 'view': viewMoney(); break;
        case 'transfer': transferMoney(); break;
        case 'newUser': newUser(); break;
        default: p.cancel('La opción seleccionada no está disponible'); bankMenu(); break;
    }
    
}

const depositMoney = async () => {
    const amount = await p.text({
        message: 'Ingresa la cantidad a depositar: ',
        validate(value) {
          if (isNaN(value)) return `El valor ingresado debe ser numerico`;
          if (value <= 0) return `El deposito debe ser mayor a $0`;
        },
    });
    
    s.start('Realizando el deposito'); 
    await sleep(300);
    
    currentUser.balance = currentUser.balance + Number(amount);
    currentUser.movements.push({
        text: `Deposito de $${amount}`,
        type: 'deposit'
    });
    
    s.stop(color.green('Deposito realizado correctamente :)'));
    
    backMenu();
}

const viewMoney = async () => {
    
    const balance = `Cantidad disponible: $${currentUser.balance}`;
    
    let history = 'Historial de movimientos \n';
    
    if(currentUser.movements.length){
        currentUser?.movements?.forEach( (action, idx )=> {
            history += `${idx + 1}. ${action.text}`;
            if(idx + 1 !== currentUser.movements.length) history += '\n';    
        });
    } else {
        history +='Aun no hay movimientos';
    }
    
    p.note(`${balance}\n\n${history}`, `Cuenta de ${currentUser.user}`);
    
    backMenu();
}

const withdrawMoney = async () => {
    const amount = await p.text({
        message: 'Ingresa la cantidad a retirar: ',
        validate(value) {
          if (isNaN(value)) return `El valor ingresado debe ser numerico`;
          if (value <= 0) return `El retiro debe ser mayor a $0`;
          if (value > currentUser.balance) return `Fondos insuficientes`;
        },
    });
    
    s.start('Realizando el retiro'); 
    await sleep(300);
    
    currentUser.balance = currentUser.balance - Number(amount);
    currentUser.movements.push({
        text: `Retiro de $${amount}`,
        type: 'withdraw'
    });
    
    s.stop(color.green('Retiro realizado correctamente :)'));
    
    backMenu();
}

const transferMoney = async () => {
    
    let toUser = await p.text({
        message: 'Ingresa el usuario a transferir: ',
        validate(value) {
            if (!value) return `Debes ingresar el usuario`;
            if (value === currentUser.user) return `Ingresa un usuario distinto al tuyo`;
            if (users.every(u => u.user != value)) return `Ingresa un usuario valido`;
        },
    });
    
    const amount = await p.text({
        message: 'Ingresa el monto a transferir: ',
        validate(value) {
            if (isNaN(value)) return `El valor ingresado debe ser numerico`;
            if (value <= 0) return `La transferencia debe ser mayor a $0`;
            if (value > currentUser.balance) return `Fondos insuficientes`;
        },
    });
    
    toUser = users.find(u => u.user === toUser);
    
    s.start('Realizando el retiro'); 
    await sleep(300);
    
    currentUser.balance = currentUser.balance - Number(amount);
    toUser.balance = toUser.balance + Number(amount);
    
    currentUser.movements.push({
        text: `Transferencia de $${amount} a ${toUser.user}`,
        type: 'transfer'
    });
    
    toUser.movements.push({
        text: `Transferencia de $${amount} de ${currentUser.user}`,
        type: 'transfer'
    });
    
    s.stop(color.green('Transferencia realizada correctamente :)'));
    
    backMenu();
}

const newUser = async () => {
    
    const newUserData = await p.group({
        user: () => p.text({ message: 'Usuario: ' }), 
        password: () => p.text({ message: 'Contraseña: ' })
    });
    
    users.push({
        ...newUserData,
        balance: 2000,
        movements: [],
        type: 'user'
    });
    
    backMenu();
    
}