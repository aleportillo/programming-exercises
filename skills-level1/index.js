import { mainPlayer } from "./playerReview.js";
import { mainTravel } from "./agencyProgram.js";

// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Init project

const main = () => {
    // mainPlayer();
    mainTravel();
}

main();
