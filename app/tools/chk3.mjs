import { EXERCISES } from "../src/data/library.js";
for(const e of EXERCISES.filter(x=>x.gif)) console.log(`${e.muscle}\t${e.pattern}\t${e.name}\t${e.gif}`);
