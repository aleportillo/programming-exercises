import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';


/*
 *
 * Create a currency converter between CLP, ARS, USD, EUR, TRY, GBP with the following features:
 * - The user must choose their initial currency and the currency they want to exchange to.
 * - The user can choose whether or not to withdraw their funds. If they choose not to withdraw, 
 *   it should return to the main menu.
 * - If the user decides to withdraw the funds, the system will charge a 1% commission.
 * - Set a minimum and maximum amount for each currency, it can be of your choice.
 * - The system should ask the user if they want to perform another operation. 
 *   If they choose to do so, it should restart the process; otherwise, the system should close.
 */

const users = [
    {
        user: 'user1',
        password: '1234567',
        balance : {},
    },
    {
        user: 'user2',
        password: '1234567',
        balance : {},
    },
];

const s = p.spinner();

let currentUser = {};

const converterInfo = {
    CLP: { CLP: 1, ARS: 0.023, USD: 0.0013, TRY: 0.011, GBP: 0.0011, MIN: 50, MAX: 500 },
    ARS: { CLP: 43.47, ARS: 1, USD: 0.056, TRY: 0.48, GBP: 0.047, MIN: 50, MAX: 500 },
    USD: { CLP: 767.95, ARS: 17.8, USD: 1, TRY: 8.58, GBP: 0.85, MIN: 50, MAX: 500 },
    EUR: { CLP: 674.85, ARS: 15.63, USD: 0.89, TRY: 7.64, GBP: 0.75, MIN: 50, MAX: 500 },
    TRY: { CLP: 87.63, ARS: 2.03, USD: 0.12, TRY: 1, GBP: 0.098, MIN: 50, MAX: 500 },
    GBP: { CLP: 907.24, ARS: 21.02, USD: 1.19, TRY: 10.22, GBP: 1, MIN: 50, MAX: 500 },
};

export const mainConverter = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a CASA DE CAMBIO ◈')}`);

    const isUserExists = await loginUser();
    
    if(!isUserExists) return;
    
    p.note('Convierta su moneda a su moneda deseada', `Hola! ${currentUser.user}`);
    
    converterMenu();
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
    
    converterMenu();
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

const converterMenu = async () => {
    
    const basicOptions = [
        { value: 'add', label: 'Agregar fondos' },
        { value: 'converter', label: 'Cambiar fondos' },
        { value: 'view', label: 'Ver balance' },
        { value: 'logout', label: 'Salir del sistema' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    switch(action){
        case 'add': add(); break;
        case 'logout': logout(); break;
        case 'converter': converter(); break;
        case 'view': view(); break;
        default: p.cancel('La opción seleccionada no está disponible'); shippingMenu(); break;
    }
}

const add = async () => {
    const currencyOption = [
        {value: 'CLP', label: 'CLP'},
        {value: 'ARS', label: 'ARS'},
        {value: 'USD', label: 'USD'},
        {value: 'EUR', label: 'EUR'},
        {value: 'TRY', label: 'TRY'},
        {value: 'GBP', label: 'GBP'}
    ]
    
    const typeCurrency = await p.select({ 
        message: 'Selecciona el tipo de moneda',
        options: currencyOption,
    });
    
    const amount = await p.text({
        message: 'Registrar fondos: ',
        validate(value) {
          if (isNaN(value)) return `El valor ingresado debe ser numerico`;
          if (value <= 0) return `El numero debe ser mayor a $0`;
        },
    });
    
    if(!currentUser.balance[typeCurrency]) currentUser.balance[typeCurrency] = 0;
    
    s.start('Registrando fondos'); 
    await sleep(300);
    
    currentUser.balance[typeCurrency] += Number(amount);
    
    s.stop(color.green('Fondos registrados correctamente :)'));
    
    backMenu();
};

const view = () => {

    let message = `CLP: $${ currentUser.balance.CLP || 0 } \n`;
    message += `ARS: $${ currentUser.balance.ARS || 0 } \n`;
    message += `USD: $${ currentUser.balance.USD || 0 } \n`;
    message += `EUR: $${ currentUser.balance.EUR || 0 }\n`;
    message += `TRY: $${ currentUser.balance.TRY || 0 }\n`;
    message += `GBP: $${ currentUser.balance.GBP || 0 }\n`;
    
    p.note(message,`Fondos de ${currentUser.user}`);
    
    backMenu();
}

const converter = async () => {
    
    const currencyOption = [
        {value: 'CLP', label: 'CLP'},
        {value: 'ARS', label: 'ARS'},
        {value: 'USD', label: 'USD'},
        {value: 'EUR', label: 'EUR'},
        {value: 'TRY', label: 'TRY'},
        {value: 'GBP', label: 'GBP'}
    ]
    
    const dataConverter = await p.group({
        initialCurrency: () => p.select({ 
            message: 'Moneda inicial ',
            options: currencyOption,
        }), 
        exchangeCurrency: () => p.select({ 
            message: 'Moneda a cambiar: ',
            options: currencyOption,   
        }),
    });
    
    dataConverter.amountCurrency = await p.text({
        message: 'Ingrese la cantidad a cambiar',
        validate(value) {
            if (isNaN(value)) return `El valor ingresado debe ser numerico`;
            if (value <= 0) return `El valor debe ser mayor a $0`;
            if (value < converterInfo[dataConverter.initialCurrency].MIN) 
                return `El minimo a cambiar es de ${converterInfo[dataConverter.initialCurrency].MIN}`;
            if (value > converterInfo[dataConverter.initialCurrency].MAX) 
                return `El maximo a cambiar es de ${converterInfo[dataConverter.initialCurrency].MAX}`;
        }
    })
    
    const commission = dataConverter.amountCurrency * 0.01;
    if(currentUser.balance[dataConverter.initialCurrency] + commission < dataConverter.amountCurrency){
        p.note('No hay fondos suficientes para hacer la conversion (incluye comision)', 'Error');
        backMenu();
        return;
    }
    
    const moneyConvert = dataConverter.amountCurrency / converterInfo[dataConverter.initialCurrency][dataConverter.exchangeCurrency];
    
    const getMoney = await p.select({
       message: `Van a ser ${moneyConvert} ${dataConverter.exchangeCurrency}\n Con comision de ${commission}\n Desea retirar los fondos`,
       options: [
        { value: true, label: 'Si' },
        { value: false, label: 'No' },
      ],
    });
    
    if(getMoney){
        s.start('Registrando gastos'); 
        await sleep(300);
        currentUser.balance[dataConverter.initialCurrency] -= dataConverter.amountCurrency;
        currentUser.balance[dataConverter.initialCurrency] -= commission;
        s.stop(color.green('Fondos retirados :)'));
    }
    
    backMenu();
};