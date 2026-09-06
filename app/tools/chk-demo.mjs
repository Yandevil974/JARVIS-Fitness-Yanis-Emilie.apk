import { demonstrationCoverage, missingDemonstrations, demonstrationFor } from "../src/data/demonstrations.js";
console.log(demonstrationCoverage());
const miss = missingDemonstrations();
console.log("\nSANS DÉMONSTRATION:", miss.length);
console.log(miss.map(e=>`${e.id}\t${e.name}\t${e.muscle}\t${e.pattern}`).join("\n"));
