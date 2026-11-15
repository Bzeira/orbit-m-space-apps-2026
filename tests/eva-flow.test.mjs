import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext} from "node:vm";
const base=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const fullScript=readFileSync(resolve(base,"src/eva-flow.mjs"),"utf8");
const criticalModule=readFileSync(resolve(base,"src/eva-critical.mjs"),"utf8");
const script=criticalModule.replace(/\bexport\s+/g,"")+"\n"+
  fullScript.replace(/^import [^\n]+ from "\.\/eva-critical\.mjs";\n/,"");
const style=readFileSync(resolve(base,"assets/eva-flow.css"),"utf8");
const page=readFileSync(resolve(base,"index.html"),"utf8");
function harness(search=""){
  const handlers={},values={};
  const root={hidden:false,scrollTop:0,innerHTML:"",
    setAttribute(){},addEventListener(name,fn){handlers[name]=fn;},
    contains(){return true;},querySelector(q){
      if(q==="h1,[data-autofocus]"||q===".eva-close")return {focus(){}};
      return values[q]||null;
    }};
  const body={style:{},append(node){assert.equal(node,root);}};
  const context={document:{body,createElement(){return root;},getElementById(){return null;}},
    window:{addEventListener(){}},location:{search,pathname:"/index.html",hash:""},
    URLSearchParams,history:{replaceState(){}},console,Math};
  const api=runInNewContext(script+"\n;({preEvaInspect,preEvaRanges,preEvaEmpty})",context,{filename:"eva-flow-tests.mjs"});
  function click(action,id){
    const button={dataset:{action,id}};
    handlers.click({target:{closest:()=>button}});
  }
  function submit(formId){handlers.submit({target:{id:formId},preventDefault(){}});}
  function updateVital(key,value){values['[name="'+key+'"]']={value:String(value)};}
  function simulateInput(){handlers.input({target:{closest:(selector)=>selector==="#evaVitalsForm"}});}
  return {root,values,click,submit,updateVital,simulateInput,api,context};
}
function beginAstronaut(h,id=1){
  h.click("start");
  h.values["#evaIdNumber"]={value:String(id)};
  h.submit("evaIdForm");
  assert.match(h.root.innerHTML,/Astronaut ID/);
}
function proceedToVitals(h,days=12,purpose="Equipment inspection"){
  h.values["#evaMissionLength"]={value:String(days)};
  h.values["#evaMissionPurpose"]={value:purpose};
  h.submit("evaMissionForm");
  assert.match(h.root.innerHTML,/Pre-EVA Vital Signs/);
  assert.match(h.root.innerHTML,/evaVitalsForm/);
}
function enterVitals(h,overrides={}){
  const defaults={
    heartRate:78,spo2:98,systolic:120,diastolic:80,
    temperature:36.7,breaths:8,interval:30
  };
  for(const [key,value] of Object.entries({...defaults,...overrides}))h.updateVital(key,value);
  h.simulateInput();
}
test("EVA-only site preserves styling but excludes the retired full dashboard",()=>{
  assert.match(page,/src\/eva-flow\.mjs/);
  assert.match(page,/assets\/eva-flow\.css/);
  assert.doesNotMatch(page,/id="monitor"/);
  assert.doesNotMatch(page,/src\/cardiovascular-ui\.mjs/);
  assert.doesNotMatch(page,/Notice the change|Full crew dashboard|Guided demo/);
  assert.match(style,/#orbitEvaFlow \.eva-critical/);
  assert.doesNotMatch(style,/(^|\n)body\s*\{/);
  assert.match(criticalModule,/30 seconds/);
  assert.match(criticalModule,/60 seconds/);
});
test("astronaut identification, profile report, vital entry and simulated green approval",()=>{
  const h=harness();
  assert.match(h.root.innerHTML,/welcome/);
  h.click("start");
  assert.match(h.root.innerHTML,/ASTRONAUT ID SYSTEM/);
  h.values["#evaIdNumber"]={value:"11"};
  h.values["#evaIdError"]={textContent:""};
  h.submit("evaIdForm");
  assert.match(h.values["#evaIdError"].textContent,/1 to 10/);
  h.values["#evaIdNumber"].value="1";
  h.submit("evaIdForm");
  h.click("metric","sleep");
  assert.match(h.root.innerHTML,/PROFILE REFERENCE RANGE/);
  assert.doesNotMatch(h.root.innerHTML,/12 fictional observations/);
  h.click("close");
  proceedToVitals(h);
  enterVitals(h);
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/EVA mission<br>approved/);
});
test("abnormal profile causes red warning, with profile category report",()=>{
  const h=harness();beginAstronaut(h,2);
  proceedToVitals(h,21);
  enterVitals(h);
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/EVA NOT AUTHORIZED/);
  h.click("flags");
  assert.match(h.root.innerHTML,/Parameters outside demo range/);
  assert.match(h.root.innerHTML,/body temp/);
  assert.match(h.root.innerHTML,/bpm/);
});
test("critical SpO2 and pulse pressure violations enter the warning report",()=>{
  const h=harness();beginAstronaut(h,1);
  proceedToVitals(h);
  enterVitals(h,{spo2:92,systolic:105,diastolic:80});
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/EVA NOT AUTHORIZED/);
  h.click("flags");
  assert.match(h.root.innerHTML,/Oxygen saturation/);
  assert.match(h.root.innerHTML,/Pulse pressure/);
  h.click("critical");
  assert.match(h.root.innerHTML,/Pre-EVA Vital Signs/);
  // Inputs survive return to the pre-EVA page for correction.
  assert.match(h.root.innerHTML,/name="spo2"[^>]*value="92"/);
});
test("boundary ranges, PP, MAP and short-interval respiratory conversion",()=>{
  const h=harness();
  const r=h.api.preEvaInspect({
    heartRate:"60",spo2:"95",systolic:"120",diastolic:"80",
    temperature:"38.7",breaths:"6",interval:"30"
  });
  assert.equal(r.valid,true);
  assert.equal(r.data.pp,40);
  assert.ok(Math.abs(r.data.map-93.3333333333)<1e-6);
  assert.equal(r.data.respRate,12);
  assert.equal(r.issues.length,0,"Temperature not flagged because no range provided.");
  const next=h.api.preEvaInspect({
    heartRate:"100",spo2:"100",systolic:"120",diastolic:"60",
    temperature:"39",breaths:"20",interval:"60"
  });
  assert.equal(next.data.pp,60);
  assert.equal(next.data.respRate,20);
  assert.equal(next.issues.length,0);
});
test("missing and contradictory pressure inputs block evaluation without generating approval",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  h.values["#evaVitalsFeedback"]={textContent:""};
  h.submit("evaVitalsForm");
  assert.match(h.values["#evaVitalsFeedback"].textContent,/Complete all six/);
  assert.match(h.root.innerHTML,/Pre-EVA Vital Signs/);
  enterVitals(h,{systolic:70,diastolic:80});
  h.submit("evaVitalsForm");
  assert.match(h.values["#evaVitalsFeedback"].textContent,/higher than diastolic/);
  assert.match(h.root.innerHTML,/Pre-EVA Vital Signs/);
});
test("live preview and back/forward preserve unsaved measurements",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  h.values['[data-vital-value="pp"]']={textContent:""};
  h.values['[data-vital-value="map"]']={textContent:""};
  h.values['[data-vital-value="respRate"]']={textContent:""};
  h.values['[data-vital-status="pp"]']={textContent:"",className:""};
  enterVitals(h);
  assert.equal(h.values['[data-vital-value="pp"]'].textContent,"40");
  assert.equal(h.values['[data-vital-value="map"]'].textContent,"93.3");
  assert.equal(h.values['[data-vital-value="respRate"]'].textContent,"16");
  assert.equal(h.values['[data-vital-status="pp"]'].textContent,"Within range");
  h.click("dashboard");
  proceedToVitals(h);
  assert.match(h.root.innerHTML,/name="spo2"[^>]*value="98"/);
});
test("fixing the profile, combined with acceptable immediate readings, changes demonstration result",()=>{
  const h=harness();beginAstronaut(h,4);
  assert.match(h.root.innerHTML,/Abnormal/);
  h.click("toggle","vision");
  proceedToVitals(h,7);
  enterVitals(h);
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/EVA mission<br>approved/);
});

