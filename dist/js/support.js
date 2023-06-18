// ==UserScript==
// @name         Support Panel
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  support panel
// @author       Stepanov Urii
// @match        https://**/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

class Support{static#instances=0;constructor(t={}){if(Support.#instances++,1<Support.#instances)throw new Error("Only one instance can be created class Support");this.body=document.querySelector("body"),this.setParameters(t),this.panelShow=this.getLocalStorageItem("panelShow"),this.darkTheme=this.getLocalStorageItem("darkTheme"),this.scale=this.getLocalStorageItem("scale"),this.grid=this.getLocalStorageItem("grid"),this.showScrollup=this.getLocalStorageItem("scrollup"),this.colors=this.getCssColors(),this.image=!1,this.renderPanel(),this.activationButton(),this.startProcesses()}getLocalStorageItem(t){return"true"===localStorage.getItem(t)||"false"!==localStorage.getItem(t)&&this[t]}activationButton(){for(let e in this.buttons)this[this.buttons[e][0]]&&this[e].addEventListener("click",t=>this[this.buttons[e][2]]())}startProcesses(){for(var t in this.buttons)this[this.buttons[t][0]]&&"buttonContenteditable"!==t&&"buttonGetImage"!==t&&this[this.buttons[t][2]](!1)}getCssColors(){const l=[],i=[];return document.querySelectorAll("*").forEach(t=>{var e=window.getComputedStyle(t).getPropertyValue("background-color"),o=t.style.backgroundColor,s=window.getComputedStyle(t).getPropertyValue("color"),a=t.style.color;"rgba(0, 0, 0, 0)"===e||o||(o=this.rgbToHsl(e),l.push([t,o])),"rgba(0, 0, 0, 0)"===s||a||(e=this.rgbToHsl(s),i.push([t,e]))}),[l,i]}rgbToHsl(t){let e=(t=t.replace(/[a-z()]/g,"")).split(",");var[t,o,s,a]=e=e.map(t=>parseInt(t)),l=(t/=255,o/=255,s/=255,Math.min(t,o,s)),i=Math.max(t,o,s),n=i-l;let r=0;let c=0;return r=0==n?0:i===t?(o-s)/n%6:i===o?(s-t)/n+2:(t-o)/n+4,(r=Math.round(60*r))<0&&(r+=360),c=(i+l)/2,s=+(100*(0==n?0:n/(1-Math.abs(2*c-1)))).toFixed(1),c=85<(c=+(100*c).toFixed(1))?15:c<25?90:100-c,a?"hsl("+r+","+s+"%,"+c+"%,"+a+")":"hsl("+r+","+s+"%,"+c+"%)"}toggleShow(t=!0){t&&(this.panelShow=!this.panelShow),localStorage.setItem("panelShow",this.panelShow),!0===this.panelShow?(this.buttonShow.classList.add("panel__button_on"),this.block.style.height=41*this.qtyButtons+"px"):(this.buttonShow.classList.remove("panel__button_on"),this.block.style.height=0)}toggleTheme(t=!0){t&&(this.darkTheme=!this.darkTheme),localStorage.setItem("darkTheme",this.darkTheme),!0===this.darkTheme?this.buttonTheme.classList.add("panel__button_on"):this.buttonTheme.classList.remove("panel__button_on"),this.changeTheme()}toggleScale(t=!0){t&&(this.scale=!this.scale),localStorage.setItem("scale",this.scale);t=document.querySelector("body");const s=this.scale?this.xScale:1;!0===this.scale?this.buttonScale.classList.add("panel__button_on"):this.buttonScale.classList.remove("panel__button_on"),function o(t){t.childNodes.forEach(t=>{var e;"#text"===t.nodeName&&0<t.nodeValue.replace(/\s+/g,"").length?(t.parentNode.getAttribute("data-fontsize")||(e=window.getComputedStyle(t.parentNode,null).fontSize,t.parentNode.setAttribute("data-fontsize",+e.replace(/px/g,""))),t.parentNode.style.fontSize=t.parentNode.getAttribute("data-fontsize")*s+"px"):o(t)})}(t)}changeTheme(){this.colors[0].forEach(t=>{this.darkTheme&&(t[0].style.backgroundColor=t[1]),this.darkTheme||t[0].style.removeProperty("background-color")}),this.colors[1].forEach(t=>{this.darkTheme&&(t[0].style.color=t[1]),this.darkTheme||t[0].style.removeProperty("color")})}toggleGrid(t=!0){t&&(this.grid=!this.grid),localStorage.setItem("grid",this.grid),!0===this.grid?(this.buttonGrid.classList.add("panel__button_on"),this.injectCssStyle("styleGrid",this.cssGrid)):this.buttonGrid.classList.contains("panel__button_on")&&(this.buttonGrid.classList.remove("panel__button_on"),this.styleGrid.remove())}contenteditable(){setTimeout(()=>{this.body.addEventListener("click",t=>{t.preventDefault(),t.target.setAttribute("contenteditable","true")},{once:!0})},10)}getImage(){this.image?setTimeout(()=>{this.body.addEventListener("click",t=>{t.preventDefault();t=t.target.parentNode;this.loadImage(t)},{once:!0})},10):(this.image=!this.image,this.measureImages())}loadImage(t){var t=t.querySelector("img");null!==t&&(t=t.src,this.createLinkImage(t,!0))}measureImages(){var t=document.querySelectorAll("img");const n=document.createElement("div"),r=(n.classList.add("image-display-links"),[]);t.forEach(t=>{var e,o,s=t.naturalWidth,a=t.naturalHeight,l=t.src,i=this.getImageName(l);(599<s||599<a)&&!r.includes(i)&&(r.push(i),(e=document.createElement("span")).classList.add("image-display-block"),(o=document.createElement("span")).classList.add("image-display-block"),o.innerHTML=s+"×"+a+" ("+i+")",s=this.createLinkImage(l,!1),e.append(o),n.append(s),t.parentNode.append(e)),document.querySelector("header")?document.querySelector("header").append(n):document.querySelector(".header")&&document.querySelector(".header").append(n)})}getImageName(t){t=t.split("#")[0].split("/");return t[t.length-1]}createLinkImage(t,e){const o=this.getImageName(t),s=new XMLHttpRequest,a=(s.open("GET",t,!0),s.responseType="blob",document.createElement("a"));if(s.onload=function(){a.classList.add("image-display-links__link"),a.href=window.URL.createObjectURL(s.response),a.download=o,a.innerHTML=o,e&&(a.style.display="none",document.body.appendChild(a),a.click(),a.remove())},s.send(),!e)return a}toggleScrollup(t=!0){function e(t){350<=window.pageYOffset?t.classList.add("_show"):t.classList.remove("_show")}t&&(this.showScrollup=!this.showScrollup),localStorage.setItem("scrollup",this.showScrollup),this.renderScrollup(),this.showScrollup&&(this.scrollup.addEventListener("click",t=>{t.preventDefault(),0<Math.max(document.body.scrollTop,document.documentElement.scrollTop)&&document.querySelector("body").scrollIntoView({behavior:"smooth",block:"start"})}),e(this.scrollup),window.addEventListener("scroll",()=>e(this.scrollup)))}renderScrollup(){var t;this.showScrollup?(this.wrapper=document.createElement("div"),this.wrapper.classList.add("_scrollup__wrapper"),(t=document.createElement("div")).classList.add("_scrollup__container"),this.scrollup=document.createElement("button"),this.scrollup.classList.add("_scrollup"),this.scrollup.innerHTML+=this.svgScrollup,this.wrapper.append(t),t.append(this.scrollup),document.querySelector("body").append(this.wrapper),this.injectCssStyle("styleScrollup",this.cssScrollup)):void 0!==this.wrapper&&(this.wrapper.remove(),this.styleScrollup.remove())}injectCssStyle(t,e){var o=document.createElement("style");o.type="text/css";o.styleSheet?o.styleSheet.cssText=e:o.appendChild(document.createTextNode(e)),this[t]=document.head.appendChild(o)}renderPanel(){this.injectCssStyle("panel",this.cssPanel),this.panel=document.createElement("div"),this.panel.classList.add("panel-block"),this.block=document.createElement("div"),this.block.classList.add("panel__block");let t=0;for(var e in this.buttons)this[this.buttons[e][0]]&&(this[e]=document.createElement("button"),this[e].classList.add("panel__button",this.buttons[e][1]),this[e].innerHTML=this.buttons[e][3],(0<t?this.block:this.panel).append(this[e]),t++);this.panel.append(this.block),document.querySelector("html>body").append(this.panel),this.qtyButtons=t-1}setParameters(t){var e=defaultParameters();for(const o in e)this[o]=(t.hasOwnProperty(o)?t:e)[o]}}function defaultParameters(){return{panelShow:!1,darkTheme:!1,grid:!1,scale:!1,xScale:1.2,cssGrid:"body{background-image:linear-gradient(#fab23a,transparent 1px),linear-gradient(90deg,#fab23a,transparent 1px);background-size: 5px 5px}",cssPanel:".panel-block{position:fixed;top:100px;right:0;background-color:transparent;z-index:99999;opacity:.3}.panel-block:focus,.panel-block:hover{opacity:1}.panel__block{display:flex;flex-direction:column;justify-content:end;overflow:hidden;transition:height .3s ease 0s}.panel__button{display:block;padding:5px;margin:0 0 1px;border:none;width:40px;height:40px;border-radius:5px 0 0 5px;background-color:#7575ff;box-sizing:border-box}.panel__button:focus svg,.panel__button:hover svg{fill:#eeeeee}.panel__button svg{fill:#a8a8ff}.panel__button_on svg{fill:#4242ff}.panel__button_show{position:relative;z-index:1005}.image-display-block{position:relative}.image-display-block__display{position:absolute;bottom:10px;left:10px;font-size:18px;color:#333333;text-shadow:0 0 5px #dddddd, 0 0 5px #dddddd, 0 0 5px #dddddd;z-index:9999}.image-display-links__link{display:inline-block;padding:5px 10px;margin-left:5px;bottom:10px;left:10px;font-size:18px;color:#333333;background-color:#7575ff;border-radius:5px}",cssScrollup:"._scrollup__wrapper{position:fixed;z-index:50;bottom:0;width:100%}._scrollup__container{position:relative}._scrollup{position:absolute;right:0;bottom:70px;display:flex;align-items:center;flex-direction:row;justify-content:center;width:50px;height:50px;padding:0;cursor:pointer;transition:transform .5s ease 0s;transform:translate(150%,0);opacity:.6;border:none;border-radius:5px 0 0 5px;background-color:#7575ff}._scrollup._show{transition:transform opacity box-shadow .7s ease 0s;transform:translateX(0)}._scrollup:focus,._scrollup:hover{transition:opacity box-shadow .3s ease 0s;opacity:1;outline:none}._scrollup svg{fill:#a8a8ff}._scrollup:focus svg,._scrollup:hover svg{fill:#ffffff}",svgScrollup:'<svg width="30" height="30" viewBox="0 0 20 20"><path d="m 9.2167969,5.5195312 a 1.108695,1.108695 0 0 0 0,1.5683594 l 7.3906251,7.3925784 a 1.108695,1.108695 0 0 0 1.568359,0 1.108695,1.108695 0 0 0 0,-1.56836 L 10.783203,5.5195312 a 1.108695,1.108695 0 0 0 -1.5664061,0 z M 5.5195312,9.2167969 1.8242187,12.912109 a 1.108695,1.108695 0 0 0 0,1.56836 1.108695,1.108695 0 0 0 1.5683594,0 l 3.6953125,-3.697266 a 1.108695,1.108695 0 0 0 0,-1.5664061 1.108695,1.108695 0 0 0 -1.5683594,0 z" /></svg>',buttons:{buttonShow:["panelBlock","panel__button_show","toggleShow",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="M 10 3 C 9.1804538 3 8.5 3.6804718 8.5 4.5 C 8.5 5.3195282 9.1804538 6 10 6 C 10.819546 6 11.5 5.3195282 11.5 4.5 C 11.5 3.6804718 10.819546 3 10 3 z M 10 8.5 C 9.1804718 8.5 8.5 9.1804718 8.5 10 C 8.5 10.819529 9.1804718 11.5 10 11.5 C 10.819529 11.5 11.5 10.819529 11.5 10 C 11.5 9.1804718 10.819529 8.5 10 8.5 z M 10 14 C 9.1804718 14 8.5 14.680471 8.5 15.5 C 8.5 16.319529 9.1804718 17 10 17 C 10.819529 17 11.5 16.319529 11.5 15.5 C 11.5 14.680471 10.819529 14 10 14 z"/></svg>'],buttonTheme:["themeBlock","panel__button_theme","toggleTheme",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="M 9.5820313,1.5 A 0.65390539,0.65390539 0 0 0 9.0996094,2.6132813 C 11.368483,4.9120582 11.340713,7.9543562 9.9667969,10.341797 8.5928804,12.729238 5.9025678,14.366013 2.7207031,13.71875 a 0.65390539,0.65390539 0 0 0 -0.671875,1.007813 C 3.6361937,17.052943 6.5378563,18.5 9.5644531,18.5 c 2.7071479,0 5.0721349,-1.209131 6.6093749,-3.105469 a 0.65384001,0.65384001 0 0 0 -0.0957,-0.919922 0.65384001,0.65384001 0 0 0 -0.919922,0.09766 c -1.296941,1.599906 -3.273128,2.61914 -5.5937499,2.61914 -1.9992347,0 -3.7777507,-0.905588 -5.1679687,-2.125 C 7.3039552,14.94235 9.7727208,13.303255 11.101563,10.994141 12.456819,8.6391249 12.564784,5.6492852 11.023438,3.1308594 14.295151,3.8868457 16.755859,6.6052903 16.755859,10 A 0.65384001,0.65384001 0 0 0 17.410156,10.654297 0.65384001,0.65384001 0 0 0 18.064453,10 c 0,-4.6183783 -3.78546,-8.3765424 -8.4824217,-8.5 z"/></svg>'],buttonScale:["scaleBlock","panel__button_scale","toggleScale",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="M 9.0820313,1.5 C 4.9032796,1.5 1.5,4.9032796 1.5,9.0820313 c 0,4.1787187 3.4032751,7.5800777 7.5820313,7.5800777 2.7627127,0 4.1923477,-1.191698 4.8164067,-1.789062 l 3.425781,3.425781 a 0.68918997,0.68918997 0 0 0 0.974609,0 0.68918997,0.68918997 0 0 0 0,-0.974609 l -3.857422,-3.857422 a 0.68925889,0.68925889 0 0 0 -1.019531,0.05078 c 0,0 -1.412001,1.765625 -4.3398437,1.765625 -3.4338179,0 -6.203125,-2.76739 -6.203125,-6.2011717 0,-3.4338224 2.7693026,-6.203125 6.203125,-6.203125 3.4337817,0 6.2011717,2.7693071 6.2011717,6.203125 0,0.4258931 -0.04172,0.8396438 -0.123047,1.2402347 a 0.68918997,0.68918997 0 0 0 0.53711,0.8125 0.68918997,0.68918997 0 0 0 0.8125,-0.539063 C 16.60928,10.105495 16.662109,9.600235 16.662109,9.0820313 16.662109,4.9032751 13.26075,1.5 9.0820313,1.5 Z"/></svg>'],buttonGrid:["gridBlock","panel__button_grid","toggleGrid",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="M 2.1894531,1.5 A 0.68925889,0.68925889 0 0 0 1.5,2.1894531 V 8.6210938 A 0.68925889,0.68925889 0 0 0 2.1894531,9.3105469 H 8.6210938 A 0.68925889,0.68925889 0 0 0 9.3105469,8.6210938 V 2.1894531 A 0.68925889,0.68925889 0 0 0 8.6210938,1.5 Z m 9.1894529,0 a 0.68925889,0.68925889 0 0 0 -0.689453,0.6894531 v 1.3789063 a 0.68918997,0.68918997 0 0 0 0.689453,0.6875 0.68918997,0.68918997 0 0 0 0.689453,-0.6875 V 2.8789063 h 5.052735 v 5.0527343 h -5.052735 v -0.6875 A 0.68918997,0.68918997 0 0 0 11.378906,6.5546875 0.68918997,0.68918997 0 0 0 10.689453,7.2441406 v 1.3769532 a 0.68925889,0.68925889 0 0 0 0.689453,0.6894531 h 6.431641 A 0.68925889,0.68925889 0 0 0 18.5,8.6210938 V 2.1894531 A 0.68925889,0.68925889 0 0 0 17.810547,1.5 Z M 2.8789063,2.8789063 H 7.9316406 V 7.9316406 H 2.8789063 Z M 2.1894531,10.689453 A 0.68925889,0.68925889 0 0 0 1.5,11.378906 v 6.431641 A 0.68925889,0.68925889 0 0 0 2.1894531,18.5 H 8.6210938 A 0.68925889,0.68925889 0 0 0 9.3105469,17.810547 V 11.378906 A 0.68925889,0.68925889 0 0 0 8.6210938,10.689453 H 7.2441406 a 0.68918997,0.68918997 0 0 0 -0.6894531,0.689453 0.68918997,0.68918997 0 0 0 0.6894531,0.689453 h 0.6875 v 5.052735 H 2.8789063 v -5.052735 h 0.6894531 a 0.68918997,0.68918997 0 0 0 0.6875,-0.689453 0.68918997,0.68918997 0 0 0 -0.6875,-0.689453 z m 9.1894529,0 a 0.68925889,0.68925889 0 0 0 -0.689453,0.689453 v 6.431641 A 0.68925889,0.68925889 0 0 0 11.378906,18.5 h 6.431641 A 0.68925889,0.68925889 0 0 0 18.5,17.810547 v -6.431641 a 0.68925889,0.68925889 0 0 0 -0.689453,-0.689453 z m 0.689453,1.378906 h 5.052735 v 5.052735 h -5.052735 z"/></svg>'],buttonContenteditable:["contenteditableBlock","panel__button_contenteditable","contenteditable",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="M 13.648438,1.7011719 10.890625,4.4589844 4.9179687,10.431641 a 0.68918997,0.68918997 0 0 0 0,0.974609 0.68918997,0.68918997 0 0 0 0.9746094,0 l 5.4863279,-5.484375 2.699219,2.6992188 -0.429687,0.4316406 a 0.68918997,0.68918997 0 0 0 0,0.9746096 0.68918997,0.68918997 0 0 0 0.974609,0 l 0.917969,-0.917969 2.757812,-2.7578125 a 0.68925889,0.68925889 0 0 0 0,-0.9746094 L 14.623047,1.7011719 a 0.68925889,0.68925889 0 0 0 -0.974609,0 z m 0.488281,1.4628906 2.699218,2.6992187 -1.781249,1.7851563 -2.703125,-2.703125 z m -2.757813,8.4433595 a 0.68918997,0.68918997 0 0 0 -0.488281,0.203125 L 5.5800781,17.121094 H 2.8789063 v -2.701172 l 0.7167968,-0.716797 a 0.68918997,0.68918997 0 0 0 0,-0.974609 0.68918997,0.68918997 0 0 0 -0.9746093,0 L 1.7011719,13.648438 A 0.68925889,0.68925889 0 0 0 1.5,14.134766 v 3.675781 A 0.68925889,0.68925889 0 0 0 2.1894531,18.5 h 3.6757813 a 0.68925889,0.68925889 0 0 0 0.4863281,-0.201172 l 5.5136715,-5.513672 a 0.68918997,0.68918997 0 0 0 0,-0.974609 0.68918997,0.68918997 0 0 0 -0.486328,-0.203125 z" /></svg>'],buttonGetImage:["imageBlock","panel__button_image","getImage",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="m 4.4003906,1.8339844 c -1.4092383,0 -2.5664062,1.1571679 -2.5664062,2.5664062 V 8.1328125 C 1.8333367,8.5195644 2.1464509,8.8335533 2.5332031,8.8339844 2.9199553,8.8335533 3.2330696,8.5195644 3.2324219,8.1328125 V 4.4003906 c 0,-0.6526236 0.5153451,-1.1679687 1.1679687,-1.1679687 H 10 C 10.385989,3.2319915 10.698788,2.9191926 10.699219,2.5332031 10.698788,2.1472136 10.385989,1.8344148 10,1.8339844 Z m 10.2656254,0 c -0.385989,4.304e-4 -0.698788,0.3132292 -0.699219,0.6992187 4.31e-4,0.3859895 0.31323,0.6987884 0.699219,0.6992188 h 0.933593 c 0.652662,0 1.167969,0.5153325 1.167969,1.1679687 v 5.9550784 c 0,0 -0.486723,-0.4320361 -0.673828,-0.6191409 C 15.560869,9.2034475 14.419972,8.834334 13.099609,9.890625 l -2.470703,1.976563 c -0.39891,0.319138 -0.9557214,0.349391 -1.3769529,0.06055 -1.7249069,-1.182779 -2.8959684,-0.809706 -3.6230466,-0.08203 l -2.3964843,2.398438 v -1.44336 C 3.23307,12.414029 2.9199555,12.10004 2.5332031,12.099609 2.1464509,12.10004 1.8333366,12.414029 1.8339844,12.800781 v 2.798828 c 0,1.177513 1.4873802,2.566439 2.5664064,2.566439 H 15.599609 c 1.409244,0 2.566407,-1.157163 2.566407,-2.566407 V 12.044922 4.4003906 c 0,-1.4092257 -1.157151,-2.5664062 -2.566407,-2.5664062 z M 7.1992187,4.6328125 c -1.4092383,0 -2.5664062,1.1571679 -2.5664062,2.5664062 0,1.4092561 1.1571807,2.5683594 2.5664062,2.5683594 1.4092433,0 2.5683594,-1.1591161 2.5683594,-2.5683594 0,-1.4092255 -1.1591033,-2.5664062 -2.5683594,-2.5664062 z m 0,1.4003906 c 0.6526621,0 1.1679688,0.513379 1.1679688,1.1660156 0,0.652675 -0.5152938,1.1679688 -1.1679688,1.1679688 -0.6526366,0 -1.1660156,-0.5153067 -1.1660156,-1.1679688 0,-0.6526237 0.5133919,-1.1660156 1.1660156,-1.1660156 z m 8.1367193,4.8808599 c 0.347957,0.347957 1.431643,1.41992 1.431643,1.41992 v 3.265625 c 0,0.652675 -0.515294,1.167969 -1.167969,1.167969 H 4.4003906 c -0.4747741,0 -0.8181728,-0.312649 -1.0019531,-0.710937 L 6.5878906,12.867188 C 6.9623257,12.492753 7.5687631,12.467819 8,12.775391 c 1.5629076,1.114715 2.672806,0.851084 3.503906,0.185547 l 2.470703,-1.978516 c 0.527299,-0.422256 1.091476,-0.338212 1.361329,-0.06836 z"/></svg>'],buttonScrollup:["scrollupBlock","panel__button_scrollup","toggleScrollup",'<svg width="30" height="30" viewBox="0 0 20 20"><path d="M 9.7207031,1.5546875 A 0.72864785,0.72864785 0 0 0 9.2714844,2.2285156 V 17.771484 A 0.72857499,0.72857499 0 0 0 10,18.5 0.72857499,0.72857499 0 0 0 10.728516,17.771484 V 3.9882813 L 15.3125,8.5722656 a 0.72857499,0.72857499 0 0 0 1.03125,0 0.72857499,0.72857499 0 0 0 0,-1.03125 L 10.515625,1.7128906 A 0.72864785,0.72864785 0 0 0 9.7207031,1.5546875 Z M 6.5703125,4.6269531 3.65625,7.5410156 a 0.72857499,0.72857499 0 0 0 0,1.03125 0.72857499,0.72857499 0 0 0 1.0292969,0 L 7.6015625,5.6582031 a 0.72857499,0.72857499 0 0 0 0,-1.03125 0.72857499,0.72857499 0 0 0 -1.03125,0 z"/></svg>']},panelBlock:!0,themeBlock:!0,scaleBlock:!0,gridBlock:!0,imageBlock:!0,contenteditableBlock:!0,scrollupBlock:!0}}new Support;