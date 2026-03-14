import{h,c as d,b as p,n as g,s as a,r as b,l as f,j as y,a as w}from"./headings.css-ba42a53d.js";const n=class o extends HTMLElement{constructor(){var s;super(),this.viewModel=p().using(g(a(this).root),"username","password"),a(this).template(o.template).styles(b.styles,f.styles,o.styles),(s=this.shadowRoot)==null||s.addEventListener("submit",t=>this.submitLogin(t,this.getAttribute("api")||"#")),this.viewModel.createEffect(t=>console.log("Credentials:",t.username,t.password))}submitLogin(s,t){s.preventDefault();const l=this.viewModel.toObject(),r="POST",m={"Content-Type":"application/json"},i=JSON.stringify(l);console.log("Posting login form:",t,i,s),fetch(t,{method:r,headers:m,body:i}).then(e=>{if(e.status!==200)throw`Form submission failed: Status ${e.status}`;return e.json()}).then(e=>{const{token:u}=e,c=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signin",{token:u,redirect:"/"}]});this.dispatchEvent(c)})}};n.template=h`<template>
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
  `;let E=n;y({"un-auth":w.Provider,"login-form":E});
