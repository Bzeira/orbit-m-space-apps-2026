import test from "node:test";
import assert from "node:assert/strict";
import {PARAMETERS,parseAstronautId,createAstronaut,parameterStatus,assessReadiness,setParameterState} from "../src/astronaut.mjs";

test("ID input accepts only whole-number IDs 1–10",()=>{
  for(let id=1;id<=10;id++) {
    assert.equal(parseAstronautId(id),id);
    assert.equal(parseAstronautId(" "+id+" "),id);
  }
  for(const input of ["", " ", 0, 11, -1, 1.2, "1e0", "0x1", "2abc", true, null, undefined, {}, "Infinity"]) {
    assert.equal(parseAstronautId(input),null,String(input));
    assert.throws(()=>createAstronaut(input));
  }
});

test("all ten isolated fictional records have reproducible preflight baselines and mission trends",()=>{
  for(let id=1;id<=10;id++) {
    const astronaut=createAstronaut(id);
    assert.deepEqual(astronaut,createAstronaut(id));
    assert.equal(astronaut.synthetic,true);
    assert.deepEqual(astronaut.parameters.map(row=>row.key),PARAMETERS.map(row=>row.key));
    for(const row of astronaut.parameters) {
      assert.equal(row.evidence,"DEMO");
      assert.equal(row.preflight.length,14);
      assert.equal(row.inflight.length,7);
      assert.equal(row.inflight.at(-1).value,row.current);
      const sorted=row.preflight.map(point=>point.value).sort((a,b)=>a-b);
      assert.equal(row.baseline,Number(((sorted[6]+sorted[7])/2).toFixed(1)));
    }
  }
});

test("readiness uses all seven actual values and never grants medical clearance",()=>{
  for(let id=1;id<=10;id++) {
    const astronaut=createAstronaut(id);
    const result=assessReadiness(astronaut);
    assert.equal(result.approved,[1,5,8].includes(id));
    assert.equal(result.medicalClearance,false);
    assert.equal(result.synthetic,true);
    assert.deepEqual(result.findings.map(row=>row.key),astronaut.parameters.filter(row=>parameterStatus(row)!=="normal").map(row=>row.key));
  }
  assert.deepEqual(assessReadiness(createAstronaut(2)).findings.map(row=>row.key),["bpm","temperature"]);
  assert.throws(()=>assessReadiness({...createAstronaut(1),synthetic:false}));
});

test("missing, nonfinite or invalid range data cannot produce an approved result",()=>{
  for(const patch of [{current:NaN},{current:null},{current:Infinity},{range:{min:80,max:70}},{range:{min:0,max:NaN}}]) {
    const astronaut=createAstronaut(1);
    Object.assign(astronaut.parameters[0],patch);
    const result=assessReadiness(astronaut);
    assert.equal(result.approved,false);
    assert.equal(result.findings[0].status,"unavailable");
  }
  const astronaut=createAstronaut(1);
  astronaut.parameters.pop();
  assert.deepEqual(assessReadiness(astronaut).findings,[{key:"vision",label:"vision",status:"unavailable"}]);
});

test("range boundaries are inclusive, and values immediately outside are abnormal",()=>{
  const parameter=createAstronaut(1).parameters[0];
  assert.equal(parameterStatus({...parameter,current:parameter.range.min}),"normal");
  assert.equal(parameterStatus({...parameter,current:parameter.range.max}),"normal");
  assert.equal(parameterStatus({...parameter,current:parameter.range.min-.1}),"abnormal");
  assert.equal(parameterStatus({...parameter,current:parameter.range.max+.1}),"abnormal");
});

test("original arrow controls update readings, report data and assessment together without changing preflight",()=>{
  for(const definition of PARAMETERS) {
    const astronaut=createAstronaut(1);
    const other=createAstronaut(2);
    const baseline=structuredClone(astronaut.parameters.find(row=>row.key===definition.key).preflight);
    const otherBefore=structuredClone(other);
    const row=setParameterState(astronaut,definition.key,"abnormal");
    assert.equal(parameterStatus(row),"abnormal");
    assert.equal(row.current,row.inflight.at(-1).value);
    assert.equal(assessReadiness(astronaut).approved,false);
    assert.deepEqual(row.preflight,baseline);
    setParameterState(astronaut,definition.key,"normal");
    assert.equal(parameterStatus(row),"normal");
    assert.equal(row.current,row.baseline);
    assert.equal(row.current,row.inflight.at(-1).value);
    assert.equal(assessReadiness(astronaut).approved,true);
    assert.deepEqual(other,otherBefore);
  }
  assert.throws(()=>setParameterState(createAstronaut(1),"unknown","normal"));
  assert.throws(()=>setParameterState(createAstronaut(1),"sleep","invalid"));
});
