import { mainBank } from "./banks.js";
import { mainConverter } from "./converter.js";
import { mainFinance } from "./financeManagment.js";
import { mainShipping } from "./shipping.js";


// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Init project

const main = () => {
    
    // mainBank();
    // mainFinance();
    // mainShipping()
    mainConverter();
}

main();
