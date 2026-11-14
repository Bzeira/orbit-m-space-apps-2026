/**
 * ORBIT-M cabin + crew context explorer. All records are deliberately
 * synthetic, manual and nonclinical. No connection to spacecraft sensors.
 *
 * Source: NASA-STD-3001, Vol 2, V2 6004: the nominal HABITAT requirement
 * for ppCO2 is a one-hour average no greater than 3 mmHg. This is NOT
 * an instantaneously sampled alarm, clinical symptom threshold, diagnosis,
 * probability of harm, or operational instruction.
 *
 * V2 6020/6021 reference cabin pressure, humidity, temperature, ppO2 and
 * ppCO2 measurement. Oxygen ppO2 is not inspired PIO2; do NOT compare the
 * two to infer hypoxia.
 */
export const NASA_CABIN_STANDARD="https://www.nasa.gov/reference/6-0-natural-and-induced-environments-vol-2/";
export const NASA_CO2_BRIEF="https://www.nasa.gov/ochmo-tb-004-carbon-dioxide-2/";
export const NOMINAL_CO2_ONE_HOUR_MAX_MMHG=3;
export const CABIN_SYMPTOMS=Object.freeze({
  headache:"Headache",sleep:"Trouble sleeping",focus:"Difficulty concentrating",
  fatigue:"Fatigue",none:"No symptom reported"
});
const FIELDS=Object.freeze({
  co2OneHourMmHg:{min:0,max:20,label:"one-hour mean cabin ppCO2 (mmHg)"},
  oxygenPartialMmHg:{min:0,max:300,label:"ambient cabin ppO2 (mmHg)"},
  pressureKPa:{min:0,max:150,label:"cabin total pressure (kPa)"},
  temperatureC:{min:-20,max:65,label:"cabin temperature (°C)"},
  humidityPercent:{min:0,max:100,label:"relative humidity (%)"}
});
function validNumber(value,{min,max,label}){
  if(typeof value==="boolean"||value===null||String(value??"").trim()==="")
    throw Error("Enter "+label+".");
  const n=Number(value);
  if(!Number.isFinite(n)||n<min||n>max)throw Error("Invalid "+label+".");
  return n;
}
export function validateCabinReading(input){
  const day=Number(input?.day);
  if(!Number.isInteger(day)||day<1||day>1095)throw Error("Enter a valid fictional mission day.");
  const row={day};
  for(const [name,bounds] of Object.entries(FIELDS)){
    row[name]=validNumber(input?.[name],bounds);
  }
  const symptoms=input?.symptoms??[];
  if(!Array.isArray(symptoms)||symptoms.some(x=>x==="none"||!CABIN_SYMPTOMS[x])||
     new Set(symptoms).size!==symptoms.length||symptoms.length>4){
    throw Error("Choose only valid, non-duplicated fictional symptoms.");
  }
  return {...row,symptoms:[...symptoms],synthetic:true,
    sourceTag:"ORBIT-M team-created scenario; no real sensor readings"};
}
export function reviewCabinAndCrew(reading){
  const row=validateCabinReading(reading);
  const aboveNominal=row.co2OneHourMmHg>NOMINAL_CO2_ONE_HOUR_MAX_MMHG;
  const hasSymptoms=row.symptoms.length>0;
  const context=aboveNominal
    ?"One-hour mean ppCO2 is above the NASA-STD-3001 V2 6004 nominal habitat design reference (3 mmHg)."
    :"One-hour mean ppCO2 is at or below the NASA-STD-3001 V2 6004 nominal habitat design reference (3 mmHg).";
  const association=aboveNominal&&hasSymptoms
    ?"The fictional cabin reading and crew symptoms were logged on the same mission day. This is co-occurrence only; it cannot establish that CO2 caused the symptoms."
    :hasSymptoms
    ?"A symptom is recorded, but a value at or below this nominal reference cannot rule out any environmental or medical issue."
    :"No accompanying symptom is logged; that does not establish that environmental or crew health conditions are safe.";
  const next=aboveNominal
    ?"Verify the one-hour averaging period, sensor quality and habitat context; follow authorized mission environmental and medical protocols."
    :hasSymptoms
    ?"Review symptoms and measurement context with qualified mission medical personnel; this reference is not a health-clearance rule."
    :"Continue appropriate approved monitoring; the prototype makes no safety or health clearance decision.";
  return {
    ...row,aboveNominal,hasSymptoms,coObserved:aboveNominal&&hasSymptoms,
    referenceValue:NOMINAL_CO2_ONE_HOUR_MAX_MMHG,referenceUnit:"mmHg / one-hour average",
    category:aboveNominal?"ABOVE_NOMINAL_REFERENCE":hasSymptoms?"SYMPTOM_CONTEXT":"AT_OR_BELOW_REFERENCE",
    context,association,next,
    oxygenNote:"Ambient ppO2 is logged for context. Inspired PIO2 depends on other factors and is not calculated or screened for hypoxia here.",
    clinicalDiagnosis:false,causalConclusion:false
  };
}
const STORIES=Object.freeze([
  {day:12,co2OneHourMmHg:1.8,oxygenPartialMmHg:159,pressureKPa:101.2,
    temperatureC:22.0,humidityPercent:44,symptoms:[]},
  {day:15,co2OneHourMmHg:2.4,oxygenPartialMmHg:159,pressureKPa:101.1,
    temperatureC:22.3,humidityPercent:46,symptoms:[]},
  {day:17,co2OneHourMmHg:3.4,oxygenPartialMmHg:158,pressureKPa:101.0,
    temperatureC:22.5,humidityPercent:47,symptoms:["headache","focus"]},
  {day:19,co2OneHourMmHg:2.8,oxygenPartialMmHg:159,pressureKPa:101.0,
    temperatureC:22.4,humidityPercent:46,symptoms:["fatigue"]}
].map(x=>Object.freeze({...x,symptoms:Object.freeze([...x.symptoms])})));
export function cabinMissionScene(day){
  const source=STORIES.find(x=>x.day===Number(day));
  if(!source)throw Error("No fictional cabin scene exists for this mission day.");
  return reviewCabinAndCrew(source);
}
export function cabinMissionTrend(){
  return STORIES.map(row=>({
    day:row.day,co2OneHourMmHg:row.co2OneHourMmHg,
    aboveNominal:row.co2OneHourMmHg>NOMINAL_CO2_ONE_HOUR_MAX_MMHG
  }));
}
