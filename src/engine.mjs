/**
 * ORBIT-M: preflight-vs-inflight personal trend demonstration.
 * SYNTHETIC INPUT ONLY; all change cutoffs are unvalidated team heuristics.
 * This module does not diagnose, clinically triage or prescribe treatment.
 * NASA's Standard Measures research motivates longitudinal pre/in/post phases,
 * but NASA did NOT approve these numerical rules or scenario values.
 */
export const METRICS = {
  heartRate:{label:"Resting heart rate",unit:"bpm"},
  sleepHours:{label:"Sleep duration",unit:"h"},
  mood:{label:"Private self-reported mood",unit:"1–5"},
  temperature:{label:"Body temperature",unit:"°C"}
};
export const BASELINE_DAYS = 14; // illustrative prototype period; not a NASA requirement.
const median = vals => {
  const sorted=[...vals].sort((a,b)=>a-b), n=sorted.length;
  return n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;
};
const round = (n) => Number(n.toFixed(1));
const within = (n,lo,hi) => Number.isFinite(n)&&n>=lo&&n<=hi;
function valid(e) {
  return e && ["preflight","inflight"].includes(e.phase) &&
    within(e.heartRate,30,220) && within(e.sleepHours,0,24) &&
    within(e.mood,1,5) && Number.isInteger(e.mood) &&
    within(e.temperature,30,43);
}
export function analyze(entries) {
  if(!Array.isArray(entries)||entries.some(e=>!valid(e)))
    throw new Error("Invalid telemetry or phase. Use labelled synthetic records.");
  const preflight=entries.filter(e=>e.phase==="preflight");
  const inflight=entries.filter(e=>e.phase==="inflight");
  if(preflight.length<BASELINE_DAYS||inflight.length<2)
    throw new Error("Demo requires 14 preflight days and at least 2 inflight days.");
  const baseline=Object.fromEntries(
    Object.keys(METRICS).map(key=>[key,round(median(preflight.map(e=>e[key])))])
  );
  const current=inflight.at(-1),previous=inflight.at(-2);
  const flags=[];
  // Toy relative changes; not validated, not appropriate for care decisions.
  const twoElevatedPulse=[current,previous].every(
    e => e.heartRate>baseline.heartRate*1.2
  );
  if(twoElevatedPulse)flags.push({
    metric:"heartRate",title:"Resting pulse trend shifted",
    detail:"Two simulated inflight measurements exceed this person's preflight pulse median by over 20%. Not a medical threshold.",
    questions:["Were both readings taken at rest with the same method?","Are there new symptoms that should be reported using mission procedures?"],
    source:"https://www.nasa.gov/hrp/risks/"
  });
  if([current,previous].every(e=>e.sleepHours<baseline.sleepHours-1.5))flags.push({
    metric:"sleepHours",title:"Sleep duration changed",
    detail:"Two synthetic nights are more than 1.5 hours below this person's 14-day preflight sleep median. This is a demonstration rule.",
    questions:["Did light exposure or crew schedules shift?","Is workload or noise affecting sleep?"],
    source:"https://www.nasa.gov/directorates/smd/space-life-physical-sciences-research-applications-division/human-research-program/spaceflight-standard-measures-characterizing-how-humans-adapt-in-space/"
  });
  if([current,previous].every(e=>e.mood<=2))flags.push({
    metric:"mood",title:"Repeated lower mood check-ins",
    detail:"Two consecutive optional, private synthetic check-ins were low; no diagnosis is inferred.",
    questions:["Would the crew member like a private conversation with an authorized psychological-support professional?","Has sleep, social contact or workload changed?"],
    source:"https://www.nasa.gov/reference/jsc-behavioral-health/"
  });
  if(current.temperature>=38)flags.push({
    metric:"temperature",title:"Temperature value needs verification",
    detail:"This sample value activated a demo-only rule. Recheck and use approved mission medical procedures; do not infer a diagnosis.",
    questions:["Was the temperature remeasured and the instrument checked?","Are there symptoms that require contacting the mission medical officer?"],
    source:"https://www.nasa.gov/missions/station/faq-the-real-story-about-astronaut-health-care-in-space/"
  });
  return {
    baseline, current, flags,
    status:flags.length?"REVIEW CHANGES":"NO DEMO FLAGS",
    counts:{preflight:preflight.length,inflight:inflight.length,reviewFlags:flags.length},
    limits:"Preflight median is based on 14 SYNTHETIC days. No clinical validation, environmental calibration or NASA alert thresholds."
  };
}
export function makeScenario(type="stable") {
  if(!["stable","fatigue","temperature","mood"].includes(type))
    throw new Error("Unknown synthetic scenario.");
  const preflight=Array.from({length:BASELINE_DAYS},(_,i)=>({
    phase:"preflight",day:i-BASELINE_DAYS,
    heartRate:62+[-1,0,1,2][i%4],
    sleepHours:[7.4,7.6,7.7,7.5][i%4],
    mood:4,temperature:[36.5,36.6,36.7][i%3]
  }));
  const flight= type==="fatigue"?
    [[68,6.9,3,36.6],[77,5.4,2,36.7],[79,5.1,2,36.8]]:
    type==="temperature"?
    [[63,7.3,4,36.6],[67,7.2,3,37.0],[70,6.3,3,38.2]]:
    type==="mood"?
    [[63,7.4,4,36.6],[65,7.3,2,36.7],[65,7.2,2,36.6]]:
    [[63,7.4,4,36.6],[63,7.3,4,36.5],[64,7.5,4,36.6]];
  return [...preflight,...flight.map(([heartRate,sleepHours,mood,temperature],i)=>({
    phase:"inflight",day:i+1,heartRate,sleepHours,mood,temperature
  }))];
}
export function addEntry(entries,form) {
  const nextDay=entries.filter(e=>e.phase==="inflight").length+1;
  const values={phase:"inflight",day:nextDay};
  for(const key of Object.keys(METRICS)) {
    if(form[key]===undefined||form[key]===null||String(form[key]).trim()==="")
      throw new Error("Every demo reading must have a numeric value.");
    values[key]=Number(form[key]);
  }
  const next=[...entries,values];
  analyze(next); // reject before saving
  return next;
}