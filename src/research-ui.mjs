import {screenDcsConcern,DCS_EXAMPLES} from "./dcs-screen.mjs";
import {
  ISS_INFLIGHT_LIMITS,REGIONS,MAX_RECORDS,checkSample,checkEva,
  makeDemoSamples,makeDemoEva,sampleOptions
} from "./research.mjs";

const el=id=>document.getElementById(id);
const stores={eva:"orbit-m-eva-SYNTHETIC-v1",sample:"orbit-m-habitat-SYNTHETIC-v1"};
function loadDemo(key,make,validator){
  try{
    const saved=JSON.parse(localStorage.getItem(stores[key]));
    if(!Array.isArray(saved)||saved.length>MAX_RECORDS)throw Error("No valid demo set");
    for(const r of saved)validator(r);
    return saved;
  }catch(_){return make();}
}
let evaRows=loadDemo("eva",makeDemoEva,checkEva);
let sampleRows=loadDemo("sample",makeDemoSamples,checkSample);
function persist(kind,records){
  try{localStorage.setItem(stores[kind],JSON.stringify(records));}
  catch(_){el(kind==="eva"?"evaFeedback":"sampleFeedback").textContent="Saved only in this tab; browser storage is unavailable.";}
}
function make(tag,className,content){
  const n=document.createElement(tag);if(className)n.className=className;
  if(content!==undefined)n.textContent=String(content);
  return n;
}
function historyRow(icon,heading,details,badge,review){
  const line=make("div","history-row");
  const symbol=make("div","history-icon",icon);
  const body=make("div","history-copy");
  body.append(make("strong","",heading));
  for(const d of details){body.append(make("p","",d));}
  const pill=make("span","history-tag"+(review?" is-review":""),badge);
  line.append(symbol,body,pill);
  return line;
}
function renderEva(){
  const target=el("evaTimeline");
  target.replaceChildren();
  if(!evaRows.length){target.append(make("p","subtle","No synthetic EVA check-ins. Add one using the form."));return;}
  for(const row of [...evaRows].reverse().slice(0,10)){
    const areas=REGIONS[row.area]||"Body region";
    const details=[
      row.event+" · "+areas+" · "+row.side+" · Discomfort "+row.severity+"/10",
      "Reported: "+row.kind+" · Started "+row.onset+" EVA · Suit fit: "+row.suitFit,
      row.note||"No additional fictional note.",
      row.recorded||"Synthetic demo check"
    ];
    const badge=row.status==="resolved"?"RESOLVED":row.status==="improving"?"IMPROVING":"ONGOING";
    target.append(historyRow(row.status==="resolved"?"✓":"+",areas,details,badge,row.status==="ongoing"));
  }
}
function setArea(area){
  el("evaArea").value=area;
  for(const b of document.querySelectorAll("[data-body]"))
    b.dataset.selected=String(b.dataset.body===area);
}
for(const b of document.querySelectorAll("[data-body]")){
  b.addEventListener("click",()=>setArea(b.dataset.body));
}
el("evaArea").addEventListener("change",e=>setArea(e.currentTarget.value));
el("evaForm").addEventListener("submit",ev=>{
  ev.preventDefault();
  try{
    const data=Object.fromEntries(new FormData(ev.currentTarget));
    const checked=checkEva(data);
    const added={...checked,id:Date.now(),recorded:"Synthetic entry: "+new Date().toLocaleString("en-GB")};
    evaRows=[...evaRows,added].slice(-MAX_RECORDS);
    persist("eva",evaRows);
    el("evaFeedback").textContent="Example EVA follow-up added to local browser history.";
    renderEva();
  }catch(e){el("evaFeedback").textContent=e.message;}
});
el("evaReset").addEventListener("click",()=>{
  evaRows=makeDemoEva();persist("eva",evaRows);
  el("evaFeedback").textContent="Example EVA timeline restored.";
  renderEva();
});
function renderSample(){
  const log=el("sampleLog");log.replaceChildren();
  if(!sampleRows.length){log.append(make("p","subtle","No synthetic sample observations."));return;}
  for(const row of [...sampleRows].reverse().slice(0,10)){
    const check=checkSample(row);
    const delta=row.value/check.reference;
    const compare=check.comparison==="ABOVE REFERENCE"||check.comparison==="COLIFORM DETECTED";
    const label=row.kind.toUpperCase()+" · "+row.organism+" · "+row.location;
    const details=[
      row.value.toLocaleString("en-US")+" "+check.unit+" / NASA ISS inflight reference "+check.reference.toLocaleString("en-US")+" "+check.unit,
      check.comparison==="COLIFORM DETECTED"?"Fictional coliform detection: NASA's ISS in-flight table specifies no detectable coliforms. Professional review is needed.":
      check.comparison==="INCOMPLETE WATER CHECK"?"Coliform testing was not recorded. An at-or-below colony count alone cannot establish acceptability.":
      compare?"Numerically above the cited reference (x"+delta.toFixed(2)+"). Requires expert interpretation, not automatic action.":"At or below the cited reference. This does not prove microbiological safety.",
      row.recorded||"Synthetic demonstration sample"
    ];
    log.append(historyRow("◈",label,details,check.comparison==="COLIFORM DETECTED"?"COLIFORM CHECK":check.comparison==="INCOMPLETE WATER CHECK"?"TEST INCOMPLETE":compare?"ABOVE REFERENCE":"WITHIN REFERENCE*",compare||check.comparison==="INCOMPLETE WATER CHECK"));
  }
}
function syncOrganisms(){
  const kind=el("sampleKind").value,select=el("sampleOrganism");
  const previous=select.value,choices=sampleOptions(kind);
  select.replaceChildren();
  for(const name of choices){
    const option=make("option","",name==="fungi"?"Fungi":"Bacteria");
    option.value=name;select.append(option);
  }
  if(choices.includes(previous))select.value=previous;
  el("coliformRow").hidden=kind!=="water";
  renderUnit();
}
function renderUnit(){
  const key=el("sampleKind").value+":"+el("sampleOrganism").value;
  const ref=ISS_INFLIGHT_LIMITS[key];
  el("sampleUnitHint").textContent=ref?"ISS inflight reference: "+ref.limit.toLocaleString("en-US")+" "+ref.unit+" · NASA OCHMO-TB-046, p. 10":"Select a supported sampling category.";
}
el("sampleKind").addEventListener("change",syncOrganisms);
el("sampleOrganism").addEventListener("change",renderUnit);
el("sampleForm").addEventListener("submit",ev=>{
  ev.preventDefault();
  try{
    const data=Object.fromEntries(new FormData(ev.currentTarget));
    const sample=checkSample(data);
    const added={...sample,id:Date.now(),recorded:"Synthetic entry: "+new Date().toLocaleString("en-GB"),demo:true};
    sampleRows=[...sampleRows,added].slice(-MAX_RECORDS);
    persist("sample",sampleRows);
    el("sampleFeedback").textContent="Fictional lab sample added. The comparison is informational only.";
    renderSample();
  }catch(e){el("sampleFeedback").textContent=e.message;}
});
el("sampleReset").addEventListener("click",()=>{
  sampleRows=makeDemoSamples();persist("sample",sampleRows);
  el("sampleFeedback").textContent="Example sample log restored.";
  renderSample();
});
setArea("hand");
syncOrganisms();
renderEva();
renderSample();


