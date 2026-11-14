/* Local-only offline readiness indicator for the static ORBIT-M prototype.
 * Service-worker caching covers app resources, not personal/medical data.
 */
const offlineStatus=document.getElementById("offlineSupport");
if(offlineStatus){
  const update=(message,state)=>{
    offlineStatus.textContent=message;
    offlineStatus.dataset.state=state;
  };
  if(!("serviceWorker" in navigator)){
    update("Offline re-opening is not supported in this browser. The app can still process loaded demo data locally.","unsupported");
  }else if(!window.isSecureContext){
    update("Offline installation requires HTTPS or localhost. Open the public HTTPS demo for offline setup.","unsupported");
  }else{
    update("Preparing an offline copy of the app files…","installing");
    navigator.serviceWorker.register("./sw.js",{scope:"./"}).then(registration=>{
      navigator.serviceWorker.ready.then(()=>{
        update("Offline app shell ready after first online visit. External NASA reference links still need internet.","ready");
      }).catch(()=>{
        update("Offline installation could not be confirmed; use an online connection.","unsupported");
      });
      const installing=registration.installing;
      if(installing){
        installing.addEventListener("statechange",()=>{
          if(installing.state==="redundant")
            update("Offline files could not be fully installed. Keep an internet connection and try again.","unsupported");
        });
      }
    }).catch(()=>{
      update("Offline cache could not be installed. The app still runs when loaded online.","unsupported");
    });
  }
}
