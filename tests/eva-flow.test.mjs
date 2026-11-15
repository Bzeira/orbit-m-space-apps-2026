import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {dirname,resolve} from "node:path";
import {runInNewContext} from "node:vm";
const base=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const script=readFileSync(resolve(base,"src/eva-flow.mjs"),"utf8");
const style=readFileSync(resolve(base,"assets/eva-flow.css"),"utf8");
const page=readFileSync(resolve(base,"index.html"),"utf8");
function harness(search="",hasOriginalArtEntry=false){
  const handlers={};const values={};
  const root={hidden:false,scrollTop:0,innerHTML:"",
    setAttribute(){},addEventListener(name,fn){handlers[name]=fn;},
    contains(){return true;},querySelector(q){
      if(q==="h1,[data-autofocus]"||q===".eva-close")return {focus(){}};
      return values[q]||null;
    }};
  const body={style:{},append(node){assert.equal(node,root);}};
  const context={document:{body,createElement(){return root;},getElementById(id){return hasOriginalArtEntry&&id==="astronautApp"?{}:null;}},
    window:{addEventListener(){}},location:{search,pathname:"/index.html",hash:""},
    URLSearchParams,history:{replaceState(){}},console,Math};
  runInNewContext(script,context,{filename:"eva-flow.mjs"});
  function click(action,id){
    const button={dataset:{action,id}};
    handlers.click({target:{closest:()=>button}});
  }
  function submit(formId){
    handlers.submit({target:{id:formId},preventDefault(){}});
  }
  return {root,values,click,submit,context};
}
test("welcome flow is integrated without replacing the original multi-module dashboard",()=>{
  assert.match(page,/src\/eva-flow\.mjs/);
  assert.match(page,/assets\/eva-flow\.css/);
  assert.match(page,/id="monitor"/);
  assert.match(page,/src\/cardiovascular-ui\.mjs/);
  assert.match(style,/#orbitEvaFlow/);
  assert.doesNotMatch(style,/(^|\n)body\s*\{/);
});
test("astronaut identifiers are limited to 1-10 and produce both decision paths",()=>{
  const h=harness();
  assert.match(h.root.innerHTML,/welcome/);
  h.click("start");assert.match(h.root.innerHTML,/ASTRONAUT ID SYSTEM/);
  h.values["#evaIdNumber"]={value:"11"};
  h.values["#evaIdError"]={textContent:""};
  h.submit("evaIdForm");
  assert.match(h.values["#evaIdError"].textContent,/1 to 10/);
  h.values["#evaIdNumber"].value="1";h.submit("evaIdForm");
  assert.match(h.root.innerHTML,/ASTRONAUT 1/);
  assert.match(h.root.innerHTML,/Assess Readiness/);
  h.click("metric","sleep");assert.match(h.root.innerHTML,/SYNTHETIC PARAMETER HISTORY/);
  h.click("close");
  h.values["#evaMissionLength"]={value:"180"};
  h.values["#evaMissionPurpose"]={value:"Suit maintenance"};
  h.submit("evaMissionForm");
  assert.match(h.root.innerHTML,/EVA mission<br>approved/);
  h.click("identify");
  h.values["#evaIdNumber"].value="2";h.submit("evaIdForm");
  h.values["#evaMissionLength"].value="21";
  h.values["#evaMissionPurpose"].value="Panel inspection";
  h.submit("evaMissionForm");
  assert.match(h.root.innerHTML,/EVA NOT AUTHORIZED/);
  h.click("flags");
  assert.match(h.root.innerHTML,/Parameters outside demo range/);
  assert.match(h.root.innerHTML,/body temp/);
  assert.match(h.root.innerHTML,/bpm/);
});
test("interactive status changes can change the fictional decision",()=>{
  const h=harness();
  h.click("start");h.values["#evaIdNumber"]={value:"4"};
  h.submit("evaIdForm");
  assert.match(h.root.innerHTML,/Abnormal/);
  h.click("toggle","vision");
  h.values["#evaMissionLength"]={value:"7"};
  h.values["#evaMissionPurpose"]={value:"Equipment check"};
  h.submit("evaMissionForm");
  assert.match(h.root.innerHTML,/EVA mission<br>approved/);
});
test("cached shell includes new flow and safe bypass remains possible",()=>{
  const worker=readFileSync(resolve(base,"sw.js"),"utf8");
  assert.match(worker,/src\/eva-flow\.mjs/);
  assert.match(worker,/assets\/eva-flow\.css/);
  const h=harness("?dashboard=1");
  assert.equal(h.root.hidden,true);
});
test("original-art entry prevents a second overlay or a body scroll lock",()=>{
  const h=harness("",true);
  assert.equal(h.root.hidden,true);
  assert.equal(h.context.document.body.style.overflow,undefined);
  assert.equal(h.root.innerHTML,"");
});
