/*! Copyright 2024 Adobe
All Rights Reserved. */
const b=s=>s.replace(/_([a-z])/g,(o,e)=>e.toUpperCase()),c=(s,o,e)=>{const u=["string","boolean","number"],p=b;return Array.isArray(s)?s.map(r=>u.includes(typeof r)||r===null?r:typeof r=="object"?c(r,o,e):r):s!==null&&typeof s=="object"?Object.entries(s).reduce((r,[t,n])=>{const f=e&&e[t]?e[t]:p(t);return r[f]=u.includes(typeof n)||n===null?n:c(n,o,e),r},{}):s};export{c as a,b as c};
