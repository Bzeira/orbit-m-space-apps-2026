/**
 * Accessible, interactive SVG body map for fictional post-EVA discomfort logs.
 * No external images or medical anatomy claims. The SVG is a stylized map.
 * Click / touch or keyboard Enter/Space toggles a region in the linked form.
 */
import {REGIONS} from "./research.mjs";

const NS="http://www.w3.org/2000/svg";
const views=["front","back"];
const legend=Object.freeze({...REGIONS});
const parts=[
  {area:"head",shapes:[
    ["ellipse",{cx:150,cy:49,rx:25,ry:29}],
    ["path",{d:"M137 72 H163 L164 91 H136 Z"}]
  ]},
  {area:"hand",shapes:[
    ["path",{d:"M92 120 Q82 120 79 135 L62 242 Q60 255 70 258 Q81 260 85 247 L105 151 Q110 136 101 126 Z"}],
    ["path",{d:"M208 120 Q218 120 221 135 L238 242 Q240 255 230 258 Q219 260 215 247 L195 151 Q190 136 199 126 Z"}],
    ["ellipse",{cx:70,cy:257,rx:12,ry:17,transform:"rotate(10 70 257)"}],
    ["ellipse",{cx:230,cy:257,rx:12,ry:17,transform:"rotate(-10 230 257)"}]
  ]},
  {area:"shoulder",shapes:[
    ["path",{d:"M123 91 Q103 91 93 106 Q88 117 92 134 L109 144 L126 113 Z"}],
    ["path",{d:"M177 91 Q197 91 207 106 Q212 117 208 134 L191 144 L174 113 Z"}]
  ]},
  {area:"torso",view:"front",shapes:[
    ["path",{d:"M122 94 Q150 90 178 94 Q184 119 184 155 L182 203 Q180 214 171 217 H129 Q120 214 118 203 L116 155 Q116 119 122 94 Z"}],
    ["path",{d:"M150 108 V198",className:"eva-surface-line"}],
    ["path",{d:"M127 138 Q150 150 173 138",className:"eva-surface-line"}]
  ]},
  {area:"back",view:"back",shapes:[
    ["path",{d:"M122 94 Q150 90 178 94 Q184 119 184 155 L182 203 Q180 214 171 217 H129 Q120 214 118 203 L116 155 Q116 119 122 94 Z"}],
    ["path",{d:"M150 100 V206",className:"eva-surface-line"}],
    ["path",{d:"M126 125 Q137 144 149 140 M174 125 Q163 144 151 140",className:"eva-surface-line"}]
  ]},
  {area:"hip",shapes:[
    ["path",{d:"M119 207 Q126 212 150 213 Q174 212 181 207 L179 238 Q174 249 163 253 L151 246 L137 253 Q126 249 121 238 Z"}]
  ]},
  {area:"knee",shapes:[
    ["path",{d:"M125 246 L146 248 L144 306 Q139 317 127 310 L119 299 Z"}],
    ["path",{d:"M154 248 L175 246 L181 299 Q173 317 161 310 L156 306 Z"}],
    ["ellipse",{cx:133,cy:305,rx:12,ry:12}],
    ["ellipse",{cx:167,cy:305,rx:12,ry:12}]
  ]},
  {area:"foot",shapes:[
    ["path",{d:"M126 314 Q135 317 144 313 L145 360 L141 375 L121 375 L122 360 Z"}],
    ["path",{d:"M156 313 Q165 317 174 314 L178 360 L179 375 L159 375 L155 360 Z"}],
    ["path",{d:"M121 365 H145 L143 381 L117 381 Q111 378 121 365 Z"}],
    ["path",{d:"M155 365 H179 Q189 378 183 381 H157 Z"}]
  ]}
];

function element(tag,attributes={}){
  const node=document.createElementNS(NS,tag);
  for(const [key,value] of Object.entries(attributes)){
    if(key==="className")node.setAttribute("class",value);
    else node.setAttribute(key,String(value));
  }
  return node;
}
export function selectableRegions(view){
  if(!views.includes(view))throw Error("Unknown body map view");
  return [...new Set(parts.filter(part=>!part.view||part.view===view).map(part=>part.area))];
}
export function mountBodyMap(svg,{onToggle}){
  if(!svg||typeof onToggle!=="function")throw Error("Interactive body map target and toggle callback required.");
  svg.replaceChildren();
  const hint=document.getElementById("evaMapHint");
  const mapViews=new Map();
  let selected=new Set(),hovered=null,currentView="front";

  function describe(area){
    const label=legend[area]||"Body region";
    return selected.has(area)
      ? label+" is selected. Click or press Enter to remove it."
      : label+". Click, tap or press Enter to select and enter a pain rating.";
  }
  function updateHint(area){
    if(!hint)return;
    hint.textContent=area?describe(area):
      "Select one or more highlighted body parts. Use Front / Back to switch views.";
  }
  function setHovered(area){
    hovered=area&&legend[area]?area:null;
    for(const item of svg.querySelectorAll(".eva-region")){
      item.dataset.hovered=String(item.dataset.body===hovered);
    }
    updateHint(hovered);
  }
  function setSelected(areas){
    selected=new Set(areas.filter(x=>legend[x]));
    for(const item of svg.querySelectorAll(".eva-region")){
      const active=selected.has(item.dataset.body);
      item.dataset.selected=String(active);
      item.setAttribute("aria-pressed",String(active));
    }
    updateHint(hovered);
  }
  function setView(view){
    if(!views.includes(view))return;
    currentView=view;
    for(const [id,layer] of mapViews.entries()){
      const off=id!==view;
      layer.hidden=off;
      layer.style.display=off?"none":"";
      layer.setAttribute("aria-hidden",String(off));
    }
    for(const button of document.querySelectorAll("[data-body-view]")){
      button.setAttribute("aria-pressed",String(button.dataset.bodyView===view));
    }
    setHovered(null);
    if(hint)hint.textContent=view==="front"
      ?"Front view: point to a part of the figure, then click to select."
      :"Back view: the back and other body regions can be selected directly.";
  }

  for(const view of views){
    const layer=element("g",{class:"eva-map-view","data-view":view});
    for(const part of parts){
      if(part.view&&part.view!==view)continue;
      const g=element("g",{
        class:"eva-region","data-body":part.area,"data-selected":"false",
        "data-hovered":"false",tabindex:0,role:"button","aria-pressed":"false",
        "aria-label":(legend[part.area]||part.area)+": toggle discomfort area"
      });
      const title=element("title");
      title.textContent=(legend[part.area]||part.area)+" — click to select/deselect";
      g.append(title);
      for(const [type,props] of part.shapes){
        const shape=element(type,{...props,className:props.className||"eva-map-part"});
        g.append(shape);
      }
      g.addEventListener("pointerenter",()=>setHovered(part.area));
      g.addEventListener("pointerleave",()=>setHovered(null));
      g.addEventListener("focus",()=>setHovered(part.area));
      g.addEventListener("blur",()=>setHovered(null));
      g.addEventListener("click",event=>{
        event.stopPropagation();
        onToggle(part.area);
      });
      g.addEventListener("keydown",event=>{
        if(event.key==="Enter"||event.key===" "){
          event.preventDefault();
          onToggle(part.area);
        }
      });
      layer.append(g);
    }
    mapViews.set(view,layer);
    svg.append(layer);
  }
  for(const button of document.querySelectorAll("[data-body-view]")){
    button.addEventListener("click",()=>setView(button.dataset.bodyView));
  }
  setSelected([]);
  setView(currentView);
  return {setHovered,setSelected,setView};
}
