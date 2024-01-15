import { mainPlayer } from "./playerReview.js";
import { mainTravel } from "./agencyProgram.js";
import { mainHospital } from "./appointmentsHospital.js";

// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Init project

const main = () => {
    // mainPlayer();
    // mainTravel();
    mainHospital();
}

main();
