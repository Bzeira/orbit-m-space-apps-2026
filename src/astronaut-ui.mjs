import {PARAMETERS,parseAstronautId,createAstronaut,parameterStatus,assessReadiness,setParameterState} from "./astronaut.mjs";
import {ARTWORK} from "./astronaut-art.mjs";

const root = document.getElementById("astronautApp");
const workspace = document.getElementById("researchWorkspace");
const crew = new Map();
const esc = value => String(value).replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
const statusLabel = status => ({normal:"Normal",abnormal:"Abnormal",unavailable:"Unavailable"}[status]);
const valueText = (parameter,value=parameter.current) => Number.isFinite(value) ? `${value}${parameter.unit === "/100" ? "/100" : " "+parameter.unit}` : "Unavailable";
const rangeText = parameter => `${parameter.range.min}–${parameter.range.max}${parameter.unit === "/100" ? "/100" : " "+parameter.unit}`;
const note = "Fictional astronauts · Synthetic data · DEMO ranges only. This result is not medical clearance. Mission medical clearance is still required.";

function art(name,label="",extraClass="") {
  const {x,y,width,height} = ARTWORK.elements[name];
  return `<svg class="am-art am-art-${name} ${extraClass}" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="${x} ${y} ${width} ${height}" width="${width}" height="${height}" ${label ? `role="img" aria-label="${esc(label)}"` : 'aria-hidden="true"'}><image href="./assets/astronaut/original-elements.png" xlink:href="./assets/astronaut/original-elements.png" x="0" y="0" width="${ARTWORK.width}" height="${ARTWORK.height}"/></svg>`;
}

function logo() {
  return `<span class="am-wordmark">${art("logo","ORBIT-M","am-logo-art")}</span>`;
}

function header(step,id) {
  return `<header class="am-top"><a href="#welcome" aria-label="ORBIT-M welcome">${logo()}</a><div class="am-top-links"><span class="am-step">${esc(step)}</span>${id ? '<a href="#id">Change ID</a>' : '<a href="#welcome">Welcome</a>'}<a class="am-workspace-link" href="#research">Research workspace ↗</a></div></header>`;
}

function frame(content,{step="",id=null,showHeader=true,footer=note}={}) {
  root.innerHTML = `<div class="am-sunset" aria-hidden="true"></div><div class="am-grid" aria-hidden="true"></div>${showHeader?header(step,id):""}<div class="am-shell">${content}</div>${footer ? `<p class="am-demo-note">${esc(footer)}</p>` : ""}`;
}

function getAstronaut(id) {
  if(!crew.has(id)) crew.set(id,createAstronaut(id));
  return crew.get(id);
}

function go(hash,{replace=false}={}) {
  if(replace) {
    history.replaceState(null,"",hash);
    renderRoute();
  } else if(location.hash === hash) renderRoute();
  else location.hash = hash;
}

function welcomePage() {
  frame(`<section class="am-welcome-wrap" aria-label="Welcome"><a class="am-welcome" id="welcomeAction" href="#id" aria-label="Welcome. Enter the EVA assessment program"><img src="./assets/astronaut/welcome.jpeg" width="1600" height="918" alt="Welcome to the EVA assessment program"><span class="am-welcome-hint" aria-hidden="true">Click to enter ↗</span></a></section><div class="am-welcome-foot"><p>Fictional astronaut readiness demonstration · IDs 1–10</p><a href="#research">Research workspace ↗</a></div>`,{showHeader:false,footer:""});
  document.title = "ORBIT-M | Welcome";
}

