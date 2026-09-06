import fs from "fs";
const css = fs.readFileSync("src/styles.css","utf8");
const hexes = [...css.matchAll(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g)].map(m=>m[0]);
const counts = {};
for(const h of hexes) counts[h.toLowerCase()] = (counts[h.toLowerCase()]||0)+1;
function hsl(hex){
  let h = hex.slice(1);
  if(h.length===3) h = h.split("").map(c=>c+c).join("");
  const r=parseInt(h.slice(0,2),16)/255,g=parseInt(h.slice(2,4),16)/255,b=parseInt(h.slice(4,6),16)/255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2;
  let s=0,hh=0;
  if(mx!==mn){const d=mx-mn;s=l>.5?d/(2-mx-mn):d/(mx+mn);
    hh = mx===r?((g-b)/d+(g<b?6:0)):mx===g?((b-r)/d+2):((r-g)/d+4); hh*=60;}
  return [Math.round(hh),Math.round(s*100),Math.round(l*100)];
}
const rows = Object.entries(counts).map(([hex,n])=>({hex,n,hsl:hsl(hex)}));
rows.sort((a,b)=>a.hsl[2]-b.hsl[2]);
for(const r of rows) console.log(r.hex, "n="+r.n, "H"+r.hsl[0], "S"+r.hsl[1], "L"+r.hsl[2]);
console.log("TOTAL distinct", rows.length, "occurrences", hexes.length);
