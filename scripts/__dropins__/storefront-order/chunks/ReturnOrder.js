/*! Copyright 2024 Adobe
All Rights Reserved. */
import{jsx as s}from"@dropins/tools/preact-jsx-runtime.js";import{createContext as m}from"@dropins/tools/preact.js";import{useContext as a,useState as f,useEffect as c}from"@dropins/tools/preact-hooks.js";import{events as d}from"@dropins/tools/event-bus.js";const e=m(""),C=({children:t})=>{const[o,n]=f("");return c(()=>{const r=d.on("orderReturnNumber/data",u=>{n(u)},{eager:!0});return()=>{r==null||r.off()}},[]),s(e.Provider,{value:o,children:t})},b=()=>a(e);export{C as R,b as u};
