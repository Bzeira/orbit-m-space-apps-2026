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
  {key:"respRate",label:"Respiratory rate",min:12,max:20,unit:"breaths/min"},
  {key:"temperature",label:"Body temperature",min:36,max:37.5,unit:"°C",inputMin:30,inputMax:41}
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
  const invalidTemperature=data.temperature!==null&&(data.temperature<30||data.temperature>41);
  if(invalidTemperature)errors.push("Body temperature must be between 30°C and 41°C. Recheck the measurement.");
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
  // Near-limit is an illustrative UI tier, NOT an EVA medical or NASA threshold.
  // It means a reading is still inside its reference band but within the
  // outer 10% of that band's width at either end.
  const rows=preEvaRanges.map(rule=>{
    const value=data[rule.key], lowerDistance=value===null?null:value-rule.min,
          upperDistance=value===null?null:rule.max-value;
    const nearestSide=lowerDistance!==null&&lowerDistance<=upperDistance?"lower":"upper";
    if(rule.key==="temperature"){
      // Illustrative UI tiers, not NASA/EVA medical criteria.
      // 30–41°C is the acceptable demo input window, not a physiological limit.
      const invalid=invalidTemperature;
      const outOfRange=value!==null&&!invalid&&(value<35||value>=38);
      const nearLimit=value!==null&&!invalid&&!outOfRange&&(value<36||value>37.5);
      return {...rule,value,invalid,outOfRange,nearLimit,nearestSide,
        nearestLimit:nearestSide==="lower"?rule.min:rule.max};
    }
    const outOfRange=value!==null&&(value<rule.min||value>rule.max);
    const margin=(rule.max-rule.min)*.10;
    const nearLimit=value!==null&&!outOfRange&&Math.min(lowerDistance,upperDistance)<=margin+1e-9;
    return {...rule,value,invalid:false,outOfRange,nearLimit,nearestSide,
      nearestLimit:nearestSide==="lower"?rule.min:rule.max,
      distance:nearLimit?Math.min(lowerDistance,upperDistance):null,reviewMargin:margin};
  });
  return {data,rows,issues:rows.filter(x=>x.outOfRange),
    reviewFlags:rows.filter(x=>x.nearLimit),errors,valid:errors.length===0};
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
  const isChartable=preEvaRanges.some(rule=>rule.key===key);
  const start=isChartable
    ?'<button type="button" class="eva-live-row eva-live-row-btn" data-action="criticalMetric" data-id="'+key+'" aria-label="Open reference chart for '+label+'">'
    :'<div class="eva-live-row">';
  return start
    +'<div><span>'+label+'</span><small>'+band+'</small></div>'
    +'<div class="eva-live-result"><strong data-vital-value="'+key+'">—</strong>'
    +'<span data-vital-status="'+key+'" class="eva-live-state pending">Awaiting input</span></div>'
    +(isChartable?'</button>':'</div>');
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
   +inputField("temperature","Body temperature","°C","e.g. 36.7","0.1",30,41,raw,esc)
   +inputField("breaths","Breaths counted","during interval","e.g. 8","1",0,null,raw,esc)
   +'<p class="eva-critical-hint eva-critical-wide">Temperature input: 30–41°C. Normal 36–37.5°C; 35–35.9°C or above 37.5°C and below 38°C needs inspection; below 35°C or at least 38°C is flagged.</p>'
   +'<p id="evaTemperatureError" class="eva-critical-error eva-critical-wide" role="alert" aria-live="polite"></p>'
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
   +displayRow("temperature","Body temperature","36–37.5°C normal · 30–41°C input")
   +'</div><p class="eva-critical-disclaimer">Temperature now participates in the demo: 36–37.5°C normal, 35–35.9°C or above 37.5°C and below 38°C review, below 35°C or from 38°C flagged. Outside 30–41°C is rejected. These are illustrative rules, not EVA authorization criteria. MAP is an approximation.</p>'
   +'</aside></section>';
}
export function preEvaRefresh(root,raw){
  const result=preEvaInspect(raw);
  for(const row of result.rows){
    const valueNode=root.querySelector('[data-vital-value="'+row.key+'"]');
    if(valueNode)valueNode.textContent=preEvaFormat(row.value);
    const statusNode=root.querySelector('[data-vital-status="'+row.key+'"]');
    if(statusNode){
      statusNode.textContent=row.value===null?"Awaiting input":row.invalid?"Invalid entry":row.outOfRange?"Outside range":row.nearLimit?"Needs inspection":"Within range";
      statusNode.className="eva-live-state "+(row.value===null?"pending":row.invalid?"bad":row.outOfRange?"bad":row.nearLimit?"caution":"ok");
    }
  }
  const tempRow=result.rows.find(row=>row.key==="temperature");
  const input=root.querySelector('[name="temperature"]');
  if(input){
    if(typeof input.setAttribute==="function")input.setAttribute("aria-invalid",tempRow.invalid?"true":"false");
    if(typeof input.setCustomValidity==="function")input.setCustomValidity(tempRow.invalid?"Enter 30°C to 41°C.":"");
  }
  const error=root.querySelector("#evaTemperatureError");
  if(error)error.textContent=tempRow.invalid?"Input must be between 30°C and 41°C. Check the measurement.":"";
  const submit=root.querySelector('#evaVitalsForm button[type="submit"]');
  if(submit)submit.disabled=tempRow.invalid;
  return result;
}


