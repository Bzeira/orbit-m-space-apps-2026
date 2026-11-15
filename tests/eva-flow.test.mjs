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
  fullScript.replace(/^import [^\n]+ from "\.\/eva-critical\.mjs(?:\?[^"]+)?";\n/,"");
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
    heartRate:78,spo2:98,systolic:115,diastolic:72,
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
  assert.equal(r.issues.filter(row=>row.key!=="temperature").length,0);
  assert.equal(r.issues.find(row=>row.key==="temperature").value,38.7);
  const next=h.api.preEvaInspect({
    heartRate:"100",spo2:"100",systolic:"120",diastolic:"60",
    temperature:"39",breaths:"20",interval:"60"
  });
  assert.equal(next.data.pp,60);
  assert.equal(next.data.respRate,20);
  assert.equal(next.issues.find(row=>row.key==="temperature").value,39);
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
  enterVitals(h,{systolic:120,diastolic:80});
  assert.equal(h.values['[data-vital-value="pp"]'].textContent,"40");
  assert.equal(h.values['[data-vital-value="map"]'].textContent,"93.3");
  assert.equal(h.values['[data-vital-value="respRate"]'].textContent,"16");
  assert.equal(h.values['[data-vital-status="pp"]'].textContent,"Near limit");
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

test("all eight immediate pre-EVA summary rows open an accurate reference chart",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:78,spo2:98,systolic:120,diastolic:80,breaths:8,interval:30});
  const cases=[
    ["heartRate","60","100","78"],
    ["spo2","95","100","98"],
    ["systolic","90","120","120"],
    ["diastolic","60","80","80"],
    ["pp","40","60","40"],
    ["map","70","100","93.3"],
    ["respRate","12","20","16"],
    ["temperature","36","37.5","36.7"]
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
  assert.match(h.root.innerHTML,/data-action="criticalMetric" data-id="temperature"/,
    "Temperature is now interactive and has an illustrative reference band.");
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
  assert.match(h.root.innerHTML,/fill="#b27b2d"/);
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
test("a single in-range near-limit reading routes to further inspection",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:62});
  const inspected=h.api.preEvaInspect({
    heartRate:"62",spo2:"98",systolic:"115",diastolic:"72",
    temperature:"36.7",breaths:"8",interval:"30"
  });
  assert.equal(inspected.valid,true);
  assert.equal(inspected.issues.length,0);
  assert.equal(inspected.reviewFlags.length,1);
  assert.equal(inspected.reviewFlags[0].key,"heartRate");
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/NEEDS FURTHER<br>INSPECTION/);
  assert.match(h.root.innerHTML,/CLICK TO CHECK FURTHER INFO/);
  h.click("review");
  assert.match(h.root.innerHTML,/Further inspection needed/);
  assert.match(h.root.innerHTML,/62 bpm/);
  assert.match(h.root.innerHTML,/60–100 bpm/);
  assert.doesNotMatch(h.root.innerHTML,/Oxygen saturation.*Near lower limit/s);
  h.click("criticalMetric","heartRate");
  assert.match(h.root.innerHTML,/PRE-EVA REFERENCE RANGE/);
  assert.match(h.root.innerHTML,/Needs inspection/);
  assert.match(h.root.innerHTML,/Back to near-limit readings/);
  h.click("review");
  assert.match(h.root.innerHTML,/Further inspection needed/);
});
test("intermediate review uses pixel-art park reference without altering other outcomes",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:62});
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/eva-review-scene/);
  assert.match(h.root.innerHTML,/eva-review-title\.svg/);
  assert.match(h.root.innerHTML,/eva-review-cursor/);
  assert.match(h.root.innerHTML,/CLICK TO CHECK FURTHER INFO/);
  assert.match(h.root.innerHTML,/data-action="review"/);
  assert.match(style,/eva-review-scene\.svg/);
  assert.match(style,/image-rendering:pixelated/);
  h.click("review");
  assert.match(h.root.innerHTML,/62 bpm/);
  assert.match(h.root.innerHTML,/Near lower limit/);
  h.click("criticalMetric","heartRate");
  assert.match(h.root.innerHTML,/PRE-EVA REFERENCE RANGE/);
});

