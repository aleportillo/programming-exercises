import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';
const s = p.spinner();

// Manchester United FC Player Management System:
// As a developer for Manchester United FC, the executive management 
// has tasked you with creating a CRUD system for the current players, 
// including the following information: Jersey number, position, age, height,
// and other statistical data.
// Additionally, integrate the system from 
// the previous level where it was possible to compare two players and 
// visualize their characteristics. You may find player information by 
// searching on the internet.
// Features:
// - Create: Add new players to the system with their respective details.
// - Read: View the complete list of current players with their 
//   jersey number, position, age, height, and other statistical information.
// - Update: Modify player information as needed, such as 
//   position, age, or height.
// - Delete:Remove players from the system if they are no
//   longer part of the team.
// - Compare Players: Utilize the comparison feature to analyze and 
//   contrast the characteristics of two players.
// - Visualize Characteristics: Display the statistical and 
//   physical attributes of each player for a comprehensive overview.

let players = [
    {
      "name": "David Silva",
      "jerseyNumber": 21,
      "position": "Midfielder",
      "age": 35,
      "height": 173,
      "goals": 8,
      "speedPoints": 7,
      "assistsPoints": 10,
      "passingAccuracyPoints": 9,
      "defensiveInvolvements": 4
    },
    {
      "name": "Marcus Rashford",
      "jerseyNumber": 10,
      "position": "Forward",
      "age": 24,
      "height": 180,
      "goals": 15,
      "speedPoints": 9,
      "assistsPoints": 5,
      "passingAccuracyPoints": 7,
      "defensiveInvolvements": 3
    },
    {
      "name": "Harry Maguire",
      "jerseyNumber": 5,
      "position": "Defensa Central",
      "age": 28,
      "height": 194,
      "goals": 3,
      "speedPoints": 5,
      "assistsPoints": 1,
      "passingAccuracyPoints": 8,
      "defensiveInvolvements": 12
    }
]

const validators = {
    integer : (value) => {
        if (!Number.isInteger(Number(value))) return 'Ingrese un número entero válido';
    }, 
    number : (value) => {
        if (isNaN(value)) return 'Ingrese un número válido';
        if(value.endsWith('.')) return 'Ingrese un numero valido';
    },
    jersey: (value, player) => {
        const integerError = validators.integer(value);
        if(integerError) return integerError;
        const duplicateJersey = players.filter(p => p.jerseyNumber === Number(value));
        if(!player && duplicateJersey.length > 0) return 'Ese número no está disponible';
        if(duplicateJersey[0] && player.jerseyNumber !== duplicateJersey[0]?.jerseyNumber) return 'Ese número no está disponible';
    },
}


export const mainPlayer = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a Manchester United FC ◈')}`);

    playersMenu();
}

const playersMenu = async () => {
    
    const basicOptions = [
        { label: 'Ver todos los jugadores', value: () => viewAll() },
        { label: 'Ver datos de un jugador', value: () => review() },
        { label: 'Agregar un jugador',      value: () => addPlayer() },
        { label: 'Editar un jugador',       value: () => updatePlayer() },
        { label: 'Eliminar un jugador',     value: () => deletePlayer() },
        { label: 'Comparar dos jugadores',  value: () => compare() },
        { label: 'Top de jugadores',        value: () => top() },       
        { label: 'Cerrar el sistema',       value: () => logout()},       
    ];
    
    const action = await p.select({
        message: 'Selecciona una opcion',
        options: basicOptions,
    });
    
    if(typeof action === 'function'){
        action()
    } else {
        p.cancel('La opción seleccionada no está disponible'); 
        playersMenu();
    }

}

