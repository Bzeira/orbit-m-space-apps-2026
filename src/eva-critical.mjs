/* ORBIT-M: immediate pre-EVA demo measurements. No real medical clearance. */
export const preEvaEmpty=()=>({
  heartRate:"",spo2:"",systolic:"",diastolic:"",temperature:"",breaths:"",interval:"30"
});
export const preEvaRanges=[
  {key:"heartRate",label:"Heart rate",min:60,max:100,unit:"bpm"},
  {key:"spo2",label:"Oxygen saturation (SpO₂)",min:95,max:100,unit:"%"},
  {key:"systolic",label:"Systolic blood pressure",min:90,max:120,unit:"mmHg"},
  {key:"diastolic",label:"Diastolic blood pressure",min:60,max:80,unit:"mmHg"},
  {key:"pp",label:"Pulse pressure (PP)",min:40,max:60,unit:"mmHg"},
  {key:"map",label:"Estimated mean arterial pressure (MAP)",min:70,max:100,unit:"mmHg"},
  {key:"respRate",label:"Respiratory rate",min:12,max:20,unit:"breaths/min"}
];
const parseValue=v=>{
  if(v===undefined||v===null||String(v).trim()==="")return null;
  const n=Number(v);return Number.isFinite(n)?n:null;
};
export function preEvaInspect(raw){
  const data={
    heartRate:parseValue(raw.heartRate),
    spo2:parseValue(raw.spo2),
    systolic:parseValue(raw.systolic),
    diastolic:parseValue(raw.diastolic),
    temperature:parseValue(raw.temperature),
    breaths:parseValue(raw.breaths)
  };
  const interval=Number(raw.interval);
  const errors=[];
  if(Object.values(data).some(x=>x===null))errors.push("Complete all six measurement inputs.");
  if(![30,60].includes(interval))errors.push("Select a 30- or 60-second observation interval.");
  if(data.heartRate!==null&&data.heartRate<=0)errors.push("Heart rate must be greater than zero.");
  if(data.spo2!==null&&(data.spo2<0||data.spo2>100))errors.push("Oxygen saturation must be from 0% to 100%.");
  if(data.systolic!==null&&data.systolic<=0)errors.push("Systolic pressure must be positive.");
  if(data.diastolic!==null&&data.diastolic<=0)errors.push("Diastolic pressure must be positive.");
  if(data.systolic!==null&&data.diastolic!==null&&data.systolic<=data.diastolic)errors.push("Systolic pressure must be higher than diastolic pressure.");
  if(data.breaths!==null&&(!Number.isInteger(data.breaths)||data.breaths<0))errors.push("Enter a non-negative whole number of counted breaths.");
  // PP = SBP - DBP; MAP approximated by DBP + PP/3 (at ordinary/resting heart rates).
  data.pp=data.systolic!==null&&data.diastolic!==null&&data.systolic>data.diastolic?data.systolic-data.diastolic:null;
  data.map=data.pp===null?null:data.diastolic+data.pp/3;
  // Count respiratory cycles over the observed interval, then normalize per minute.
  data.respRate=data.breaths!==null&&[30,60].includes(interval)?data.breaths*60/interval:null;
  const rows=preEvaRanges.map(rule=>({...rule,value:data[rule.key],
    outOfRange:data[rule.key]!==null&&(data[rule.key]<rule.min||data[rule.key]>rule.max)}));
  return {data,rows,issues:rows.filter(x=>x.outOfRange),errors,valid:errors.length===0};
}
export function preEvaGetInputs(root,previous){
  const updated={...previous};
  for(const key of Object.keys(updated)){
    const node=root.querySelector('[name="'+key+'"]');
    if(node)updated[key]=node.value;
  }
  return updated;
}
export const preEvaFormat=v=>v===null?"—":Number.isInteger(v)?String(v):v.toFixed(1);
function inputField(name,label,unit,placeholder,step,min,max,raw,esc){
  return '<label class="eva-critical-field"><span>'+label+' <small>'+unit+'</small></span>'
   +'<input name="'+name+'" type="number" inputmode="decimal" step="'+step+'" '
   +(min!==null?'min="'+min+'" ':'')+(max!==null?'max="'+max+'" ':'')
   +'placeholder="'+placeholder+'" value="'+esc(raw[name])+'" required></label>';
}
function displayRow(key,label,band){
  return '<div class="eva-live-row"><div><span>'+label+'</span><small>'+band+'</small></div>'
    +'<div class="eva-live-result"><strong data-vital-value="'+key+'">—</strong>'
    +'<span data-vital-status="'+key+'" class="eva-live-state pending">Awaiting input</span></div></div>';
}
export function preEvaMarkup(state,esc){
  const raw=state.critical;
  return '<section class="eva-critical" aria-label="Pre EVA vital measurement inputs">'
   +'<div class="eva-card eva-critical-entry">'
   +'<p class="eva-critical-step">ASTRONAUT '+state.id+' / FINAL CHECKPOINT</p>'
   +'<h1 tabindex="-1">Pre-EVA Vital Signs</h1>'
   +'<p class="eva-critical-intro">Enter measurements taken immediately before the simulated EVA. Compare them with your proposed reference ranges.</p>'
   +'<form id="evaVitalsForm" class="eva-critical-form" novalidate>'
   +'<div class="eva-critical-section"><h2>Cardiorespiratory measurements</h2><div class="eva-critical-fields">'
   +inputField("heartRate","Heart rate","bpm","e.g. 78","1",1,null,raw,esc)
   +inputField("spo2","Oxygen saturation · SpO₂","%","e.g. 98","0.1",0,100,raw,esc)
   +'</div></div>'
   +'<div class="eva-critical-section"><h2>Blood pressure <small>mmHg</small></h2><div class="eva-critical-fields">'
   +inputField("systolic","Systolic","mmHg","e.g. 115","1",1,null,raw,esc)
   +inputField("diastolic","Diastolic","mmHg","e.g. 75","1",1,null,raw,esc)
   +'</div><p class="eva-critical-hint">PP = systolic − diastolic. Estimated MAP = diastolic + PP / 3. Both values update automatically.</p></div>'
   +'<div class="eva-critical-section"><h2>Temperature &amp; breathing</h2><div class="eva-critical-fields">'
   +inputField("temperature","Body temperature","°C","e.g. 36.7","0.1",null,null,raw,esc)
   +inputField("breaths","Breaths counted","during interval","e.g. 8","1",0,null,raw,esc)
   +'<label class="eva-critical-field eva-critical-wide"><span>Respiration count interval <small>seconds</small></span>'
   +'<select name="interval"><option value="30" '+(raw.interval==="30"?"selected":"")+'>30 seconds · short interval</option>'
   +'<option value="60" '+(raw.interval==="60"?"selected":"")+'>60 seconds · full minute</option></select></label>'
   +'</div><p class="eva-critical-hint">Breaths/min = counted breaths × 60 / seconds. If breathing is irregular, use the full minute. Respiratory rate alone cannot verify lung function or psychological stability.</p></div>'
   +'<div class="eva-critical-actions"><button class="eva-critical-back" type="button" data-action="dashboard">← Back to astronaut profile</button>'
   +'<button class="eva-assess" type="submit">Complete Readiness Assessment</button></div>'
   +'<p id="evaVitalsFeedback" class="eva-critical-error" role="alert" aria-live="polite"></p></form>'
   +'</div><aside class="eva-card eva-critical-review"><p class="eva-critical-step">LIVE MEASUREMENT SUMMARY</p>'
   +'<h2>Range Check</h2><p class="eva-critical-hint">Inclusive demonstration bands provided by the team. Not validated for EVA authorization.</p>'
   +'<div class="eva-live-list">'
   +displayRow("heartRate","Heart rate","60–100 bpm")
   +displayRow("spo2","Oxygen saturation","95–100%")
   +displayRow("systolic","Systolic pressure","90–120 mmHg")
   +displayRow("diastolic","Diastolic pressure","60–80 mmHg")
   +'</div><h3>Automatically calculated</h3><div class="eva-live-list">'
   +displayRow("pp","Pulse pressure · PP","40–60 mmHg")
   +displayRow("map","Estimated MAP","70–100 mmHg")
   +'</div><h3>Other measurements</h3><div class="eva-live-list">'
   +displayRow("respRate","Respiratory rate","12–20 breaths/min")
   +displayRow("temperature","Body temperature","°C · range unspecified")
   +'</div><p class="eva-critical-disclaimer">Temperature is recorded but not automatically flagged because no range was provided. MAP is an approximation. This demonstration does not grant actual EVA medical clearance.</p>'
   +'</aside></section>';
}
export function preEvaRefresh(root,raw){
  const result=preEvaInspect(raw);
  for(const row of result.rows){
    const valueNode=root.querySelector('[data-vital-value="'+row.key+'"]');
    if(valueNode)valueNode.textContent=preEvaFormat(row.value);
    const statusNode=root.querySelector('[data-vital-status="'+row.key+'"]');
    if(statusNode){
      statusNode.textContent=row.value===null?"Awaiting input":row.outOfRange?"Outside range":"Within range";
      statusNode.className="eva-live-state "+(row.value===null?"pending":row.outOfRange?"bad":"ok");
    }
  }
  const temp=root.querySelector('[data-vital-value="temperature"]');
  if(temp)temp.textContent=preEvaFormat(result.data.temperature);
  const tempStatus=root.querySelector('[data-vital-status="temperature"]');
  if(tempStatus){tempStatus.textContent=result.data.temperature===null?"Awaiting input":"Recorded · No range specified";tempStatus.className="eva-live-state pending";}
  return result;
}
