import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';


/*
 *
 *  Develop a finance management application with the following features:
 * 	- The user records their total income.
 * 	- There are categories: Medical expenses, household expenses, leisure, savings, and education.
 * 	- The user can list their expenses within the categories and get the total for each category.
 * 	- The user can obtain the total of their expenses.
 * 	- If the user spends the same amount of money they earn, the system should display a message advising the user to reduce expenses in the category where they have spent the most money.
 * 	- If the user spends less than they earn, the system displays a congratulatory message on the screen.
 * 	- If the user spends more than they earn, the system will display advice to improve the user's financial health.
 * 
 */

const users = [
    {
        user: 'user1',
        password: '1234567',
        income: 0,
        movements : [],
    },
    {
        user: 'user2',
        password: '1234567',
        income: 0,
        movements : [],
    },
];

const s = p.spinner();

let currentUser = {};

export const mainFinance = async () => {
    p.intro(`${color.cyan('◈ Bienvenido al programa de finanzas ◈')}`);

    const isUserExists = await loginUser();
    
    if(!isUserExists) return;
    
    p.note('Maneje sus finanzas correctamente', `Hola! ${currentUser.user}`);
    
    financeMenu();
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

const financeMenu = async () => {
    
    const userOptions = [
        { value: 'addIncome', label: 'Agregar ingresos' },
        { value: 'addExpenses', label: 'Agregar gastos' },    
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: userOptions,
    });
    
}