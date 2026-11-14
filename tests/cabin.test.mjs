import test from "node:test";
import assert from "node:assert/strict";
import {
  NOMINAL_CO2_ONE_HOUR_MAX_MMHG,NASA_CABIN_STANDARD,
  cabinMissionScene,cabinMissionTrend,validateCabinReading,reviewCabinAndCrew
} from "../src/cabin.mjs";
const entry={day:17,co2OneHourMmHg:3.4,oxygenPartialMmHg:158,
  pressureKPa:101,temperatureC:22.5,humidityPercent:47,
  symptoms:["headache","focus"]};

test("NASA-STD-3001 nominal ppCO2 requirement uses a one-hour average, not momentary readings",()=>{
  assert.equal(NOMINAL_CO2_ONE_HOUR_MAX_MMHG,3);
  assert.match(NASA_CABIN_STANDARD,/nasa\.gov/);
  const at=reviewCabinAndCrew({...entry,co2OneHourMmHg:3});
  const above=reviewCabinAndCrew({...entry,co2OneHourMmHg:3.01});
  assert.equal(at.aboveNominal,false);
  assert.equal(above.aboveNominal,true);
  assert.match(above.context,/One-hour mean/);
  assert.match(above.context,/nominal habitat design reference/);
});

test("the overlap is explicitly noncausal, never an automatic hypoxia diagnosis",()=>{
  const result=reviewCabinAndCrew(entry);
  assert.equal(result.category,"ABOVE_NOMINAL_REFERENCE");
  assert.equal(result.coObserved,true);
  assert.equal(result.clinicalDiagnosis,false);
  assert.equal(result.causalConclusion,false);
  assert.match(result.association,/co-occurrence only/);
  assert.match(result.association,/cannot establish/);
  assert.match(result.oxygenNote,/not calculated or screened for hypoxia/);
});

test("crew symptoms are recorded and interpreted even when CO2 is below nominal reference",()=>{
  const result=reviewCabinAndCrew({...entry,co2OneHourMmHg:2.2});
  assert.equal(result.category,"SYMPTOM_CONTEXT");
  assert.equal(result.coObserved,false);
  assert.match(result.association,/cannot rule out/);
});

test("above-reference cabin CO2 without symptoms remains environmental comparison, not safety verdict",()=>{
  const result=reviewCabinAndCrew({...entry,symptoms:[]});
  assert.equal(result.category,"ABOVE_NOMINAL_REFERENCE");
  assert.equal(result.coObserved,false);
  assert.match(result.next,/sensor quality/);
});

test("no symptoms and below reference is not medical clearance",()=>{
  const result=reviewCabinAndCrew({...entry,co2OneHourMmHg:1.8,symptoms:[]});
  assert.equal(result.category,"AT_OR_BELOW_REFERENCE");
  assert.match(result.association,/does not establish/);
  assert.match(result.next,/no safety or health clearance/);
});

test("input must be complete, finite, plausible and use declared units",()=>{
  for(const patch of [
    {oxygenPartialMmHg:""},{co2OneHourMmHg:""},{co2OneHourMmHg:-1},
    {co2OneHourMmHg:Infinity},{pressureKPa:NaN},{temperatureC:100},
    {humidityPercent:101},{day:0},{day:4.1},{symptoms:["bogus"]},
    {symptoms:["headache","headache"]},{symptoms:["none"]}
  ]){
    assert.throws(()=>validateCabinReading({...entry,...patch}),JSON.stringify(patch));
  }
});

test("guided story cabin values are synthetic and tied to the same four mission days",()=>{
  const trend=cabinMissionTrend();
  assert.deepEqual(trend.map(x=>x.day),[12,15,17,19]);
  assert.deepEqual(trend.map(x=>x.aboveNominal),[false,false,true,false]);
  assert.deepEqual([12,15,17,19].map(x=>cabinMissionScene(x).synthetic),[true,true,true,true]);
  assert.equal(cabinMissionScene(17).coObserved,true);
  assert.equal(cabinMissionScene(19).aboveNominal,false);
  assert.throws(()=>cabinMissionScene(16));
});

test("mutating a returned scene cannot alter a later scene",()=>{
  const first=cabinMissionScene(17);
  first.symptoms.push("sleep");
  const next=cabinMissionScene(17);
  assert.deepEqual(next.symptoms,["headache","focus"]);
});

test("ambient oxygen is contextual; no false physiological inference from isolated ppO2",()=>{
  const low=reviewCabinAndCrew({...entry,oxygenPartialMmHg:100,co2OneHourMmHg:2,symptoms:[]});
  const high=reviewCabinAndCrew({...entry,oxygenPartialMmHg:180,co2OneHourMmHg:2,symptoms:[]});
  assert.equal(low.category,high.category);
  assert.equal(low.clinicalDiagnosis,false);
  assert.equal(high.clinicalDiagnosis,false);
});
