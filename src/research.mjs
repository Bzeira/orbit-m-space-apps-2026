/**
 * ORBIT-M NASA-research demonstrators.
 * ONLY synthetic data. No diagnosis, medical triage, environmental safety
 * certification, treatment or automated cleaning instructions.
 */
export const MICRO_SOURCE="https://www.nasa.gov/wp-content/uploads/2025/05/ochmo-tb-046-microbiology-rev-a.pdf";
export const EVA_SOURCE="https://ntrs.nasa.gov/citations/20220004017";
export const EVA_TRACKING_SOURCE="https://ntrs.nasa.gov/citations/20230015608";
export const REGIONS=Object.freeze({
  hand:"Hands & fingers",shoulder:"Shoulders",torso:"Torso / chest",
  back:"Spine & back",hip:"Hips",knee:"Knees",foot:"Feet & ankles"
});
// NASA OCHMO-TB-046, Rev A (2025), page 10, table 'In-Flight Testing'.
// ISS-specific culture-based acceptability reference limits, not medical
// thresholds or operational instructions for every spacecraft.
export const ISS_INFLIGHT_LIMITS=Object.freeze({
  "air:bacteria":{limit:1000,unit:"CFU/m³",label:"Air • bacteria"},
  "air:fungi":{limit:100,unit:"CFU/m³",label:"Air • fungi"},
  "surface:bacteria":{limit:10000,unit:"CFU/100 cm²",label:"Surface • bacteria"},
  "surface:fungi":{limit:100,unit:"CFU/100 cm²",label:"Surface • fungi"},
  "water:bacteria":{limit:50,unit:"CFU/mL",label:"Water • bacteria"}
});
export const MAX_RECORDS=60;
export function checkSample(data) {
  const kind=String(data?.kind||"");
  const organism=String(data?.organism||"");
  const key=kind+":"+organism;
  const location=String(data?.location||"").trim();
  const raw=String(data?.value??"").trim();
  if(!location||location.length>80)throw Error("Add a short sampling location.");
  if(!raw||!Number.isFinite(Number(raw))||Number(raw)<0||Number(raw)>1e8)
    throw Error("Enter a valid non-negative colony count.");
  const item=ISS_INFLIGHT_LIMITS[key];
  if(!item)throw Error("No verified numeric ISS in-flight reference for this combination.");
  const value=Number(raw);
  const coliform=kind==="water"?String(data?.coliform||"not_tested"):"not_applicable";
  if(kind==="water"&&!["not_tested","not_detected","detected"].includes(coliform))
    throw Error("Choose a valid coliform testing status.");
  let comparison=value>item.limit?"ABOVE REFERENCE":"AT OR BELOW REFERENCE";
  if(kind==="water"&&coliform==="detected")comparison="COLIFORM DETECTED";
  else if(kind==="water"&&coliform==="not_tested"&&comparison!=="ABOVE REFERENCE")
    comparison="INCOMPLETE WATER CHECK";
  const sample={id:0,kind,organism,location,value,coliform,unit:item.unit,source:MICRO_SOURCE};
  return {...sample,reference:item.limit,comparison,
    description:"Illustrative numeric comparison with a NASA ISS in-flight acceptability reference, NOT an assessment of health or prescribed action."};
}
export function makeDemoSamples(){
  return [
    {kind:"air",organism:"bacteria",location:"Habitat module A",value:620},
    {kind:"surface",organism:"fungi",location:"Galley panel",value:135},
    {kind:"water",organism:"bacteria",location:"Water outlet",value:30,coliform:"not_detected"}
  ].map((r,i)=>({...checkSample(r),id:i+1,recorded:"Synthetic mission day "+(i+2),demo:true}));
}
export function checkEva(data){
  // Legacy single-location demo observations remain readable for existing
  // browser storage. New reports use a unique region/severity list.
  const hasMulti=Array.isArray(data?.painAreas);
  const rawAreas=hasMulti?data.painAreas:[{area:data?.area,severity:data?.severity}];
  if(!rawAreas.length||rawAreas.length>Object.keys(REGIONS).length)
    throw Error("Select at least one discomfort region.");
  const used=new Set();
  const painAreas=rawAreas.map(entry=>{
    const area=String(entry?.area||"");
    const raw=String(entry?.severity??"").trim(),severity=Number(raw);
    if(!REGIONS[area]||used.has(area)||!raw||!Number.isInteger(severity)||
      (severity<1&&!(severity===0&&data?.demo===true&&data?.status==="resolved"&&rawAreas.length===1))||severity>10)
      throw Error("Every selected region needs a separate 1–10 discomfort rating.");
    used.add(area);return {area,severity};
  });
  const event=String(data?.event||"").trim();
  if(!event||event.length>50)throw Error("Enter a short synthetic EVA event ID.");
  const kind=String(data?.kind||"");
  if(!["pressure","strain","skin","fatigue","other"].includes(kind))
    throw Error("Choose a symptom description.");
  const status=String(data?.status||"");
  if(!["ongoing","improving","resolved"].includes(status))
    throw Error("Choose the current follow-up status.");
  const side=String(data?.side||"");
  if(!["left","right","both","central"].includes(side))
    throw Error("Choose a body side.");
  const onset=String(data?.onset||"");
  if(!["during","after","later"].includes(onset))
    throw Error("Choose when the discomfort began.");
  const suitFit=String(data?.suitFit||"");
  if(!["normal","contact","restricted","unsure"].includes(suitFit))
    throw Error("Choose suit fit feedback.");
  const note=String(data?.note||"").trim();
  if(note.length>200)throw Error("Demo notes must be under 200 characters.");
  const primary=painAreas[0];
  return {id:0,area:primary.area,region:REGIONS[primary.area],severity:primary.severity,
    painAreas,side,event,kind,onset,suitFit,status,note,recorded:"Synthetic record",demo:true};
}
export function makeDemoEva(){
  return [
    checkEva({area:"hand",side:"right",severity:5,event:"EVA-004",
      kind:"pressure",onset:"during",suitFit:"contact",status:"ongoing",
      note:"Illustrative glove pressure following a simulated EVA."}),
    checkEva({area:"hand",side:"right",severity:2,event:"EVA-004",
      kind:"pressure",onset:"during",suitFit:"contact",status:"improving",
      note:"Follow-up example: lower discomfort."}),
    checkEva({area:"shoulder",side:"left",severity:0,event:"EVA-003",
      kind:"strain",onset:"after",suitFit:"restricted",status:"resolved",
      note:"Resolved example."})
  ].map((x,i)=>({...x,id:i+1,recorded:"Synthetic mission day "+(i+2)}));
}
export function sampleOptions(kind){
  return Object.keys(ISS_INFLIGHT_LIMITS).filter(k=>k.startsWith(kind+":")).map(k=>k.split(":")[1]);
}
export function trendFor(records,selector,identity){
  return records.filter(x=>identity(x)).map(x=>selector(x));
}