function idPage() {
  frame(`<section class="am-id-card" aria-labelledby="astronautIdHeading"><div class="am-id-brand">${logo()}</div><div class="am-ribbons" aria-hidden="true"><i></i><i></i><i></i></div><h1 class="am-id-title" id="astronautIdHeading" tabindex="-1"><span class="am-sr-only">ASTRONAUT ID SYSTEM</span>${art("idTitle")}</h1><div class="am-id-content"><form class="am-id-form" id="astronautIdForm" novalidate><label for="astronautIdInput"><span class="am-id-label"><span class="am-sr-only">ID No.</span>${art("idLabel")}</span><input class="am-id-input" id="astronautIdInput" name="astronautId" type="text" inputmode="numeric" autocomplete="off" aria-describedby="astronautIdHelp astronautIdError" required></label><p class="am-id-help" id="astronautIdHelp">Enter an astronaut ID from 1 to 10.</p><p class="am-id-error" id="astronautIdError" role="alert"></p><button type="submit" class="am-enter" aria-label="ENTER">${art("enter")}</button></form>${art("idPerson","","am-person")}</div></section>`,{step:"01 / IDENTIFICATION"});
  document.title = "ORBIT-M | Enter astronaut ID";
  const input = document.getElementById("astronautIdInput");
  document.getElementById("astronautIdForm").addEventListener("submit",event=>{
    event.preventDefault();
    const id = parseAstronautId(input.value);
    if(id === null) {
      document.getElementById("astronautIdError").textContent = "Enter a whole-number astronaut ID from 1 to 10.";
      input.setAttribute("aria-invalid","true");
      input.focus();
      return;
    }
    getAstronaut(id);
    go(`#astronaut/${id}`);
  });
  input.addEventListener("input",()=>{
    input.removeAttribute("aria-invalid");
    document.getElementById("astronautIdError").textContent = "";
  });
  input.focus({preventScroll:true});
}

function parameterRow(parameter,id) {
  const state = parameterStatus(parameter);
  return `<div class="am-param-row" data-parameter="${parameter.key}"><button type="button" class="am-param-name" data-report="${parameter.key}" aria-label="View ${esc(parameter.label)} detailed report">${art(parameter.key)}</button><button type="button" class="am-arrow" data-state="normal" data-key="${parameter.key}" aria-label="Set ${esc(parameter.label)} to Normal (demo)" aria-pressed="${state === "normal"}" title="Set a Normal demo value">‹</button><button type="button" class="am-param-status" data-report="${parameter.key}" aria-label="${esc(parameter.label)}: ${statusLabel(state)}. View detailed report">${state === "unavailable"?"Unavailable":art(state)}</button><button type="button" class="am-arrow" data-state="abnormal" data-key="${parameter.key}" aria-label="Set ${esc(parameter.label)} to Abnormal (demo)" aria-pressed="${state === "abnormal"}" title="Set an Abnormal demo value">›</button></div>`;
}

function astronautPage(astronaut) {
  const {id} = astronaut;
  frame(`<section class="am-astronaut-grid" aria-label="Astronaut ${id} data"><article class="am-profile"><h1 id="astronautHeading" tabindex="-1"><span class="am-sr-only">Astronaut ID ${id}</span>${art("astronautTitle")}</h1><p class="am-profile-mission">mission ${esc(astronaut.mission)}</p>${art("avatar","Original astronaut avatar","am-avatar")}<p class="am-profile-meta">ID No. ${String(id).padStart(2,"0")} · Fictional crew member</p></article><article class="am-parameters" aria-label="Astronaut parameters"><div class="am-param-list" id="astronautParameterList">${astronaut.parameters.map(parameter=>parameterRow(parameter,id)).join("")}</div><form class="am-mission-form" id="astronautMissionForm"><label for="astronautMissionLength"><span class="am-sr-only">mission length</span>${art("missionLength")}<input id="astronautMissionLength" name="length" value="${esc(astronaut.length)}" placeholder="Enter mission length" maxlength="80"></label><label for="astronautMissionPurpose"><span class="am-sr-only">purpose</span>${art("purpose")}<input id="astronautMissionPurpose" name="purpose" value="${esc(astronaut.purpose)}" placeholder="Enter mission purpose" maxlength="200"></label><button class="am-assess" type="submit" aria-label="Assess Readiness">${art("assess")}</button></form><p class="am-status-feedback" id="astronautStateFeedback" role="status" aria-live="polite"></p></article></section><p class="am-interaction-note">Click a parameter or its status to see the detailed report. The arrows select Normal / Abnormal demonstration values.</p>`,{step:"02 / ASTRONAUT DATA",id});
  document.title = `ORBIT-M | Astronaut ${id}`;
  const list = document.getElementById("astronautParameterList");
  list.addEventListener("click",event=>{
    const control = event.target.closest("button");
    if(!control) return;
    if(control.dataset.report) {
      go(`#report/${id}/${control.dataset.report}`);
    } else if(control.dataset.state) {
      const parameter = setParameterState(astronaut,control.dataset.key,control.dataset.state);
      // Updating only the row preserves keyboard focus and in-progress inputs.
      const row = control.closest(".am-param-row");
      const focusedState = control.dataset.state;
      row.outerHTML = parameterRow(parameter,id);
      list.querySelector(`[data-parameter="${parameter.key}"] [data-state="${focusedState}"]`).focus({preventScroll:true});
      document.getElementById("astronautStateFeedback").textContent = `${parameter.label}: ${statusLabel(parameterStatus(parameter))}. Synthetic value updated to ${valueText(parameter)}.`;
    }
  });
  const form = document.getElementById("astronautMissionForm");
  form.addEventListener("input",()=>{
    astronaut.length = form.elements.namedItem("length").value;
    astronaut.purpose = form.elements.namedItem("purpose").value;
  });
  form.addEventListener("submit",event=>{
    event.preventDefault();
    const result = assessReadiness(astronaut);
    go(`#${result.approved?"approved":"not-approved"}/${id}`);
  });
}

