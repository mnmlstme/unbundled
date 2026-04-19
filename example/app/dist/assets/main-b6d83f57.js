import{a as u,c as l,b as h,f as x,d as n,h as r,s as c,e as p,g as w,V as d,i as v,j as f,k as C,r as H,l as A,m as P,n as U}from"./headings.css-a620ccdc.js";const _={};function j(a,e,t){var o,m,$;const[i,s]=e;switch(i){case"profile/request":if(((o=a.profile)==null?void 0:o.userid)===s.userid)break;return[{...a,profile:{userid:s.userid,name:"?",home:"?",airports:[]}},q(s,t)];case"profile/save":return[a,N(s,t)];case"profile/load":const{profile:k}=s;return{...a,profile:k};case"tourIndex/request":if(((m=a.tourIndex)==null?void 0:m.userid)===s.userid)break;return[{...a,tourIndex:{userid:s.userid,tours:[]}},R(s,t)];case"tourIndex/load":return{...a,tourIndex:s};case"tour/request":if((($=a.tour)==null?void 0:$.id)===s.id)break;return[{...a,tour:{id:s.id,name:"",startDate:new Date,endDate:new Date,destinations:[],transportation:[],entourage:[]}},F(s,t)];case"tour/load":const{tour:z}=s;return{...a,tour:z};default:console.log("Invalid message type:",i)}return a}function q(a,e){return fetch(`/api/travelers/${a.userid}`,{headers:u.headers(e)}).then(t=>{if(t.status!==200)throw`HTTP Status ${t.status}`;return t.json()}).then(t=>["profile/load",{profile:t}])}function N(a,e){return fetch(`/api/travelers/${a.userid}`,{method:"PUT",headers:{"Content-Type":"application/json",...u.headers(e)},body:JSON.stringify(a.profile)}).then(t=>{if(t.status!==200)throw new Error(`Failed to save profile for ${a.userid}`);return t.json()}).then(t=>["profile/load",{profile:t}])}function R(a,e){return fetch(`/api/tours/?userid=${a.userid}`,{headers:u.headers(e)}).then(t=>{if(t.status!==200)throw`HTTP Status ${t.status}`;return t.json()}).then(t=>{const{data:i}=t;return["tourIndex/load",{userid:a.userid,tours:i}]})}function F(a,e){return fetch(`/api/tours/${a.id}`,{headers:u.headers(e)}).then(t=>{if(t.status!==200)throw`HTTP Status ${t.status}`;return t.json()}).then(t=>["tour/load",{tour:t}])}const L=l`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: var(--font-family-display);
    line-height: var(--font-line-height-display);
  }
  h1 {
    font-size: var(--size-type-xxlarge);
    font-style: oblique;
    line-height: 1;
    font-weight: var(--font-weight-bold);
  }
  h2 {
    font-size: var(--size-type-xlarge);
    font-weight: var(--font-weight-bold);
  }
  h3 {
    font-size: var(--size-type-large);
    font-weight: var(--font-weight-normal);
    font-style: oblique;
  }
  h4 {
    font-size: var(--size-type-mlarge);
    font-weight: var(--font-weight-bold);
  }
  h5 {
    font-size: var(--size-type-body);
    font-weight: var(--font-weight-bold);
  }
  h6 {
    font-size: var(--size-type-body);
    font-weight: var(--font-weight-normal);
    font-style: italic;
  }
`,O={styles:L},B=l`
  * {
    margin: 0;
    box-sizing: border-box;
  }
  img {
    max-width: 100%;
  }
  ul,
  menu {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
  }
`,W={styles:B},T=class M extends HTMLElement{constructor(){super(),this.viewModel=h({authenticated:!1}).with(x(this),"authenticated","username"),this.view=n(r`
    <header>
      <h1>Blazing Travels</h1>
      <nav
        class=${e=>e.authenticated?"logged-in":"logged-out"}>
        <p>Hello, ${e=>e.username||"traveler"}</p>
        <menu>
          <li class="when-signed-in">
            <a>Sign Out</a>
          </li>
          <li class="when-signed-out">
            <a href="/login.html">Sign In</a>
          </li>
        </menu>
      </nav>
    </header>
  `),c(this).styles(W.styles,O.styles,M.styles).replace(this.viewModel.render(this.view)).delegate(".when-signed-in a",{click:()=>this.signout()})}signout(){const e=new CustomEvent("auth:message",{bubbles:!0,composed:!0,detail:["auth/signout"]});this.dispatchEvent(e),u.dispatch(this,"auth/signout")}};T.styles=l`
    :host {
      display: contents;
    }
    header {
      display: flex;
      grid-column: start / end;
      flex-wrap: wrap;
      align-items: bottom;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--color-background-header);
      color: var(--color-text-inverted);
    }
    header ~ * {
      margin: var(--size-spacing-medium);
    }
    header p {
      --color-link: var(--color-link-inverted);
    }
    nav {
      display: flex;
      flex-direction: column;
      flex-basis: max-content;
      align-items: end;
    }
    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }
    #userid:empty::before {
      content: "traveler";
    }
    menu {
      display: flex;
      flex-direction: row;
      gap: 1em;
    }
    menu a {
      color: var(--color-link-inverted);
      cursor: pointer;
      text-decoration: none;
    }
    nav.logged-out .when-signed-in,
    nav.logged-in .when-signed-out {
      display: none;
    }
  `;let J=T;class Y extends HTMLElement{constructor(){super(),this.viewModel=h({userid:"guest"}).withCalculated(p(this),{userid:e=>e["user-id"]}).with(w(this),"tourIndex"),this.view=n(r`
    <dl>
      ${e=>{var t;return d.map(this.viewTour,((t=e.tourIndex)==null?void 0:t.tours)||[])}}
    </dl>
  `),this.viewTour=n(r`
      <dt>
        <a href=${e=>`/app/tour/${e.id}`}>${e=>e.name}</a>
      </dt>
      <dd>${e=>e.startDate.toString()} to ${e=>e.endDate.toString()}</dd>
      <dd>
        <ul>
          ${e=>d.map(this.travelerView,e.entourage)}
        </ul>
      </dd>
    </li>`),this.travelerView=n(r`
    <li>
      <a href=${e=>`/app/profile/${e.userid}`}>
        ${e=>e.userid}
      </a>
    </li>
  `),c(this).replace(this.viewModel.render(this.view)),this.viewModel.createEffect(e=>{e.userid&&this.dispatch(["tourIndex/request",{userid:e.userid}])})}dispatch(e){v.dispatch(this,e)}}const E=class D extends HTMLElement{constructor(){super(),this.viewModel=h({endDate:void 0}).withCalculated(p(this),{startDate:e=>new Date(e["start-date"]),endDate:e=>{const t=e["end-date"];if(t!==void 0)return new Date(t)}}),this.dateView=n(r`
    <label style="grid-column: ${e=>e.day+1}">
      <span>${e=>e.d}</span>
      <input
        type="radio"
        name="cal"
        value="${e=>Q(e)}" />
    </label>
  `),this.view=n(r`
    <section>
      <fieldset>
        <h6>Su</h6>
        <h6>Mo</h6>
        <h6>Tu</h6>
        <h6>We</h6>
        <h6>Th</h6>
        <h6>Fr</h6>
        <h6>Sa</h6>
        ${e=>e.startDate?d.map(this.dateView,X(e.startDate,e.endDate).map(K)):""}
      </fieldset>
      <button id="clear">Clear Selection</button>
    </section>
  `),this.changeEventType=`${this.tagName}/change`,c(this).styles(D.styles).replace(this.viewModel.render(this.view)).delegate('input[name="cal"]',{change:e=>{const t=e.target,i=new CustomEvent(this.changeEventType,{bubbles:!0,composed:!0,detail:{dateString:t.value}});this.dispatchEvent(i)}})}};E.styles=l`
    /* CSS here */
  `;let G=E;function K(a){return{d:a.getUTCDate(),m:a.getUTCMonth()+1,y:a.getUTCFullYear(),day:a.getUTCDay()}}function Q(a){const{y:e,m:t,d:i}=a;return[e,t,i].join("-")}function X(a,e){const t=e?e.getTime():a.getTime();let i=[],s=new Date(a);for(;s.getTime()<=t;)i.push(new Date(s)),s.setUTCDate(s.getUTCDate()+1);return i}const I=class g extends HTMLElement{constructor(){super(),this.uses=f({"calendar-widget":G}),this.viewModel=h().withRenamed(p(this),{tourId:"tour-id"}).with(w(this),"tour"),this.view=n(r`
    <section class="calendar">
      <h3>Calendar</h3>
      <calendar-widget
        start-date=${e=>{var t,i;return((i=(t=e.tour)==null?void 0:t.startDate)==null?void 0:i.toString())||""}}
        end-date=${e=>{var t,i;return((i=(t=e.tour)==null?void 0:t.endDate)==null?void 0:i.toString())||""}}></calendar-widget>
    </section>
    <section class="itinerary">
      <h3>Itinerary</h3>
      <dl>
        ${e=>{var t,i;return d.map2(this.pairView,((t=e.tour)==null?void 0:t.transportation)||[],((i=e.tour)==null?void 0:i.destinations)||[])}}
      </dl>
    </section>
    <section class="entourage">
      <h3>Entourage</h3>
      <ul>
        ${e=>{var t;return d.map(this.travelerView,((t=e.tour)==null?void 0:t.entourage)||[])}}
      </ul>
    </section>
  `),this.pairView=C(r`
    ${(e,t)=>d.apply(this.transportationView,e)}
    ${(e,t)=>t?d.apply(this.destinationView,t):""}
  `),this.destinationView=n(r`
    <dt>
      ${e=>g.dateRange(e.startDate,e.endDate)}
    </dt>
    <dd>
      <blz-destination
        start-date=${e=>{var t;return(t=e.startDate)==null?void 0:t.toString()}}
        end-date=${e=>{var t;return(t=e.endDate)==null?void 0:t.toString()}}>
        ${e=>e.name}
      </blz-destination>
    </dd>
  `),this.transportationView=n(r`
    <dt></dt>
    <dt>
      ${e=>g.dateRange(e.startDate,e.endDate)}
    </dt>
    <dd>[Transportation Details]</dd>
  `),this.travelerView=n(r`
    <li>
      <a href=${e=>`/app/profile/${e.userid}`}>
        ${e=>e.avatar?r`
                <img src=${e.avatar} />
              `:""}
        <h4>${e=>e.name}</h4>
      </a>
    </li>
  `),c(this).styles(g.styles).replace(this.viewModel.render(this.view)).listen({"calendar-widget/change":e=>{const{dateString:t}=e.detail;this.viewModel.set("selectedDate",new Date(t))}}),this.viewModel.createEffect(e=>{e.tourId&&this.dispatch(["tour/request",{id:e.tourId}])})}static dateRange(e,t){return`${e==null?void 0:e.toString()}${t?`to ${t.toString()}`:""}`}dispatch(e){v.dispatch(this,e)}};I.styles=l``;let Z=I;const y=class V extends HTMLElement{constructor(){super(),this.viewModel=h({values:[]}).with(p(this),"name"),this.view=n(r`
    <fieldset name=${e=>e.name||"undefined"}>
      <ul>
        ${e=>d.map(this.itemView,e.values.map(t=>({value:t})))}
      </ul>
      <button class="add">
        <slot name="label-add">Add an item</slot>
      </button>
    </fieldset>
  `),this.itemView=n(r`
    <li>
      <input value=${e=>e.value} />
      <button class="remove">Remove</button>
    </li>
  `),c(this).styles(V.styles).replace(this.viewModel.render(this.view)).delegate("input",{change:e=>{const t=e.target,i=t.closest("li");i&&this.changeItem(i,t.value)}}).delegate("button.add",{click:e=>{this.addItem("")}}).delegate("button.remove",{click:e=>{const i=e.target.closest("li");i&&this.removeItem(i)}})}get name(){return this.viewModel.$.name}get value(){return this.viewModel.$.values}set value(e){this.viewModel.set("values",e)}changeItem(e,t){const i=this.getItemIndex(e);i&&(this.viewModel.$.values[i]=t)}addItem(e){this.viewModel.set("values",this.viewModel.$.values.concat([e]))}removeItem(e){const t=this.getItemIndex(e);t>=0&&this.viewModel.set("values",this.viewModel.$.values.toSpliced(t,1))}getItemIndex(e){const t=e.parentElement;if(!t)return-1;const i=t.children;for(let s=0;i&&s<i.length;s++)if(i[s]===e)return s;return-1}};y.formAssociated=!0;y.styles=l`
    fieldset {
      display: grid;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
      padding: 0;
      border: none;
    }
    ul {
      display: contents;
      list-style: none;
      padding: 0;
    }
    li {
      display: contents;
      button {
        grid-column: auto/-1;
      }
      input {
        grid-column: auto/-2;
      }
    }
  `;let ee=y;const b=class S extends HTMLElement{constructor(){super(),this.viewModel=h({mode:"view"}).withRenamed(p(this),{userid:"user-id"}).with(x(this),"token","username").with(w(this),"profile"),this.view=n(r`
    <section>
      ${e=>e.profile?d.apply(e.mode==="view"?this.mainView:this.editView,e.profile):""}
    </section>
  `),this.mainView=n(r`
    ${e=>e.userid===this.viewModel.get("username")?r`
            <button id="edit-mode">Edit</button>
          `:""}
    ${e=>e.avatar?r`
            <img src=${e.avatar} alt=${e.name} />
          `:""}
    <h1>${e=>e.name}</h1>
    <dl>
      <dt>Username</dt>
      <dd>${e=>e.userid}</dd>
      <dt>Nickname</dt>
      <dd>${e=>e.nickname||""}</dd>
      <dt>Home City</dt>
      <dd>${e=>e.home}</dd>
      <dt>Airports</dt>
      <dd>${e=>e.airports.join(", ")}</dd>
      <dt>Favorite Color</dt>
      <dd>
        ${e=>e.color?r`
                <span
                  class="swatch"
                  style=${`background: ${e.color}`}></span>
                <span>${e.color}</span>
              `:""}
      </dd>
    </dl>
  `),this.editView=n(r`
    <form>
    ${e=>e.avatar?r`
            <img src=${e.avatar} alt=${e.name} />
          `:""}
      <h1>
        <span class="aria-only" name="name-label">Display Name</span>
        <input name="name"
          value=${e=>e.name}
          aria-labelled-by="name-label"/>
      </h1>
      <dl>
        <dt id="userid-label">Username</dt>
        <dd>
            <input disabled name="userid"
              value=${e=>e.userid}
              aria-labelled-by="userid-label"/>
        </dd>
        <dt id="nickname-label">Nickname</dt>
        <dd>
            <input name="nickname"
              value=${e=>e.nickname||""}
              aria-labelled-by="nickname-label"/>
        </dd>
        <dt id="home-label">Home City</dt>
        <dd>
            <input name="home"
              value=${e=>e.home||""}
              aria-labelled-by="home-label"/>
        </dd>
        <dt id="airports-label">Airports</dt>
        <dd>
          <input-array
            name="airports"
            .value=${e=>e.airports}
            aria-labelled-by="airports-label"/>
          </input-array>
        </dd>
        <dt id="color-label">Favorite Color</dt>
        <dd>
        ${e=>e.color?r`
                <span
                  class="swatch"
                  style=${`background: ${e.color}`}></span>
                <span>
                  <input
                    type="color"
                    name="color"
                    value=${e.color}
                    aria-labelled-by="color-label" />
                </span>
              `:""}
        </dd>
        <dt id="avatar-label">Upload Profile Image</dt>
        <dd>
            <input type="file" name="avatar"
              aria-labelled-by="avatar-label"/>
        </dd>
      </dl>
      <button id="cancel" type="button">Cancel</button>
      <button type="submit">Save</button>
     </form>
  `),c(this).styles(H.styles,A.styles,S.styles).replace(this.viewModel.render(this.view)).delegate("#edit-mode",{click:()=>this.viewModel.set("mode","edit")}).delegate("#cancel",{click:()=>this.viewModel.set("mode","view")}).delegate('input[name="avatar"]',{change:e=>{const i=e.target.files;i&&i.length&&this.readAvatarBase64(i)}}).listen({submit:e=>this.submitForm(e)}),this.viewModel.createEffect(e=>{e.userid&&this.dispatch(["profile/request",{userid:e.userid}])})}dispatch(e){v.dispatch(this,e)}submitForm(e){e.preventDefault();const t=e.target,i=this.formDataToJSON(t),s=this.viewModel.$.userid;s&&this.dispatch(["profile/save",{userid:s,profile:i}])}formDataToJSON(e){const i=Array.from(e.elements).filter(s=>s.tagName!=="BUTTON"&&"name"in s).map(s=>{const o=s.name;switch(o){case"avatar":return[o,this.viewModel.get("_avatar")];default:return[o,s.value]}});return Object.fromEntries(i)}readAvatarBase64(e){e&&e.length&&new Promise((i,s)=>{const o=new FileReader;o.onload=()=>i(o.result),o.onerror=m=>s(m),o.readAsDataURL(e[0])}).then(i=>{this.viewModel.set("_avatar",i)})}};b.uses=f({"input-array":ee});b.styles=l`
    :host {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
    }
    section {
      display: grid;
      grid-template-columns: subgrid;
      gap: inherit;
      gap: var(--size-spacing-medium) var(--size-spacing-xlarge);
      align-items: end;
      grid-column: 1 / -1;
    }
    h1 {
      grid-row: 4;
      grid-column: auto / span 2;
    }
    img {
      display: block;
      grid-column: auto / span 2;
      grid-row: 1 / span 4;
    }
    .swatch {
      display: inline-block;
      width: 2em;
      aspect-ratio: 1;
      vertical-align: middle;
    }
    dl {
      display: grid;
      grid-column: 1 / -1;
      grid-row: 5 / auto;
      grid-template-columns: subgrid;
      align-items: baseline;
    }
    dt {
      grid-column: 1 / span 2;
      color: var(--color-accent);
      font-family: var(--font-family-display);
    }
    dd {
      grid-column: 3 / -1;
    }
    form {
      display: contents;
    }
    input {
      margin: var(--size-spacing-medium) 0;
      font: inherit;
    }
  `;let te=b;const ie=[{auth:"protected",path:"/app/profile/:userid",view:r`
      <profile-view
        user-id=${a=>a.params.userid}></profile-view>
    `},{auth:"protected",path:"/app/tour/:id",view:r`
      <tour-view tour-id=${a=>a.params.id}></tour-view>
    `},{path:"/app",view:r`
      <home-view
        user-id=${a=>{var e,t;return((e=a.user)==null?void 0:e.authenticated)&&((t=a.user)==null?void 0:t.username)||"anonymous"}}></home-view>
    `},{path:"/",redirect:"/app"}];f({"auth-provider":u.Provider,"history-provider":P.Provider,"blazing-header":J,"router-switch":class extends U.Element{constructor(){super(ie)}},"store-provider":class extends v.Provider{constructor(){super(j,_)}},"home-view":Y,"profile-view":te,"tour-view":Z});
