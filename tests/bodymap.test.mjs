import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve,dirname} from "node:path";
import {selectableRegions} from "../src/bodymap.mjs";
import {REGIONS,checkEva} from "../src/research.mjs";
import {screenDcsConcern} from "../src/dcs-screen.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const html=readFileSync(resolve(root,"index.html"),"utf8");
const controller=readFileSync(resolve(root,"src/research-ui.mjs"),"utf8");
const svg=readFileSync(resolve(root,"src/bodymap.mjs"),"utf8");
const css=readFileSync(resolve(root,"assets/bodymap.css"),"utf8");

test("body map offers every selectable region across front and back",()=>{
  const front=selectableRegions("front"),back=selectableRegions("back");
  assert.ok(front.includes("torso")&&!front.includes("back"));
  assert.ok(back.includes("back")&&!back.includes("torso"));
  assert.deepEqual(new Set([...front,...back]),new Set(Object.keys(REGIONS)));
  assert.ok(front.includes("head")&&back.includes("head"));
  assert.throws(()=>selectableRegions("side"));
});

test("page contains Front/Back map controls and hover hint",()=>{
  for(const id of ["evaBodySvg","evaMapHint","evaPainChoices"])
    assert.match(html,new RegExp('id="'+id+'"'));
  assert.match(html,/data-body-view="front"/);
  assert.match(html,/data-body-view="back"/);
  assert.match(html,/\.\/assets\/bodymap\.css/);
  assert.ok(!html.includes('class="body-silhouette"'),"Old static body shape should be replaced");
});

test("SVG body areas support hover, keyboard activation and ARIA pressed states",()=>{
  assert.match(svg,/pointerenter/);
  assert.match(svg,/pointerleave/);
  assert.match(svg,/event\.key==="Enter"/);
  assert.match(svg,/event\.key===" "/);
  assert.match(svg,/role:"button"/);
  assert.match(svg,/aria-pressed/);
  assert.match(svg,/setSelected/);
  assert.match(svg,/setView/);
  assert.match(css,/eva-region\[data-hovered="true"\]/);
  assert.match(css,/eva-region\[data-selected="true"\]/);
});

test("clicking body region is connected to linked pain checkbox change",()=>{
  assert.match(controller,/mountBodyMap\(el\("evaBodySvg"\),\{onToggle:toggleBodyRegion\}\)/);
  assert.match(controller,/checkbox\.checked=!checkbox\.checked/);
  assert.match(controller,/checkbox\.dispatchEvent\(new Event\("change"/);
  assert.match(controller,/bodyMapUI\?\.setSelected/);
  assert.match(controller,/rating\.disabled=!checkbox\.checked/);
});

test("head and torso regions can be logged with independent scores",()=>{
  const record=checkEva({event:"EVA-011",painAreas:[
      {area:"head",severity:3},{area:"torso",severity:6}
    ],side:"central",kind:"pressure",onset:"after",suitFit:"contact",status:"ongoing"});
  assert.deepEqual(record.painAreas.map(x=>x.severity),[3,6]);
  const result=screenDcsConcern({exposure:"unknown",symptoms:[],painAreas:record.painAreas});
  assert.equal(result.status,"LOCAL_CONTACT_CONCERN");
});
