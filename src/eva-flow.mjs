/* ORBIT-M astronaut EVA UI. Synthetic interactive demonstration only. */
const METRICS=[
["sleep","sleep score",86,58,"70–100","/100"],
["bpm","bpm",72,112,"60–95","bpm"],
["anatomy","anatomical profile",85,43,"70–100","index"],
["fitness","fitness",84,49,"70–100","index"],
["ent","ENT",91,44,"70–100","index"],
["temperature","body temp",36.7,38.2,"36.0–37.5","°C"],
["vision","vision",89,47,"70–100","index"]];
const FAILURES={1:[],2:["bpm","temperature"],3:["sleep","fitness"],4:["vision"],5:[],6:["ent"],7:["anatomy","bpm"],8:[],9:["fitness"],10:["temperature","vision"]};
const root=document.createElement("div");root.id="orbitEvaFlow";root.setAttribute("aria-label","Simulated ORBIT-M EVA assessment");document.body.append(root);
const state={screen:"welcome",id:0,flags:{},missionLength:"",missionPurpose:"",modal:"",decision:null,feedback:""};
const esc=v=>String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const metric=id=>METRICS.find(m=>m[0]===id);
const abnormal=()=>METRICS.filter(m=>state.flags[m[0]]);
function storeInputs(){const a=root.querySelector("#evaMissionLength"),b=root.querySelector("#evaMissionPurpose");if(a)state.missionLength=a.value;if(b)state.missionPurpose=b.value;}
function go(screen){state.screen=screen;state.modal="";state.feedback="";render();root.scrollTop=0;root.querySelector("h1,[data-autofocus]")?.focus({preventScroll:true});}
function avatar(){return '<svg viewBox="0 0 270 270" aria-hidden="true"><ellipse cx="135" cy="135" rx="88" ry="99" fill="#f3d7b1"/><path d="M61 130 Q55 45 133 50 Q211 47 212 129 L198 98 Q179 75 133 73 Q91 76 74 101Z" fill="#78543d"/><ellipse cx="62" cy="150" rx="20" ry="24" fill="#f3d7b1"/><ellipse cx="210" cy="150" rx="20" ry="24" fill="#f3d7b1"/><path d="M86 131l28 -4m40 0 27 4" stroke="#332538" stroke-width="4" stroke-linecap="round"/><circle cx="103" cy="150" r="11" fill="white"/><circle cx="167" cy="150" r="11" fill="white"/><circle cx="103" cy="151" r="5" fill="#25223d"/><circle cx="167" cy="151" r="5" fill="#25223d"/><path d="M113 185 Q135 207 158 185" stroke="#332538" stroke-width="4" stroke-linecap="round" fill="none"/></svg>';}
function welcome(){return '<section class="eva-welcome"><button type="button" class="eva-welcome-title" data-action="start">welcome</button><div class="eva-welcome-sub">to the eva<br>assessment<br>program</div><button class="eva-cta" data-action="start" type="button">Start assessment</button></section>';}
function identify(){return '<section class="eva-sheet"><div class="eva-sheet-header"><h1 tabindex="-1">ASTRONAUT ID SYSTEM</h1></div><div class="eva-corners"></div><div class="eva-id-body"><form id="evaIdForm" class="eva-id-form"><label for="evaIdNumber">ID No.</label><input data-autofocus id="evaIdNumber" type="number" inputmode="numeric" min="1" max="10" step="1" required placeholder="1–10" aria-describedby="evaIdHelp evaIdError"><small id="evaIdHelp">Enter a fictional astronaut ID between 1 and 10</small><button class="eva-enter" type="submit">ENTER</button><p id="evaIdError" class="eva-error" role="alert"></p></form><div class="eva-person" role="img" aria-label="Astronaut silhouette"></div></div></section>';}
function dashboard(){
 const rows=METRICS.map(m=>{const bad=state.flags[m[0]];return '<div class="eva-metric-row"><button type="button" class="eva-metric-name" data-action="metric" data-id="'+m[0]+'" title="Open report and graph">'+m[1]+'</button><button type="button" class="eva-arrow" data-action="toggle" data-id="'+m[0]+'" aria-label="Toggle '+m[1]+'">‹</button><span class="eva-status '+(bad?"bad":"ok")+'">'+(bad?"Abnormal":"Normal")+'</span><button type="button" class="eva-arrow" data-action="toggle" data-id="'+m[0]+'" aria-label="Toggle '+m[1]+'">›</button></div>';}).join("");
 return '<section class="eva-dashboard"><div class="eva-card"><h1 tabindex="-1">Astronaut ID</h1><div class="eva-mission-id">ASTRONAUT '+state.id+'</div><div class="eva-avatar">'+avatar()+'</div><p class="eva-card-note">Select a parameter for a detailed report and synthetic graph.</p><button type="button" class="eva-text-button" data-action="identify">Change astronaut ID</button></div><div class="eva-card"><div class="eva-scenario"><span>SIMULATED HEALTH PARAMETERS</span><button type="button" class="eva-text-button" data-action="random">Randomize demo statuses</button></div><div class="eva-list">'+rows+'</div><form id="evaMissionForm" class="eva-fields"><label>mission length<input id="evaMissionLength" name="length" type="number" inputmode="numeric" min="1" max="1095" step="1" placeholder="Enter mission length (days)" value="'+esc(state.missionLength)+'" required></label><label>purpose<input id="evaMissionPurpose" name="purpose" type="text" maxlength="120" placeholder="Enter mission purpose" value="'+esc(state.missionPurpose)+'" required></label><button class="eva-assess" type="submit">Assess Readiness</button><p class="eva-error" id="evaAssessmentFeedback" role="alert"></p></form><p class="eva-card-note">Use arrows to change Normal / Abnormal. Fictional training scenario; not operational medical clearance.</p></div></section>';
}
function results(){
 if(!state.decision.denied)return '<section class="eva-result eva-approve"><small>astronaut “'+state.id+'”</small><h1 tabindex="-1">EVA mission<br>approved</h1><div class="eva-rule"></div><p>you can suit up– good luck on your mission:)</p><div class="eva-safety-note">SIMULATED APPROVAL ONLY. Actual EVA authorization requires qualified review and established mission procedures.</div><div class="eva-result-actions"><button data-action="dashboard" type="button">Back to parameters</button><button data-action="identify" type="button">New astronaut</button></div></section>';
 return '<section class="eva-result eva-warning"><div class="eva-warning-head"><div class="eva-warning-icon" aria-hidden="true">!</div><h1 tabindex="-1">WARNING</h1></div><div class="eva-alert-band">EVA NOT AUTHORIZED</div><button class="eva-see-data" type="button" data-action="flags">CLICK HERE TO SEE DATA</button><div class="eva-stripes"></div><div class="eva-safety-note">'+state.decision.count+' abnormal fictional parameter categories. This is not a medical decision.</div><div class="eva-result-actions"><button data-action="dashboard" type="button">Back to parameters</button><button data-action="identify" type="button">New astronaut</button></div></section>';
}
function graph(m){
 const bad=state.flags[m[0]],center=bad?m[3]:m[2],amp=m[0]==="temperature"?.18:m[0]==="bpm"?5:4;
 const values=Array.from({length:12},(_,i)=>+(center+Math.sin((i+state.id)*1.2)*amp+(i-11)*amp*.1).toFixed(1));
 const min=Math.min(...values)-amp,max=Math.max(...values)+amp;
 const xy=values.map((v,i)=>[55+i*500/11,171-(v-min)/(max-min)*116]);
 const points=xy.map(p=>p.map(n=>n.toFixed(1)).join(",")).join(" ");
 const last=xy.at(-1),color=bad?"#fa777d":"#71e2a5";
 return '<svg class="eva-chart" viewBox="0 0 610 230" role="img" aria-label="Illustrative twelve-sample trend for '+m[1]+'"><line x1="54" y1="172" x2="563" y2="172" stroke="#63708b"/><line x1="54" y1="65" x2="563" y2="65" stroke="#63708b" stroke-dasharray="5 7"/><line x1="54" y1="122" x2="563" y2="122" stroke="#63708b" stroke-dasharray="5 7"/><polyline points="'+points+'" stroke="'+color+'" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="'+last[0]+'" cy="'+last[1]+'" r="7" fill="'+color+'"/><text x="54" y="31" font-size="15" fill="#e9e1ee">SYNTHETIC PARAMETER HISTORY</text><text x="54" y="204" font-size="12" fill="#b7afc8">12 fictional observations</text><text x="558" y="204" text-anchor="end" font-size="12" fill="#b7afc8">Latest '+values.at(-1)+' '+m[5]+'</text></svg>';
}
function modal(){
 if(!state.modal)return "";
 let body;
 if(state.modal==="flags"){body='<h2 id="evaModalHeading">Parameters outside demo range</h2><p class="eva-modal-desc">Astronaut '+state.id+' · '+abnormal().length+' fictional abnormal categories. Select one for details.</p>'+abnormal().map(m=>'<button type="button" class="eva-flag-item" data-action="metric" data-id="'+m[0]+'"><span>'+m[1]+'</span><strong style="color:#c43f4b">Abnormal ↗</strong></button>').join("");}
 else{const m=metric(state.modal);if(!m)return "";const bad=state.flags[m[0]];body='<h2 id="evaModalHeading">'+m[1]+'</h2><p class="eva-modal-status '+(bad?"bad":"ok")+'">'+(bad?"Abnormal":"Normal")+' · DEMO STATUS</p>'+graph(m)+'<p class="eva-modal-desc"><strong>Illustrative profile band:</strong> '+m[4]+' '+m[5]+'</p><p class="eva-modal-desc">Fictional screening signal displayed for interface demonstration, not a validated EVA limit or medical observation.</p>'+(state.decision?.denied?'<button type="button" class="eva-text-button" data-action="flags">View all abnormal parameters</button>':'');}
 return '<div class="eva-modal-backdrop" data-action="close-backdrop"><div class="eva-modal" role="dialog" aria-modal="true" aria-labelledby="evaModalHeading"><button type="button" class="eva-close" data-action="close" aria-label="Close report">×</button>'+body+'<p class="eva-modal-note">All charts and baseline bands are invented for this prototype; no real astronaut measurements, clinical approval or NASA-specific thresholds are represented.</p></div></div>';
}
function render(){
 const body=state.screen==="welcome"?welcome():state.screen==="identify"?identify():state.screen==="dashboard"?dashboard():results();
 root.innerHTML='<div class="eva-universe" aria-hidden="true"><div class="eva-sun"></div><div class="eva-horizon"></div></div><header class="eva-top"><div class="eva-brand"><span class="eva-orbit" aria-hidden="true"></span>ORBIT-M</div><div class="eva-top-right"><span class="eva-kicker">EXTRAVEHICULAR ACTIVITY / INTERACTIVE DEMO</span><button class="eva-link" type="button" data-action="open-dashboard">Full crew dashboard ↗</button></div></header><main class="eva-stage">'+body+'</main>'+modal();
 if(state.modal)root.querySelector(".eva-close")?.focus();
}
root.addEventListener("click",event=>{
 const btn=event.target.closest("[data-action]");if(!btn||!root.contains(btn))return;
 const action=btn.dataset.action;
 if(action==="close-backdrop"&&event.target!==btn)return;
 if(action==="start"||action==="identify"){go("identify");return;}
 if(action==="open-dashboard"){storeInputs();root.hidden=true;document.body.style.overflow="";history.replaceState(null,"",location.pathname+"?dashboard=1#monitor");document.getElementById("monitor")?.scrollIntoView();return;}
 if(action==="dashboard"){go("dashboard");return;}
 if(action==="close"||action==="close-backdrop"){state.modal="";render();return;}
 if(action==="flags"){state.modal="flags";render();return;}
 if(action==="metric"){storeInputs();state.modal=btn.dataset.id;render();return;}
 if(action==="toggle"){storeInputs();state.flags[btn.dataset.id]=!state.flags[btn.dataset.id];render();return;}
 if(action==="random"){storeInputs();for(const m of METRICS)state.flags[m[0]]=Math.random()<.32;render();}
});
root.addEventListener("submit",event=>{
 if(event.target.id==="evaIdForm"){
   event.preventDefault();const n=Number(root.querySelector("#evaIdNumber").value);
   if(!Number.isInteger(n)||n<1||n>10){root.querySelector("#evaIdError").textContent="Enter a whole number from 1 to 10.";return;}
   state.id=n;state.flags=Object.fromEntries(METRICS.map(m=>[m[0],FAILURES[n].includes(m[0])]));
   state.missionLength="";state.missionPurpose="";state.decision=null;go("dashboard");return;
 }
 if(event.target.id==="evaMissionForm"){
   event.preventDefault();storeInputs();const days=Number(state.missionLength);
   if(!Number.isInteger(days)||days<1||days>1095||!state.missionPurpose.trim()){root.querySelector("#evaAssessmentFeedback").textContent="Enter a valid mission length and purpose.";return;}
   state.decision={denied:abnormal().length>0,count:abnormal().length};
   go("result");
 }
});
root.addEventListener("keydown",event=>{if(event.key==="Escape"&&state.modal){state.modal="";render();}});
// The original-art entry owns navigation when present. Retain this earlier
// self-contained flow for older hosts without mounting a second fixed overlay.
window.addEventListener("hashchange",()=>{if(location.hash==="#eva-flow"&&root.hidden&&!document.getElementById("astronautApp")){root.hidden=false;document.body.style.overflow="hidden";go("welcome");}});
if(document.getElementById("astronautApp")||new URLSearchParams(location.search).get("dashboard")==="1"){root.hidden=true;}else{document.body.style.overflow="hidden";render();}
