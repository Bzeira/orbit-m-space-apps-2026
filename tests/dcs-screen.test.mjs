import test from "node:test";
import assert from "node:assert/strict";
import {screenDcsConcern,DCS_SYMPTOMS,DCS_EXAMPLES,DCS_TECH_BRIEF_2026} from "../src/dcs-screen.mjs";

test("official NASA brief is cited as symptom reference, not validated rule",()=>{
  assert.match(DCS_TECH_BRIEF_2026,/nasa\.gov\/wp-content\/uploads\/2023\/12\/ochmo-tb-037/);
  const a=screenDcsConcern(DCS_EXAMPLES.possible);
  assert.ok(a.disclaimer.includes("NOT validated"));
});
test("possible pressure-related concern: DCS not diagnosed or given odds",()=>{
  const a=screenDcsConcern({exposure:"yes",symptoms:["musculoskeletal","itching"]});
  assert.equal(a.status,"POSSIBLE_CONCERN");
  assert.equal(a.kind,"review");
  assert.ok(/possible/i.test(a.title));
  assert.equal(a.probability,undefined);
});
test("serious symptoms trigger urgent review even without recorded decompression",()=>{
  for(const exposure of ["yes","no","unknown"]){
    const a=screenDcsConcern({exposure,symptoms:["breathing"]});
    assert.equal(a.status,"URGENT_REVIEW");
    assert.match(a.nextStep,/mission medical team/);
  }
});
test("new neurological complaint is not converted into type II diagnosis",()=>{
  const a=screenDcsConcern({exposure:"yes",symptoms:["numbness"]});
  assert.equal(a.status,"URGENT_REVIEW");
  assert.ok(!/type II/i.test(a.title));
  assert.ok(!/confirmed/i.test(a.title));
});
test("only mild symptoms without documented pressure change are nonspecific",()=>{
  const a=screenDcsConcern({exposure:"unknown",symptoms:["mildRash"]});
  assert.equal(a.status,"SYMPTOM_REVIEW");
  assert.match(a.reason,/does not support a DCS-specific/);
});
test("no symptoms never yields no-DCS/all-clear conclusion",()=>{
  const a=screenDcsConcern({exposure:"yes",symptoms:[]});
  assert.equal(a.status,"NOT_ASSESSED");
  assert.match(a.title,/not assessed/i);
  assert.ok(!/safe|healthy|clear\b/i.test(a.title));
});
test("unknown symptom codes, repeated symptoms, missing exposure are rejected",()=>{
  assert.throws(()=>screenDcsConcern({exposure:"yes",symptoms:["unlisted"]}));
  assert.throws(()=>screenDcsConcern({exposure:"yes",symptoms:["itching","itching"]}));
  assert.throws(()=>screenDcsConcern({exposure:"unverified",symptoms:[]}));
  assert.throws(()=>screenDcsConcern({exposure:"yes",symptoms:"itching"}));
  assert.equal(Object.keys(DCS_SYMPTOMS).length,8);
});
test("pupil asymmetry triggers urgent review before mild DCS-like symptoms",()=>{
  const r=screenDcsConcern({exposure:"yes",symptoms:["itching"],neuro:{pupils:"asymmetric"}});
  assert.equal(r.status,"URGENT_REVIEW");
  assert.equal(r.priority,1);
  assert.ok(r.neuroConcerns.some(x=>x.includes("Pupil")));
});
test("slurred speech, altered clarity and poor coordination are prioritized regardless of pressure history",()=>{
  const cases=[{speech:"slurred"},{clarity:"altered"},{coordination:"poor"},{coordination:"moderate"}];
  for(const neuro of cases){
    const r=screenDcsConcern({exposure:"unknown",symptoms:[],neuro});
    assert.equal(r.status,"URGENT_REVIEW");
    assert.match(r.furtherAssessment,/neurological examination/);
  }
});
test("milder symptom suspicion includes clinician-only Doppler caveat",()=>{
  const r=screenDcsConcern({exposure:"yes",symptoms:["musculoskeletal"]});
  assert.equal(r.priority,2);
  assert.match(r.furtherAssessment,/Doppler\/ultrasound/);
  assert.match(r.furtherAssessment,/no bubbles do not exclude/);
});
test("localized pain alone is reported after both higher priority groups",()=>{
  const r=screenDcsConcern({exposure:"unknown",symptoms:[],
     painAreas:[{area:"hand",severity:6},{area:"knee",severity:2}]});
  assert.equal(r.status,"LOCAL_CONTACT_CONCERN");
  assert.equal(r.priority,3);
  assert.equal(r.painAreas.length,2);
  assert.ok(!r.title.includes("diagnosis"));
});
test("invalid neurological or pain entries cannot produce reassurance",()=>{
  assert.throws(()=>screenDcsConcern({exposure:"yes",symptoms:[],neuro:{coordination:"excellent"}}));
  assert.throws(()=>screenDcsConcern({exposure:"yes",symptoms:[],painAreas:[{area:"hip",severity:11}]}));
  assert.throws(()=>screenDcsConcern({exposure:"yes",symptoms:[],painAreas:[{area:"foot",severity:2},{area:"foot",severity:4}]}));
});
