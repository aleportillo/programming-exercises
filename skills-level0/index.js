import { mainBank } from "./banks.js";


// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Init project

const main = () => {
    mainBank();
}

main();
