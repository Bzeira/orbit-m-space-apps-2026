/**
 * ORBIT-M symptom concern screen. Synthetic data only, NOT a diagnostic,
 * clinical triage, treatment, or DCS exclusion algorithm.
 * Serious signs are considered FIRST; only then milder DCS symptoms and
 * localized suit-contact discomfort are described. NASA did not validate
 * this ordering algorithm or any numeric pain threshold.
 */
export const DCS_ROADMAP_2020="https://www.nasa.gov/wp-content/uploads/2017/02/tp-20205007604.pdf";
export const DCS_TECH_BRIEF_2026="https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-037-decompression-sickness.pdf";
export const NASA_NEURO_EXAM="https://ntrs.nasa.gov/api/citations/20070024711/downloads/20070024711.pdf";
export const NASA_NEURO_SURVEILLANCE="https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-043-longitudinal-health-surveillance.pdf";
export const DCS_SYMPTOMS=Object.freeze({
  musculoskeletal:{label:"New joint or muscle pain",group:"I"},
  itching:{label:"Unusual itching",group:"I"},
  mildRash:{label:"New mild rash",group:"I"},
  numbness:{label:"New numbness or weakness",group:"II"},
  cognition:{label:"New confusion or cognitive difficulty",group:"II"},
  balance:{label:"New dizziness, hearing or balance problem",group:"II"},
  breathing:{label:"Breathing difficulty or chest symptoms",group:"II"},
  mottledRash:{label:"New mottled / marbled skin pattern",group:"II"}
});
export const NEURO_FIELDS=Object.freeze({
  pupils:{label:"Pupil symmetry",values:["not_checked","symmetric","uncertain","asymmetric"]},
  speech:{label:"Speech clarity",values:["not_checked","clear","moderate","slurred"]},
  clarity:{label:"Mental clarity",values:["not_checked","clear","moderate","altered"]},
  coordination:{label:"Limb coordination",values:["not_checked","good","moderate","poor"]}
});
export const PAIN_REGIONS=Object.freeze(["hand","shoulder","torso","back","hip","knee","foot"]);
function parsePainAreas(data){
  const raw=data?.painAreas??[];
  if(!Array.isArray(raw)||raw.length>PAIN_REGIONS.length)throw Error("Invalid body pain selections.");
  const used=new Set();
  return raw.map(row=>{
    const area=String(row?.area||""),severity=Number(row?.severity);
    if(!PAIN_REGIONS.includes(area)||used.has(area)||!Number.isInteger(severity)||severity<1||severity>10)
      throw Error("Each selected body region requires a unique pain rating from 1–10.");
    used.add(area);
    return {area,severity};
  });
}
export function screenDcsConcern(data){
  const exposure=String(data?.exposure??"");
  if(!["yes","no","unknown"].includes(exposure))
    throw Error("Choose whether a relevant pressure transition was documented.");
  const symptoms=data?.symptoms;
  if(!Array.isArray(symptoms)||symptoms.some(x=>typeof x!=="string"||!DCS_SYMPTOMS[x])||
     new Set(symptoms).size!==symptoms.length)
    throw Error("Choose only the listed synthetic symptoms.");
  const neuro={};
  for(const [key,field] of Object.entries(NEURO_FIELDS)){
    const value=String(data?.neuro?.[key]??"not_checked");
    if(!field.values.includes(value))throw Error("Choose a valid neurological observation.");
    neuro[key]=value;
  }
  const painAreas=parsePainAreas(data);
  const severe=symptoms.filter(key=>DCS_SYMPTOMS[key].group==="II");
  const mild=symptoms.filter(key=>DCS_SYMPTOMS[key].group==="I");
  const neuroConcerns=Object.entries(neuro).filter(([key,val])=>val!=="not_checked"&&
    !["symmetric","clear","good"].includes(val)).map(([key,val])=>NEURO_FIELDS[key].label+": "+val);
  const labels=symptoms.map(key=>DCS_SYMPTOMS[key].label);
  const sources=[DCS_ROADMAP_2020,DCS_TECH_BRIEF_2026,NASA_NEURO_EXAM,NASA_NEURO_SURVEILLANCE];
  const common={exposure,symptoms:[...symptoms],labels,neuro,painAreas,neuroConcerns,sources,
    disclaimer:"Illustrative symptom screen only. NASA has NOT validated this decision rule, and symptoms cannot confirm or exclude DCS."};
  // SERIOUS RED FLAGS ALWAYS FIRST; even if pressure exposure is unknown/denied.
  if(severe.length||neuroConcerns.length){
    return {...common,status:"URGENT_REVIEW",title:exposure==="yes"
      ?"Serious findings after pressure transition — possible DCS concern"
      :"Serious neurological or cardiopulmonary findings — urgent medical review",
      reason:"New serious symptoms or potentially abnormal neurological observations require medical evaluation; DCS and other serious causes must be considered by qualified personnel, not inferred from this form.",
      nextStep:"Immediately involve the authorized mission medical team and follow established emergency protocols. Do not use this prototype to choose treatment or fitness for EVA.",
      furtherAssessment:"Professional review: focused neurological examination and appropriate cardiopulmonary assessment, using approved mission protocols. Doppler/ultrasound VGE studies may be considered only by clinicians when indicated; a negative result cannot rule out DCS and must not delay urgent evaluation.",
      priority:1,kind:"urgent"};
  }
  // MILDER DCS-LIKE SYMPTOMS NEXT. Normal self-reported neurological checks
  // do NOT mean serious DCS was definitively excluded.
  if(mild.length&&exposure==="yes"){
    return {...common,status:"POSSIBLE_CONCERN",
      title:"Possible decompression-related concern — medical review needed",
      reason:"After a reported pressure transition, the selected symptoms overlap with NASA-described milder DCS manifestations. A symptom questionnaire cannot exclude serious DCS or alternative causes.",
      nextStep:"Report symptoms and pressure exposure promptly to authorized mission medical personnel.",
      furtherAssessment:"A flight surgeon can consider a targeted clinical examination and, if appropriate, Doppler/ultrasound assessment for venous gas emboli. Visible bubbles do not prove DCS, and no bubbles do not exclude it.",
      priority:2,kind:"review"};
  }
  if(mild.length){
    return {...common,status:"SYMPTOM_REVIEW",
      title:"Symptoms reported — cause cannot be determined",
      reason:"NASA also lists these symptoms with DCS, but the available pressure-exposure information does not support a DCS-specific screen.",
      nextStep:"Document onset and context and consult the authorized mission medical team. A missing pressure record is not proof of safety.",
      furtherAssessment:"Qualified personnel decide whether a targeted examination or additional testing is warranted; this form cannot determine a specific diagnostic test.",
      priority:2,kind:"review"};
  }
  if(painAreas.length){
    return {...common,status:"LOCAL_CONTACT_CONCERN",
      title:"Localized pain or suit-contact concern — cause uncertain",
      reason:"Pain distribution and suit fit can be useful for reporting possible pressure/contact or musculoskeletal injury. These observations do not diagnose a specific condition or exclude DCS.",
      nextStep:"Record the locations, severity and onset, and share the report with authorized mission medical staff.",
      furtherAssessment:"Medical and suit-fit assessment may be appropriate. Imaging is a clinician's decision, not an automatic recommendation from the 1–10 ratings.",
      priority:3,kind:"review"};
  }
  return {...common,status:"NOT_ASSESSED",title:"No listed symptoms selected — DCS not assessed",
    reason:"The absence of selected symptoms in a demo form cannot rule out DCS or another medical problem.",
    nextStep:"Continue approved operational monitoring and follow authorized medical procedures whenever there is a concern.",
    furtherAssessment:"No specific tests are suggested by the fictional entries; this is not medical clearance.",
    priority:4,kind:"neutral"};
}
export const DCS_EXAMPLES=Object.freeze({
  possible:{exposure:"yes",symptoms:["musculoskeletal","itching"]},
  urgent:{exposure:"yes",symptoms:["numbness","breathing"],neuro:{speech:"slurred",coordination:"poor"}},
  unknown:{exposure:"unknown",symptoms:[]}
});
