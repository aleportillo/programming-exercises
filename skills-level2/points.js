import * as p from '@clack/prompts';
import color from 'picocolors';


// The Big Six of the English Premier League is composed of six teams: Manchester United, 
// Liverpool, Arsenal, Chelsea, Manchester City, and Tottenham Hotspur.
// Develop a system that generates between 0, 1, and 3 points randomly for each team. 
// The winner of the Big Six will be the team with the highest 
// accumulated points at the end. Each team will play 3 matches against every opponent. 
// After the matches, the system will display on-screen the team standings 
// from highest to lowest points.

const teams = ["Manchester United", "Liverpool", "Arsenal", "Chelsea", "Manchester City", "Tottenham"];

const table = { "Manchester United" : 0, "Liverpool" : 0, "Arsenal" : 0, "Chelsea" : 0, "Manchester City" : 0, "Tottenham": 0 };

const matches = [];

export const mainPoints = async () => {
    p.intro(`${color.cyan('◈ The Big Six of the English Premier League ◈')}`);
    
    await getTable();
    printResults();
    
    p.cancel('Vuelve pronto :)')
}

const printResults = () => {
    
    p.note(matches.join('\n'), 'Resultados');
    
    const sortedData = Object.fromEntries(
        Object.entries(table).sort(([, a], [, b]) => b - a)
    );
    
    const tablePrint = Object.entries(sortedData).map(([key, value]) => `${key} = ${value}`).join('\n');
    
    p.note(tablePrint, 'Resultados Finales');
    
}

const getTable = () => {
    teams.forEach((currentTeam, index) => {
        const otherTeams = teams.slice(index + 1);
        otherTeams.forEach(team => getMatches(currentTeam, team));
    });
}

const getMatches = (currentTeam, team) => {
    for (let idx = 0; idx < 3; idx++) {
        const POINTS_1 = Math.floor(Math.random() * 4);
        const POINTS_2 = Math.floor(Math.random() * 4);
        table[currentTeam] += POINTS_1;
        table[team] += POINTS_2;
        matches.push(`${currentTeam} ${POINTS_1} VS ${team} ${POINTS_2}`);
    }
};