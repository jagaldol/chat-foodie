(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[929],{8761:function(e,t,n){Promise.resolve().then(n.bind(n,3253))},3253:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return v}});var r=n(7437),s=n(2265),o=n(6691),a=n.n(o),l=n(9402),i=n(9036),c=n(6244),u=n(8814),h=n(2068),d=n(1527),m=()=>{let[e,t]=(0,s.useState)(!1),n=(0,d.useMediaQuery)({maxWidth:768});return(0,s.useEffect)(()=>{n?t(!0):t(!1)},[n]),e},f=n(2601);function x(e){let{messages:t,handleStreamMessage:n,addUserMessage:o,prepareRegenerate:d,handleStreamEndWhichCaseUser:x}=e,[g,p]=(0,s.useState)(!1),{userId:b,isLoad:v}=(0,s.useContext)(i.AuthContext),{chatroomId:w,setChatroomId:y}=(0,s.useContext)(c.ChatroomContext),C=m(),j=()=>{let e=document.querySelector("#user-input-box");null!==e&&(e.style.height=C?"20px":"24px",e.style.height="".concat(Math.min(e.scrollHeight,120),"px"))},N=()=>{let e=t.slice(-38),n=[];e.forEach(e=>{let t=n.length%2==1;t&&!e.isFromChatbot&&n.push(""),!t&&e.isFromChatbot&&n.push(""),n.push(e.content)}),n.length%2==1&&n.push("");let r=n.slice(-38),s=[];for(let e=0;e<r.length;e+=2)s.push([r[e],r[e+1]]);return s};async function k(e,t){let r="".concat(f.env.NEXT_PUBLIC_WS_URL,"/api"),s=w;if(0===b)r+="/public-chat";else{var o;let e=(0,u.Ld)(),t=null!==(o=(0,u.He)())&&void 0!==o?o:"";if(null!=e&&1e3*e<Date.now()){let e=await h.Z.post("/authentication");t=e.headers.authorization,(0,u.LJ)(t)}if(r+="/chat?token=".concat(t),0===s){let e=await h.Z.post("/chatrooms");y(s=e.data.response.chatroomId)}}let a=new WebSocket(r),l=!1;a.addEventListener("open",()=>{let n;l=!0,n=0===b?JSON.stringify({input:e,history:N(),regenerate:t}):JSON.stringify({input:e,chatroomId:s,regenerate:t}),a.send(n)}),a.addEventListener("message",e=>{let r=JSON.parse(e.data);switch(r.event){case"text_stream":n(r.response);return;case"stream_end":0!==b&&x(Number(r.response.userMessageId),Number(r.response.chatbotMessageId),t);break;case"error":alert(r.response);break;default:alert("서버 통신 중 오류가 발생했습니다.")}a.close()}),a.addEventListener("close",()=>{p(!1),l||alert("채팅 서버에 연결할 수 없습니다!")})}let E=()=>{if(!v||g)return;let e=document.querySelector("#user-input-box"),t=e.value;t&&(o(t),p(!0),k(t,!1).then(()=>{}),e.value="",j())},S=["부모님이랑 먹기 좋은 음식 추천해줘","매콤한 음식이 먹고싶은데 메뉴 추천 해줘","고기가 많이 들어있는 음식을 추천해줘","여름에 먹기 좋은 음식 추천해줘"];return(0,r.jsxs)("div",{className:"sticky bottom-6 max-md:bottom-10 flex flex-col items-center bg-white",children:[v&&0===t.length&&(0,r.jsx)("div",{className:"justify-center w-[50%] max-lg:w-[70%] max-md:w-[90%] grid ".concat(C?"grid-cols-1":"grid-cols-2"," gap-4 mb-2 "),children:(()=>{let e=C?2:S.length;return S.slice(0,e).map(e=>(0,r.jsx)("button",{type:"button",className:"px-4 py-2 text-orange-500 rounded-lg border border-black hover:bg-orange-500 hover:text-white hover:border-white max-md:text-sm",onClick:()=>{o(e),p(!0),k(e,!1).then(()=>{})},children:e},e))})()}),(0,r.jsxs)("div",{className:"flex justify-center items-center mt-3 mb-6 max-md:mb-2 w-[50%] max-lg:w-[70%] max-md:w-[90%] border-2 border-solid border-gray-400 rounded py-3 max-md:py-2 box-content focus-within:shadow-[0_0_4px_4px_rgba(0,0,0,0.1)]",children:[(0,r.jsxs)("button",{type:"button",className:"px-8 border bg-white border-gray-400 rounded flex justify-center items-center py-1.5 mb-4 absolute -top-9 opacity-70 hover:opacity-100 transition".concat(0===t.length||g?" invisible":""),onClick:()=>{g||(p(!0),d(),k("",!0).then(()=>{}))},children:[(0,r.jsx)(a(),{src:"/svg/refresh.svg",alt:"",width:"16",height:"16",style:{width:"16px",height:"16px"},className:"max-md:h-3.5 max-md:w-3.5"}),(0,r.jsx)("p",{className:"ml-2 text-sm max-md:text-xs",children:"답변 재생성"})]}),(0,r.jsx)("textarea",{className:"w-full focus:outline-none pl-5 mr-5 custom-scroll-bar-4px overflow-y scroll resize-none h-6 max-md:text-sm max-md:h-5",id:"user-input-box",onChange:e=>{(0,l.kT)(e,500),j()},onKeyDown:e=>{(0,l.Ot)(e,E)},placeholder:"메시지를 입력해주세요"}),(0,r.jsx)("button",{type:"button",className:"w-10 flex justify-center items-center".concat(g?" hover:cursor-default":""),onClick:E,children:g?(0,r.jsx)("div",{className:"-translate-x-2",children:(0,r.jsx)("div",{className:"dot-elastic"})}):(0,r.jsx)(a(),{src:"/svg/send.svg",alt:"전송",width:"16",height:"16"})})]})]})}function g(e){let{message:t}=e;return(0,s.useEffect)(()=>{window.scrollTo(0,document.body.scrollHeight)},[]),(0,r.jsx)("div",{className:"".concat(t.isFromChatbot?"bg-gray-100 ":"","pt-10 pb-14 flex justify-center items-center w-full"),children:(0,r.jsxs)("div",{className:"w-[50%] max-lg:w-[70%] max-md:w-[90%] flex",children:[(0,r.jsx)("div",{className:"".concat(t.isFromChatbot?"bg-white ":""," min-w-[30px] mr-10 max-md:mr-5 h-fit"),children:(0,r.jsx)(a(),{src:"".concat(t.isFromChatbot?"/svg/logo.svg":"/svg/user.svg"),alt:"icon",width:30,height:30,style:{height:"30px"}})}),(0,r.jsx)("p",{className:"break-all whitespace-pre-line max-md:text-sm",children:t.content})]})})}function p(e){let{messages:t}=e,{chatroomId:n}=(0,s.useContext)(c.ChatroomContext),o=()=>{window.innerHeight+window.scrollY>=document.body.offsetHeight-30&&window.scrollTo(0,document.body.scrollHeight)};return(0,s.useEffect)(()=>{o()},[t]),(0,s.useEffect)(()=>{o()},[n]),(0,r.jsx)("div",{className:"w-full h-full",id:"chat-main",children:t.map(e=>(0,r.jsx)(g,{message:e},e.key))})}function b(e){let{messages:t}=e,{chatroomId:n}=(0,s.useContext)(c.ChatroomContext);return(0,r.jsx)("div",{className:"grow flex justify-center items-center h-auto",children:0===t.length&&0===n?(0,r.jsx)(p,{messages:[{key:1,content:"오늘 점심은 뭘 먹을까?",isFromChatbot:!1},{key:2,content:"라면에 김밥은 어떠신가요?\n\n- 한식 중에서 뭐 먹을까? 와 같이 원하는 음식 종류를 언급해도 좋아요!\n- 특정 식재료나 요리 스타일을 언급하면 더 정확한 추천이 가능해요!\n- 아래의 예시 질문을 클릭해보세요. foodie가 정성껏 답변해 드릴게요!",isFromChatbot:!0}]}):(0,r.jsx)(p,{messages:t})})}function v(){let[e,t]=(0,s.useState)([]),n=(0,s.useRef)(1),{userId:o}=(0,s.useContext)(i.AuthContext),{chatroomId:a,setChatroomId:l}=(0,s.useContext)(c.ChatroomContext),u=e=>e.map(e=>{let t={...e};return t.key=n.current,n.current+=1,t}),d=(e,n)=>{t(t=>[...t,...u([{key:0,content:e,isFromChatbot:n}])])},m=async e=>{t(t=>{let n=t[t.length-1];return n&&n.isFromChatbot?(n.content=e,[...t.slice(0,-1),n]):[...t,...u([{key:0,content:e,isFromChatbot:!0}])]})},f=(0,s.useCallback)(e=>{-1!==e.key&&h.Z.get("/chatrooms/".concat(a,"/messages"),{params:{}}).then(n=>{let r=n.data.response.body.messages;void 0===e.key?t(e=>{let t=e.filter(e=>void 0===e.id);return[...u(r),...t]}):t(e=>[...u(r),...e])}).catch(e=>{alert(e.response.data.errorMessage)})},[a]);return(0,s.useEffect)(()=>{0===a?t([]):f({size:20})},[a,f]),(0,s.useEffect)(()=>{l(0),t([])},[o,l]),(0,r.jsxs)("div",{className:"flex flex-col min-h-full",children:[(0,r.jsx)(b,{messages:e}),(0,r.jsx)(x,{messages:e,handleStreamMessage:m,handleStreamEndWhichCaseUser:(e,n,r)=>{t(t=>{let s=t[t.length-1];if(s.id=n,r)return[...t.slice(0,-1),s];let o=t[t.length-2];return o.id=e,[...t.slice(0,-2),o,s]})},addUserMessage:e=>d(e,!1),prepareRegenerate:()=>{t(e=>e.slice(0,-1))}})]})}},9036:function(e,t,n){"use strict";n.r(t),n.d(t,{AuthContext:function(){return a},default:function(){return l}});var r=n(7437),s=n(2265),o=n(8814);let a=(0,s.createContext)({});function l(e){let{children:t}=e,[n,l]=(0,s.useState)(0),[i,c]=(0,s.useState)("ROLE_PENDING"),[u,h]=(0,s.useState)(!1),[d,m]=(0,s.useState)(!1),f=(0,s.useMemo)(()=>({userId:n,setUserId:l,userRole:i,setUserRole:c,isLoad:u,needUpdate:()=>{m(e=>!e),h(!1)}}),[n,i,u]);return(0,s.useEffect)(()=>{let e=(0,o.ss)();null===e?(l(0),c("ROLE_PENDING"),(0,o.l6)()):(l(e.id),c(e.role)),h(!0)},[d]),(0,r.jsx)(a.Provider,{value:f,children:t})}},6244:function(e,t,n){"use strict";n.r(t),n.d(t,{ChatroomContext:function(){return o},default:function(){return a}});var r=n(7437),s=n(2265);let o=(0,s.createContext)({});function a(e){let{children:t}=e,[n,a]=(0,s.useState)(0),[l,i]=(0,s.useState)(!1),c=(0,s.useMemo)(()=>({chatroomId:n,setChatroomId:a,update:l,needUpdate:()=>{i(e=>!e)}}),[l,n]);return(0,r.jsx)(o.Provider,{value:c,children:t})}},8814:function(e,t,n){"use strict";function r(e){localStorage.setItem("jwt",e)}function s(){localStorage.removeItem("jwt")}function o(e){let t="";if(e)t=e;else{let e=localStorage.getItem("jwt");t=null!=e?e:t}if(null===t)return null;let n=t.split(".");if(!t.startsWith("Bearer ")||3!==n.length)return null;let r=atob(n[1]);return JSON.parse(r)}function a(e){let t=o(e);return t?t.exp:null}function l(e){let t=o(e);return t?t.id:null}function i(){return localStorage.getItem("jwt")}n.d(t,{He:function(){return i},LJ:function(){return r},Ld:function(){return a},l6:function(){return s},sk:function(){return l},ss:function(){return o}})},2068:function(e,t,n){"use strict";n.d(t,{Z:function(){return h}});var r=n(9222),s=n(8814),o=n(2601);let a=!1,l=[],i=async e=>{let t=(0,s.Ld)();if(null!=t&&1e3*t<Date.now()){if(a)await new Promise(t=>{l.push(n=>{e.headers.Authorization=n,t(n)})});else try{a=!0;let t=await r.Z.post("".concat(o.env.NEXT_PUBLIC_API_URL,"/api/authentication"),null,{withCredentials:!0}),n=t.headers.authorization;(0,s.LJ)(n),l.forEach(e=>e(n)),l=[],e.headers.Authorization=n}catch(e){(0,s.l6)()}finally{a=!1}}else e.headers.Authorization=(0,s.He)();return e};var c=n(2601);let u=r.Z.create({baseURL:"".concat(c.env.NEXT_PUBLIC_API_URL,"/api"),withCredentials:!0});u.interceptors.request.use(i,()=>{});var h=u},9402:function(e,t,n){"use strict";n.d(t,{DD:function(){return l},Ot:function(){return o},Zj:function(){return i},kT:function(){return s}});var r=n(7437);function s(e,t){let{value:n}=e.target;n.length>t&&(e.target.value=n.slice(0,t))}function o(e,t){"Enter"!==e.key||e.shiftKey||(e.preventDefault(),t())}n(2265);let a={1:31,2:28,3:31,4:30,5:31,6:30,7:31,8:31,9:30,10:31,11:30,12:31};function l(e,t){let n=2===t&&(e%4==0&&e%100!=0||e%400==0)?29:a[t],s=[];for(let e=1;e<=n;e+=1)s.push((0,r.jsx)("option",{value:e,children:e},e));return s}function i(){let e=[],t=new Date().getFullYear();for(let n=1900;n<=t;n+=1)e.push((0,r.jsx)("option",{value:n,children:n},n));return e}}},function(e){e.O(0,[222,357,971,596,744],function(){return e(e.s=8761)}),_N_E=e.O()}]);