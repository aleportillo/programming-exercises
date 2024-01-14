import * as p from '@clack/prompts';
import color from 'picocolors';

/*
 *
 * A travel agency has a special offer for traveling in any season of 2024. Their destinations are:
 * Winter: Andorra and Switzerland. In Andorra, there are skiing activities, and in Switzerland, there's a tour of the Swiss Alps.
 * Summer: Spain and Portugal. In Spain, there are hiking and extreme sports activities. In Portugal, there are activities on the beaches.
 * Spring: France and Italy. In France, there are extreme sports activities, and in Italy, there's a cultural and historical tour.
 * Autumn: Belgium and Austria. In Belgium, there are hiking and extreme sports activities, and in Austria, there are cultural and historical activities.
 * Note: Traveling in winter costs $100, in autumn $200, in spring $300, and in summer $400.
 * 
 * Design a system that helps users choose their best destination according to their personal preferences and the season they want to travel in.
 * 12. Important: With the information you have, you should ask the user the right questions and display on screen what their best destination would be.
 * 
 * Clue: You could consider the user's budget
 *
 */

const travelDestinations = [
    {
      "season": "invierno",
      "destinations": [
        {
          "country": "Andorra",
          "activities": ["esquí"]
        },
        {
          "country": "Suiza",
          "activities": ["tour de los Alpes Suizos"]
        }
      ],
      "cost": 100
    },
    {
      "season": "verano",
      "destinations": [
        {
          "country": "España",
          "activities": ["senderismo", "deportes extremos"]
        },
        {
          "country": "Portugal",
          "activities": ["actividades en la playa"]
        }
      ],
      "cost": 400
    },
    {
      "season": "primavera",
      "destinations": [
        {
          "country": "Francia",
          "activities": ["deportes extremos"]
        },
        {
          "country": "Italia",
          "activities": ["tour cultural e histórico"]
        }
      ],
      "cost": 300
    },
    {
      "season": "otoño",
      "destinations": [
        {
          "country": "Bélgica",
          "activities": ["senderismo", "deportes extremos"]
        },
        {
          "country": "Austria",
          "activities": ["actividades culturales e históricas"]
        }
      ],
      "cost": 200
    }
]

export const mainTravel = async () => {
    p.intro(`${color.cyan('◈ Bienvenido a AGENCIAS DE VIAJE ◈')}`);

    travelMenu();
}

const travelMenu = async () => {
    
    let userBudget = Number(await p.text({
        message: 'Cual es tu presupuesto para viajar',
        validate(value) {
            if (!value) return `Debes ingresar un dato`;
            if (isNaN(value)) return `Debes ingresar un numero`;
        } 
    }));
    
    let season;

    if(userBudget >= 100 && userBudget < 200){
        season = travelDestinations[0];
    } else {
        const availableSeasons = travelDestinations
            .filter(season => userBudget >= season.cost )
            .map(season => { return { ...season, label: season.season, value: season}});    
        
        season = await p.select({
            message: 'Varias temporadas se ajustan a su presupuesto.\nSeleccionse su favorita.',
            options: availableSeasons,
        });
    }
    
    const result = await activities(season.destinations);
    
    let messageBody = `Su destino ideal es ${color.cyan(color.bold(result))}`;
    messageBody += `\nDurante ${color.cyan(color.bold(season.season))}`;
    messageBody += `\nCon un costo de ${color.cyan(color.bold(season.cost))}`;
    
    p.note(messageBody, 'RESULTADO');
    
    const nextAction = await p.select({
        message: 'Que desea hacer',
        options: [
         { label: 'Elegir otro lugar', value: true},   
         { label: 'Salir', value: false}   
        ]
    });
    
    if(nextAction){
        travelMenu();
        return;
    }
    
    logout();
    
}

const activities = async (options) => {
    let activitiesOptions = [];
    options.forEach(country => {
        const activitiesParse = country.activities.map(act => {
            return {
                label: act,
                value: country.country
            }
        });
        activitiesOptions = [...activitiesOptions, ...activitiesParse];
    });

    const country = await p.select({
        message: 'Que actividad prefieres hacer: ',
        options: activitiesOptions,
    });
    
    return country;
}

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}