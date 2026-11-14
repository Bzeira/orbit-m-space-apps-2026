/**
 * ORBIT-M: educational DCS symptom concern screen, not a diagnostic model.
 * NASA sources describe symptom groupings, NOT an individual predictive rule.
 * All user inputs must be fictional. No odds, risk score or "all clear" state.
 * No clinical advice, decompression protocol or treatment is provided.
 */
export const DCS_ROADMAP_2020="https://www.nasa.gov/wp-content/uploads/2017/02/tp-20205007604.pdf";
export const DCS_TECH_BRIEF_2026="https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-037-decompression-sickness.pdf";
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

/**
 * Screens only for the relevance of clinical review; never diagnoses DCS or
 * claims to distinguish it from suit injury, other causes or emergencies.
 */
export function screenDcsConcern(data){
  const exposure=String(data?.exposure??"");
  if(!["yes","no","unknown"].includes(exposure))
    throw Error("Choose whether a relevant pressure transition was documented.");
  const symptoms=data?.symptoms;
  if(!Array.isArray(symptoms)||symptoms.some(x=>typeof x!=="string"||!DCS_SYMPTOMS[x])||
     new Set(symptoms).size!==symptoms.length)
    throw Error("Choose only the listed synthetic symptoms.");
  const severe=symptoms.filter(key=>DCS_SYMPTOMS[key].group==="II");
  const mild=symptoms.filter(key=>DCS_SYMPTOMS[key].group==="I");
  const labels=symptoms.map(key=>DCS_SYMPTOMS[key].label);
  const sources=[DCS_ROADMAP_2020,DCS_TECH_BRIEF_2026];
  const common={exposure,symptoms:[...symptoms],labels,sources,
    disclaimer:"Illustrative symptom screen only. NASA has NOT validated this decision rule, and symptoms cannot confirm or exclude DCS."};
  if(severe.length){
    return {...common,status:"URGENT_REVIEW",title:exposure==="yes"
       ?"Serious symptoms after pressure transition — possible DCS concern"
       :"Serious symptoms reported — urgent medical review",
      reason:"Reported symptoms overlap with NASA's serious decompression-sickness symptom categories, but have other possible causes.",
      nextStep:"Immediately involve the authorized mission medical team and follow established emergency protocols. Do not use this prototype to choose treatment or fitness for EVA.",
      kind:"urgent"};
  }
  if(mild.length && exposure==="yes"){
    return {...common,status:"POSSIBLE_CONCERN",
      title:"Possible decompression-related concern — medical review needed",
      reason:"After a reported pressure transition, the selected symptoms overlap with symptoms described by NASA for DCS, but could also arise from other causes.",
      nextStep:"Report the symptoms and pressure-exposure context promptly to the authorized mission medical team for assessment.",
      kind:"review"};
  }
  if(mild.length){
    return {...common,status:"SYMPTOM_REVIEW",
      title:"Symptoms reported — cause cannot be determined",
      reason:"NASA also lists these symptoms with DCS, but the available pressure-exposure information does not support a DCS-specific screen.",
      nextStep:"Document onset and context and consult the authorized mission medical team. A missing pressure record is not proof of safety.",
      kind:"review"};
  }
  return {...common,status:"NOT_ASSESSED",
    title:"No listed symptoms selected — DCS not assessed",
    reason:"The absence of selected symptoms in a demo form cannot rule out DCS or another medical problem.",
    nextStep:"Continue the approved operational monitoring and follow authorized medical procedures whenever there is a concern.",
    kind:"neutral"};
}

export const DCS_EXAMPLES=Object.freeze({
  possible:{exposure:"yes",symptoms:["musculoskeletal","itching"]},
  urgent:{exposure:"yes",symptoms:["numbness","breathing"]},
  unknown:{exposure:"unknown",symptoms:[]}
});