function resultContext(astronaut) {
  return `<div class="am-result-context"><span>Astronaut ${astronaut.id} · ${esc(astronaut.mission)}${astronaut.length?" · "+esc(astronaut.length):""}</span><span class="am-result-label">DEMONSTRATION RESULT</span></div>`;
}

function resultActions(id) {
  return `<div class="am-result-actions"><a href="#astronaut/${id}" class="am-secondary">← Back to astronaut data</a><a href="#id" class="am-secondary">Enter another ID</a></div>`;
}

function approvedPage(astronaut) {
  frame(`${resultContext(astronaut)}<section class="am-approved" aria-labelledby="evaApprovedHeading"><p class="am-approved-person">astronaut “${astronaut.id}”</p><h1 id="evaApprovedHeading" tabindex="-1"><span class="am-sr-only">EVA mission approved</span>${art("approvedTitle")}</h1><hr>${art("goodLuck","you can suit up- good luck on your mission:)")}</section>${resultActions(astronaut.id)}`,{step:"03 / EVA ASSESSMENT",id:astronaut.id});
  document.title = "ORBIT-M | EVA mission approved (demo)";
}

function notApprovedPage(astronaut) {
  frame(`${resultContext(astronaut)}<section class="am-warning" aria-labelledby="evaWarningHeading"><div class="am-warning-heading">${art("warningIcon")}<h1 id="evaWarningHeading" tabindex="-1"><span class="am-sr-only">WARNING</span>${art("warningTitle")}</h1></div><div class="am-warning-banner" role="status">${art("notAuthorized","EVA NOT AUTHORIZED")}</div><button class="am-see-data" id="seeOutOfRangeData" type="button" aria-label="CLICK HERE TO SEE DATA">${art("seeData")}</button><div class="am-hazard-stripes" aria-hidden="true"></div></section>${resultActions(astronaut.id)}`,{step:"03 / EVA ASSESSMENT",id:astronaut.id});
  document.title = "ORBIT-M | EVA not authorized (demo)";
  document.getElementById("seeOutOfRangeData").addEventListener("click",()=>go(`#findings/${astronaut.id}`));
}

function findingsPage(astronaut) {
  const {findings} = assessReadiness(astronaut);
  const rows = findings.map(finding=>{
    const parameter = astronaut.parameters.find(row=>row.key === finding.key);
    return `<a class="am-finding" data-finding="${finding.key}" href="#report/${astronaut.id}/${finding.key}/findings"><div><strong>${esc(finding.label)}</strong><p>${parameter?`${esc(valueText(parameter))} · Demo range: ${esc(rangeText(parameter))}`:"No reading available"}</p></div><span>${statusLabel(finding.status)} ↗</span></a>`;
  });
  frame(`<section class="am-data-card" aria-labelledby="findingsHeading"><div class="am-data-heading"><div><small>ASTRONAUT ${String(astronaut.id).padStart(2,"0")} / DEMO FINDINGS</small><h1 id="findingsHeading" tabindex="-1">Parameters out of range</h1><p>${findings.length} parameter${findings.length===1?"":"s"} ${findings.length===1?"needs":"need"} review in this demonstration.</p></div><a class="am-light-button" href="#${findings.length?"not-approved":"approved"}/${astronaut.id}">← Back to result</a></div><div class="am-findings">${rows.length?rows.join(""):'<p class="am-empty">All available parameters are within their demonstration ranges.</p>'}</div><p class="am-data-note">Only out-of-range or unavailable parameters are listed here. Click a parameter to inspect its baseline, mission trend and DEMO range.</p></section>`,{step:"04 / REVIEW DATA",id:astronaut.id});
  document.title = `ORBIT-M | Astronaut ${astronaut.id} findings`;
}

