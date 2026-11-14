/* ORBIT-M: local-first static app shell, no medical data ever cached here.
 * This caches only same-origin static resources inside the app's GitHub Pages
 * repository scope. NASA research links are NOT cached or intercepted.
 * Successful first online installation is required for later offline opening.
 */
const CACHE_NAME="orbit-m-static-2026-11-14-v1";
const APP_FILES=[
  "./","./index.html",
  "./assets/app.css","./assets/bodymap.css",
  "./assets/cardiovascular.css","./assets/mission-demo.css",
  "./assets/mission-mental.css","./assets/research.css",
  "./src/app.mjs","./src/bodymap.mjs",
  "./src/cardiovascular-ui.mjs","./src/cardiovascular.mjs",
  "./src/dcs-screen.mjs","./src/engine.mjs",
  "./src/mission-demo-ui.mjs","./src/mission-demo.mjs",
  "./src/mission-mental-ui.mjs","./src/mission-mental.mjs",
  "./src/research-ui.mjs","./src/research.mjs",
  "./src/offline-ui.mjs"
];
const scopeUrl=()=>new URL(self.registration.scope);
const appUrl=path=>new URL(path,self.registration.scope).href;
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
      if(name.startsWith("orbit-m-static-")&&name!==CACHE_NAME)await caches.delete(name);
    }
    await self.clients.claim();
  })());
});
self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const target=new URL(request.url);
  const scope=scopeUrl();
  if(target.origin!==scope.origin||!target.pathname.startsWith(scope.pathname))return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE_NAME);
    try{
      const response=await fetch(request);
      if(response.ok&&response.type!=="opaque"){
        // Storage quota errors must never block an otherwise successful online load.
        try{await cache.put(request,response.clone());}catch(_){}
      }
      return response;
    }catch(_){
      const cached=await cache.match(request,{ignoreSearch:true});
      if(cached)return cached;
      if(request.mode==="navigate"){
        const shell=await cache.match(appUrl("./index.html"));
        if(shell)return shell;
      }
      return Response.error();
    }
  })());
});