test("all seven immediate pre-EVA summary rows open an accurate reference chart",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:78,spo2:98,systolic:120,diastolic:80,breaths:8,interval:30});
  const cases=[
    ["heartRate","60","100","78"],
    ["spo2","95","100","98"],
    ["systolic","90","120","120"],
    ["diastolic","60","80","80"],
    ["pp","40","60","40"],
    ["map","70","100","93.3"],
    ["respRate","12","20","16"]
  ];
  for(const [key,min,max,value] of cases){
    assert.match(h.root.innerHTML,new RegExp('data-action="criticalMetric" data-id="'+key+'"'));
    h.click("criticalMetric",key);
    assert.match(h.root.innerHTML,/PRE-EVA REFERENCE RANGE/);
    assert.match(h.root.innerHTML,/Entered reading:/);
    assert.ok(h.root.innerHTML.includes("reference band "+min+" to "+max),key+" correct band");
    assert.ok(h.root.innerHTML.includes("entered value "+value),key+" current entered value");
    assert.doesNotMatch(h.root.innerHTML,/12 fictional observations/,"Do not invent a time series.");
    h.click("close");
  }
  assert.doesNotMatch(h.root.innerHTML,/data-action="criticalMetric" data-id="temperature"/,
    "Temperature has no user-supplied reference band.");
});
test("a vital flagged on red decision opens its graph, not just the data entry page",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{spo2:92,systolic:105,diastolic:80});
  h.submit("evaVitalsForm");
  h.click("flags");
  assert.match(h.root.innerHTML,/data-action="criticalMetric" data-id="spo2"/);
  assert.match(h.root.innerHTML,/data-action="criticalMetric" data-id="pp"/);
  h.click("criticalMetric","spo2");
  assert.match(h.root.innerHTML,/Oxygen saturation/);
  assert.match(h.root.innerHTML,/Outside range/);
  assert.match(h.root.innerHTML,/entered value 92/);
  h.click("flags");
  assert.match(h.root.innerHTML,/Parameters outside demo range/);
});
test("unentered vital displays its reference interval without fictional observations",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  h.click("criticalMetric","heartRate");
  assert.match(h.root.innerHTML,/Awaiting input/);
  assert.match(h.root.innerHTML,/Enter a reading to place the marker/);
  assert.match(h.root.innerHTML,/60–100 bpm/);
  assert.doesNotMatch(h.root.innerHTML,/12 fictional observations/);
});