function trendChart(parameter) {
  const values = [...parameter.preflight,...parameter.inflight];
  const domainMin = Math.min(parameter.range.min,...values.map(row=>row.value));
  const domainMax = Math.max(parameter.range.max,...values.map(row=>row.value));
  const pad = (domainMax-domainMin)*.18 || 1;
  const low = domainMin-pad,high = domainMax+pad;
  const x = index => 66+index*840/(values.length-1);
  const y = value => 231-(value-low)/(high-low)*194;
  const boundary = (x(13)+x(14))/2;
  const ticks = Array.from({length:5},(_,index)=>{
    const value = low+(high-low)*index/4;
    return `<line x1="66" x2="906" y1="${y(value)}" y2="${y(value)}" stroke="#e9e2e9"/><text x="55" y="${y(value)+4}" text-anchor="end" fill="#806b7b" font-size="12">${roundLabel(value)}</text>`;
  }).join("");
  const points = values.map((row,index)=>`${x(index).toFixed(2)},${y(row.value).toFixed(2)}`).join(" ");
  const dots = values.map((row,index)=>`<circle cx="${x(index)}" cy="${y(row.value)}" r="${index === values.length-1?5.5:3}" fill="${index === values.length-1 && parameterStatus(parameter) === "abnormal"?"#cc4559":"#665487"}" stroke="white" stroke-width="1.5"><title>${row.phase === "preflight"?"Preflight":"Mission"} day ${row.day}: ${esc(valueText(parameter,row.value))}</title></circle>`).join("");
  return `<svg class="am-report-chart" viewBox="0 0 960 280" role="img" aria-label="${esc(parameter.label)}: 14 synthetic preflight observations and 7 mission observations. Latest ${esc(valueText(parameter))}. Personal baseline ${esc(valueText(parameter,parameter.baseline))}. Demonstration range ${esc(rangeText(parameter))}."><rect x="${boundary}" y="25" width="${906-boundary}" height="206" fill="#faf5fb"/><rect x="66" y="${y(parameter.range.max)}" width="840" height="${y(parameter.range.min)-y(parameter.range.max)}" fill="#d9eadc" opacity=".7"/>${ticks}<line x1="${boundary}" x2="${boundary}" y1="25" y2="231" stroke="#bda5b9" stroke-dasharray="3 5"/><line x1="66" x2="906" y1="${y(parameter.baseline)}" y2="${y(parameter.baseline)}" stroke="#bc75a1" stroke-width="2" stroke-dasharray="6 5"/><polyline points="${points}" fill="none" stroke="#665487" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>${dots}<text x="66" y="260" fill="#806b7b" font-size="12">Preflight day −14</text><text x="${boundary-12}" y="260" text-anchor="end" fill="#806b7b" font-size="12">−1</text><text x="${boundary+12}" y="260" fill="#806b7b" font-size="12">Mission day 1</text><text x="906" y="260" text-anchor="end" fill="#806b7b" font-size="12">Day 7</text><text x="74" y="19" fill="#806b7b" font-size="12">${esc(parameter.unit)}</text></svg>`;
}

function roundLabel(value) {
  return String(Number(value.toFixed(1)));
}

function comparison(parameter) {
  const max = Math.max(parameter.range.max,parameter.baseline,parameter.current)*1.12;
  return `<section class="am-compare" aria-label="Baseline and latest measurement comparison"><h2>Baseline &amp; current reading</h2><div class="am-compare-row"><span>Baseline</span><span class="am-compare-track"><i style="width:${parameter.baseline/max*100}%"></i></span><span>${esc(valueText(parameter,parameter.baseline))}</span></div><div class="am-compare-row" data-state="${parameterStatus(parameter)}"><span>Current</span><span class="am-compare-track"><i style="width:${parameter.current/max*100}%"></i></span><span>${esc(valueText(parameter))}</span></div></section>`;
}

