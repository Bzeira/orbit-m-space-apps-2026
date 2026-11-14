/**
 * ORBIT-M demonstrator: simple personal-baseline change detection.
 * NOT clinically validated, NOT NASA-certified, not medical advice.
 * All bundled telemetry is synthetic.
 */
export const METRICS = {
  heartRate: {label:"Resting heart rate",unit:"bpm"},
  sleepHours: {label:"Sleep",unit:"h"},
  mood: {label:"Self-reported mood",unit:"1–5"},
  temperature: {label:"Temperature",unit:"°C"}
};
const average = arr => arr.reduce((a,b) => a + b, 0) / arr.length;
const round = (v,d=1) => Number(v.toFixed(d));

export function analyze(entries) {
  if (!Array.isArray(entries) || entries.length < 5) throw new Error("At least five valid daily observations are required.");
  for (const e of entries) {
    if (![e.heartRate,e.sleepHours,e.mood,e.temperature].every(Number.isFinite)) throw new Error("Invalid observation.");
    if (e.heartRate<30 || e.heartRate>220 || e.sleepHours<0 || e.sleepHours>24 || e.mood<1 || e.mood>5 || e.temperature<30 || e.temperature>43) throw new Error("Observation outside demo input bounds.");
  }
  const baselineEntries = entries.slice(0,4);
  const baseline = {
    heartRate: round(average(baselineEntries.map(e=>e.heartRate))),
    sleepHours: round(average(baselineEntries.map(e=>e.sleepHours))),
    mood: round(average(baselineEntries.map(e=>e.mood))),
    temperature: round(average(baselineEntries.map(e=>e.temperature)))
  };
  const current = entries[entries.length-1];
  const prev = entries[entries.length-2];
  const flags = [];
  if (Math.abs(current.heartRate-baseline.heartRate)/baseline.heartRate >= 0.15) {
    flags.push({metric:"heartRate",severity:"review",title:"Resting pulse shifted",detail:"A change of at least 15% from this simulated personal baseline. Verify the reading and review recent trend.",source:"https://www.nasa.gov/hrp/risks/"});
  }
  if (current.sleepHours <= baseline.sleepHours-1.5 || (current.sleepHours<6 && prev.sleepHours<6)) {
    flags.push({metric:"sleepHours",severity:"review",title:"Sleep pattern changed",detail:"Sleep is below this person's simulated baseline or short on two consecutive days. Review the schedule and report persistent changes through mission procedures.",source:"https://www.nasa.gov/hrp/risks/"});
  }
  if (current.mood<=2 && prev.mood<=2) {
    flags.push({metric:"mood",severity:"review",title:"Two low mood check-ins",detail:"Two consecutive low self-ratings in this demo. Encourage a private check-in with the appropriate crew support contact.",source:"https://www.nasa.gov/hrp/hazards/"});
  }
  if (current.temperature>=38) {
    flags.push({metric:"temperature",severity:"review",title:"Temperature warrants verification",detail:"A project-defined demo flag. Recheck the measurement and follow authorized mission medical protocols; this is not a diagnosis.",source:"https://www.nasa.gov/hrp/risks/"});
  }
  return {
    baseline,current,flags,
    status:flags.length?"CHECK":"WITHIN PERSONAL PATTERN",
    counts:{observations:entries.length,reviewFlags:flags.length},
    limits:"Relative-change and temperature rules here are unvalidated illustrative heuristics, not NASA medical criteria."
  };
}

export function makeScenario(type="stable") {
  const base=[
    {day:1,heartRate:62,sleepHours:7.6,mood:4,temperature:36.6},
    {day:2,heartRate:63,sleepHours:7.4,mood:4,temperature:36.5},
    {day:3,heartRate:61,sleepHours:7.8,mood:4,temperature:36.6},
    {day:4,heartRate:64,sleepHours:7.5,mood:4,temperature:36.7}
  ];
  const extra= type==="fatigue"?
    [{day:5,heartRate:65,sleepHours:6.7,mood:3,temperature:36.7},{day:6,heartRate:70,sleepHours:5.2,mood:2,temperature:36.8},{day:7,heartRate:74,sleepHours:4.7,mood:2,temperature:36.7}]:
    type==="temperature"?
    [{day:5,heartRate:62,sleepHours:7.1,mood:4,temperature:36.6},{day:6,heartRate:65,sleepHours:6.9,mood:3,temperature:37.0},{day:7,heartRate:70,sleepHours:6.2,mood:3,temperature:38.2}]:
    [{day:5,heartRate:63,sleepHours:7.4,mood:4,temperature:36.6},{day:6,heartRate:63,sleepHours:7.3,mood:4,temperature:36.5},{day:7,heartRate:64,sleepHours:7.5,mood:4,temperature:36.6}];
  return [...base,...extra];
}

export function addEntry(entries,form) {
  const e={
    day:entries.length+1,
    heartRate:Number(form.heartRate),
    sleepHours:Number(form.sleepHours),
    mood:Number(form.mood),
    temperature:Number(form.temperature)
  };
  // Analyze first, so invalid entries never get persisted.
  analyze([...entries,e]);
  return [...entries,e];
}