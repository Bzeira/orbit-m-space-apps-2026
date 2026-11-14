import {
  CABIN_SYMPTOMS,cabinMissionScene,cabinMissionTrend,
  reviewCabinAndCrew,NOMINAL_CO2_ONE_HOUR_MAX_MMHG
} from "./cabin.mjs";

const get=id=>document.getElementById(id);
const write=(id,value)=>{get(id).textContent=String(value);};
const trend=cabinMissionTrend();
let current=cabinMissionScene(12),guidedDay=12,mode="guided",
  demoActive=false,backup=null;

function make(tag,text,cls){
  const node=document.createElement(tag);
  if(text!==undefined)node.textContent=String(text);
  if(cls)node.className=cls;
  return node;
}
function showTrend(currentDay){
  const node=get("cabinTrend");
  node.replaceChildren();
  for(const item of trend){
    const column=make("div",undefined,"cabin-trend-column");
    column.dataset.above=String(item.aboveNominal);
    column.dataset.current=String(item.day===currentDay);
    const label=make("strong",item.co2OneHourMmHg.toFixed(1));
    const outer=make("div",undefined,"cabin-trend-bar-box");
    const fill=make("div",undefined,"cabin-trend-fill");
    fill.style.height=(Math.max(0,Math.min(100,item.co2OneHourMmHg/5*100))).toFixed(1)+"%";
    outer.append(fill);
    column.append(label,outer,make("small","Day "+item.day));
    column.title="Fictional day "+item.day+": one-hour ppCO2 = "+item.co2OneHourMmHg.toFixed(1)+
      " mmHg; NASA nominal habitat reference "+NOMINAL_CO2_ONE_HOUR_MAX_MMHG+" mmHg";
    node.append(column);
  }
}
function render(){
  const result=reviewCabinAndCrew(current);
  write("cabinDay","Mission day "+result.day);
  write("cabinMode",mode==="manual"?"MANUAL FICTIONAL ENTRY":"GUIDED STORY DATA");
  write("cabinCo2",result.co2OneHourMmHg.toFixed(1));
  write("cabinO2",result.oxygenPartialMmHg.toFixed(1));
  write("cabinPressure",result.pressureKPa.toFixed(1));
  write("cabinTemp",result.temperatureC.toFixed(1));
  write("cabinHumidity",result.humidityPercent.toFixed(0));
  get("cabin").querySelector(".cabin-stat-main").dataset.above=String(result.aboveNominal);
  const label=get("cabinStatus");
  label.dataset.level=result.aboveNominal?"review":result.hasSymptoms?"symptoms":"routine";
  label.textContent=result.aboveNominal?"ABOVE NOMINAL HABITAT REFERENCE":
    result.hasSymptoms?"CREW SYMPTOM CONTEXT":"WITHIN NOMINAL CO₂ REFERENCE";
  write("cabinConclusion",result.coObserved?"Two observations on one day. No confirmed cause.":
    result.aboveNominal?"One-hour habitat CO₂ comparison needs review.":
    result.hasSymptoms?"Symptoms still warrant context, even without an above-reference CO₂ value.":
    "No CO₂ comparison flag in this fictional snapshot.");
  write("cabinContext",result.context);
  write("cabinSymptoms",result.hasSymptoms?
    result.symptoms.map(x=>CABIN_SYMPTOMS[x]).join(" · "):
    "No fictional crew symptoms reported.");
  write("cabinAssociation",result.association);
  write("cabinNext",result.next);
  showTrend(result.day);
}
function restore(){
  current=cabinMissionScene(guidedDay);
  mode="guided";
  render();
  write("cabinFeedback","Showing the team's fictional cabin reading for mission day "+guidedDay+".");
}
get("cabinForm").addEventListener("submit",event=>{
  event.preventDefault();
  try{
    const fields=Object.fromEntries(new FormData(event.currentTarget));
    fields.symptoms=[...event.currentTarget.querySelectorAll('input[name="cabinSymptom"]:checked')].map(x=>x.value);
    current=reviewCabinAndCrew(fields);
    mode="manual";render();
    write("cabinFeedback","Fictional input evaluated in this tab. No values were uploaded or stored.");
  }catch(error){
    write("cabinFeedback",error.message);
  }
});
get("cabinRestore").addEventListener("click",restore);

document.addEventListener("orbitm:demo-scene",event=>{
  if(event.detail?.synthetic!==true)return;
  const day=Number(event.detail.day);
  try{
    const scene=cabinMissionScene(day);
    if(!demoActive)backup={current,mode,guidedDay};
    demoActive=true;guidedDay=day;current=scene;mode="guided";
    render();
    write("cabinFeedback","Cabin context aligned with guided demo day "+day+". All values are fictional.");
  }catch(error){
    write("cabinFeedback","Unable to align fictional cabin context: "+error.message);
  }
});
function leaveDemo(){
  if(!demoActive)return;
  demoActive=false;
  if(backup){
    current=backup.current;mode=backup.mode;guidedDay=backup.guidedDay;
    backup=null;render();
  }else restore();
  write("cabinFeedback","Previous fictional cabin snapshot restored.");
}
document.addEventListener("orbitm:demo-end",leaveDemo);
document.addEventListener("orbitm:demo-cancelled",leaveDemo);
render();
