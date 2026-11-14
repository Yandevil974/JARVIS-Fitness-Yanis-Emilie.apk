import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {APP_VERSION,BUILD_CODE,APP_ID} from '../src/app-identity.js';
test('version affichée, package npm et version Android sont cohérents',()=>{
 const pkg=JSON.parse(readFileSync('package.json','utf8'));
 const gradle=readFileSync('android/app/build.gradle','utf8');
 assert.equal(APP_VERSION,pkg.version);
 assert.match(gradle,new RegExp(`versionName "${APP_VERSION.replaceAll('.', '\\.')}"`));
 assert.match(gradle,new RegExp(`versionCode ${BUILD_CODE}\\b`));
 assert.ok(gradle.includes(`applicationId "${APP_ID}"`));
});
