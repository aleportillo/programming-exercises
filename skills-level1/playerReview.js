import * as p from '@clack/prompts';
import color from 'picocolors';

/*
 *
 * Manchester United FC has hired you as a developer. Develop a program that helps the coach identify 
 * their fastest player, player with the most goals, assists, passing accuracy, and defensive involvements.
 * The system should also allow comparison between two players. Use the following player profiles:
 * 
 * Bruno Fernandes: 5 goals, 6 points in speed, 9 points in assists, 10 points in passing accuracy, 3 defensive involvements. Corresponds to jersey number 8.
 * Rasmus Hojlund: 12 goals, 8 points in speed, 2 points in assists, 6 points in passing accuracy, 2 defensive involvements. Corresponds to jersey number 11.
 * Harry Maguire: 1 goal, 5 points in speed, 1 point in assists, 7 points in passing accuracy, 9 defensive involvements. Corresponds to jersey number 5.
 * Alejandro Garnacho: 8 goals, 7 points in speed, 8 points in assists, 6 points in passing accuracy, 0 defensive involvements. Corresponds to jersey number 17.
 * Mason Mount: 2 goals, 6 points in speed, 4 points in assists, 8 points in passing accuracy, 1 defensive involvement. Corresponds to jersey number 7.
 * The program functions as follows: The coach accesses the system and encounters a menu with the following options:
 * - Player Review: By entering the player's jersey number, they can access the player's characteristics.
 * - Compare two players: The system prompts for two jersey numbers and displays the data of both players on screen.
 * - Identify the fastest player: Displays the player with the most points in speed.
 * - Identify the top goal scorer: Displays the player with the most points in goals.
 * - Identify the player with the most assists: Displays the player with the most points in assists.
 * - Identify the player with the highest passing accuracy: Displays the player with the most points in passing accuracy.
 * - Identify the player with the most defensive involvements: Displays the player with the most points in defensive involvements.
 * - The system should also allow returning to the main menu.
 *
 */

const players = [
    {
      "name": "Bruno Fernandes",
      "goals": 5,
      "speedPoints": 6,
      "assistsPoints": 9,
      "passingAccuracyPoints": 10,
      "defensiveInvolvements": 3,
      "jerseyNumber": 8
    },
    {
      "name": "Rasmus Hojlund",
      "goals": 12,
      "speedPoints": 8,
      "assistsPoints": 2,
      "passingAccuracyPoints": 6,
      "defensiveInvolvements": 2,
      "jerseyNumber": 11
    },
    {
      "name": "Harry Maguire",
      "goals": 1,
      "speedPoints": 5,
      "assistsPoints": 1,
      "passingAccuracyPoints": 7,
      "defensiveInvolvements": 9,
      "jerseyNumber": 5
    },
    {
      "name": "Alejandro Garnacho",
      "goals": 8,
      "speedPoints": 7,
      "assistsPoints": 8,
      "passingAccuracyPoints": 6,
      "defensiveInvolvements": 0,
      "jerseyNumber": 17
    },
    {
      "name": "Mason Mount",
      "goals": 2,
      "speedPoints": 6,
      "assistsPoints": 4,
      "passingAccuracyPoints": 8,
      "defensiveInvolvements": 1,
      "jerseyNumber": 7
    }
]


export const mainPlayer = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a Manchester United FC ◈')}`);

    playersMenu();
}

const playersMenu = async () => {
    
    const basicOptions = [
        { value: 'review', label: 'Ver datos de un jugador' },
        { value: 'compare', label: 'Comparar dos jugadores' },
        { value: 'top', label: 'Ver los mejores jugadores' },       
        { value: 'close', label: 'Cerrar el sistema' },       
    ];
    
    const action = await p.select({
        message: 'Qué operación deseas realizar?',
        options: basicOptions,
    });
    
    
    switch(action){
        case 'review': review(); break;
        case 'top': top(); break;
        case 'compare': compare(); break;
        case 'close': logout(); break;
        default: p.cancel('La opción seleccionada no está disponible'); shippingMenu(); break;
    }
}

const review = async () => {
    let playerFound = {};
    do{
        const numJersey = await p.text({ 
            message: 'Ingresa el numero del jersey',
            validate(value) {
                if (!value) return `Debes ingresar un dato`;
                if (isNaN(value)) return `Debes ingresar un numero`;
                if (isNaN(value)) return `Debes ingresar un numero`;
            }       
        });
       playerFound = players.find(player => player.jerseyNumber === Number(numJersey));
       if(!playerFound) p.note(color.red('No hay juagadores con ese numero. Intenta de nuevo'), 'Error');
    } while(!playerFound);
    
    let messageBody = `Nombre: ${color.cyan(playerFound.name)}`;
    messageBody += `\nGoles: ${playerFound.goals}`;
    messageBody += `\nPuntos de rapidez: ${playerFound.speedPoints}`;
    messageBody += `\nPuntos de asistencia: ${playerFound.assistsPoints}`;
    messageBody += `\nPuntos de precision de pases: ${playerFound.assistsPoints}`;
    messageBody += `\nDefensiva: ${playerFound.passingAccuracyPoints}`;
    messageBody += `\nJersey: ${playerFound.jerseyNumber}`;
    p.note(messageBody, 'Resumen del jugador');
    playersMenu();
}

const top = async () => {
    
    
    const findPlayer = (key) => {
        
        const result = structuredClone(players).reduce((prev, curr) => {
            return prev[key] > curr[key] ? prev : curr
        }, 0)
        
        return `${result.name} - ${color.green(result[key])}`;
    }
    
    let messageBody = `\nGoles: ${ findPlayer('goals')}`;
    messageBody += `\nPuntos de rapidez: ${ findPlayer('speedPoints') }`;
    messageBody += `\nPuntos de asistencia: ${findPlayer('assistsPoints')}`;
    messageBody += `\nPuntos de precision de pases: ${findPlayer('passingAccuracyPoints')}`;
    p.note(messageBody, 'Top de jugadores');
    
    playersMenu();
}

const compare = async () =>{
    const playerOptions = structuredClone(players).map(player => {return {
        ...player, 
        label: player.name,
        value: player
    }});
    
    const player1 = await p.select({
        message: 'Selecciona el jugador 1',
        options: playerOptions,
    });
    
    const secondPlayers = playerOptions.filter(player => player.jerseyNumber != player1.jerseyNumber);
    
    const player2 = await p.select({
        message: 'Selecciona el jugador ',
        options: secondPlayers,
    });
    
    let messageBody = `Goles \n ${player1.name} - ${ player1.goals } / ${player2.name} - ${player2.goals} `;
    messageBody += `\n\nPuntos de rapidez \n ${player1.name} - ${ player1.speedPoints } / ${player2.name} - ${player2.speedPoints} `;
    messageBody += `\n\nPuntos de asistencia \n ${player1.name} - ${ player1.assistsPoints } / ${player2.name} - ${player2.assistsPoints} `;
    messageBody += `\n\nPuntos de precision de pases \n ${player1.name} - ${ player1.passingAccuracyPoints } / ${player2.name} - ${player2.passingAccuracyPoints} `;  
    p.note(messageBody, 'Comparacion');
    playersMenu();
}

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}