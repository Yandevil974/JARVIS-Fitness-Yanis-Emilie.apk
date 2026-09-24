import {defineConfig} from '../../../JARVIS-Fitness-Source/node_modules/@playwright/test/index.mjs';
export default defineConfig({
 testDir:'../tests',testMatch:['pool-candidate.spec.mjs','warmup-candidate.spec.mjs','emilie-session-block.spec.mjs','tabata-context.spec.mjs','stretch-media.spec.mjs','pool-land-guides.spec.mjs'],workers:1,timeout:45000,
 outputDir:'../../../.cache/media-pool-browser',reporter:'list',
 use:{baseURL:process.env.POOL_CANDIDATE_URL||'http://127.0.0.1:5186',
 viewport:{width:390,height:900},timezoneId:'Indian/Reunion',screenshot:'only-on-failure',
 launchOptions:{executablePath:process.env.CHROMIUM_EXECUTABLE_PATH||'/tmp/chromium',args:['--no-sandbox','--disable-dev-shm-usage']}}
});
