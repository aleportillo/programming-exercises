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
        expenses: {}
    },
    {
        user: 'user2',
        password: '1234567',
        income: 0,
        movements : [],
        expenses: {}
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
    
    const basicOptions = [
        { value: 'addIncome', label: 'Agregar ingresos' },
        { value: 'addExpenses', label: 'Agregar gastos' },    
        { value: 'viewBalance', label: 'Ver finanzas' },    
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    
    switch(action){
        case 'addIncome': addIncome(); break;
        case 'addExpenses': addExpenses(); break;
        case 'viewBalance': viewBalance(); break;
        default: p.cancel('La opción seleccionada no está disponible'); bankMenu(); break;
    }
}

const addIncome = async () => {
    const amount = await p.text({
        message: 'Cuales son tus ingresos mensuales: ',
        validate(value) {
          if (isNaN(value)) return `El valor ingresado debe ser numerico`;
          if (value <= 0) return `El deposito debe ser mayor a $0`;
        },
    });
    
    s.start('Registrando ingresos'); 
    await sleep(300);
    
    currentUser.income = currentUser.income + Number(amount);
    currentUser.movements.push({
        text: `Ingreso de $${amount}`,
        type: 'income'
    });
    
    s.stop(color.green('Ingresos registrados correctamente :)'));
    
    backMenu();
}

const addExpenses = async () => {
    
    const expensesOptions = [
        { value: 'medicalExpenses', label: 'Medico' },
        { value: 'householdExpenses', label: 'Hogar' },
        { value: 'leisureExpenses', label: 'Ocio'},
        { value: 'savingsExpenses', label: 'Ahorro'},        
        { value: 'educationExpenses', label: 'Educacion'},        
    ]
    
    const action = await p.select({
        message: 'Ingrese el tipo de gasto que realizo',
        options: expensesOptions,
    });
    
    const amount = await p.text({
        message: 'Ingrese la cantidad gastada: ',
        validate(value) {
          if (isNaN(value)) return `El valor ingresado debe ser numerico`;
          if (value <= 0) return `El gasto debe ser mayor a $0`;
        },
    });
    
    s.start('Registrando gastos'); 
    await sleep(300);
    
    let message = '';
    if(!currentUser.expenses[action]) currentUser.expenses[action] = 0;
    currentUser.expenses[action] += Number(amount);
    
    if(amount < currentUser.income){
        message = color.green('Su salud financiera es buena :)');
    } else if (Number(amount) === currentUser.income){
        let majorExpense = Object.keys(currentUser.expenses).reduce((prev, curr) => { 
            return Number(currentUser.expenses[prev]) > Number(currentUser.expenses[curr]) ? prev : curr 
        }, 0);
        majorExpense = !majorExpense ? action : majorExpense;
        message = `Su salud financiera puede estar en riesgo, \nle aconsejamos disminuir gastos \n en el area de : ${majorExpense}`;
        message = color.yellow(message);
    } else {
        message = color.red('Su salud financiera esta en riesgo. Gasto mas de lo que gana');
    }
    
    currentUser.income -= Number(amount);
    
    const expenseName = expensesOptions.find(ex => ex.value === action).label;
    
    currentUser.movements.push({
        text: `Gasto ${expenseName.toLowerCase()} de $${amount}`,
        type: 'expense' 
    });
    
    s.stop(color.green('Gastos registrados correctamente :)'));
    
    p.note(message, `Notas`);
    
    backMenu();  
}

const viewBalance = async () =>{
    
    const balance = `Cantidad disponible: $${currentUser.income || 0}`;
    
    const totalAmount = Object.values(currentUser.expenses).reduce((prev, curr) => prev + Number(curr), 0);
    
    const totalExpenses = `Total de gastos: $${totalAmount || 0}`;
    
    let expenses = '-------- Gastos';
    
    expenses += `\nMedico: $${currentUser.expenses?.medicalExpenses || 0}`;
    expenses += `\nHogar: $${currentUser.expenses?.householdExpenses || 0}`;
    expenses += `\nOcio: $${currentUser.expenses?.leisureExpenses || 0}`;
    expenses += `\nAhorro: $${currentUser.expenses?.savingsExpenses || 0}`;
    expenses += `\nEducacion: $${currentUser.expenses?.educationExpenses || 0}`;
    
    let history = '-------- Historial \n';
    if(currentUser.movements.length){
        currentUser?.movements?.forEach( (action, idx )=> {
            history += `${idx + 1}. ${action.text}`;
            if(idx + 1 !== currentUser.movements.length) history += '\n';    
        });
    } else {
        history +='Aun no hay movimientos';
    }
    p.note(`${balance}\n${totalExpenses}\n\n${expenses}\n\n${history}`, `Cuenta de ${currentUser.user}`);
    backMenu();
}