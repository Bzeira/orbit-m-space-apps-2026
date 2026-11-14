# ORBIT-M — Organizer-ready project summary
*NASA Space Apps Challenge 2026 · Haifa, Israel · 14–15 November 2026*

## Short Hebrew description (for the local organizers)

**שם המיזם:** ORBIT-M — Notice the change. Know what to check.  
**אתגר:** Create Health Monitoring Software for Astronauts on Space Missions

ORBIT-M הוא אבטיפוס למערכת ניטור בריאות עבור צוותי חלל במשימות ממושכות. במקום להסתמך על ערכי סף כלליים, המערכת משווה מדדים של אסטרונאוט לבסיס אישי לפני הטיסה ומציגה מגמות לאורך המשימה. היא מסבירה בדיוק מה השתנה, איזה כלל הפיק התראה, מה לא ניתן להסיק מהמדידות, ואילו נתונים כדאי לבדוק בהמשך עם הגורם הרפואי המוסמך.

הדגמה אינטראקטיבית מציגה ארבע נקודות זמן במשימה מדומה, מהמצב היציב ועד לשינוי חוזר בשינה ובדופק. לצד המעקב האישי, מודול Cabin × Crew מציג גם מדדי סביבה מדומים: לחץ, חמצן, CO₂, טמפרטורה ולחות. הוא מאפשר לזהות חפיפה בזמן בין שינוי סביבתי לבין דיווח על תסמינים, תוך הדגשה שחפיפה אינה מוכיחה קשר סיבתי. בהשוואת CO₂ נעשה שימוש בערך ייחוס רשמי של NASA לממוצע של שעה בסביבת מגורים, ולא בסף רפואי אישי. המערכת כוללת גם מעקב אחר בריאות מנטלית, דיווח תסמינים לאחר פעילות מחוץ לחללית (EVA), תיעוד לחץ דם וניטור מיקרוביולוגי סביבתי. היא פועלת בדפדפן, שומרת נתוני הדגמה מקומיים ותומכת בשמירת קובצי הממשק לפתיחה חוזרת לאחר ביקור מקוון.

**כל המדידות בתוכנה הן סינתטיות.** מחקרי NASA משמשים בסיס לבחירת תחומי המעקב, אך אין בפרויקט אבחון רפואי, ספי התראה שאושרו על ידי NASA או חיבור לנתוני אסטרונאוטים אמיתיים. לפני שימוש מבצעי נדרשים תיקוף מדעי, אבטחת נתונים ואינטגרציה עם חיישנים מאושרים.

**הדגמה:** https://bzeira.github.io/orbit-m-space-apps-2026/#flightStory  
**קוד המקור:** https://github.com/Bzeira/orbit-m-space-apps-2026

## English summary (for the global submission)

**ORBIT-M — Notice the change. Know what to check.**

ORBIT-M is a local-first, explainable crew-health monitoring demonstrator for long-duration space missions. It compares fictional physiological and behavioral readings with a personal synthetic preflight baseline, highlighting repeated changes in context rather than treating every isolated value as an emergency. For each demonstration flag, it shows the observed difference, the explicit rule, the uncertainty, and suitable questions for qualified follow-up.

A four-stage interactive mission walkthrough moves from a stable fictional crew member to a sustained sleep-and-pulse shift, powered by the same rule engine as the live dashboard. A synchronized Cabin × Crew module cross-checks fictional ambient habitat parameters and crew symptoms across the same mission days, explicitly avoiding causal claims. The one-hour cabin ppCO2 comparison cites NASA-STD-3001 V2 6004 (3 mmHg nominal habitat requirement). Additional modules capture behavioral check-ins, post-EVA discomfort, blood pressure and pulse pressure, and ISS-referenced environmental microbiology samples.

All measurements and example thresholds are team-created simulations. NASA publications inform the research context, not clinical validation or endorsement. The application has no real astronaut data, live sensor feed, medical diagnosis, secure medical records or treatment automation. Its static files can be cached for offline reopening after a successful first online visit.

**Live demo:** https://bzeira.github.io/orbit-m-space-apps-2026/#flightStory  
**Source:** https://github.com/Bzeira/orbit-m-space-apps-2026

## Technical and scientific notes
- Pure browser HTML/CSS/JavaScript modules, localStorage for fictional examples, a scoped static-cache service worker, Node's built-in test runner, and GitHub Actions CI.
- 78 automated software tests passed after the Cabin × Crew integration (Nov 14); these tests do NOT establish clinical validity.
- NASA Human Research Program and OCHMO documents support research scope and certain ISS sampling reference values. Synthetic baseline and alert thresholds were authored by the team.
- Maya Dimant and Ofir Nakash are conducting the medical/scientific research together. Itay Lipsky contributed cardiovascular research. Inbar contributes behavioral-health content and presentation. Barak Zeira develops and integrates the prototype.
- ChatGPT (OpenAI) assisted with code, interface, documentation, tests, and pitch preparation. Disclose this assistance on the official submission page as required.
- The team must manually test the public app, the offline reload, the final scientific wording and links before presentation; this document is not confirmation those manual checks were completed.

## Important local submission tasks (confirm with organizers)
- **Sunday Nov 15, 16:00 Israel:** send project text/description.
- **Sunday Nov 15, 17:30 Israel:** send pitch slides/demo.
- **Sunday Nov 15, 17:45 Israel:** local four-minute pitch plus two minutes Q&A.
- **Sunday Nov 15, 23:59 Israel:** submit the official final project link on the NASA Space Apps project page.

## Official sources used as context
- Spaceflight Standard Measures: https://www.nasa.gov/directorates/smd/space-life-physical-sciences-research-applications-division/human-research-program/spaceflight-standard-measures-characterizing-how-humans-adapt-in-space/
- NASA EVA injury evidence report: https://ntrs.nasa.gov/citations/20220004017
- NASA OCHMO DCS Technical Brief: https://www.nasa.gov/wp-content/uploads/2023/12/ochmo-tb-037-decompression-sickness.pdf
- NASA OCHMO Microbiology Rev A (2025): https://www.nasa.gov/wp-content/uploads/2025/05/ochmo-tb-046-microbiology-rev-a.pdf
- NASA JSC Behavioral Health Operations: https://www.nasa.gov/reference/jsc-behavioral-health/
- NASA-STD-3001 Volume 2, V2 6004 / 6020 / 6021: https://www.nasa.gov/reference/6-0-natural-and-induced-environments-vol-2/
- NASA OCHMO CO2 background: https://www.nasa.gov/ochmo-tb-004-carbon-dioxide-2/
