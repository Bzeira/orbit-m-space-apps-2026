import test from "node:test";
import assert from "node:assert/strict";
import {ISS_INFLIGHT_LIMITS,checkSample,checkEva,makeDemoSamples,makeDemoEva,sampleOptions} from "../src/research.mjs";

test("ISS in-flight NASA values have exact numeric units",()=>{
  assert.deepEqual(ISS_INFLIGHT_LIMITS["air:bacteria"],{limit:1000,unit:"CFU/m³",label:"Air • bacteria"});
  assert.equal(ISS_INFLIGHT_LIMITS["air:fungi"].limit,100);
  assert.equal(ISS_INFLIGHT_LIMITS["surface:bacteria"].limit,10000);
  assert.equal(ISS_INFLIGHT_LIMITS["surface:fungi"].limit,100);
  assert.equal(ISS_INFLIGHT_LIMITS["water:bacteria"].unit,"CFU/mL");
  assert.equal(ISS_INFLIGHT_LIMITS["water:bacteria"].limit,50);
});
test("reference comparison never diagnoses",()=>{
  const a=checkSample({kind:"air",organism:"bacteria",location:"Cabin A",value:1001});
  assert.equal(a.comparison,"ABOVE REFERENCE");
  assert.equal(a.reference,1000);
  const b=checkSample({kind:"air",organism:"bacteria",location:"Cabin A",value:1000});
  assert.equal(b.comparison,"AT OR BELOW REFERENCE");
});
test("only verified sample combinations can be compared",()=>{
  assert.deepEqual(sampleOptions("water"),["bacteria"]);
  assert.throws(()=>checkSample({kind:"water",organism:"fungi",location:"Galley",value:1}));
  assert.throws(()=>checkSample({kind:"air",organism:"bacteria",location:"Cabin",value:-1}));
  assert.throws(()=>checkSample({kind:"air",organism:"bacteria",location:"Cabin",value:""}));
});
test("water coliform status is separate from bacterial colony count",()=>{
  const inputs={kind:"water",organism:"bacteria",location:"Outlet",value:25};
  assert.equal(checkSample({...inputs,coliform:"detected"}).comparison,"COLIFORM DETECTED");
  assert.equal(checkSample({...inputs,coliform:"not_detected"}).comparison,"AT OR BELOW REFERENCE");
  assert.equal(checkSample({...inputs,coliform:"not_tested"}).comparison,"INCOMPLETE WATER CHECK");
  assert.throws(()=>checkSample({...inputs,coliform:"clear"}));
});
test("synthetic sample fixtures are valid and labelled",()=>{
  const rows=makeDemoSamples();
  assert.equal(rows.length,3);
  assert.ok(rows.every(x=>x.demo===true));
  assert.equal(rows[1].comparison,"ABOVE REFERENCE");
});
test("EVA 0–10 self report is recorded without diagnosis",()=>{
  const p=checkEva({area:"hand",side:"right",severity:"4",event:"EVA-004",kind:"pressure",onset:"during",suitFit:"contact",status:"ongoing",note:"Synthetic note"});
  assert.equal(p.severity,4);
  assert.equal(p.status,"ongoing");
  assert.equal(p.region,"Hands & fingers");
});
test("EVA malformed reports fail closed",()=>{
  const base={area:"foot",side:"left",severity:3,event:"EVA-005",kind:"skin",onset:"after",suitFit:"normal",status:"improving",note:""};
  assert.throws(()=>checkEva({...base,severity:11}));
  assert.throws(()=>checkEva({...base,severity:1.5}));
  assert.throws(()=>checkEva({...base,area:"unknown"}));
  assert.throws(()=>checkEva({...base,event:""}));
  assert.throws(()=>checkEva({...base,status:"cleared"}));
});
test("EVA demo includes changed and resolved follow-ups",()=>{
  const rows=makeDemoEva();
  assert.equal(rows.length,3);
  assert.ok(rows.some(x=>x.status==="resolved"));
  assert.ok(rows.some(x=>x.status==="improving"));
});
