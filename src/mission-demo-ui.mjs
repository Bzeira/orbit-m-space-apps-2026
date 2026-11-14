import {
  STORY_STEPS,missionScene,explainScene,nextSceneIndex,previousSceneIndex
} from "./mission-demo.mjs";

const byId=id=>document.getElementById(id);
const make=(tag,text,className)=>{
  const el=document.createElement(tag);
  if(text!==undefined)el.textContent=String(text);
  if(className)el.className=className;
  return el;
};
const formatDelta=(delta,unit)=>{
  const d=Number(delta);
  return (d>0?"+":"")+d.toFixed(1)+(unit?" "+unit:"")+" vs baseline";
};
let active=false,index=0,acknowledged=false;

function updateButtons(){
  byId("storyStart").hidden=active;
  byId("storyPrev").disabled=!active||index===0;
  byId("storyNext").disabled=!active||index===STORY_STEPS.length-1;
  byId("storyEnd").hidden=!active;
  byId("storyAcknowledge").hidden=!(active&&index===STORY_STEPS.length-1);
  for(const button of byId("storySteps").querySelectorAll("button")){
    button.setAttribute("aria-current",Number(button.dataset.step)===index?"step":"false");
  }
}
function showChart(scene){
  const rows=scene.sleepTrend;
  const left=45,width=610,min=4,max=9,top=22,height=150;
  const x=i=>left+width*i/Math.max(1,rows.length-1);
  const y=value=>top+(max-value)/(max-min)*height;
  const pairs=rows.map((r,i)=>[x(i),y(r.sleepHours)]);
  byId("storySleepPolyline").setAttribute("points",pairs.map(p=>p.map(x=>x.toFixed(1)).join(",")).join(" "));
  const last=pairs.at(-1);
  byId("storyLastPoint").setAttribute("cx",last[0].toFixed(1));
  byId("storyLastPoint").setAttribute("cy",last[1].toFixed(1));
  const baselineY=y(scene.baseline.sleepHours);
  byId("storyBaselineLine").setAttribute("y1",baselineY.toFixed(1));
  byId("storyBaselineLine").setAttribute("y2",baselineY.toFixed(1));
  byId("storyBaselineText").setAttribute("y",(baselineY-10).toFixed(1));
  byId("storyBaselineText").textContent="Personal synthetic baseline "+scene.baseline.sleepHours+" h";
  byId("storyChartEnd").textContent="Mission day "+scene.day;
  byId("storyChart").setAttribute("aria-label",
    "Synthetic sleep duration for mission days 10 through "+scene.day+
    ". Personal preflight median "+scene.baseline.sleepHours+
    " hours. Latest "+scene.current.sleepHours+" hours.");
}
function displayScene(){
  const scene=missionScene(index);
  const e=explainScene(scene);
  byId("storyCurrentDay").textContent="Day "+scene.day+" / "+scene.totalDays;
  byId("storySceneLabel").textContent=String(index+1).padStart(2,"0")+" / "+scene.step.label;
  byId("storySceneTitle").textContent=scene.step.subtitle;
  byId("storySceneNarrative").textContent=scene.step.narrative;
  byId("storyHr").textContent=scene.current.heartRate+" bpm";
  byId("storySleep").textContent=scene.current.sleepHours+" h";
  byId("storyMood").textContent=scene.current.mood+"/5";
  byId("storyTemp").textContent=scene.current.temperature+" °C";
  byId("storyHrDelta").textContent=formatDelta(scene.delta.heartRate,"bpm");
  byId("storySleepDelta").textContent=formatDelta(scene.delta.sleepHours,"h");
  byId("storyMoodDelta").textContent=formatDelta(scene.delta.mood,"");
  byId("storyTempDelta").textContent=formatDelta(scene.delta.temperature,"°C");
  const flag=byId("storyFlag");
  flag.textContent=scene.flags.length?scene.flags.length+" EXPLAINABLE DEMO CHANGE SIGNALS":"NO DEMO FLAGS";
  flag.className="story-flag"+(scene.flags.length?" review":"");
  byId("storyWhyTitle").textContent=e.heading;
  byId("storyWhy").textContent=e.why;
  byId("storyUncertainty").textContent=e.uncertainty;
  byId("storyNextAction").textContent=e.next;
  const rules=byId("storyRules");
  rules.replaceChildren();
  if(!scene.flags.length){
    rules.append(make("p","None of the team-designed repeated-change rules activated.","subtle"));
  }else{
    for(const row of scene.flags){
      const item=make("div",undefined,"story-rule");
      item.append(make("strong",row.title),make("p",row.detail));
      rules.append(item);
    }
  }
  const questions=byId("storyQuestions");
  questions.replaceChildren();
  if(scene.questions.length){
    questions.append(make("p","Examples of useful follow-up questions:"));
    for(const q of scene.questions.slice(0,2))questions.append(make("p","• "+q));
  }
  showChart(scene);
  updateButtons();
  if(active){
    // This only changes the *visible* dashboard; it never saves the script
    // into the user's local entries or sends them to another service.
    document.dispatchEvent(new CustomEvent("orbitm:demo-scene",{
      detail:{entries:scene.entries,index,day:scene.day,synthetic:true}
    }));
    byId("storyFeedback").textContent="Showing fictional mission day "+scene.day+
      " in the vitals dashboard. Your previous local demo entries are preserved until you end this guided demo.";
  }
}
function selectStage(next){
  if(!Number.isInteger(next)||next<0||next>=STORY_STEPS.length)return;
  index=next;
  acknowledged=false;
  if(!active)active=true;
  displayScene();
}
function finish(){
  if(!active)return;
  active=false;
  acknowledged=false;
  document.dispatchEvent(new Event("orbitm:demo-end"));
  byId("storyFeedback").textContent="Guided demo ended. Your prior vitals scenario has been restored. Start again whenever you like.";
  updateButtons();
}
for(let i=0;i<STORY_STEPS.length;i++){
  const step=STORY_STEPS[i];
  const button=make("button",undefined,"story-step");
  button.type="button";
  button.dataset.step=String(i);
  const number=make("span",String(i+1).padStart(2,"0"));
  button.append(number,make("span","Day "+step.day),document.createTextNode(step.label));
  button.title="Show fictional mission day "+step.day+": "+step.subtitle;
  button.addEventListener("click",()=>selectStage(i));
  byId("storySteps").append(button);
}
byId("storyStart").addEventListener("click",()=>selectStage(0));
byId("storyPrev").addEventListener("click",()=>selectStage(previousSceneIndex(index)));
byId("storyNext").addEventListener("click",()=>selectStage(nextSceneIndex(index)));
byId("storyEnd").addEventListener("click",finish);
byId("storyAcknowledge").addEventListener("click",()=>{
  if(!active||index!==STORY_STEPS.length-1)return;
  acknowledged=true;
  byId("storyFeedback").textContent="Fictional follow-up noted for this walkthrough only. No message was sent or medical clearance recorded.";
  byId("storyAcknowledge").textContent=acknowledged?"Fictional follow-up noted":"Record fictional follow-up reviewed";
  byId("storyAcknowledge").disabled=true;
});
document.addEventListener("orbitm:demo-cancelled",()=>{
  if(!active)return;
  active=false;acknowledged=false;
  byId("storyFeedback").textContent="Guided demo stopped because you used an independent dashboard control.";
  updateButtons();
});
function resetAcknowledgement(){
  byId("storyAcknowledge").textContent="Record fictional follow-up reviewed";
  byId("storyAcknowledge").disabled=false;
}
const previous=selectStage;
function setUp(){
  displayScene();
  resetAcknowledgement();
}
setUp();