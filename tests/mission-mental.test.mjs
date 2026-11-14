import test from "node:test";
import assert from "node:assert/strict";
import {checkMission,checkMentalEntry,addMentalEntry,getDaySchedule,explainMental,demoMentalEntries} from "../src/mission-mental.mjs";
const mission={durationDays:180,missionDay:12};
test("mission duration limits check-in day",()=>{
  assert.deepEqual(checkMission(mission),{durationDays:180,missionDay:12,slotsPerDay:2});
  assert.throws(()=>checkMission({durationDays:0,missionDay:1}));
  assert.throws(()=>checkMission({durationDays:3,missionDay:4}));
  assert.throws(()=>checkMission({durationDays:1.5,missionDay:1}));
});
test("two planned check-ins per day and optional extras",()=>{
  const rows=demoMentalEntries();
  assert.deepEqual(getDaySchedule(rows,12).map(x=>x.recorded),[true,true]);
  assert.deepEqual(getDaySchedule(rows,13).map(x=>x.recorded),[false,false]);
  const extra=addMentalEntry(rows,{...rows[0],slot:"extra"},mission);
  assert.equal(extra.length,3);
  assert.throws(()=>addMentalEntry(rows,rows[0],mission));
});
test("behavioral self-reports do not produce diagnoses",()=>{
  const row=checkMentalEntry({...demoMentalEntries()[0],stress:5,anxiety:4},mission);
  const r=explainMental(row);
  assert.equal(r.attention,true);
  assert.ok(r.flagged.includes("higher stress"));
  assert.match(r.message,/not a mental-health diagnosis/);
  assert.equal(r.probability,undefined);
});
test("private support check-in is a prompt not actual messaging",()=>{
  const row=checkMentalEntry({...demoMentalEntries()[0],support:"yes"},mission);
  assert.match(explainMental(row).message,/sends no messages/);
});
test("invalid mental ratings and physiology rejected",()=>{
  const row=demoMentalEntries()[0];
  assert.throws(()=>checkMentalEntry({...row,focus:6},mission));
  assert.throws(()=>checkMentalEntry({...row,anxiety:2.5},mission));
  assert.throws(()=>checkMentalEntry({...row,heartRate:""},mission));
  assert.throws(()=>checkMentalEntry({...row,day:999},mission));
});