/* Fictional symptom concern only: no diagnoses, numerical risk or persistence. */
function dcsInputs(){
  const form=el("dcsForm");
  return {exposure:form.elements.namedItem("exposure").value,
    symptoms:[...form.querySelectorAll('input[name="symptoms"]:checked')].map(x=>x.value)};
}
function renderDcsScreen(report){
  const target=el("dcsResult");
  target.className="dcs-result"+(report.kind==="urgent"?" is-urgent":report.kind==="review"?" is-review":"");
  target.replaceChildren();
  target.append(make("strong","",report.title));
  target.append(make("p","",report.reason));
  if(report.labels.length){
    target.append(make("p","", "Fictional symptoms selected: "+report.labels.join("; ")+"."));
  }
  target.append(make("p","",report.nextStep));
  target.append(make("p","dcs-source",report.disclaimer));
  const row=make("p","dcs-source");
  const anchor=make("a","","NASA symptom reference (Oct 2026), page 3 ↗");
  anchor.href=report.sources[1];anchor.target="_blank";anchor.rel="noopener";
  row.append(anchor);
  target.append(row);
}
function loadDcsExample(name){
  const sample=DCS_EXAMPLES[name];
  if(!sample)return;
  const form=el("dcsForm");
  form.elements.namedItem("exposure").value=sample.exposure;
  for(const input of form.querySelectorAll('input[name="symptoms"]')){
    input.checked=sample.symptoms.includes(input.value);
  }
  renderDcsScreen(screenDcsConcern(sample));
}
for(const button of document.querySelectorAll("[data-dcs-example]")){
  button.addEventListener("click",()=>loadDcsExample(button.dataset.dcsExample));
}
el("dcsForm").addEventListener("submit",event=>{
  event.preventDefault();
  try{renderDcsScreen(screenDcsConcern(dcsInputs()));}
  catch(error){const target=el("dcsResult");target.className="dcs-result is-review";target.replaceChildren(make("p","",error.message));}
});
