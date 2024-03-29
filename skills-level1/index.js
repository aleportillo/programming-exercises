import { mainPlayer } from "./playerReview.js";
import { mainTravel } from "./agencyProgram.js";
import { mainHospital } from "./appointmentsHospital.js";
import { mainHotel } from "./hotel.js";
import { mainAirline } from "./airline.js";

// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Init project

const main = () => {
    // mainPlayer();
    // mainTravel();
    // mainHospital();
    // mainHotel();
    mainAirline();
}

main();