function reportPage(astronaut,key,returnToFindings) {
  const parameter = astronaut.parameters.find(row=>row.key === key);
  if(!parameter) return go(`#astronaut/${astronaut.id}`,{replace:true});
  const status = parameterStatus(parameter);
  const back = returnToFindings?`#findings/${astronaut.id}`:`#astronaut/${astronaut.id}`;
  const rows = [...parameter.preflight,...parameter.inflight].map(row=>`<tr><td>${row.phase === "preflight"?"Preflight":"Mission"}</td><td>${row.day}</td><td>${esc(valueText(parameter,row.value))}</td></tr>`).join("");
  frame(`<section class="am-data-card" aria-labelledby="parameterReportHeading"><div class="am-data-heading"><div><small>ASTRONAUT ${String(astronaut.id).padStart(2,"0")} / PARAMETER REPORT</small><h1 id="parameterReportHeading" tabindex="-1">${esc(parameter.label)}</h1><p>${esc(parameter.description)}</p></div><a class="am-light-button" href="${back}">← Back to ${returnToFindings?"flagged data":"astronaut data"}</a></div><div class="am-report-stats"><div class="am-report-stat"><small>Latest reading · Mission day 7</small><strong>${esc(valueText(parameter))}</strong></div><div class="am-report-stat"><small>Personal preflight baseline</small><strong>${esc(valueText(parameter,parameter.baseline))}</strong></div><div class="am-report-stat"><small>Team-authored DEMO range</small><strong>${esc(rangeText(parameter))}</strong></div><div class="am-report-stat" data-state="${status}"><small>State under the DEMO rule</small><strong>${statusLabel(status)}</strong></div></div><section class="am-chart-panel"><h2>Personal baseline &amp; mission trend</h2><p>14 synthetic preflight readings + 7 synthetic mission readings</p>${trendChart(parameter)}<div class="am-chart-key"><span><i></i>Synthetic readings</span><span><i></i>Personal baseline</span><span><i></i>DEMO range</span></div></section><div class="am-report-bottom">${comparison(parameter)}<section class="am-method"><h2>How this status is calculated</h2><p>The baseline is the median of this astronaut's 14 fictional preflight readings. The current value is compared with the displayed inclusive DEMO range.</p><p>${parameter.kind === "index"?"This /100 index is invented for the interface demonstration. No clinical test or instrument is connected.":"The numbers and range are invented for this interface demonstration. They are not NASA or clinical thresholds."}</p>${parameter.overridden?'<p>The latest reading was changed with a demonstration arrow control.</p>':""}</section></div><details class="am-data-table"><summary>View the underlying synthetic data</summary><div class="am-table-scroll"><table><thead><tr><th scope="col">Phase</th><th scope="col">Day</th><th scope="col">${esc(parameter.label)} (${esc(parameter.unit)})</th></tr></thead><tbody>${rows}</tbody></table></div></details></section>`,{step:"PARAMETER DETAILS",id:astronaut.id});
  document.title = `ORBIT-M | Astronaut ${astronaut.id} · ${parameter.label}`;
}

function renderRoute() {
  const [requestedPage="welcome",rawId,key,origin] = location.hash.slice(1).split("/");
  // Keep the established entry link and dashboard bypass working.
  const page = requestedPage === "eva-flow" ? "welcome" : requestedPage;
  const appPages = ["","welcome","id","astronaut","approved","not-approved","findings","report"];
  if(!appPages.includes(page)) {
    // Existing in-page research links remain addressable, including old bookmarks.
    const target = page === "research" ? document.getElementById("mission") : document.getElementById(page);
    if(target && workspace.contains(target)) {
      root.hidden = true;
      workspace.hidden = false;
      document.title = "ORBIT-M | Research workspace";
      requestAnimationFrame(()=>target.scrollIntoView({behavior:"instant"}));
      return;
    }
    return go("#welcome",{replace:true});
  }
  root.hidden = false;
  workspace.hidden = true;
  root.dataset.view = page || "welcome";
  if(!page || page === "welcome") welcomePage();
  else if(page === "id") idPage();
  else {
    const id = parseAstronautId(rawId);
    if(id === null) return go("#id",{replace:true});
    const astronaut = getAstronaut(id);
    if(page === "astronaut") astronautPage(astronaut);
    else if(page === "report") reportPage(astronaut,key,origin === "findings");
    else if(page === "findings") findingsPage(astronaut);
    else {
      // The URL cannot force a green result for out-of-range data.
      const approved = assessReadiness(astronaut).approved;
      const actualPage = approved?"approved":"not-approved";
      if(page !== actualPage) return go(`#${actualPage}/${id}`,{replace:true});
      if(approved) approvedPage(astronaut);
      else notApprovedPage(astronaut);
    }
  }
  window.scrollTo({top:0,behavior:"instant"});
  if(page !== "id") {
    const heading = root.querySelector("h1[tabindex]");
    if(heading) heading.focus({preventScroll:true});
  }
}

window.addEventListener("hashchange",renderRoute);
if(new URLSearchParams(location.search).get("dashboard") === "1" && (!location.hash || location.hash === "#welcome")) {
  history.replaceState(null,"",location.pathname+location.search+"#monitor");
}
renderRoute();
