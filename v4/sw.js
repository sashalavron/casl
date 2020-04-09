try{self["workbox:core:5.1.2"]&&_()}catch(e){}const e={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},s=s=>[e.prefix,s,e.suffix].filter(e=>e&&e.length>0).join("-"),a=a=>a||s(e.precache),t=e=>new URL(String(e),location.href).href.replace(new RegExp(`^${location.origin}`),""),n=(e,...s)=>{let a=e;return s.length>0&&(a+=` :: ${JSON.stringify(s)}`),a};class c extends Error{constructor(e,s){super(n(e,s)),this.name=e,this.details=s}}const i=new Set;const o=(e,s)=>e.filter(e=>s in e),r=async({request:e,mode:s,plugins:a=[]})=>{const t=o(a,"cacheKeyWillBeUsed");let n=e;for(const e of t)n=await e.cacheKeyWillBeUsed.call(e,{mode:s,request:n}),"string"==typeof n&&(n=new Request(n));return n},f=async({cacheName:e,request:s,event:a,matchOptions:t,plugins:n=[]})=>{const c=await self.caches.open(e),i=await r({plugins:n,request:s,mode:"read"});let o=await c.match(i,t);for(const s of n)if("cachedResponseWillBeUsed"in s){const n=s.cachedResponseWillBeUsed;o=await n.call(s,{cacheName:e,event:a,matchOptions:t,cachedResponse:o,request:i})}return o},d=async({cacheName:e,request:s,response:a,event:n,plugins:d=[],matchOptions:l})=>{const u=await r({plugins:d,request:s,mode:"write"});if(!a)throw new c("cache-put-with-no-response",{url:t(u.url)});const h=await(async({request:e,response:s,event:a,plugins:t=[]})=>{let n=s,c=!1;for(const s of t)if("cacheWillUpdate"in s){c=!0;const t=s.cacheWillUpdate;if(n=await t.call(s,{request:e,response:n,event:a}),!n)break}return c||(n=n&&200===n.status?n:void 0),n||null})({event:n,plugins:d,response:a,request:u});if(!h)return;const b=await self.caches.open(e),p=o(d,"cacheDidUpdate"),w=p.length>0?await f({cacheName:e,matchOptions:l,request:u}):null;try{await b.put(u,h)}catch(e){throw"QuotaExceededError"===e.name&&await async function(){for(const e of i)await e()}(),e}for(const s of p)await s.cacheDidUpdate.call(s,{cacheName:e,event:n,oldResponse:w,newResponse:h,request:u})},l=async({request:e,fetchOptions:s,event:a,plugins:t=[]})=>{if("string"==typeof e&&(e=new Request(e)),a instanceof FetchEvent&&a.preloadResponse){const e=await a.preloadResponse;if(e)return e}const n=o(t,"fetchDidFail"),i=n.length>0?e.clone():null;try{for(const s of t)if("requestWillFetch"in s){const t=s.requestWillFetch,n=e.clone();e=await t.call(s,{request:n,event:a})}}catch(e){throw new c("plugin-error-request-will-fetch",{thrownError:e})}const r=e.clone();try{let n;n="navigate"===e.mode?await fetch(e):await fetch(e,s);for(const e of t)"fetchDidSucceed"in e&&(n=await e.fetchDidSucceed.call(e,{event:a,request:r,response:n}));return n}catch(e){for(const s of n)await s.fetchDidFail.call(s,{error:e,event:a,originalRequest:i.clone(),request:r.clone()});throw e}};let u;async function h(e,s){const a=e.clone(),t={headers:new Headers(a.headers),status:a.status,statusText:a.statusText},n=s?s(t):t,c=function(){if(void 0===u){const e=new Response("");if("body"in e)try{new Response(e.body),u=!0}catch(e){u=!1}u=!1}return u}()?a.body:await a.blob();return new Response(c,n)}try{self["workbox:precaching:5.1.2"]&&_()}catch(e){}function b(e){if(!e)throw new c("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const s=new URL(e,location.href);return{cacheKey:s.href,url:s.href}}const{revision:s,url:a}=e;if(!a)throw new c("add-to-cache-list-unexpected-type",{entry:e});if(!s){const e=new URL(a,location.href);return{cacheKey:e.href,url:e.href}}const t=new URL(a,location.href),n=new URL(a,location.href);return t.searchParams.set("__WB_REVISION__",s),{cacheKey:t.href,url:n.href}}class p{constructor(e){this.s=a(e),this.t=new Map,this.i=new Map,this.o=new Map}addToCacheList(e){const s=[];for(const a of e){"string"==typeof a?s.push(a):a&&void 0===a.revision&&s.push(a.url);const{cacheKey:e,url:t}=b(a),n="string"!=typeof a&&a.revision?"reload":"default";if(this.t.has(t)&&this.t.get(t)!==e)throw new c("add-to-cache-list-conflicting-entries",{firstEntry:this.t.get(t),secondEntry:e});if("string"!=typeof a&&a.integrity){if(this.o.has(e)&&this.o.get(e)!==a.integrity)throw new c("add-to-cache-list-conflicting-integrities",{url:t});this.o.set(e,a.integrity)}if(this.t.set(t,e),this.i.set(t,n),s.length>0){const e="Workbox is precaching URLs without revision "+`info: ${s.join(", ")}\nThis is generally NOT safe. `+"Learn more at https://bit.ly/wb-precache";console.warn(e)}}}async install({event:e,plugins:s}={}){const a=[],t=[],n=await self.caches.open(this.s),c=await n.keys(),i=new Set(c.map(e=>e.url));for(const[e,s]of this.t)i.has(s)?t.push(e):a.push({cacheKey:s,url:e});const o=a.map(({cacheKey:a,url:t})=>{const n=this.o.get(a),c=this.i.get(t);return this.l({cacheKey:a,cacheMode:c,event:e,integrity:n,plugins:s,url:t})});return await Promise.all(o),{updatedURLs:a.map(e=>e.url),notUpdatedURLs:t}}async activate(){const e=await self.caches.open(this.s),s=await e.keys(),a=new Set(this.t.values()),t=[];for(const n of s)a.has(n.url)||(await e.delete(n),t.push(n.url));return{deletedURLs:t}}async l({cacheKey:e,url:s,cacheMode:a,event:t,plugins:n,integrity:i}){const o=new Request(s,{integrity:i,cache:a,credentials:"same-origin"});let r,f=await l({event:t,plugins:n,request:o});for(const e of n||[])"cacheWillUpdate"in e&&(r=e);if(!(r?await r.cacheWillUpdate({event:t,request:o,response:f}):f.status<400))throw new c("bad-precaching-response",{url:s,status:f.status});f.redirected&&(f=await h(f)),await d({event:t,plugins:n,response:f,request:e===s?o:new Request(e),cacheName:this.s,matchOptions:{ignoreSearch:!0}})}getURLsToCacheKeys(){return this.t}getCachedURLs(){return[...this.t.keys()]}getCacheKeyForURL(e){const s=new URL(e,location.href);return this.t.get(s.href)}async matchPrecache(e){const s=e instanceof Request?e.url:e,a=this.getCacheKeyForURL(s);if(a){return(await self.caches.open(this.s)).match(a)}}createHandler(e=!0){return async({request:s})=>{try{const e=await this.matchPrecache(s);if(e)return e;throw new c("missing-precache-entry",{cacheName:this.s,url:s instanceof Request?s.url:s})}catch(a){if(e)return fetch(s);throw a}}}createHandlerBoundToURL(e,s=!0){if(!this.getCacheKeyForURL(e))throw new c("non-precached-url",{url:e});const a=this.createHandler(s),t=new Request(e);return()=>a({request:t})}}let w;const v=()=>(w||(w=new p),w);const g=(e,s)=>{const a=v().getURLsToCacheKeys();for(const t of function*(e,{ignoreURLParametersMatching:s,directoryIndex:a,cleanURLs:t,urlManipulation:n}={}){const c=new URL(e,location.href);c.hash="",yield c.href;const i=function(e,s=[]){for(const a of[...e.searchParams.keys()])s.some(e=>e.test(a))&&e.searchParams.delete(a);return e}(c,s);if(yield i.href,a&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=a,yield e.href}if(t){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(n){const e=n({url:c});for(const s of e)yield s.href}}(e,s)){const e=a.get(t);if(e)return e}};let y=!1;function R(e){y||((({ignoreURLParametersMatching:e=[/^utm_/],directoryIndex:s="index.html",cleanURLs:t=!0,urlManipulation:n}={})=>{const c=a();self.addEventListener("fetch",a=>{const i=g(a.request.url,{cleanURLs:t,directoryIndex:s,ignoreURLParametersMatching:e,urlManipulation:n});if(!i)return;let o=self.caches.open(c).then(e=>e.match(i)).then(e=>e||fetch(i));a.respondWith(o)})})(e),y=!0)}const m=[],j={get:()=>m,add(e){m.push(...e)}},q=e=>{const s=v(),a=j.get();e.waitUntil(s.install({event:e,plugins:a}).catch(e=>{throw e}))},U=e=>{const s=v();e.waitUntil(s.activate())};var L;self.addEventListener("message",e=>{e.data&&"SKIP_WAITING"===e.data.type&&self.skipWaiting()}),L={},function(e){v().addToCacheList(e),e.length>0&&(self.addEventListener("install",q),self.addEventListener("activate",U))}([{url:"assets/a.0dea9028.json",revision:"d3ee4aa856a05727328ce982655d2e94"},{url:"assets/a.0fb79a4b.json",revision:"b20e4d722bccee1de41520bd047ff152"},{url:"assets/a.192ee03a.json",revision:"6add3816968bc67f6c3aa9481b793f34"},{url:"assets/a.19f413ea.json",revision:"3b4e36fc00df8ccf19ac4789217de16b"},{url:"assets/a.232a1bdd.json",revision:"115bfb75ed879fe1593342d80c597fdc"},{url:"assets/a.2555427d.json",revision:"f05a7dc1e85eb3900a1cfbda86765007"},{url:"assets/a.26897b06.json",revision:"c1690a6bd10834e1c28560cea60f3744"},{url:"assets/a.37d3dd8f.json",revision:"f7766de643cfee3c511efc1aedc83473"},{url:"assets/a.392cf909.json",revision:"a71f9c1264c4a93a24bd69ceaf7c749b"},{url:"assets/a.3a1055aa.json",revision:"9c788732271006a1cfc28c58165f228d"},{url:"assets/a.3eac0367.json",revision:"db291e9819b554930d1dd9ed39ca0d21"},{url:"assets/a.4649ce6a.json",revision:"22aac46033708aaad16f75bb468fa892"},{url:"assets/a.498b686d.json",revision:"2f119bb998defbcc797bc40441442142"},{url:"assets/a.553eb86b.json",revision:"3222e1a37b219b849af20aa268339469"},{url:"assets/a.5eb3b0a8.json",revision:"6d28ff0e03660c83ef2dc0c5719e4cb7"},{url:"assets/a.6895d449.json",revision:"59dcb40ffc035a08d6a549adcee05fd2"},{url:"assets/a.790c827c.json",revision:"24d3d2e1c89e2e47d4ff6399fc495d73"},{url:"assets/a.7ba660a3.json",revision:"0181ae8a086e3366b582178b2711c090"},{url:"assets/a.86aea29b.json",revision:"2d15e619aa97fdb6c1590e423f8b78bb"},{url:"assets/a.8c56cf79.json",revision:"05f1a617ef885400a6754a5118a9c1ed"},{url:"assets/a.8e142ab0.json",revision:"bfedaf1e50ca95f9e99b98991b2b92be"},{url:"assets/a.994942e3.json",revision:"b198e87194faa0d01dda1b967b0f07ef"},{url:"assets/a.9a7a5d5a.json",revision:"853dfcc3d237afe9dd77d145493b7889"},{url:"assets/a.a6a8b35f.json",revision:"12c88b82486a6231e8c2828c9a98ed1c"},{url:"assets/a.ad1a03e5.json",revision:"17744804fd75c0d4a40627a84a56800d"},{url:"assets/a.b0e49197.json",revision:"0885dc384121db51d8b710b178c8a17c"},{url:"assets/a.cb69cc53.json",revision:"9e0e35613afe2fe835766072ae6b4da4"},{url:"assets/a.cce04acc.json",revision:"8a7dcee315f00d57877abaf2cc007f9f"},{url:"assets/a.ce2c3571.json",revision:"4bb3caa87cc9bf3077c05a0f4f4a3a35"},{url:"assets/a.d397cd54.json",revision:"9d8192b936cc8aa225313a429ff435ae"},{url:"assets/a.dcafa4dc.json",revision:"76528d80e8e2a0040829a39621999637"},{url:"assets/a.edf41136.json",revision:"beadb5f83f42a497091b66845c1752e7"},{url:"assets/a.fa592bbe.json",revision:"449fc684c553b4197c1fd914f7a2a8f8"},{url:"assets/content_pages_searchIndexes.en.efce695a.json",revision:"205eb0a870f7f9f988d690533e169474"},{url:"assets/content_pages_summaries.en.be651775.json",revision:"a5bf64555f520a19854a0f36f3781a90"},{url:"app-icons/android-chrome-192x192.png",revision:"0b18304dea12cc8d59c9528a00d37ee8"},{url:"app-icons/android-chrome-256x256.png",revision:"8da8a7602d1cc4d21a70445eda7e8e62"},{url:"app-icons/apple-touch-icon.png",revision:"e2be3ed5414bed313d9219504bd7224f"},{url:"app-icons/favicon-16x16.png",revision:"c72946f88111cb426093e6bdb63fa70b"},{url:"app-icons/favicon-32x32.png",revision:"e53028dac3ae19a1ebd8c2ed0a0772a8"},{url:"app-icons/favicon.ico",revision:"bc4c3c662b5614ee2e63ac9bd79cafa4"},{url:"app-icons/mstile-150x150.png",revision:"ffd33ced9004c319a6743d79a61d23c3"},{url:"app-icons/safari-pinned-tab.svg",revision:"1171db203c6305482c696d3f702c83f6"},{url:"manifest.json",revision:"9a2195c0c368b7ae215a188a95ff7f26"},{url:"index.html",revision:"92176bf77816f08c2054cfa558b6ac1e"},{url:"bootstrap.01b67ab2.js",revision:"fd1086bab322181b8e26a6d564630668"}]),R(L),self.addEventListener("activate",e=>{const s=a();e.waitUntil((async(e,s="-precache-")=>{const a=(await self.caches.keys()).filter(a=>a.includes(s)&&a.includes(self.registration.scope)&&a!==e);return await Promise.all(a.map(e=>self.caches.delete(e))),a})(s).then(e=>{}))});
//# sourceMappingURL=sw.js.map
