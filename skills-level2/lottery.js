
import * as p from '@clack/prompts';
import color from 'picocolors';
import { sleep } from './index.js';
const s = p.spinner();

// Lottery System: 
// The lottery system produces results consisting of 4 digits + 1 letter, 
// e.g., 0345F. Develop a lottery ticket purchase system with 
// the following features:
// - Users can choose from the following tickets:
//   5678B, 9876C, 2345D, 6789E, 3456F, 8765G, 4321H, 7890J, 5432K, 
//   2109L, 8765M, 1357N, 2468P, 6543Q, 7891R, 3579S, 9821T, 4682U, 
//   5763V, 1234A
// - Users can buy a minimum of 1 and a maximum of 2 tickets.
// - Payment is accepted in cash, and each ticket costs 1 USD.
// - After choosing tickets and quantity, the system prompts the user
//   to pay in cash or by bank card.
// - This system only accepts 1 USD and 5 USD bills. The user must 
//   choose the bill to use for payment, and the system should return
//   the change if applicable.
// - After payment, the ticket is issued.
// - The user returns to the main menu to play the lottery.
// - The lottery system generates 1 random ticket code.

let ALL_TICKETS = [
    { ticketNumber: '5678B', sold: false },
    { ticketNumber: '9876C', sold: false },
    { ticketNumber: '2345D', sold: false },
    { ticketNumber: '6789E', sold: false },
    { ticketNumber: '3456F', sold: false },
    { ticketNumber: '8765G', sold: false },
    { ticketNumber: '4321H', sold: false },
    { ticketNumber: '7890J', sold: false },
    { ticketNumber: '5432K', sold: false },
    { ticketNumber: '2109L', sold: false },
    { ticketNumber: '8765M', sold: false },
    { ticketNumber: '1357N', sold: false },
    { ticketNumber: '2468P', sold: false },
    { ticketNumber: '6543Q', sold: false },
    { ticketNumber: '7891R', sold: false },
    { ticketNumber: '3579S', sold: false },
    { ticketNumber: '9821T', sold: false },
    { ticketNumber: '4682U', sold: false },
    { ticketNumber: '5763V', sold: false },
    { ticketNumber: '1234A', sold: false },
];

let sellTickets = 0;

export const mainLottery = async () => {
    p.intro(`${color.cyan('◈ Sistema de loteria ◈')}`);
    menu();
}

const logout = () => {
    p.outro(color.cyan('Vuelve pronto :)'));
}

async function menu() {
    
    let basicOptions = [
        { value: 'playLottery', label: 'Jugar a la loteria' },
        { value: 'sellLotteryTicket', label: 'Comprar boletos de loteria' },       
        { value: 'logout', label: 'Salir' },       
    ];
    
    if(sellTickets >= 2){
        basicOptions = basicOptions.filter( op => op.value !== 'sellLotteryTicket')
    }
    
    
    const action = await p.select({
        message: 'Selecciona una opcion',
        options: basicOptions,
    });
    
    
    switch(action){
        case 'playLottery': playLottery(); break;
        case 'sellLotteryTicket': sellLotteryTicket(); break;
        case 'logout': logout(); break;
        default: p.cancel('La opción seleccionada no está disponible'); menu(); break;
    }
}

async function sellLotteryTicket () {

    const firstTicket = await getTicketSelection(ALL_TICKETS);
    sellTickets ++;
    
    if(sellTickets >= 2){
        paidTicket (firstTicket);
        return; 
    }
    
    const isUserAnotherTicket = await p.select({
        options: [
            { label: 'Si', value: true},
            { label: 'No', value: false}
        ],
        message: 'Desea comprar otro boleto?'
    });
    
    if(!isUserAnotherTicket ){
        paidTicket (firstTicket);
        return; 
    }
    
    const availableTickets = ALL_TICKETS.filter(t => t.ticketNumber !== firstTicket.ticketNumber);
    
    const secondTicket = await getTicketSelection (availableTickets);
    
    sellTickets ++;
    
    paidTicket (firstTicket, secondTicket);
    
}

async function getTicketSelection (tickets) {
    return await p.select({
        options: getAvailableTickets(tickets),
        message: 'Selecciona el boleto que desea comprar: '
    });
}

async function paidTicket (firstTicket, secondTicket) {
    const tickets = [firstTicket, secondTicket].map(t => t ? `Boleto: ${t?.ticketNumber}` : '').join('\n');
    
    const total = secondTicket ? 2 : 1;
    
    p.note( tickets + `\nTotal a pagar $${total}.00` , 'Resumen de compra');
    
    const paidMethod = await p.select({
        options: [
            { label: 'Efectivo', value: 'cash'},
            { label: 'Tarjeta', value: 'card'}
        ],
        message: 'Seleccione el metodo de pago:'
    });
    
    if(paidMethod === 'card'){
        p.note(color.red('Solo se aceptan pagos en efectivo', 'Oops!'));
        paidTicket (firstTicket, secondTicket);
        return;
    }
    
    const bills = async () => {
        return await p.text({
            message : 'Ingrese su billete: ',
            validate : (value) => {
                if(isNaN(value)) return 'Ingrese un numero valido';
                if(!['1', '5'].includes(value)) return 'Solo se aceptan billetes de $1 y $5'
            }
        });
    }
    
    let amount = Number(await bills());
    
    if(amount < total) {
        p.note(`Faltan: ${total - amount}.00`, 'Oops');
        amount += Number(await bills());
    }
    
    const change = amount - total;
    
    if(change) p.note(`Su cambio es de $${change}.00`, 'Cambio');
    else p.note('Gracias por comprar!', 'Compra realizada');
    
    ALL_TICKETS.forEach(t => {
        t.sold = [firstTicket.ticketNumber, secondTicket?.ticketNumber].includes(t.ticketNumber) ? true : t.sold;
    });
    
   menu();   
}

function getAvailableTickets (tickets) { 

    const filterTickets = tickets.filter(t => !t.sold)?.
        map(t => { return {label: t.ticketNumber, value: t}});
        
    if (filterTickets.length === 0) {
        p.note('Todos los boletos han sido vendidos.', 'Oops');
        menu();
        return;
    }
    return filterTickets;
}

const playLottery = async () => {
    s.start('Generando boleto ganador');
    await sleep(2000);
    
    const idx = Math.floor(Math.random() * ALL_TICKETS.length);
    s.stop();
    p.note(color.green(`Boleto ganador: ${ALL_TICKETS[idx].ticketNumber}`), 'GANADOR');
    
    menu();
}