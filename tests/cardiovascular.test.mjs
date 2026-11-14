import test from "node:test";
import assert from "node:assert/strict";
import {calculateBp,bpBaseline,checkCardioEntry,addCardioEntry,plannedReturn,
  evaluateCardio,gravityReturnMessage,demoCardioHistory,DEMO_SHIFT} from "../src/cardiovascular.mjs";
const mission={durationDays:180,missionDay:13};
test("PP is systolic minus diastolic and MAP is a one-third approximation",()=>{
  const r=calculateBp(120,80);
  assert.equal(r.pp,40);
  assert.ok(Math.abs(r.map-93.3333333333)<1e-6);
  assert.match(r.mapMethod,/approximation/);
});
test("BP validation rejects swapped, nonnumeric and unusable readings",()=>{
  for(const [s,d] of [[80,120],["",80],[NaN,70],[120,120],[280,80]]){
    assert.throws(()=>calculateBp(s,d));
  }
});
test("synthetic preflight baseline uses medians, not NASA population values",()=>{
  const x=bpBaseline();
  assert.equal(x.systolic,118);assert.equal(x.diastolic,76);assert.equal(x.pp,42);
});
test("manual morning/evening readings and optional extra in one mission day",()=>{
  const a=checkCardioEntry({day:13,slot:"morning",context:"habitat",systolic:120,diastolic:80,symptom:"none"},mission);
  const b=checkCardioEntry({day:13,slot:"evening",context:"eva",systolic:116,diastolic:75,symptom:"none"},mission);
  const rows=addCardioEntry(addCardioEntry([],a,mission),b,mission);
  assert.equal(rows.length,2);
  assert.throws(()=>addCardioEntry(rows,a,mission));
  assert.equal(addCardioEntry(rows,{...a,slot:"extra"},mission).length,3);
});
test("severe reported symptoms always take priority, regardless of numeric readings",()=>{
  const bp=checkCardioEntry({day:13,slot:"extra",context:"gravity-return",systolic:118,diastolic:76,symptom:"chest"},mission);
  const decision=evaluateCardio(bp);
  assert.equal(decision.category,"URGENT");
  assert.match(decision.action,/emergency/);
});
test("individual change marker is explicit project-made, not a diagnosis",()=>{
  const row=checkCardioEntry({day:13,slot:"extra",context:"eva",systolic:140,diastolic:80,symptom:"none"},mission);
  const decision=evaluateCardio(row);
  assert.equal(decision.category,"REVIEW");
  assert.equal(DEMO_SHIFT,20);
  assert.match(decision.reason,/team-created/);
  assert.match(decision.contextNote,/NOT changed to a 1\/2 coefficient/);
});
test("no flagged change never yields clinical clearance",()=>{
  const row=checkCardioEntry({day:13,slot:"evening",context:"habitat",systolic:118,diastolic:76,symptom:"none"},mission);
  const outcome=evaluateCardio(row);
  assert.equal(outcome.category,"LOGGED");
  assert.match(outcome.reason,/does not establish health/);
});
test("gravity-return milestone is checked against mission duration",()=>{
  assert.equal(plannedReturn("160",mission),160);
  assert.equal(plannedReturn("",mission),null);
  assert.throws(()=>plannedReturn(200,mission));
  assert.match(gravityReturnMessage(160,150),/10 mission day/);
  assert.equal(demoCardioHistory(mission).length,2);
});
