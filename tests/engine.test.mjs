import test from "node:test";
import assert from "node:assert/strict";
import {analyze,makeScenario,addEntry,BASELINE_DAYS} from "../src/engine.mjs";

test("baseline uses 14 labeled preflight synthetic days",()=>{
  const d=makeScenario("stable");
  assert.equal(d.filter(x=>x.phase==="preflight").length,BASELINE_DAYS);
  assert.equal(d.filter(x=>x.phase==="inflight").length,3);
  const r=analyze(d);
  assert.equal(r.status,"NO DEMO FLAGS");
  assert.equal(r.flags.length,0);
  assert.equal(r.counts.preflight,14);
});
test("repeat fatigue changes produce explainable independent alerts",()=>{
  const r=analyze(makeScenario("fatigue"));
  assert.ok(r.flags.some(f=>f.metric==="heartRate"));
  assert.ok(r.flags.some(f=>f.metric==="sleepHours"));
  assert.ok(r.flags.some(f=>f.metric==="mood"));
  assert.ok(r.flags.every(f=>f.questions.length>=2));
});
test("temperature sample prompts recheck, not diagnosis",()=>{
  const r=analyze(makeScenario("temperature"));
  assert.ok(r.flags.some(f=>f.metric==="temperature"));
  assert.ok(!r.flags.some(f=>/diagnos(es|is)/i.test(f.title)));
});
test("private check-in scenario has mood prompt",()=>{
  const r=analyze(makeScenario("mood"));
  assert.ok(r.flags.some(f=>f.metric==="mood"));
});
test("added entries are inflight and do not change preflight baseline",()=>{
  const d=makeScenario("stable");
  const b=analyze(d).baseline;
  const next=addEntry(d,{heartRate:63,sleepHours:7.1,mood:4,temperature:36.5});
  assert.equal(next.at(-1).phase,"inflight");
  assert.equal(next.at(-1).day,4);
  assert.deepEqual(analyze(next).baseline,b);
});
test("invalid, incomplete and insufficient data never pass",()=>{
  const d=makeScenario("stable");
  assert.throws(()=>analyze(d.filter(e=>e.phase==="inflight")));
  assert.throws(()=>addEntry(d,{heartRate:"",sleepHours:7,mood:4,temperature:36.6}));
  assert.throws(()=>addEntry(d,{heartRate:0,sleepHours:7,mood:4,temperature:36.6}));
  assert.throws(()=>addEntry(d,{heartRate:63,sleepHours:7,mood:3.5,temperature:36.6}));
  assert.throws(()=>makeScenario("unknown"));
});
test("two check-ins on same mission day retain AM/PM labels without changing preflight baseline",()=>{
  const d=makeScenario("stable");
  const baseline=analyze(d).baseline;
  const morning=addEntry(d,{heartRate:64,sleepHours:7,mood:4,temperature:36.6,missionDay:13,slot:"morning"});
  const evening=addEntry(morning,{heartRate:66,sleepHours:7,mood:4,temperature:36.6,missionDay:13,slot:"evening"});
  assert.equal(morning.at(-1).day,13);
  assert.equal(evening.at(-1).day,13);
  assert.equal(evening.at(-1).slot,"evening");
  assert.equal(evening.at(-2).slot,"morning");
  assert.deepEqual(analyze(evening).baseline,baseline);
  assert.throws(()=>addEntry(d,{heartRate:64,sleepHours:7,mood:4,temperature:36.6,missionDay:0,slot:"morning"}));
});
