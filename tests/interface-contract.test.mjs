import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
const base=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const html=readFileSync(resolve(base,"index.html"),"utf8");
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
const known=new Set(ids);

test("every script-target DOM id in both new browser interfaces exists",()=>{
  for(const path of ["src/research-ui.mjs","src/mission-mental-ui.mjs"]){
    const code=readFileSync(resolve(base,path),"utf8");
    for(const m of code.matchAll(/\bel\("([^"]+)"\)/g)){
      assert.ok(known.has(m[1]),path+" references missing element #"+m[1]);
    }
  }
});
test("no duplicate DOM ids and all app modules/styles are linked",()=>{
  assert.equal(known.size,ids.length,"Duplicate element id");
  for(const source of ["./src/app.mjs","./src/research-ui.mjs","./src/mission-mental-ui.mjs",
    "./assets/app.css","./assets/research.css","./assets/mission-mental.css"]){
    assert.ok(html.includes(source),source+" missing in page");
    assert.ok(existsSync(resolve(base,source)),"Missing linked file "+source);
  }
});
test("serious findings are shown before mild symptoms in DCS UI",()=>{
  assert.ok(html.indexOf("STEP 1A")<html.indexOf("STEP 1B"));
  assert.ok(html.indexOf("STEP 1B")<html.indexOf("STEP 2 —"));
  assert.ok(html.indexOf("STEP 2 —")<html.indexOf("STEP 3 —"));
  assert.match(html,/id="dcsMildSymptoms" disabled/);
  assert.match(html,/does NOT rule out Type II DCS/);
});
test("mission scheduler, mental inputs and distinct EVA pain choices are present",()=>{
  for(const id of ["missionForm","mentalForm","mentalSchedule","evaPainChoices","dcsContinueMild","neuroPupils","neuroSpeech","neuroClarity","neuroCoordination","mentalHistory"]){
    assert.ok(known.has(id),id+" should exist");
  }
  assert.ok(!html.includes('id="evaArea"'),"Old single-region selector should be removed");
});
test("long hazard explanation section removed from active UI",()=>{
  assert.ok(!html.includes('id="evidence"'));
  assert.ok(html.includes('id="references"'));
});