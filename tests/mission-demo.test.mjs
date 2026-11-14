import test from "node:test";
import assert from "node:assert/strict";
import {missionScene,STORY_STEPS,STORY_MISSION_DAYS,explainScene,nextSceneIndex,previousSceneIndex} from "../src/mission-demo.mjs";
import {analyze,BASELINE_DAYS} from "../src/engine.mjs";

test("judge walkthrough has four deterministic synthetic stages within mission",()=>{
  assert.equal(STORY_STEPS.length,4);
  assert.equal(STORY_MISSION_DAYS,180);
  assert.deepEqual(STORY_STEPS.map(x=>x.day),[12,15,17,19]);
  for(let i=0;i<STORY_STEPS.length;i++){
    const s=missionScene(i);
    assert.equal(s.day,STORY_STEPS[i].day);
    assert.equal(s.synthetic,true);
    assert.equal(s.clinicalValidation,false);
    assert.equal(s.preflightCount,BASELINE_DAYS);
    assert.equal(s.inflightCount,s.day-9);
    assert.equal(s.entries.length,BASELINE_DAYS+s.inflightCount);
    assert.deepEqual(analyze(s.entries).flags.map(x=>x.metric),s.flags.map(x=>x.metric));
  }
});
test("baseline never changes between scripted in-flight stages",()=>{
  const first=missionScene(0).baseline;
  for(let i=1;i<STORY_STEPS.length;i++) assert.deepEqual(missionScene(i).baseline,first);
});
test("first stage is stable and early shift does not fake a diagnosis",()=>{
  const stable=missionScene(0),early=missionScene(1);
  assert.equal(stable.flags.length,0);
  assert.equal(early.flags.length,0);
  assert.match(explainScene(early).heading,/no two-reading demo flag yet/);
  assert.ok(early.current.sleepHours<stable.current.sleepHours);
});
test("sustained sleep/pulse drift triggers actual engine rules",()=>{
  const detected=missionScene(2);
  assert.equal(detected.status,"REVIEW CHANGES");
  assert.ok(detected.flags.some(x=>x.metric==="heartRate"));
  assert.ok(detected.flags.some(x=>x.metric==="sleepHours"));
  assert.ok(detected.questions.length>=2);
  const explanation=explainScene(detected);
  assert.match(explanation.why,/project-made rules/);
  assert.match(explanation.uncertainty,/cannot identify a cause/);
});
test("last follow-up stage remains a prompt, never a medical conclusion",()=>{
  const final=missionScene(3);
  assert.ok(final.flags.length>0);
  assert.ok(!/diagnos|cured|safe to fly/i.test(final.step.narrative));
  assert.ok(/authorized mission medical support/.test(explainScene(final).next));
});
test("scripted input cannot mutate global baseline or internal sequence",()=>{
  const scene=missionScene(2);
  scene.entries[0].heartRate=155;
  scene.flags[0].questions.push("altered");
  const fresh=missionScene(2);
  assert.notEqual(fresh.entries[0].heartRate,155);
  assert.ok(!fresh.flags.some(x=>x.questions.includes("altered")));
});
test("step bounds reject bad indices and navigation clamps",()=>{
  for(const bad of [-1,4,1.5,NaN,"2"])assert.throws(()=>missionScene(bad));
  assert.equal(nextSceneIndex(3),3);
  assert.equal(previousSceneIndex(0),0);
  assert.equal(nextSceneIndex(1),2);
  assert.equal(previousSceneIndex(2),1);
});
test("sleep and pulse trends are longitudinal with no real NASA measurements",()=>{
  const scene=missionScene(3);
  assert.ok(scene.sleepTrend.length>=6);
  assert.deepEqual(scene.sleepTrend.map(x=>x.day),scene.pulseTrend.map(x=>x.day));
  assert.ok(scene.sleepTrend.every(x=>typeof x.sleepHours==="number"));
  assert.ok(scene.pulseTrend.every(x=>typeof x.heartRate==="number"));
});
