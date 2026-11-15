import {preEvaEmpty,preEvaInspect,preEvaMarkup,preEvaGetInputs,preEvaRefresh,preEvaFormat,preEvaRanges,preEvaReferenceChart} from "./eva-critical.mjs";
/* ORBIT-M astronaut EVA UI. Synthetic interactive demonstration only. */
const METRICS=[
["sleep","sleep score",86,58,"70–100","/100"],
["bpm","bpm",72,112,"60–100","bpm"],
["anatomy","anatomical profile",85,43,"70–100","index"],
["fitness","fitness",84,49,"70–100","index"],
["ent","ENT",91,44,"70–100","index"],
["temperature","body temp",36.7,38.2,"36.0–37.5","°C"],
["vision","vision",89,47,"70–100","index"]];
const FAILURES={1:[],2:["bpm","temperature"],3:["sleep","fitness"],4:["vision"],5:[],6:["ent"],7:["anatomy","bpm"],8:[],9:["fitness"],10:["temperature","vision"]};
const root=document.createElement("div");root.id="orbitEvaFlow";root.setAttribute("aria-label","Simulated ORBIT-M EVA assessment");document.body.append(root);
const state={screen:"welcome",id:0,flags:{},missionLength:"",missionPurpose:"",critical:preEvaEmpty(),modal:"",decision:null,feedback:""};
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
 return '<section class="eva-dashboard"><div class="eva-card"><h1 tabindex="-1">Astronaut ID</h1><div class="eva-mission-id">ASTRONAUT '+state.id+'</div><div class="eva-avatar">'+avatar()+'</div><p class="eva-card-note">Select a parameter for its synthetic reference range.</p><button type="button" class="eva-text-button" data-action="identify">Change astronaut ID</button></div><div class="eva-card"><div class="eva-scenario"><span>SIMULATED HEALTH PARAMETERS</span><button type="button" class="eva-text-button" data-action="random">Randomize demo statuses</button></div><div class="eva-list">'+rows+'</div><form id="evaMissionForm" class="eva-fields"><label>mission length<input id="evaMissionLength" name="length" type="number" inputmode="numeric" min="1" max="1095" step="1" placeholder="Enter mission length (days)" value="'+esc(state.missionLength)+'" required></label><label>purpose<input id="evaMissionPurpose" name="purpose" type="text" maxlength="120" placeholder="Enter mission purpose" value="'+esc(state.missionPurpose)+'" required></label><button class="eva-assess" type="submit">Assess Readiness</button><p class="eva-error" id="evaAssessmentFeedback" role="alert"></p></form><p class="eva-card-note">Use arrows to change Normal / Abnormal. Fictional training scenario; not operational medical clearance.</p></div></section>';
}
function results(){
 if(!state.decision.denied)return '<section class="eva-result eva-approve"><small>astronaut “'+state.id+'”</small><h1 tabindex="-1">EVA mission<br>approved</h1><div class="eva-rule"></div><p>you can suit up– good luck on your mission:)</p><div class="eva-safety-note">SIMULATED APPROVAL ONLY. Actual EVA authorization requires qualified review and established mission procedures.</div><div class="eva-result-actions"><button data-action="dashboard" type="button">Back to parameters</button><button data-action="identify" type="button">New astronaut</button></div></section>';
 return '<section class="eva-result eva-warning"><div class="eva-warning-head"><div class="eva-warning-icon" aria-hidden="true">!</div><h1 tabindex="-1">WARNING</h1></div><div class="eva-alert-band">EVA NOT AUTHORIZED</div><button class="eva-see-data" type="button" data-action="flags">CLICK HERE TO SEE DATA</button><div class="eva-stripes"></div><div class="eva-safety-note">'+state.decision.count+' flagged findings in profile and immediate vital measurements. This is not a medical decision.</div><div class="eva-result-actions"><button data-action="dashboard" type="button">Back to parameters</button><button data-action="identify" type="button">New astronaut</button></div></section>';
}
/* One demo value against one declared profile range. No invented time-series history. */
function graph(m){
  const [low,high]=m[4].split("–").map(Number);
  const value=state.flags[m[0]]?m[3]:m[2];
  const outside=value<low||value>high;
  const lineStart=115,lineEnd=495,lineY=116;
  const span=high-low;
  const markerX=Math.max(54,Math.min(556,lineStart+(value-low)*(lineEnd-lineStart)/span));
  const color=outside?"#bc3b46":"#34804c";
  const pos=markerX.toFixed(1);
  return '<svg class="eva-chart eva-reference-chart" viewBox="0 0 610 218" role="img" aria-label="Illustrative '+m[1]+' profile range '+low+' to '+high+' '+m[5]+'; fictional demo value '+value+' '+m[5]+'">'
    +'<text x="48" y="30" fill="#786775" font-size="12" letter-spacing="1.2">PROFILE REFERENCE RANGE · SYNTHETIC DEMO</text>'
    +'<line data-reference-line="true" x1="'+lineStart+'" x2="'+lineEnd+'" y1="'+lineY+'" y2="'+lineY+'" stroke="#765e92" stroke-width="5" stroke-linecap="round"/>'
    +'<line x1="'+lineStart+'" x2="'+lineStart+'" y1="130" y2="144" stroke="#63566b" stroke-width="2"/>'
    +'<line x1="'+lineEnd+'" x2="'+lineEnd+'" y1="130" y2="144" stroke="#63566b" stroke-width="2"/>'
    +'<text x="'+pos+'" y="78" text-anchor="middle" fill="'+color+'" font-weight="700" font-size="32">'+value+'</text>'
    +'<circle data-value-marker="true" cx="'+pos+'" cy="'+lineY+'" r="11" fill="'+color+'" stroke="#fcfaff" stroke-width="3"/>'
    +'<text x="'+lineStart+'" y="178" text-anchor="middle" fill="#463a4b" font-size="23">'+low+'</text>'
    +'<text x="'+lineEnd+'" y="178" text-anchor="middle" fill="#463a4b" font-size="23">'+high+'</text>'
    +'<text x="305" y="179" text-anchor="middle" fill="#765e92" font-size="22">'+m[5]+'</text>'
    +'</svg>';
}
function modal(){
 if(!state.modal)return "";
 let body;
 if(state.modal==="flags"){
   const profiles=(state.decision?.profileFlags||abnormal().map(m=>m[0])).map(metric).filter(Boolean);
   const vitalFlags=state.decision?.vitalFlags||[];
   body='<h2 id="evaModalHeading">Parameters outside demo range</h2><p class="eva-modal-desc">Astronaut '+state.id+' · '+(profiles.length+vitalFlags.length)+' flagged findings. Select a category to investigate.</p>'
    +(profiles.length?'<h3>Astronaut profile</h3>'+profiles.map(m=>'<button type="button" class="eva-flag-item" data-action="metric" data-id="'+m[0]+'"><span>'+m[1]+'</span><strong style="color:#c43f4b">Abnormal ↗</strong></button>').join(""):"")
    +(vitalFlags.length?'<h3>Immediate pre-EVA vital signs</h3>'+vitalFlags.map(row=>'<button type="button" class="eva-flag-item" data-action="criticalMetric" data-id="'+row.key+'"><span>'+row.label+' <small>('+row.min+'–'+row.max+' '+row.unit+')</small></span><strong style="color:#c43f4b">'+preEvaFormat(row.value)+' '+row.unit+' ↗</strong></button>').join(""):"");
 }
 else if(state.modal.startsWith("critical:")){
   const key=state.modal.slice("critical:".length);
   const rule=preEvaRanges.find(item=>item.key===key);
   if(!rule)return "";
   const checked=preEvaInspect(state.critical);
   const value=checked.data[key];
   const status=value===null?"Awaiting input":value<rule.min||value>rule.max?"Outside range":"Within range";
   const style=value===null?"pending":status==="Outside range"?"bad":"ok";
   body='<h2 id="evaModalHeading">'+rule.label+'</h2>'
     +'<p class="eva-modal-status '+style+'">'+status+' · PRE-EVA CHECK</p>'
     +preEvaReferenceChart(key,state.critical)
     +'<p class="eva-modal-desc"><strong>Entered reading:</strong> '+preEvaFormat(value)+' '+rule.unit+'</p>'
     +'<p class="eva-modal-desc"><strong>Reference band:</strong> '+rule.min+'–'+rule.max+' '+rule.unit+' (inclusive)</p>'
     +'<p class="eva-modal-desc">The horizontal line marks the project reference range. The dot marks your current reading (red when outside the range). No historical measurements are inferred.</p>'
     +(key==="pp"||key==="map"?'<p class="eva-modal-desc">'+(key==="pp"?"PP = systolic − diastolic.":"Estimated MAP = diastolic + PP / 3 (resting approximation).")+'</p>':"")
     +(key==="respRate"?'<p class="eva-modal-desc">Rate = counted breaths × 60 ÷ observation interval in seconds.</p>':"")
     +(state.decision?.denied?'<button type="button" class="eva-text-button" data-action="flags">View flagged findings</button>':"");
 }
 else{const m=metric(state.modal);if(!m)return "";const bad=state.flags[m[0]];body='<h2 id="evaModalHeading">'+m[1]+'</h2><p class="eva-modal-status '+(bad?"bad":"ok")+'">'+(bad?"Abnormal":"Normal")+' · DEMO STATUS</p>'+graph(m)+'<p class="eva-modal-desc"><strong>Illustrative profile band:</strong> '+m[4]+' '+m[5]+'</p><p class="eva-modal-desc">The dot shows a fictional value selected for the current Normal / Abnormal demo state, not a historical or actual astronaut measurement.</p>'+(state.decision?.denied?'<button type="button" class="eva-text-button" data-action="flags">View all abnormal parameters</button>':'');}
 return '<div class="eva-modal-backdrop" data-action="close-backdrop"><div class="eva-modal" role="dialog" aria-modal="true" aria-labelledby="evaModalHeading"><button type="button" class="eva-close" data-action="close" aria-label="Close report">×</button>'+body+'<p class="eva-modal-note">'+(state.modal.startsWith("critical:")?"These reference ranges are team-supplied, not NASA-approved EVA thresholds. Only the current entry is plotted; no past readings are simulated. This interface cannot authorize EVA.":"Profile charts display one fictional value against an illustrative range. They are not real astronaut measurements or NASA-approved medical limits.")+'</p></div></div>';
}
function render(){
 const body=state.screen==="welcome"?welcome():state.screen==="identify"?identify():state.screen==="dashboard"?dashboard():state.screen==="critical"?preEvaMarkup(state,esc):results();
 root.innerHTML='<div class="eva-universe" aria-hidden="true"><div class="eva-sun"></div><div class="eva-horizon"></div></div><header class="eva-top"><div class="eva-brand"><span class="eva-orbit" aria-hidden="true"></span>ORBIT-M</div><div class="eva-top-right"><span class="eva-kicker">EXTRAVEHICULAR ACTIVITY / INTERACTIVE DEMO</span></div></header><main class="eva-stage">'+body+'</main>'+modal();
 if(state.screen==="critical")preEvaRefresh(root,state.critical);
 if(state.modal)root.querySelector(".eva-close")?.focus();
}
root.addEventListener("click",event=>{
 const btn=event.target.closest("[data-action]");if(!btn||!root.contains(btn))return;
 const action=btn.dataset.action;
 if(action==="close-backdrop"&&event.target!==btn)return;
 if(action==="start"||action==="identify"){go("identify");return;}
 if(action==="dashboard"){if(state.screen==="critical")state.critical=preEvaGetInputs(root,state.critical);go("dashboard");return;}
 if(action==="critical"){go("critical");return;}
 if(action==="criticalMetric"){
   const key=btn.dataset.id;
   if(!preEvaRanges.some(rule=>rule.key===key))return;
   if(state.screen==="critical")state.critical=preEvaGetInputs(root,state.critical);
   state.modal="critical:"+key;
   render();return;
 }
 if(action==="close"||action==="close-backdrop"){state.modal="";render();return;}
 if(action==="flags"){state.modal="flags";render();return;}
 if(action==="metric"){storeInputs();state.modal=btn.dataset.id;render();return;}
 if(action==="toggle"){storeInputs();state.flags[btn.dataset.id]=!state.flags[btn.dataset.id];render();return;}
 if(action==="random"){storeInputs();for(const m of METRICS)state.flags[m[0]]=Math.random()<.32;render();}
});
root.addEventListener("input",event=>{
 if(event.target.closest?.("#evaVitalsForm")){
   state.critical=preEvaGetInputs(root,state.critical);
   preEvaRefresh(root,state.critical);
 }
});
root.addEventListener("change",event=>{
 if(event.target.closest?.("#evaVitalsForm")){
   state.critical=preEvaGetInputs(root,state.critical);
   preEvaRefresh(root,state.critical);
 }
});
root.addEventListener("submit",event=>{
 if(event.target.id==="evaIdForm"){
   event.preventDefault();const n=Number(root.querySelector("#evaIdNumber").value);
   if(!Number.isInteger(n)||n<1||n>10){root.querySelector("#evaIdError").textContent="Enter a whole number from 1 to 10.";return;}
   state.id=n;state.flags=Object.fromEntries(METRICS.map(m=>[m[0],FAILURES[n].includes(m[0])]));
   state.missionLength="";state.missionPurpose="";state.critical=preEvaEmpty();state.decision=null;go("dashboard");return;
 }
 if(event.target.id==="evaVitalsForm"){
   event.preventDefault();
   state.critical=preEvaGetInputs(root,state.critical);
   const result=preEvaInspect(state.critical);
   if(!result.valid){
     const feedback=root.querySelector("#evaVitalsFeedback");
     if(feedback)feedback.textContent=result.errors.join(" ");
     return;
   }
   const profileFlags=abnormal().map(m=>m[0]);
   const vitalFlags=result.issues.map(row=>({...row}));
   state.decision={
     denied:profileFlags.length+vitalFlags.length>0,
     count:profileFlags.length+vitalFlags.length,
     profileFlags,vitalFlags,data:{...result.data}
   };
   go("result");
   return;
 }
 if(event.target.id==="evaMissionForm"){
   event.preventDefault();storeInputs();const days=Number(state.missionLength);
   if(!Number.isInteger(days)||days<1||days>1095||!state.missionPurpose.trim()){root.querySelector("#evaAssessmentFeedback").textContent="Enter a valid mission length and purpose.";return;}
   go("critical");
 }
});
root.addEventListener("keydown",event=>{if(event.key==="Escape"&&state.modal){state.modal="";render();}});
document.body.style.overflow="hidden";render();
