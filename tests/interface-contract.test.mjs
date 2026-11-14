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
  for(const path of ["src/research-ui.mjs","src/mission-mental-ui.mjs","src/cardiovascular-ui.mjs","src/mission-demo-ui.mjs","src/cabin-ui.mjs"]){
    const code=readFileSync(resolve(base,path),"utf8");
    for(const m of code.matchAll(/\b(?:el|byId)\("([^"]+)"\)/g)){
      assert.ok(known.has(m[1]),path+" references missing element #"+m[1]);
    }
  }
});
test("no duplicate DOM ids and all app modules/styles are linked",()=>{
  assert.equal(known.size,ids.length,"Duplicate element id");
  for(const source of ["./src/app.mjs","./src/research-ui.mjs","./src/mission-mental-ui.mjs","./src/cardiovascular-ui.mjs","./src/mission-demo-ui.mjs","./src/offline-ui.mjs","./src/cabin-ui.mjs",
    "./assets/app.css","./assets/research.css","./assets/mission-mental.css","./assets/cardiovascular.css","./assets/mission-demo.css","./assets/cabin.css"]){
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
test("blood pressure section exposes readings, PP/MAP, NASA sources and independent controls",()=>{
  for(const id of ["cardio","cardioForm","cardioReturnForm","cardioHistory","cardioPp","cardioMap",
     "cardioBp","cardioPpLine","cardioMapLine","cardioReturnDay"]){
    assert.ok(known.has(id),id+" should exist");
  }
  assert.ok(html.indexOf('id="monitor"')<html.indexOf('id="cardio"'));
  assert.ok(html.indexOf('id="cardio"')<html.indexOf('id="mental"'));
  assert.match(html,/DBP \+ \(PP ÷ 3\)/);
  assert.match(html,/not a validated medical threshold/);
});

test("guided judge demo is prominent, navigable, synthetic and linked to the real dashboard",()=>{
  for(const id of ["flightStory","storySteps","storyStart","storyNext","storyPrev",
     "storyEnd","storyFlag","storyWhyTitle","storyRules","storyQuestions",
     "storySleepPolyline","storyBaselineLine","storyFeedback","storyAcknowledge"]){
    assert.ok(known.has(id),id+" missing from guided demo");
  }
  assert.ok(html.indexOf('id="flightStory"')<html.indexOf('id="monitor"'));
  assert.match(html,/100% SYNTHETIC/);
  assert.match(html,/Existing saved demo data will be preserved/);
  const app=readFileSync(resolve(base,"src/app.mjs"),"utf8");
  const storyUI=readFileSync(resolve(base,"src/mission-demo-ui.mjs"),"utf8");
  assert.match(app,/orbitm:demo-scene/);
  assert.match(app,/orbitm:demo-end/);
  assert.match(storyUI,/orbitm:demo-cancelled/);
  assert.match(storyUI,/orbitm:demo-scene/);
  assert.match(app,/if\(demoBackup===null\)demoBackup/);
});

test("offline status is explicit and worker registration is local to this app",()=>{
  assert.ok(known.has("offlineSupport"));
  const module=readFileSync(resolve(base,"src/offline-ui.mjs"),"utf8");
  assert.match(module,/serviceWorker\.register\("\.\/sw\.js"/);
  assert.match(module,/NASA reference links still need internet/);
});

test("cabin and crew context panel is adjacent to guided story with visible NASA reference",()=>{
  for(const id of ["cabin","cabinDay","cabinMode","cabinCo2","cabinO2",
    "cabinPressure","cabinTemp","cabinHumidity","cabinConclusion","cabinContext",
    "cabinSymptoms","cabinAssociation","cabinNext","cabinTrend","cabinForm",
    "cabinRestore","cabinFeedback"]){
    assert.ok(known.has(id),id+" should exist");
  }
  assert.ok(html.indexOf('id="flightStory"')<html.indexOf('id="cabin"'));
  assert.ok(html.indexOf('id="cabin"')<html.indexOf('id="monitor"'));
  assert.match(html,/3 mmHg \(1-hour average\)/);
  assert.match(html,/not proof of cause/i);
  assert.match(html,/NASA-STD-3001/);
  const model=readFileSync(resolve(base,"src/cabin.mjs"),"utf8");
  const ui=readFileSync(resolve(base,"src/cabin-ui.mjs"),"utf8");
  assert.match(model,/clinicalDiagnosis:false,causalConclusion:false/);
  assert.match(ui,/orbitm:demo-scene/);
  assert.match(ui,/orbitm:demo-end/);
  assert.match(ui,/orbitm:demo-cancelled/);
  const worker=readFileSync(resolve(base,"sw.js"),"utf8");
  assert.ok(worker.includes('"./assets/cabin.css"'));
  assert.ok(worker.includes('"./src/cabin.mjs"'));
  assert.ok(worker.includes('"./src/cabin-ui.mjs"'));
});
