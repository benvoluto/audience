(this.webpackJsonpaudience=this.webpackJsonpaudience||[]).push([[0],{16:function(e,t,n){},26:function(e,t,n){},32:function(e,t,n){"use strict";n.r(t);var a=n(7),c=n.n(a),r=n(19),i=n.n(r),o=(n(16),n(14)),s=n.n(o),u=n(20),l=n(10),d=(n(17),n(26),n(11)),j=n.n(d),f=n(15);f.a.initializeApp({apiKey:"AIzaSyAy0YuPBdXqBiK-VhuOLAq6S-RlrMMBBVk",authDomain:"audience-b9551.firebaseapp.com",projectId:"audience-b9551",storageBucket:"audience-b9551.appspot.com",messagingSenderId:"1088787585448",appId:"1:1088787585448:web:fd16cf89a1f1349ac6a59d",measurementId:"G-0LFC04MLB9"});var b=f.a,m=n(5),p=function(e){var t=e.dataUri,n=e.isFullscreen,a=e.imageNumber,c=e.setDataUri,r=e.setStep,i=e.setCount,o=n?"demo-image-preview-fullscreen":"",s=function(e,t){var n,a,c=(n=e,(n+="").length>=(a=4)?n:new Array(a-n.length+1).join("0")+n),r=function(e){var t=d.IMAGE_TYPES.PNG;return"image/jpeg"===e&&(t=d.IMAGE_TYPES.JPG),t}(t);return"".concat("photo","-").concat(c,".").concat(r)};return Object(m.jsx)("div",{children:t?Object(m.jsxs)("div",{className:"preview",children:[Object(m.jsx)("div",{className:"demo-image-preview "+o,children:Object(m.jsx)("img",{alt:"your portrait, mate",src:t})}),Object(m.jsx)("button",{onClick:function(){var e=function(e){for(var t=atob(e.split(",")[1]),n=e.split(",")[0].split(":")[1].split(";")[0],a=new ArrayBuffer(t.length),c=new Uint8Array(a),r=0;r<t.length;r++)c[r]=t.charCodeAt(r);return new Blob([a],{type:n})}(t),n=s(a,e.type);console.log(n);var o=b.storage().ref().child("folder/"+n).put(e);o.on(b.storage.TaskEvent.STATE_CHANGED,(function(e){console.log(100*Math.round(e.bytesTransferred/e.totalBytes))}),(function(e){throw e}),(function(){o.snapshot.ref.getDownloadURL().then((function(){c(""),r(0),i(0)}))}))},children:"Looks good."}),Object(m.jsx)("button",{onClick:function(){console.log("cancel"),c(null)},children:"Retake!"})]}):Object(m.jsx)("div",{children:Object(m.jsx)(j.a,{isFullscreen:n,onTakePhotoAnimationDone:function(e){c(e)},onCameraError:function(e){!function(e){console.log("handleCameraError",e)}(e)},idealFacingMode:d.FACING_MODES.ENVIRONMENT,idealResolution:{width:600,height:900},imageType:d.IMAGE_TYPES.JPG,imageCompression:.97,isMaxResolution:!1,isImageMirror:!1,isSilentMode:!1,isDisplayStartCameraError:!0,sizeFactor:1})})})},h=function(e){var t=Object(a.useState)(""),n=Object(l.a)(t,2),c=n[0],r=n[1],i=Object(a.useState)(0),o=Object(l.a)(i,2),d=o[0],j=o[1],f=Object(a.useState)(0),h=Object(l.a)(f,2),g=h[0],O=h[1],v=Object(a.useState)([]),x=Object(l.a)(v,2),S=x[0],E=x[1],I=Object(a.useState)(0),A=Object(l.a)(I,2),N=A[0],w=A[1],y=Object(a.useState)(0),C=Object(l.a)(y,2),M=C[0],k=C[1],T=Object(a.useState)(0),B=Object(l.a)(T,2),F=B[0],P=B[1],D=Object(a.useRef)(null),G=Object(a.useRef)(null);Object(a.useEffect)((function(){var e=D.current,t=G.current;S!==e&&(D.current=S),G!==t&&(G.current=F)}),[S,D,F,G]);var R=function(e){var t=0,n=setInterval((function(){t<e?(t++,w(t)):(w(0),t=0)}),1600);clearInterval(G.current),clearInterval(F),P(n)};Object(a.useEffect)((function(){(function(){var e=Object(u.a)(s.a.mark((function e(t){var n,a,c;return s.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=b.storage(),a=n.ref(),c=a.child(t),e.next=5,c.listAll().then((function(e){var t=e.items.map((function(e){return e.getDownloadURL()}));Promise.all(t).then((function(e){E(e),k(e.length),j(e.length),R(e.length)}))}));case 5:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}})()("folder/")}),[M]);return Object(m.jsxs)("div",{className:"app step-".concat(g),children:[Object(m.jsxs)("div",{className:"flip",children:[Object(m.jsx)("div",{className:"addbutton",children:Object(m.jsx)("button",{onClick:function(){O(1),clearInterval(G.current)},children:"Add your photo"})}),Object(m.jsx)("div",{className:"frames",children:S.map((function(e,t){return Object(m.jsx)("div",{className:N===t?"frame active":"frame",children:Object(m.jsx)("img",{alt:"portrait",className:"frameImage",src:e})},"image-".concat(t))}))})]}),Object(m.jsx)("div",{className:"camera",children:Object(m.jsx)(p,{dataUri:c,setDataUri:r,setStep:O,setCount:k,imageNumber:d,isFullscreen:!1})})]})},g=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,33)).then((function(t){var n=t.getCLS,a=t.getFID,c=t.getFCP,r=t.getLCP,i=t.getTTFB;n(e),a(e),c(e),r(e),i(e)}))};i.a.render(Object(m.jsx)(c.a.StrictMode,{children:Object(m.jsx)(h,{})}),document.getElementById("root")),g()}},[[32,1,2]]]);
//# sourceMappingURL=main.7a1560cd.chunk.js.map