test("pixel review graphics exist and are scoped to the intermediate screen",()=>{
  const scene=readFileSync(resolve(base,"assets/eva-review-scene.svg"),"utf8");
  const title=readFileSync(resolve(base,"assets/eva-review-title.svg"),"utf8");
  assert.match(scene,/<svg[^>]+viewBox="0 0 960 540"/);
  assert.match(scene,/<linearGradient id="sky"/);
  assert.match(scene,/fill="#8165de"/);
  assert.match(title,/<svg[^>]+viewBox="0 0 540 128"/);
  assert.match(style,/eva-review-scene\.svg/);
  assert.doesNotMatch(page,/eva-review-scene/,"Only the review route should display the scene");
});
test("two in-range values near limits are listed with actual values",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:62,spo2:95.3});
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/2 measurements needing further inspection/);
  h.click("review");
  assert.match(h.root.innerHTML,/62 bpm/);
  assert.match(h.root.innerHTML,/95.3 %/);
  assert.match(h.root.innerHTML,/near a boundary|Near lower limit|Near upper limit/i);
});
test("red priority when a reading is out of range; green only when no near limits",()=>{
  const green=harness();beginAstronaut(green,1);proceedToVitals(green);
  enterVitals(green);
  green.submit("evaVitalsForm");
  assert.match(green.root.innerHTML,/EVA mission<br>approved/);
  const red=harness();beginAstronaut(red,1);proceedToVitals(red);
  enterVitals(red,{heartRate:62,spo2:92});
  red.submit("evaVitalsForm");
  assert.match(red.root.innerHTML,/EVA NOT AUTHORIZED/);
  assert.doesNotMatch(red.root.innerHTML,/NEEDS FURTHER<br>INSPECTION/);
});
test("no ambiguous clearance when three or more values are near reference boundaries",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  enterVitals(h,{heartRate:62,spo2:95.3,systolic:118});
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/NEEDS FURTHER<br>INSPECTION/);
  assert.doesNotMatch(h.root.innerHTML,/EVA mission<br>approved/);
});

