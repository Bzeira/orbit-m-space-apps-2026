/* One-time retirement worker for older ORBIT-M installations.
 * Previous versions registered a service worker that cached the deleted dashboard.
 * This worker does not cache or intercept requests, and unregisters itself.
 */
self.addEventListener("install",event=>{
  event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    try {
      const names=await caches.keys();
      await Promise.all(names
        .filter(name=>name.startsWith("orbit-m-static-")||name.startsWith("orbit-m-eva-"))
        .map(name=>caches.delete(name)));
    } catch (_) {}
    await self.registration.unregister();
  })());
});
