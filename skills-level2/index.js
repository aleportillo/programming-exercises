import { mainLottery } from "./lottery.js";
import { mainPoints } from "./points.js";
import { mainPlayer } from "./crud.js";

// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = () => {
    // mainPoints();
    // mainLottery();
    mainPlayer();
}

main();
