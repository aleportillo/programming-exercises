import * as p from '@clack/prompts';
import color from 'picocolors';


/*
 *
 *  Create an online banking system with the following features:
 *  Users must be able to log in with a username and password.
 *  If the user enters the wrong credentials three times, the system must lock them out.
 *  The initial balance in the bank account is $2000.
 *  The system must allow users to deposit, withdraw, view, and transfer money.
 *  The system must display a menu for users to perform transactions.
 * 
 */

const users = [{
    user: 'puuf',
    password: '1234567'
}];

const currentUser = {};

const main = () => {
    p.intro(`${color.bgCyan('◈ Bienvenido a BANCANET ◈')}`);

    loginUser();
}

const loginUser = async () => {

    p.intro('Ingresa las credenciales para acceder al sistema');

    // p.spinner.start('Installing via npm');
    let intents = 0;
    
    const s = p.spinner();

    while (intents < 3){
        const group = await p.group({
            user: () => p.text({ message: 'Usuario: ' }),
            password: () => p.text({ message: 'Contraseña: ' })
        });
        s.start('Verificando!');
        await sleep(1000);
        if(users.some(u => u.user === group.user && u.password === group.password)){
            currentUser = group;
            intents = 3;
            s.stop('Entraste!');
        } else {
            intents ++;
            s.stop('Intenta de nuev o!');
        }
    }
    p.cancel('alto ahi!');
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


main();