test("lab-style graph uses a single horizontal reference line, boundary ticks and units",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:78,spo2:98,systolic:120,diastolic:80,breaths:8,interval:30});
  h.click("criticalMetric","heartRate");
  assert.match(h.root.innerHTML,/data-reference-line="true" x1="115" x2="495" y1="116" y2="116"/);
  assert.match(h.root.innerHTML,/font-size="23">60<\/text>/);
  assert.match(h.root.innerHTML,/font-size="23">100<\/text>/);
  assert.match(h.root.innerHTML,/font-size="22">bpm<\/text>/);
  assert.match(h.root.innerHTML,/font-size="32">78<\/text>/);
  assert.match(h.root.innerHTML,/data-value-marker="true" cx="/);
  assert.doesNotMatch(h.root.innerHTML,/<rect x="[^"]+" y="90" /,
    "Lab-style graph should be a single reference line, without the old shaded band");
});
test("out-of-range markers sit beyond the reference line; in-range markers stay on it",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:105,spo2:92,systolic:120,diastolic:80,breaths:8,interval:30});
  h.click("criticalMetric","heartRate");
  let match=h.root.innerHTML.match(/data-value-marker="true" cx="([\d.]+)"/);
  assert.ok(match);
  assert.ok(Number(match[1])>495,"105 bpm is to the right of 100 bpm boundary");
  assert.match(h.root.innerHTML,/fill="#bc3b46"/);
  h.click("close");
  h.click("criticalMetric","spo2");
  match=h.root.innerHTML.match(/data-value-marker="true" cx="([\d.]+)"/);
  assert.ok(match);
  assert.ok(Number(match[1])<115,"92% is left of the 95% boundary");
  h.click("close");
  h.click("criticalMetric","pp");
  match=h.root.innerHTML.match(/data-value-marker="true" cx="([\d.]+)"/);
  assert.ok(match);
  assert.ok(Number(match[1])>=115&&Number(match[1])<=495);
  assert.match(h.root.innerHTML,/fill="#34804c"/);
});

test("every astronaut profile modal has a horizontal reference line, not fictional timeseries",()=>{
  for(const [id,expected] of [["sleep","70 to 100"],["bpm","60 to 100"],["anatomy","70 to 100"],["fitness","70 to 100"],["ent","70 to 100"],["temperature","36 to 37.5"],["vision","70 to 100"]]){
    const h=harness();beginAstronaut(h,1);
    h.click("metric",id);
    assert.match(h.root.innerHTML,/PROFILE REFERENCE RANGE/);
    assert.match(h.root.innerHTML,/data-reference-line="true"/);
    assert.match(h.root.innerHTML,/data-value-marker="true"/);
    assert.doesNotMatch(h.root.innerHTML,/12 fictional observations|SYNTHETIC PARAMETER HISTORY/);
  }
});
test("old dashboard query no longer exposes previous website",()=>{
  const h=harness("?dashboard=1");
  assert.match(h.root.innerHTML,/welcome/);
  assert.doesNotMatch(page,/Notice the change|Know what to check|id="flightStory"/);
});
test("offline shell caches only EVA files and retired dashboard bypass does not work",()=>{
  const worker=readFileSync(resolve(base,"sw.js"),"utf8");
  assert.match(worker,/src\/eva-flow\.mjs/);
  assert.match(worker,/src\/eva-critical\.mjs/);
  assert.match(worker,/assets\/eva-flow\.css/);
  const h=harness("?dashboard=1");
  assert.equal(h.root.hidden,false);
  assert.match(h.root.innerHTML,/welcome/);
  assert.doesNotMatch(fullScript,/open-dashboard|SYNTHETIC PARAMETER HISTORY/);
  assert.doesNotMatch(worker,/src\/app\.mjs|assets\/app\.css|src\/research\.mjs/);
  for(const file of ["src/app.mjs","src/engine.mjs","assets/app.css","tests/engine.test.mjs"]){
    assert.equal(existsSync(resolve(base,file)),false,file+" should be deleted");
  }
});