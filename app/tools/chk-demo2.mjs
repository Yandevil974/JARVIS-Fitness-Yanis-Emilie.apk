import { EXERCISES } from "../src/data/library.js";
import { demonstrationFor } from "../src/data/demonstrations.js";
for (const lvl of ["famille","variante"]) {
  console.log("\n=== " + lvl.toUpperCase() + " ===");
  for (const e of EXERCISES) {
    const d = demonstrationFor(e);
    if (d?.level === lvl) console.log(`${e.name}  ->  ${d.name}`);
  }
}
