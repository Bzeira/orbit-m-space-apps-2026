import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import vm from "node:vm";
import {resolve,dirname} from "node:path";
import {fileURLToPath} from "node:url";
const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const workerSource=readFileSync(resolve(root,"sw.js"),"utf8");
const shellScope="https://bzeira.github.io/orbit-m-space-apps-2026/";

function workerHarness({online=true,quotaFailure=false}={}){
  const listeners={},stored=new Map();
  const cache={
    async addAll(urls){for(const url of urls)stored.set(url,{kind:"cached",url});},
    async match(request){
      const url=typeof request==="string"?request:request.url;
      return stored.get(url);
    },
    async put(request,response){
      if(quotaFailure)throw Error("Quota exceeded");
      stored.set(request.url,response);
    }
  };
  const caches={
    async open(){return cache;},
    async keys(){return ["orbit-m-static-old","other-app-cache"];},
    async delete(name){return name==="orbit-m-static-old";}
  };
  const self={
    registration:{scope:shellScope},
    location:{origin:new URL(shellScope).origin},
    clients:{async claim(){}},
    async skipWaiting(){},
    addEventListener(event,listener){listeners[event]=listener;}
  };
  const response={ok:true,type:"basic",kind:"online",clone(){return {...this};}};
  const runtime={self,caches,URL,
    fetch:async()=>{if(!online)throw Error("Network offline");return response;},
    Response:{error:()=>({kind:"network-error"})}
  };
  vm.runInNewContext(workerSource,runtime,{filename:"sw.js"});
  async function install(){
    let promise;
    listeners.install({waitUntil:p=>{promise=p;}});
    await promise;
  }
  async function fetchWith(request){
    let pending=null,called=false;
    listeners.fetch({request,respondWith(p){called=true;pending=p;}});
    return {called,result:pending?await pending:null};
  }
  return {listeners,stored,install,fetchWith,cache,response};
}

test("all same-origin CSS/JS app modules required for offline replay are precached",async()=>{
  const h=workerHarness();
  await h.install();
  const required=["index.html","assets/app.css","assets/mission-demo.css",
    "assets/bodymap.css","assets/cardiovascular.css","src/mission-demo.mjs",
    "src/mission-demo-ui.mjs","src/app.mjs","src/engine.mjs","src/offline-ui.mjs"];
  for(const path of required){
    assert.ok(existsSync(resolve(root,path)),"Missing offline app asset "+path);
    assert.ok(h.stored.has(new URL("./"+path,shellScope).href),"Not precached "+path);
  }
  assert.ok(h.stored.size>=20);
  assert.ok([...h.stored.keys()].every(url=>url.startsWith(shellScope)));
});

test("cached core page and module can be opened without network after initial installation",async()=>{
  const h=workerHarness({online:false});
  await h.install();
  const page=await h.fetchWith({method:"GET",mode:"navigate",url:shellScope});
  const module=await h.fetchWith({method:"GET",mode:"cors",url:shellScope+"src/mission-demo.mjs"});
  assert.equal(page.called,true);
  assert.equal(module.called,true);
  assert.equal(page.result.kind,"cached");
  assert.equal(module.result.kind,"cached");
});

test("unseen offline deep link falls back to cached index.html",async()=>{
  const h=workerHarness({online:false});
  await h.install();
  const out=await h.fetchWith({method:"GET",mode:"navigate",url:shellScope+"unknown-path"});
  assert.equal(out.result.kind,"cached");
  assert.equal(out.result.url,shellScope+"index.html");
});

test("NASA and other external domains are never intercepted; no POST caching",async()=>{
  const h=workerHarness();
  await h.install();
  const outside=await h.fetchWith({method:"GET",mode:"navigate",url:"https://www.nasa.gov/hrp/risks/"});
  const post=await h.fetchWith({method:"POST",mode:"cors",url:shellScope+"api"});
  const sibling=await h.fetchWith({method:"GET",mode:"cors",url:"https://bzeira.github.io/another-site/index.html"});
  assert.equal(outside.called,false);
  assert.equal(post.called,false);
  assert.equal(sibling.called,false);
});

test("browser storage quota failure does not prevent a valid online response",async()=>{
  const h=workerHarness({quotaFailure:true});
  await h.install();
  const out=await h.fetchWith({method:"GET",mode:"navigate",url:shellScope+"index.html"});
  assert.equal(out.result.kind,"online");
});
