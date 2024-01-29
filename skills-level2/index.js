import { mainLottery } from "./lottery.js";
import { mainPoints } from "./points.js";

// General functions
export const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = () => {
    // mainPoints();
    mainLottery();
}

main();