test("temperature validation and classification cover both boundaries and urgent-looking readings",()=>{
  const h=harness();
  const base={heartRate:"78",spo2:"98",systolic:"115",diastolic:"72",
    temperature:"37",breaths:"8",interval:"30"};
  for(const [value,tier] of [
    ["29.9","invalid"],["30","bad"],["34.9","bad"],
    ["35","review"],["35.9","review"],["36","ok"],
    ["36.7","ok"],["37.5","ok"],["37.6","review"],
    ["37.9","review"],["38","bad"],["41","bad"],["41.1","invalid"],["42","invalid"]
  ]){
    const result=h.api.preEvaInspect({...base,temperature:value});
    const row=result.rows.find(x=>x.key==="temperature");
    assert.equal(result.valid,tier!=="invalid",value+" validation");
    assert.equal(row.invalid,tier==="invalid",value+" input range");
    assert.equal(row.outOfRange,tier==="bad",value+" flagged");
    assert.equal(row.nearLimit,tier==="review",value+" inspection");
    assert.equal(!row.invalid&&!row.outOfRange&&!row.nearLimit,tier==="ok",value+" normal");
  }
});
test("temperature range check updates live, prevents submission of out-of-bounds readings, and opens a chart",()=>{
  const h=harness();beginAstronaut(h,1);proceedToVitals(h);
  assert.match(h.root.innerHTML,/name="temperature"[^>]*min="30" max="41"/);
  assert.match(h.root.innerHTML,/data-action="criticalMetric" data-id="temperature"/);
  h.values["#evaVitalsFeedback"]={textContent:""};
  h.values["#evaTemperatureError"]={textContent:""};
  h.values['[data-vital-status="temperature"]']={textContent:"",className:""};
  const submitButton={disabled:false};
  h.values['#evaVitalsForm button[type="submit"]']=submitButton;
  enterVitals(h,{temperature:41.1});
  assert.equal(submitButton.disabled,true);
  assert.match(h.values["#evaTemperatureError"].textContent,/30°C and 41°C/);
  assert.equal(h.values['[data-vital-status="temperature"]'].textContent,"Invalid entry");
  h.submit("evaVitalsForm");
  assert.match(h.values["#evaVitalsFeedback"].textContent,/30°C and 41°C/);
  assert.match(h.root.innerHTML,/Pre-EVA Vital Signs/);
  enterVitals(h,{temperature:37.8});
  assert.equal(submitButton.disabled,false);
  assert.equal(h.values["#evaTemperatureError"].textContent,"");
  assert.equal(h.values['[data-vital-status="temperature"]'].textContent,"Needs inspection");
  h.click("criticalMetric","temperature");
  assert.match(h.root.innerHTML,/Body temperature/);
  assert.match(h.root.innerHTML,/Reference band:<\/strong> 36–37.5 °C/);
  h.click("close");
  h.submit("evaVitalsForm");
  assert.match(h.root.innerHTML,/NEEDS FURTHER<br>INSPECTION/);
  h.click("review");
  assert.match(h.root.innerHTML,/37.8 °C/);
  h.click("criticalMetric","temperature");
  assert.match(h.root.innerHTML,/PRE-EVA REFERENCE RANGE/);
});
test("red result lists abnormal temperature and normal temperature does not trigger a warning",()=>{
  const red=harness();beginAstronaut(red,1);proceedToVitals(red);
  enterVitals(red,{temperature:38});
  red.submit("evaVitalsForm");
  assert.match(red.root.innerHTML,/EVA NOT AUTHORIZED/);
  red.click("flags");
  assert.match(red.root.innerHTML,/Body temperature/);
  assert.match(red.root.innerHTML,/38 °C/);
  const green=harness();beginAstronaut(green,1);proceedToVitals(green);
  enterVitals(green,{temperature:37});
  green.submit("evaVitalsForm");
  assert.match(green.root.innerHTML,/EVA mission<br>approved/);
});

test("old dashboard query no longer exposes previous website",()=>{
  const h=harness("?dashboard=1");
  assert.match(h.root.innerHTML,/welcome/);
  assert.doesNotMatch(page,/Notice the change|Know what to check|id="flightStory"/);
});
test("retire old service workers, version assets, and permanently remove full crew button",()=>{
  const worker=readFileSync(resolve(base,"sw.js"),"utf8");
  assert.match(worker,/self\.registration\.unregister\(\)/);
  assert.match(worker,/caches\.delete/);
  assert.doesNotMatch(worker,/cache\.addAll|event\.respondWith/);
  assert.match(page,/navigator\.serviceWorker\.getRegistrations\(\)/);
  assert.match(page,/reg\.unregister\(\)/);
  assert.match(page,/caches\.delete\(name\)/);
  assert.match(page,/src\/eva-flow\.mjs\?v=/);
  assert.match(page,/assets\/eva-flow\.css\?v=/);
  assert.match(fullScript,/eva-critical\.mjs\?v=/);
  assert.doesNotMatch(page+fullScript+style,/Full crew dashboard|open-dashboard|eva-link/);
  assert.doesNotMatch(fullScript,/SYNTHETIC PARAMETER HISTORY|12 fictional observations/);
  const h=harness("?dashboard=1");
  assert.equal(h.root.hidden,false);
  assert.match(h.root.innerHTML,/welcome/);
  for(const file of ["src/app.mjs","src/engine.mjs","assets/app.css","tests/engine.test.mjs"]){
    assert.equal(existsSync(resolve(base,file)),false,file+" should remain deleted");
  }
});
