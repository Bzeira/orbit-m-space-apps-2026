import test from "node:test";
import assert from "node:assert/strict";
import {analyze,makeScenario,addEntry} from "../src/engine.mjs";

test("stable synthetic telemetry has no review flags",()=>{
  const r=analyze(makeScenario("stable"));
  assert.equal(r.status,"WITHIN PERSONAL PATTERN");
  assert.equal(r.flags.length,0);
});
test("fatigue changes trigger explainable flags",()=>{
  const r=analyze(makeScenario("fatigue"));
  assert.equal(r.flags.some(f=>f.metric==="heartRate"),true);
  assert.equal(r.flags.some(f=>f.metric==="sleepHours"),true);
  assert.equal(r.flags.some(f=>f.metric==="mood"),true);
});
test("high simulated temperature triggers review",()=>{
  const r=analyze(makeScenario("temperature"));
  assert.equal(r.flags.some(f=>f.metric==="temperature"),true);
});
test("day is advanced and invalid values rejected",()=>{
  const rows=makeScenario("stable");
  const next=addEntry(rows,{heartRate:62,sleepHours:7,mood:4,temperature:36.5});
  assert.equal(next.length,8);
  assert.equal(next[7].day,8);
  assert.throws(()=>addEntry(rows,{heartRate:0,sleepHours:7,mood:4,temperature:36.5}));
});