/* Chart a real entered reading against the team's provided reference band.
 * Historical readings are unavailable, so do not generate fake time-series data.
 */
export function preEvaReferenceChart(key,raw){
  const rule=preEvaRanges.find(item=>item.key===key);
  if(!rule)return "";
  const result=preEvaInspect(raw);
  const value=result.data[key];
  // The two ends of the line are the supplied inclusive range boundaries.
  // Out-of-range values are shown beyond the line, like a lab reference plot.
  // Clamp extreme values to the visible plot width without misreporting the number.
  const lineStart=115,lineEnd=495,lineY=116;
  const span=rule.max-rule.min;
  const scaled=value===null?null:lineStart+(value-rule.min)*(lineEnd-lineStart)/span;
  const markerX=scaled===null?null:Math.max(54,Math.min(556,scaled));
  const current=result.rows.find(row=>row.key===key);
  const outside=current?.outOfRange||false;
  const nearLimit=current?.nearLimit||false;
  const markerColor=current?.invalid?"#bc3b46":outside?"#bc3b46":nearLimit?"#b27b2d":"#34804c";
  const fmt=x=>Number(x).toFixed(1);
  const marker=value===null
    ?'<text x="305" y="81" text-anchor="middle" fill="#786775" font-size="16">Enter a reading to place the marker</text>'
    :'<text x="'+fmt(markerX)+'" y="78" text-anchor="middle" fill="'+markerColor+'" font-weight="700" font-size="32">'+preEvaFormat(value)+'</text>'
     +'<circle data-value-marker="true" cx="'+fmt(markerX)+'" cy="'+lineY+'" r="11" fill="'+markerColor+'" stroke="#fcfaff" stroke-width="3"/>';
  const aria=rule.label+": reference band "+rule.min+" to "+rule.max+" "+rule.unit+
    (value===null?"; no reading entered":"; entered value "+preEvaFormat(value)+" "+rule.unit);
  return '<svg class="eva-chart eva-reference-chart" viewBox="0 0 610 218" role="img" aria-label="'+aria+'">'
    +'<text x="48" y="30" fill="#786775" font-size="12" letter-spacing="1.2">PRE-EVA REFERENCE RANGE</text>'
    +'<line data-reference-line="true" x1="'+lineStart+'" x2="'+lineEnd+'" y1="'+lineY+'" y2="'+lineY+'" stroke="#765e92" stroke-width="5" stroke-linecap="round"/>'
    +'<line x1="'+lineStart+'" x2="'+lineStart+'" y1="130" y2="144" stroke="#63566b" stroke-width="2"/>'
    +'<line x1="'+lineEnd+'" x2="'+lineEnd+'" y1="130" y2="144" stroke="#63566b" stroke-width="2"/>'
    +marker
    +'<text x="'+lineStart+'" y="178" text-anchor="middle" fill="#463a4b" font-size="23">'+rule.min+'</text>'
    +'<text x="'+lineEnd+'" y="178" text-anchor="middle" fill="#463a4b" font-size="23">'+rule.max+'</text>'
    +'<text x="305" y="179" text-anchor="middle" fill="#765e92" font-size="22">'+rule.unit+'</text>'
    +'</svg>';
}