const addPlayer = async (player) =>  {
    
    const newPlayer = await p.group({
        name: () => p.text({ message: 'Nombre: ', initialValue: player?.name}), 
        position: () => p.select({
            message: 'Posición: ',
            options: [
                { "label": "Portero", "value": "Portero" },
                { "label": "Defensa Central", "value": "Defensa Central" },
                { "label": "Lateral Derecho", "value": "Lateral Derecho" },
                { "label": "Lateral Izquierdo", "value": "Lateral Izquierdo" },
                { "label": "Centrocampista Defensivo", "value": "Centrocampista Defensivo" },
                { "label": "Centrocampista Central", "value": "Centrocampista Central" },
                { "label": "Centrocampista Ofensivo", "value": "Centrocampista Ofensivo" },
                { "label": "Extremo Derecho", "value": "Extremo Derecho" },
                { "label": "Extremo Izquierdo", "value": "Extremo Izquierdo" },
                { "label": "Delantero Centro", "value": "Delantero Centro" }
            ],
            initialValue: player?.position                  
        }),
        jerseyNumber: () => p.text({ 
            message: 'Jersey: ',
            validate : (value) => validators.jersey(value, player),
            initialValue: player?.jerseyNumber?.toString(), 
        }),
        age: () => p.text({ 
            message: 'Edad: ',
            initialValue: player?.age?.toString(), 
            validate : validators.integer,
        }),
        height: () => p.text({ 
            message: 'Altura en cm: ',
            validate : validators.integer, 
            initialValue: player?.height?.toString(), 
        }),
        goals: () => p.text({ 
            message: 'Goles: ',
            validate : validators.integer,
            initialValue: player?.goals?.toString(), 
        }),
        speedPoints: () => p.text({ 
            message: 'Puntos de rápidez: ',
            validate : validators.number,
            initialValue: player?.speedPoints?.toString(), 
        }),
        assistsPoints: () => p.text({ 
            message: 'Puntos de asistencia: ',
            validate : validators.number,
            initialValue: player?.assistsPoints?.toString(), 
        }),
        passingAccuracyPoints: () => p.text({ 
            message: 'Puntos de presición en pases: ',
            validate : validators.number,
            initialValue: player?.passingAccuracyPoints?.toString(), 
        }),
        defensiveInvolvements: () => p.text({ 
            message: 'Involucramientos defensivos: ',
            validate : validators.number,
            initialValue: player?.defensiveInvolvements?.toString(), 
        }),
    });
    
    const fieldNumbers = ['defensiveInvolvements', 'passingAccuracyPoints', 'assistsPoints', 'speedPoints', 'goals', 'height', 'age', 'jerseyNumber'];
    
    fieldNumbers.forEach(f => newPlayer[f] = Number(newPlayer[f]))
    
    if(player) return newPlayer;
    
    players.push(newPlayer);
    playersMenu();
    
}

const viewAll = async () => {
    
    const parsePlayers = players.map(p => {
        return {
            'Nombre' : p.name,
            'Posición': p.position,
            'Jersey' : p.jerseyNumber,
            'Edad' : p.age,
            'Altura': p.height,
            'Goles' : p.goals,
            'Puntos de rápidez' : p.speedPoints,
            'Puntos de assitencia': p.assistsPoints,
            'Puntos de presición en los pases': p.passingAccuracyPoints,
            'Involucramientos defensivos' : p.defensiveInvolvements
        }
    })

    let messageBody = JSON.stringify(parsePlayers)
    messageBody = messageBody.replace(/[\[\]{}"]/g, '');
    messageBody = messageBody.replace(/,/g, '\n'); 
    messageBody = messageBody.replace(/Nombre:/g, '\n----------> '); 
    messageBody = messageBody.replace(/:/g, ': ');
    
    p.note(messageBody, 'Jugadores');
    playersMenu();
}

const updatePlayer = async () => {

    let playerIdx = -1;
    
    do{
        const jersey = await p.text({ 
            message: 'Ingresa el numero del jersey',
            validate: validators.integer    
        });
       playerIdx = players.findIndex(player => player.jerseyNumber === Number(jersey));
       
       if(playerIdx === -1) p.note(color.red('No hay jugadores con ese numero. Intenta de nuevo'), 'Error');
       
    } while(playerIdx === -1);
    
    players[playerIdx] = await addPlayer(players[playerIdx])
    
    p.note('Información actualizada correctamente', 'Actualizado');
    playersMenu();
    
}

const deletePlayer = async () => {
    let player = {};
    
    do{
        const jersey = await p.text({ 
            message: 'Ingresa el numero del jersey',
            validate: validators.integer    
        });
        
        player = players.find(player => player.jerseyNumber === Number(jersey));
       
       if(!player) p.note(color.red('No hay jugadores con ese numero. Intenta de nuevo'), 'Error');
       
    } while(!player);
    
    players = players.filter(p => p.jerseyNumber !== player.jerseyNumber);
    
    p.note('Información eliminada correctamente', 'Eliminado'); 
    
    playersMenu();
    
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