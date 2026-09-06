import { EXERCISES } from "../src/data/library.js";
const no = EXERCISES.filter(e=>!e.gif);
console.log("total", EXERCISES.length, "sans gif", no.length);
console.log(no.map(e=>`${e.id} | ${e.name} | ${e.muscle} | ${e.pattern} | ${e.sources}`).join("\n"));
