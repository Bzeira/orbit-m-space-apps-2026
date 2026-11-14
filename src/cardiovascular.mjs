/**
 * ORBIT-M cardiovascular research demonstrator.
 * Itay Lipsky's blood-pressure research + verified primary sources.
 * FICTIONAL manually entered data only. No diagnosis or exercise prescription.
 */
export const CARDIO_SOURCES=Object.freeze({
  aha:"https://pmc.ncbi.nlm.nih.gov/articles/PMC11409525/",
  nasa:"https://www.nasa.gov/humans-in-space/cardiovascular-health-in-microgravity/",
  risk:"https://humanresearchroadmap.nasa.gov/risks/risk.aspx?i=179",
  exercise:"https://pubmed.ncbi.nlm.nih.gov/24970852/"
});
export const CARDIO_CONTEXTS=Object.freeze(["habitat","eva","gravity-return"]);
export const CARDIO_SLOTS=Object.freeze(["morning","evening","extra"]);
export const CARDIO_SYMPTOMS=Object.freeze(["none","lightheaded","fainting","chest","breathing"]);
export const CARDIO_MAX_HISTORY=180;
export const DEMO_SHIFT=20; // team-made, NOT clinical or NASA threshold
function numberIn(value,min,max){
  const s=String(value??"").trim(),v=Number(s);
  return s!==""&&Number.isFinite(v)&&v>=min&&v<=max;
}
export function calculateBp(systolic,diastolic){
  if(!numberIn(systolic,60,260)||!numberIn(diastolic,30,170)||Number(systolic)<=Number(diastolic))
    throw Error("Enter plausible fictional systolic/diastolic values in mmHg (systolic must exceed diastolic).");
  const sbp=Number(systolic),dbp=Number(diastolic),pp=sbp-dbp;
  return {systolic:sbp,diastolic:dbp,pp,map:dbp+pp/3,
    mapMethod:"resting-heart-rate approximation, not measured MAP"};
}
export function checkCardioEntry(input,mission){
  const duration=Number(mission?.durationDays),day=Number(input?.day);
  if(!Number.isInteger(duration)||duration<1||duration>1095||!Number.isInteger(day)||day<1||day>duration)
    throw Error("Choose a day within the fictional mission.");
  const slot=String(input?.slot||""),context=String(input?.context||"");
  const symptom=String(input?.symptom||"none");
  if(!CARDIO_SLOTS.includes(slot))throw Error("Select Morning, Evening or Extra.");
  if(!CARDIO_CONTEXTS.includes(context))throw Error("Select a measurement context.");
  if(!CARDIO_SYMPTOMS.includes(symptom))throw Error("Select an available symptom description.");
  const bp=calculateBp(input?.systolic,input?.diastolic);
  const recorded=input?.recorded&&String(input.recorded).length<100?String(input.recorded):"Synthetic entry";
  return {...bp,day,slot,context,symptom,recorded,demo:true};
}
export function addCardioEntry(records,input,mission){
  if(!Array.isArray(records)||records.length>CARDIO_MAX_HISTORY)throw Error("Invalid fictional cardiovascular log.");
  const next=checkCardioEntry(input,mission);
  if(next.slot!=="extra"&&records.some(r=>r.day===next.day&&r.slot===next.slot))
    throw Error("That morning/evening reading is already recorded; choose Extra.");
  return [...records,next].slice(-CARDIO_MAX_HISTORY);
}
export function plannedReturn(input,mission){
  const s=String(input??"").trim(),days=Number(mission?.durationDays);
  if(s==="")return null;
  const day=Number(s);
  if(!Number.isInteger(day)||!Number.isInteger(days)||day<1||day>days)
    throw Error("Gravity-return day must be within the fictional mission.");
  return day;
}
function median(values){
  if(!values.length)throw Error("A reference is required.");
  const a=[...values].sort((x,y)=>x-y),i=Math.floor(a.length/2);
  return a.length%2?a[i]:(a[i-1]+a[i])/2;
}
export function demoCardioBaseline(){
  return [{systolic:116,diastolic:75},{systolic:118,diastolic:76},
    {systolic:120,diastolic:77}].map(x=>calculateBp(x.systolic,x.diastolic));
}
export function bpBaseline(records=demoCardioBaseline()){
  if(!Array.isArray(records)||!records.length||records.length>60)throw Error("Missing fictional preflight baseline.");
  for(const row of records)calculateBp(row?.systolic,row?.diastolic);
  return calculateBp(median(records.map(x=>Number(x.systolic))),
    median(records.map(x=>Number(x.diastolic))));
}
export function demoCardioHistory(mission={durationDays:180,missionDay:13}){
  const day=Math.min(Math.max(1,mission.missionDay||13),mission.durationDays);
  return [
    {day:Math.max(1,day-1),slot:"morning",context:"habitat",systolic:120,diastolic:78,symptom:"none"},
    {day:Math.max(1,day-1),slot:"evening",context:"habitat",systolic:119,diastolic:77,symptom:"none"}
  ].map(x=>checkCardioEntry(x,mission));
}
export function evaluateCardio(entry,baseline=bpBaseline()){
  const checked=calculateBp(entry?.systolic,entry?.diastolic);
  const comparison=calculateBp(baseline?.systolic,baseline?.diastolic);
  const delta={systolic:checked.systolic-comparison.systolic,
    diastolic:checked.diastolic-comparison.diastolic,
    pp:checked.pp-comparison.pp,map:checked.map-comparison.map};
  const symptom=String(entry?.symptom||"none");
  const serious=["chest","breathing","fainting"].includes(symptom);
  const largeShift=Math.max(Math.abs(delta.systolic),Math.abs(delta.diastolic))>=DEMO_SHIFT;
  const context=entry?.context||"habitat";
  let category,title,reason,action;
  if(serious){
    category="URGENT";title="Symptoms reported — urgent medical review";
    reason="Chest symptoms, breathing difficulty or fainting need prompt qualified medical assessment regardless of an estimated MAP or PP.";
    action="Follow approved mission emergency procedures; do not use this demonstrator for diagnosis or treatment.";
  }else if(largeShift){
    category="REVIEW";title="Illustrative large change relative to preflight samples";
    reason="At least one cuff value differs by 20 mmHg or more from the fictional preflight median. The 20 mmHg marker is team-created, NOT a NASA clinical alert threshold.";
    action="Confirm measurement context and discuss the change with authorized mission medical staff.";
  }else if(symptom==="lightheaded"){
    category="REVIEW";title="Lightheadedness reported — context review";
    reason="Symptoms matter even when the team-made numerical shift marker is not triggered.";
    action="Report the symptom and measurement context to authorized medical staff.";
  }else{
    category="LOGGED";title="Fictional measurement recorded — no demo shift flag";
    reason="A non-flagged entry does not establish health or exclude cardiovascular risk.";
    action="Continue approved mission monitoring.";
  }
  const contextNote=context==="gravity-return"
    ?"Returning to gravity can involve orthostatic intolerance; this fictional reading cannot diagnose it."
    :context==="eva"
    ?"EVA context is recorded, but MAP is NOT changed to a 1/2 coefficient; the document's EVA-specific claim was not verified."
    :"Microgravity changes fluid distribution; there is no assumed universal PP trajectory.";
  return {checked,comparison,delta,category,title,reason,action,contextNote};
}
export function gravityReturnMessage(returnDay,currentDay){
  if(returnDay===null)return "No gravity-return milestone entered.";
  if(currentDay<returnDay)return "Planned gravity transition in "+(returnDay-currentDay)+" mission day(s).";
  if(currentDay===returnDay)return "Planned gravity transition is today in this fictional mission.";
  return "Planned gravity transition was "+(currentDay-returnDay)+" mission day(s) ago in this fictional mission.";
}
