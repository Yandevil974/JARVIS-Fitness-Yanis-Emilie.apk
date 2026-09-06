import { EXERCISES } from "../src/data/library.js";
import { norm } from "../src/engine/utils.js";
const simplified = (name) => norm(name).replace(/\([^)]*\)|,.*$/g, "").replace(/\b(tempo|plat|moderee?|alternee?s?|variante)\b/g, "").replace(/\s+/g, " ").trim();
function demo(ex){
  if(ex.gif) return "exact";
  const key = simplified(ex.name);
  const m = EXERCISES.find(e=>e.gif && e.muscle===ex.muscle && e.pattern===ex.pattern && simplified(e.name)===key);
  return m? "variant:"+m.name : null;
}
const un = EXERCISES.filter(e=>!demo(e));
console.log("non résolus:", un.length, "/", EXERCISES.length);
console.log(un.map(e=>`${e.id}\t${e.name}\t${e.muscle}\t${e.pattern}`).join("\n"));
