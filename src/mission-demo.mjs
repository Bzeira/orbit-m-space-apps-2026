/**
 * ORBIT-M judge walkthrough: one longitudinal, completely fictional mission.
 * Each scene uses the unchanged 14-day synthetic baseline and the real
 * explanatory demo engine, rather than pre-written alert outcomes.
 *
 * The scenes, days, cutoffs and outcomes are NOT NASA astronaut data,
 * validated flight/medical criteria, diagnosis or treatment advice.
 */
import {analyze,makeScenario,BASELINE_DAYS} from "./engine.mjs";

export const STORY_MISSION_DAYS=180;
export const STORY_STEPS=Object.freeze([
  {day:12,label:"Routine",subtitle:"A stable personal pattern",
    narrative:"Commander A completes routine fictional self-checks. The baseline is personal, not a population average."},
  {day:15,label:"Early shift",subtitle:"A change worth watching",
    narrative:"Resting pulse is gradually higher and sleep is shorter. One isolated change does not automatically activate the two-reading demonstration rule."},
  {day:17,label:"Review signals",subtitle:"The repeat pattern is visible",
    narrative:"Two consecutive fictional readings cross the project-made pulse and sleep change rules. This is a prompt to verify the pattern, not a diagnosis."},
  {day:19,label:"Follow-up",subtitle:"Explain and document the next check",
    narrative:"The change remains visible. The crew member can document that the measurement and relevant context will be reviewed using approved mission procedures."}
]);

const SEQUENCE=Object.freeze([
  {day:10,heartRate:63,sleepHours:7.4,mood:4,temperature:36.6},
  {day:11,heartRate:64,sleepHours:7.6,mood:4,temperature:36.6},
  {day:12,heartRate:63,sleepHours:7.5,mood:4,temperature:36.6},
  {day:13,heartRate:66,sleepHours:7.0,mood:4,temperature:36.6},
  {day:14,heartRate:69,sleepHours:6.7,mood:4,temperature:36.6},
  {day:15,heartRate:73,sleepHours:6.1,mood:3,temperature:36.7},
  {day:16,heartRate:77,sleepHours:5.7,mood:3,temperature:36.6},
  {day:17,heartRate:78,sleepHours:5.3,mood:3,temperature:36.7},
  {day:18,heartRate:80,sleepHours:5.1,mood:3,temperature:36.7},
  {day:19,heartRate:78,sleepHours:5.6,mood:3,temperature:36.6}
].map(x=>Object.freeze({...x})));

function assertIndex(index){
  if(!Number.isInteger(index)||index<0||index>=STORY_STEPS.length)
    throw new Error("Unknown judge-demo stage.");
}
export function missionScene(index){
  assertIndex(index);
  const step=STORY_STEPS[index];
  const baseline=makeScenario("stable").filter(x=>x.phase==="preflight");
  const inflight=SEQUENCE.filter(x=>x.day<=step.day).map(x=>({...x,phase:"inflight",slot:"morning"}));
  const entries=[...baseline,...inflight];
  const result=analyze(entries);
  const b=result.baseline,c=result.current;
  const delta={
    heartRate:Number((c.heartRate-b.heartRate).toFixed(1)),
    sleepHours:Number((c.sleepHours-b.sleepHours).toFixed(1)),
    mood:Number((c.mood-b.mood).toFixed(1)),
    temperature:Number((c.temperature-b.temperature).toFixed(1))
  };
  const reasons=result.flags.map(f=>({metric:f.metric,title:f.title,detail:f.detail,
    questions:[...f.questions],source:f.source}));
  const questions=[...new Set(reasons.flatMap(f=>f.questions))];
  return {
    index,day:step.day,totalDays:STORY_MISSION_DAYS,
    step:{...step},entries,
    baseline:b,current:c,delta,
    inflightCount:inflight.length,preflightCount:BASELINE_DAYS,
    flags:reasons,questions,
    status:result.status,
    sleepTrend:inflight.map(x=>({day:x.day,sleepHours:x.sleepHours})),
    pulseTrend:inflight.map(x=>({day:x.day,heartRate:x.heartRate})),
    clinicalValidation:false,synthetic:true
  };
}
export function nextSceneIndex(index){
  assertIndex(index);
  return Math.min(index+1,STORY_STEPS.length-1);
}
export function previousSceneIndex(index){
  assertIndex(index);
  return Math.max(index-1,0);
}
export function explainScene(scene){
  if(!scene||scene.synthetic!==true)throw new Error("Missing fictional mission scene.");
  const b=scene.baseline,c=scene.current,d=scene.delta;
  const fmt=(v,unit)=>Math.abs(v).toFixed(1)+(unit?" "+unit:"");
  if(!scene.flags.length){
    return {
      heading:scene.index===0?"No demo flags under the sample rules":"Changes are emerging; no two-reading demo flag yet",
      why:"The simulated latest pulse is "+c.heartRate+" bpm (baseline "+b.heartRate+" bpm) and sleep is "+c.sleepHours+
        " h (baseline "+b.sleepHours+" h). The team's two-reading rules have not both been met.",
      uncertainty:"Ordinary schedule changes, normal adaptation, incomplete context or measurement variation can also affect these values.",
      next:"Continue the planned check-in and verify readings if something seems unusual."
    };
  }
  return {
    heading:scene.flags.length+" explainable demo signal"+(scene.flags.length===1?"":"s")+" detected",
    why:"Pulse is "+fmt(d.heartRate,"bpm")+" above the personal synthetic baseline; sleep is "+
      fmt(d.sleepHours,"h")+" "+(d.sleepHours<0?"below":"above")+" baseline. "+
      "The software flags repeated changes under explicitly project-made rules, not NASA-approved medical thresholds.",
    uncertainty:"These measurements alone cannot identify a cause, predict a condition or establish how serious a real astronaut's symptoms would be.",
    next:"Check the measurement context, record relevant symptoms and use authorized mission medical support when indicated."
  };
}
