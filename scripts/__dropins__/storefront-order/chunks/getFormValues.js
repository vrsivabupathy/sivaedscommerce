/*! Copyright 2024 Adobe
All Rights Reserved. */
const s=n=>{if(!n)return null;const t=new FormData(n);if(n.querySelectorAll('input[type="checkbox"]').forEach(e=>{t.has(e.name)||t.set(e.name,"false"),e.checked&&t.set(e.name,"true")}),t&&typeof t.entries=="function"){const e=t.entries();if(e&&typeof e[Symbol.iterator]=="function")return JSON.parse(JSON.stringify(Object.fromEntries(e)))||{}}return{}};export{s as g};
