/**
 * ORBIT-M fictional mission and twice-per-day crew check-ins.
 * The morning/evening schedule and all 1–5 prompts are our PROTOTYPE design,
 * not a NASA clinical schedule, scale, diagnostic tool or secure medical record.
 */
export const BHP_SOURCE="https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-016-behavioral-health.pdf";
export const BHP_OPERATIONS="https://www.nasa.gov/reference/jsc-behavioral-health/";
export const CHECKIN_SLOTS=Object.freeze(["morning","evening","extra"]);
export const MENTAL_FIELDS=Object.freeze({
  mood:{label:"Mood",hint:"1 = very low · 5 = very positive"},
  stress:{label:"Stress",hint:"1 = low · 5 = high"},
  anxiety:{label:"Anxiety or tension",hint:"1 = low · 5 = high"},
  fatigue:{label:"Mental fatigue",hint:"1 = low · 5 = high"},
  focus:{label:"Concentration",hint:"1 = difficult · 5 = clear"},
  connection:{label:"Social connection",hint:"1 = isolated · 5 = connected"},
  sleepQuality:{label:"Sleep quality",hint:"1 = poor · 5 = good"},
  motivation:{label:"Motivation",hint:"1 = low · 5 = high"}
});
const num=(v,min,max)=>Number.isFinite(Number(v))&&String(v??"").trim()!==""&&Number(v)>=min&&Number(v)<=max;
export function checkMission(config){
  const duration=Number(config?.durationDays),day=Number(config?.missionDay);
  if(!Number.isInteger(duration)||duration<1||duration>1095)throw Error("Mission length must be 1–1095 days.");
  if(!Number.isInteger(day)||day<1||day>duration)throw Error("Mission day must be within the planned mission.");
  return {durationDays:duration,missionDay:day,slotsPerDay:2};
}
export function checkMentalEntry(input,mission){
  const config=checkMission(mission),day=Number(input?.day??config.missionDay);
  const slot=String(input?.slot||"");
  if(!Number.isInteger(day)||day<1||day>config.durationDays)throw Error("Check-in day is outside the mission plan.");
  if(!CHECKIN_SLOTS.includes(slot))throw Error("Choose Morning, Evening or Additional check-in.");
  const result={day,slot};
  for(const field of Object.keys(MENTAL_FIELDS)){
    if(!num(input?.[field],1,5)||!Number.isInteger(Number(input[field])))
      throw Error("Every behavioral self-rating must be a whole number from 1 to 5.");
    result[field]=Number(input[field]);
  }
  for(const [field,min,max] of [["heartRate",30,220],["sleepHours",0,24],["temperature",30,43]]){
    if(!num(input?.[field],min,max))throw Error("Enter valid fictional physiological readings.");
    result[field]=Number(input[field]);
  }
  const support=String(input?.support||"no");
  if(!["yes","no"].includes(support))throw Error("Select whether a private support conversation is requested.");
  result.support=support;
  result.demo=true;
  return result;
}
export function addMentalEntry(records,input,config){
  if(!Array.isArray(records)||records.length>240)throw Error("Invalid sample check-in history.");
  const row=checkMentalEntry(input,config);
  if(row.slot!=="extra"&&records.some(r=>r.day===row.day&&r.slot===row.slot))
    throw Error("This check-in is already recorded for this mission day. Choose Additional instead.");
  return [...records,row].slice(-240);
}
export function getDaySchedule(records,day){
  return ["morning","evening"].map(slot=>({slot,
    recorded:records.some(x=>x.day===day&&x.slot===slot)}));
}
export function explainMental(record){
  const flagged=[];
  if(record.mood<=2)flagged.push("lower self-reported mood");
  if(record.stress>=4)flagged.push("higher stress");
  if(record.anxiety>=4)flagged.push("higher tension");
  if(record.fatigue>=4)flagged.push("mental fatigue");
  if(record.focus<=2)flagged.push("difficulty concentrating");
  if(record.connection<=2)flagged.push("feeling less connected");
  if(record.sleepQuality<=2)flagged.push("poor sleep quality");
  if(record.motivation<=2)flagged.push("lower motivation");
  return {
    flagged,attention:record.support==="yes"||flagged.length>0,
    title:record.support==="yes"?"Private support requested":flagged.length?"Check-in topics worth discussing":"Recorded — no demo prompts",
    message:record.support==="yes"?"In a real mission, the crew member should be able to request an appropriately private psychological conference via approved systems. This demo sends no messages.":
      flagged.length?"These subjective responses are discussion prompts, not a mental-health diagnosis. Offer a confidential check-in through authorized mission resources.":
      "This fictional sample produced no project-made prompts. It does not establish psychological well-being.",
    source:BHP_SOURCE
  };
}
export function demoMentalEntries(){
  const mission={durationDays:180,missionDay:12};
  const base={day:12,heartRate:64,sleepHours:7.2,temperature:36.6,
    mood:4,stress:2,anxiety:2,fatigue:2,focus:4,connection:4,sleepQuality:4,motivation:4,support:"no"};
  return [checkMentalEntry({...base,slot:"morning"},mission),checkMentalEntry({...base,slot:"evening",mood:3,fatigue:3},mission)];
}
