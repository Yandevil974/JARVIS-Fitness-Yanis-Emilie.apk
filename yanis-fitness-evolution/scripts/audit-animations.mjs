import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(), media=path.join(root,'public/media');
const files=fs.readdirSync(media); const animated=files.filter(f=>/\.(gif|webp|mp4|svg)$/i.test(f));
const human=fs.existsSync(path.join(root,'src/components/HumanAnim.jsx'));
console.log(`Médias: ${files.length}; médias animés: ${animated.length}; moteur humain SVG: ${human?'OK':'ABSENT'}`);
if(!human || !animated.length) process.exitCode=1;
