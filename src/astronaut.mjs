/**
 * Fictional, deterministic fixtures for the team's EVA presentation.
 * All ranges below are team-authored DEMO rules, never medical thresholds.
 * Screening indices do not represent a connected test or clinical instrument.
 */
export const PARAMETERS = Object.freeze([
  {key:"sleep", label:"sleep score", unit:"/100", kind:"index", baseline:86, tolerance:10, description:"Fictional sleep-quality index."},
  {key:"bpm", label:"bpm", unit:"bpm", kind:"measurement", baseline:64, tolerance:12, description:"Synthetic resting heart rate, compared with this astronaut's preflight baseline."},
  {key:"anatomy", label:"anatomical profile", unit:"/100", kind:"index", baseline:90, tolerance:8, description:"Illustrative screening index. No anatomical examination or imaging is connected."},
  {key:"fitness", label:"fitness", unit:"/100", kind:"index", baseline:88, tolerance:10, description:"Illustrative fitness-screening index. No exercise test is connected."},
  {key:"ent", label:"ENT", unit:"/100", kind:"index", baseline:92, tolerance:7, description:"Illustrative ear, nose and throat screening index. No examination is connected."},
  {key:"temperature", label:"body temp", unit:"°C", kind:"measurement", baseline:36.6, tolerance:0.6, description:"Synthetic body temperature, compared with this astronaut's preflight baseline."},
  {key:"vision", label:"vision", unit:"/100", kind:"index", baseline:91, tolerance:8, description:"Illustrative vision-screening index. This is not visual acuity or a SANS assessment."}
]);

// Preserve the established ten-ID demonstration scenarios from eva-flow.mjs.
const FLAGS = [[],["bpm","temperature"],["sleep","fitness"],["vision"],[],["ent"],["anatomy","bpm"],[],["fitness"],["temperature","vision"]];
const round = n => Number(n.toFixed(1));
const median = values => {
  const sorted = [...values].sort((a,b)=>a-b);
  const middle = sorted.length / 2;
  return round((sorted[Math.floor(middle)] + sorted[Math.ceil(middle)-1]) / 2);
};

export function parseAstronautId(value) {
  if(typeof value !== "number" && typeof value !== "string") return null;
  const text = String(value).trim();
  if(!/^\d+$/.test(text)) return null;
  const id = Number(text);
  return Number.isInteger(id) && id >= 1 && id <= 10 ? id : null;
}

export function createAstronaut(value) {
  const id = parseAstronautId(value);
  if(id === null) throw new Error("Enter a whole-number astronaut ID from 1 to 10.");
  const parameters = PARAMETERS.map((definition,index)=>{
    const shift = definition.key === "temperature" ? ((id-1)%3)*0.1 : ((id-1)%3)-1;
    const center = round(definition.baseline + shift);
    const variation = definition.key === "temperature" ? 0.1 : 1;
    const preflight = Array.from({length:14},(_,day)=>({
      phase:"preflight",day:day-14,
      value:round(center + [-1,0,1,0,1,-1,0][(day+index)%7]*variation)
    }));
    const baseline = median(preflight.map(row=>row.value));
    const range = {
      min:round(Math.max(0,baseline-definition.tolerance)),
      max:round(Math.min(definition.kind === "index" ? 100 : Infinity,baseline+definition.tolerance))
    };
    const flagged = FLAGS[id-1].includes(definition.key);
    const bad = definition.key === "bpm" || definition.key === "temperature";
    const current = flagged
      ? round(bad ? range.max + definition.tolerance*0.5 : range.min-definition.tolerance*0.5)
      : baseline;
    const inflight = Array.from({length:7},(_,day)=>({
      phase:"inflight",day:day+1,
      value:day === 6 ? current : round(baseline + (current-baseline)*day/6 + [0,1,-1,0,1,0][day]*variation)
    }));
    return {...definition,baseline,range,preflight,inflight,current,synthetic:true,evidence:"DEMO",overridden:false};
  });
  return {id,name:"Astronaut "+id,mission:"EVA-"+String(id).padStart(2,"0"),length:"6 hours",purpose:"Surface sampling",synthetic:true,parameters};
}

export function parameterStatus(parameter) {
  const {current,range} = parameter || {};
  if(!Number.isFinite(current) || !Number.isFinite(range?.min) || !Number.isFinite(range?.max) || range.min > range.max) return "unavailable";
  return current >= range.min && current <= range.max ? "normal" : "abnormal";
}

export function assessReadiness(astronaut) {
  if(astronaut?.synthetic !== true) throw new Error("Only fictional demonstration records are supported.");
  const parameters = Array.isArray(astronaut.parameters) ? astronaut.parameters : [];
  const findings = PARAMETERS.flatMap(definition=>{
    const row = parameters.find(parameter=>parameter.key === definition.key);
    const status = parameterStatus(row);
    return status === "normal" ? [] : [{key:definition.key,label:definition.label,status}];
  });
  return {approved:findings.length === 0,findings,synthetic:true,medicalClearance:false};
}

// The original arrow controls select a demo state by changing the actual
// synthetic value. Status labels, graphs and the result always use that value.
export function setParameterState(astronaut,key,state) {
  if(astronaut?.synthetic !== true || !["normal","abnormal"].includes(state)) throw new Error("Invalid demo state.");
  const parameter = astronaut.parameters.find(row=>row.key === key);
  if(!parameter) throw new Error("Unknown parameter.");
  parameter.current = state === "normal" ? parameter.baseline
    : round(["bpm","temperature"].includes(key)
      ? parameter.range.max + parameter.tolerance*0.5
      : parameter.range.min - parameter.tolerance*0.5);
  parameter.inflight.at(-1).value = parameter.current;
  parameter.overridden = true;
  return parameter;
}
