import{h as c,c as d,b as p,o as b,s as i,r as g,l as f,j as w,a as y}from"./headings.css-a620ccdc.js";const n=class o extends HTMLElement{constructor(){var s;super(),this.viewModel=p({username:"",password:""}).with(b(i(this).root),"username","password"),i(this).template(o.template).styles(g.styles,f.styles,o.styles),(s=this.shadowRoot)==null||s.addEventListener("submit",t=>this.submitLogin(t,this.getAttribute("api")||"#")),this.viewModel.createEffect(t=>console.log("Credentials:",t.username,t.password))}submitLogin(s,t){s.preventDefault();const l=this.viewModel.toObject(),r="POST",m={"Content-Type":"application/json"},a=JSON.stringify(l);console.log("Posting login form:",t,a,s),fetch(t,{method:r,headers:m,body:a}).then(e=>{if(e.status!==200)throw`Form submission failed: Status ${e.status}`;return e.json()}).then(e=>{const{token:u}=e,h=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:u,redirect:"/"}]});this.dispatchEvent(h)})}};n.template=c`<template>
    <form>
      <slot></slot>
      <button type="submit">
        <slot name="submit-label">Login</slot>
      </button>
    </form>
  </template>`;n.styles=d`
    :host {
      display: contents;
    }
    form {
      display: contents;
    }
  `;let E=n;w({"un-auth":y.Provider,"login-form":E});
