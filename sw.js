/* ORBIT-M EVA-only offline shell. No legacy Crew Health Companion assets. */
const CACHE_NAME="orbit-m-eva-only-v1";
const APP_FILES=["./","./index.html","./assets/eva-flow.css","./src/eva-flow.mjs","./src/eva-critical.mjs"];
const appUrl=p=>new URL(p,self.registration.scope).href;
self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(APP_FILES.map(appUrl));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    for(const name of await caches.keys()){
      if((name.startsWith("orbit-m-static-")||name.startsWith("orbit-m-eva-"))&&name!==CACHE_NAME){
        await caches.delete(name);
      }
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url),scope=new URL(self.registration.scope);
  if(url.origin!==scope.origin||!url.pathname.startsWith(scope.pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    try{
      const response=await fetch(req);
      if(response.ok&&response.type!=="opaque"){
        try{await cache.put(req,response.clone());}catch(_){}
      }
      return response;
    }catch(_){
      const fromCache=await cache.match(req,{ignoreSearch:true});
      if(fromCache)return fromCache;
      if(req.mode==="navigate"){
        const shell=await cache.match(appUrl("./index.html"));
        if(shell)return shell;
      }
      return Response.error();
    }
  })());
});
