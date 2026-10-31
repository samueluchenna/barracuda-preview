/* Barracuda v5 "The Wall". Nothing in this file moves the page: no scrollTo, no scrollIntoView, no hash links, no smooth scroll.
   Booking, directions and the share card open as sheets in place; a tap changes what is on a sheet, never where the page is. */
document.addEventListener('DOMContentLoaded',function(){
 var d=document,root=d.documentElement,WA='2347088654508',PH='0708 865 4508';
 var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
 function pad(n){return n<10?'0'+n:''+n}
 function isoOf(x){return x.getFullYear()+'-'+pad(x.getMonth()+1)+'-'+pad(x.getDate())}
 function parts(v){var p=(v||'').split('-');return p.length===3?{y:+p[0],m:+p[1]-1,d:+p[2],wd:new Date(Date.UTC(+p[0],+p[1]-1,+p[2])).getUTCDay()}:null}
 function nice(v){var p=parts(v);return p?DAYS[p.wd]+' '+p.d+' '+MON[p.m]+' '+p.y:v}
 /* open WhatsApp in a new tab with a real link click (window.open with noopener always returns null, which used to navigate this page too); same=true for the location case, where the permission prompt outlasts the tap */
 function go(url,same){if(same){location.href=url;return}var a=d.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.style.display='none';d.body.appendChild(a);a.click();a.remove()}

 /* sheets (native dialog) */
 var sheets={};
 function shut(dl){root.classList.remove('locked');if(dl.close)dl.close();else dl.removeAttribute('open')}
 [].forEach.call(d.querySelectorAll('dialog.sheet'),function(dl){
  sheets[dl.getAttribute('data-sheet')]=dl;
  dl.addEventListener('close',function(){root.classList.remove('locked')});
  dl.addEventListener('click',function(e){if(e.target===dl)shut(dl)});
  [].forEach.call(dl.querySelectorAll('[data-close]'),function(b){b.addEventListener('click',function(){shut(dl)})});
 });
 function openSheet(name){var dl=sheets[name];if(!dl)return;root.classList.add('locked');
  [].forEach.call(dl.querySelectorAll('.route'),function(r){r.classList.add('in')});
  if(dl.showModal){if(!dl.open)dl.showModal()}else{dl.setAttribute('open','')}
  if(name==='share')drawAll()}

 /* booking sheet: tabs reshape the form (day visit, room, event) */
 var bk=sheets.book,form=bk&&bk.querySelector('form.book'),tabs=bk?[].slice.call(bk.querySelectorAll('.tabs button')):[],lanes=bk?[].slice.call(bk.querySelectorAll('.lane')):[];
 function setLane(l){
  if(!form)return;
  tabs.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-lane')===l?'true':'false')});
  lanes.forEach(function(p){p.classList.toggle('on',p.getAttribute('data-lane')===l)});
  form.querySelector('[name=kind]').value=l;
  var n=form.querySelector('.nights'),e=form.querySelector('.evnote');
  if(n)n.classList.toggle('on',l==='room');if(e)e.classList.toggle('on',l==='event');
 }
 tabs.forEach(function(b){b.addEventListener('click',function(){setLane(b.getAttribute('data-lane'))})});
 [].forEach.call(d.querySelectorAll('[data-open]'),function(el){el.addEventListener('click',function(ev){
  ev.preventDefault();var lane=el.getAttribute('data-lane');if(lane)setLane(lane);openSheet(el.getAttribute('data-open'))})});
 setLane('day');
 var minDay=new Date(Date.now()+3600000).toISOString().slice(0,10);

 /* booking form -> a ready-written WhatsApp message (no payment on the site) */
 if(form){
  var date=form.querySelector('[name=date]'),err=form.querySelector('.ferr');
  if(date)date.min=minDay;
  form.addEventListener('submit',function(e){e.preventDefault();
   var dv=date.value,nm=(form.querySelector('[name=name]').value||'').trim();
   if(!dv||!nm){err.textContent=!dv?'Please pick the day you want to come.':'Please type your name.';err.classList.add('show');(!dv?date:form.querySelector('[name=name]')).focus();return}
   err.classList.remove('show');
   var k=form.querySelector('[name=kind]').value,ad=form.querySelector('[name=adults]').value||'1',ch=form.querySelector('[name=children]').value||'0',nt=form.querySelector('[name=nights]'),note=(form.querySelector('[name=note]')||{}).value||'';
   var what=k==='room'?('a room for '+((nt&&nt.value)||'1')+' night(s), arriving on '+nice(dv)):(k==='event'?('an event or a group day on '+nice(dv)):('a day visit on '+nice(dv)));
   var msg='Hello Barracuda Beach Resort. I would like to '+(k==='event'?'ask about ':'book ')+what+'. Adults: '+ad+'. Children: '+ch+'.'+(k==='event'&&note?' What I have in mind: '+note.trim()+'.':'')+' My name is '+nm+'. Please tell me if that day is open and what it costs. Thank you.';
   go('https://wa.me/'+WA+'?text='+encodeURIComponent(msg));});
 }

 /* copy the words to tell a driver */
 [].forEach.call(d.querySelectorAll('.copySay'),function(cp){cp.addEventListener('click',function(){
  var t=cp.parentNode.querySelector('.sayText').textContent;
  function done(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy'},2200)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){cp.textContent='Press and hold the words'})}else{cp.textContent='Press and hold the words'}})});

 /* send my location on WhatsApp (asked for only when the guest taps; nothing is stored or sent anywhere else) */
 var BASE='Hello Barracuda Beach Resort. I am on my way and I want to be sure I am at the right beach.';
 [].forEach.call(d.querySelectorAll('[data-loc]'),function(b){b.addEventListener('click',function(){
  var label=b.innerHTML;
  function out(t){b.disabled=false;b.innerHTML=label;go('https://wa.me/'+WA+'?text='+encodeURIComponent(t),true)}
  if(!navigator.geolocation){out(BASE+' Please help me find the gate.');return}
  b.disabled=true;b.textContent='Finding where you are...';
  navigator.geolocation.getCurrentPosition(function(p){out(BASE+' My location: https://maps.google.com/?q='+p.coords.latitude.toFixed(5)+','+p.coords.longitude.toFixed(5))},
   function(){out(BASE+' I could not share my location. Please help me find the gate.')},{enableHighAccuracy:true,timeout:9000,maximumAge:60000});
 })});

 /* skip link: a button, not a # link, so nothing is ever a hash jump; it moves keyboard focus into the page and scrolls nothing */
 var skip=d.querySelector('.skip'),mainEl=d.getElementById('main');
 if(skip&&mainEl)skip.addEventListener('click',function(){mainEl.focus({preventScroll:true})});

 /* the share-a-day card: drawn on a canvas in the browser, nothing is uploaded */
 var SITE='https://samueluchenna.github.io/barracuda-preview/',SHOW='samueluchenna.github.io/barracuda-preview',QR=["111111101011111001101110001111111", "100000101011011000110010001000001", "101110101001011000010100001011101", "101110100001001110101100101011101", "101110101101010110000010001011101", "100000100111100110010001101000001", "111111101010101010101010101111111", "000000000110110110100001100000000", "100111111001101011000000110010111", "101111011010111111110001000011100", "011110100000110100001011011011111", "100001011110010110111011010100101", "001100110011110101001001001000011", "100011000101001000111001010100100", "100100101100110101010100101001100", "110111010111010010001000110011101", "101110101100000100001011011110000", "000010010111111101111110011010101", "010110100100011101111111001101101", "110110001000100010000010011011100", "010011111010010110100001000101001", "101101011001100001001011000110100", "100100101110001001100001001001011", "100000010011101101011001011010101", "110101101010101000001000111110011", "000000001010111111000000100010110", "111111101101001111011101101010110", "100000101011110011100001100011110", "101110101000101011001011111110010", "101110101111110011110100110101111", "101110100010011101010111110111011", "100000100111101000100000011111111", "111111101010110111010000100110000"];
 var heroImg=new Image(),logoImg=new Image();heroImg.src='assets/img5/hero-828.webp';logoImg.src='assets/logo-barracuda-320.webp';
 function nextSat(){var x=new Date();x.setDate(x.getDate()+((6-x.getDay()+7)%7||7));return isoOf(x)}
 function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
 function paintWord(c,txt,cx,y,size,rot){
  c.font='900 '+size+'px Unbounded,Arial,sans-serif';c.textBaseline='alphabetic';c.lineJoin='round';
  var w=0,ws=[];for(var i=0;i<txt.length;i++){var m=c.measureText(txt[i]).width+size*.01;ws.push(m);w+=m}
  var x=cx-w/2;
  [[7,16,'#14509e',true],[0,0,'#0a1c28',true],[0,0,'#ffc61a',false]].forEach(function(p){
   var xx=x;for(var i=0;i<txt.length;i++){c.save();c.translate(xx+ws[i]/2+p[0],y+p[1]);c.rotate(rot[i%rot.length]*Math.PI/180);
    if(p[3]){c.lineWidth=size*.2;c.strokeStyle=p[2];c.strokeText(txt[i],-ws[i]/2,0)}else{c.fillStyle=p[2];c.fillText(txt[i],-ws[i]/2,0)}
    c.restore();xx+=ws[i]}});
 }
 function drawCard(c,iso,n){
  var W=1080,H=1350,x=c.getContext('2d');if(c.width!==W){c.width=W;c.height=H}
  x.clearRect(0,0,W,H);x.fillStyle='#06283a';x.fillRect(0,0,W,H);
  if(heroImg.complete&&heroImg.naturalWidth){var s=Math.max(W/heroImg.naturalWidth,720/heroImg.naturalHeight),iw=W/s,ih=720/s,sx=(heroImg.naturalWidth-iw)*.48;x.drawImage(heroImg,sx,0,iw,ih,0,0,W,720)}
  var g=x.createLinearGradient(0,340,0,720);g.addColorStop(0,'rgba(6,40,58,0)');g.addColorStop(1,'rgba(6,40,58,.7)');x.fillStyle=g;x.fillRect(0,0,W,720);
  if(logoImg.complete&&logoImg.naturalWidth){x.save();x.beginPath();x.arc(120,120,78,0,7);x.closePath();x.fillStyle='#fff';x.fill();x.clip();x.drawImage(logoImg,48,48,144,144);x.restore()}
  paintWord(x,'BARRACUDA',W/2,515,100,[-3,2,-1.5,3,-2,1.5,-2.5,2,-1]);paintWord(x,'BEACH',W/2+60,632,100,[2,-2.5,1.5,-1.5,3]);
  x.fillStyle='#06283a';rr(x,0,690,W,H-690+80,56);x.fill();
  var cols=['#d62d2a','#ffc61a','#14833d','#1766b8'];for(var i=0,fx=26;fx<W;i++,fx+=96){x.fillStyle=cols[i%4];x.beginPath();x.moveTo(fx,664);x.lineTo(fx+54,664);x.lineTo(fx+27,730);x.closePath();x.fill()}
  var p=parts(iso),dateTxt=p?DAYS[p.wd]+' '+p.d+' '+MON[p.m]:'Pick a day',yr=p?String(p.y):'';
  x.textAlign='center';x.fillStyle='#1fc8dc';x.font='700 34px Unbounded,Arial,sans-serif';x.fillText('BEACH DAY',W/2,790);
  var fs=66;x.font='800 '+fs+'px Unbounded,Arial,sans-serif';while(x.measureText(dateTxt).width>960&&fs>36){fs-=2;x.font='800 '+fs+'px Unbounded,Arial,sans-serif'}
  x.fillStyle='#fff';x.fillText(dateTxt,W/2,875);
  x.fillStyle='#9fc4d4';x.font='700 40px "Hanken Grotesk",Arial,sans-serif';x.fillText(yr,W/2,925);
  x.fillStyle='#ffc61a';rr(x,W/2-250,960,500,100,50);x.fill();x.fillStyle='#0b1d2a';x.font='800 50px Unbounded,Arial,sans-serif';x.fillText(n===1?'Just me':n+' of us',W/2,1028);
  /* bottom band: the QR code of the web address on the left, where and how to ask on the right */
  var N=QR.length,m=Math.floor(200/N),qz=m*3,box=N*m+2*qz,bx=64,by=1096;
  x.fillStyle='#fff';rr(x,bx,by,box,box,20);x.fill();x.fillStyle='#0a1c28';
  for(var r=0;r<N;r++)for(var c2=0;c2<N;c2++)if(QR[r].charAt(c2)==='1')x.fillRect(bx+qz+c2*m,by+qz+r*m,m,m);
  var tx=bx+box+36,tw=W-64-tx;x.textAlign='left';
  x.fillStyle='#fff';x.font='700 40px "Hanken Grotesk",Arial,sans-serif';x.fillText('Okun Ajah, Lagos',tx,1150);
  var us=28;x.font='700 '+us+'px "Hanken Grotesk",Arial,sans-serif';while(x.measureText(SHOW).width>tw&&us>16){us-=1;x.font='700 '+us+'px "Hanken Grotesk",Arial,sans-serif'}
  x.fillStyle='#1fc8dc';x.fillText(SHOW,tx,1200);
  x.fillStyle='#12783f';rr(x,tx,1222,tw,68,34);x.fill();x.fillStyle='#fff';x.font='700 30px "Hanken Grotesk",Arial,sans-serif';x.textAlign='center';x.fillText('Ask the fee on WhatsApp: '+PH,tx+tw/2,1267);
  x.textAlign='left';x.fillStyle='#9fc4d4';x.font='500 24px "Hanken Grotesk",Arial,sans-serif';x.fillText('Scan the code. The resort confirms the day.',tx,1324);
  x.textAlign='start';
 }
 var sd=d.getElementById('s-date'),sn=d.getElementById('s-n'),big=d.getElementById('cardbig'),prev=d.querySelector('canvas.cardprev');
 var fontsReady=null;
 function fonts(){if(!fontsReady){fontsReady=d.fonts&&d.fonts.load?Promise.all([d.fonts.load('900 60px Unbounded'),d.fonts.load('800 60px Unbounded'),d.fonts.load('700 40px "Hanken Grotesk"'),d.fonts.load('500 26px "Hanken Grotesk"')]).catch(function(){}):Promise.resolve()}return fontsReady}
 function nVal(){var n=parseInt(sn&&sn.value,10);return n>0?Math.min(n,500):1}
 function drawAll(){fonts().then(function(){var iso=(sd&&sd.value)||nextSat();if(big)drawCard(big,iso,nVal())})}
 if(sd){sd.min=minDay;sd.value=nextSat();sd.addEventListener('input',drawAll)}
 if(sn)sn.addEventListener('input',drawAll);
 if(prev){fonts().then(function(){var go2=function(){drawCard(prev,nextSat(),6)};if(heroImg.complete)go2();else heroImg.onload=go2})}
 heroImg.onload=function(){if(prev)drawCard(prev,nextSat(),6);if(big&&sheets.share&&sheets.share.open)drawAll()};
 function shareMsg(){var iso=(sd&&sd.value)||nextSat();return 'Hello Barracuda Beach Resort. We would like to come on '+nice(iso)+'. There are '+nVal()+' of us. Please tell me if that day is open and what the fee is. Thank you.'}
 var wab=d.getElementById('s-wa');if(wab)wab.addEventListener('click',function(e){e.preventDefault();go('https://wa.me/'+WA+'?text='+encodeURIComponent(shareMsg()))});
 function blobOf(){return new Promise(function(r){big.toBlob(r,'image/jpeg',0.9)})}
 var sv=d.getElementById('s-save'),sh=d.getElementById('s-share');
 if(sv)sv.addEventListener('click',function(){fonts().then(function(){drawAll();return blobOf()}).then(function(b){var u=URL.createObjectURL(b),a=d.createElement('a');a.href=u;a.download='barracuda-beach-day.jpg';d.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},4000)})});
 if(sh){if(!(navigator.share&&navigator.canShare))sh.style.display='none';
  sh.addEventListener('click',function(){blobOf().then(function(b){var f=new File([b],'barracuda-beach-day.jpg',{type:'image/jpeg'});
   if(navigator.canShare({files:[f]}))return navigator.share({files:[f],text:'Come to the beach with us. Barracuda Beach, Okun Ajah. '+SITE});
   sv.click()}).catch(function(){})})}

 /* the resort's own room videos: nothing is loaded from YouTube until a guest taps play (youtube-nocookie player) */
 [].forEach.call(d.querySelectorAll('[data-yt]'),function(b){b.addEventListener('click',function(ev){
  ev.preventDefault();var f=d.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+b.getAttribute('data-yt')+'?autoplay=1&rel=0&modestbranding=1&playsinline=1';
  f.title=b.getAttribute('data-title')+', a video from the resort';f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';f.setAttribute('allowfullscreen','');f.referrerPolicy='strict-origin-when-cross-origin';
  b.parentNode.replaceChild(f,b)})});

 /* the day: the clock on the side follows the stop in view; the route line draws itself once. Opacity and transform only. */
 var stops=[].slice.call(d.querySelectorAll('.stop[data-stop]')),routes=[].slice.call(d.querySelectorAll('.route'));
 if('IntersectionObserver' in window){
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){d.body.setAttribute('data-stop',e.target.getAttribute('data-stop'));e.target.classList.add('in')}})},{rootMargin:'-45% 0px -45% 0px'});
  stops.forEach(function(s){io.observe(s)});
  var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.3});
  routes.forEach(function(r){if(!r.closest('dialog'))ro.observe(r)});
 }else{stops.forEach(function(s){s.classList.add('in')});routes.forEach(function(r){r.classList.add('in')})}
});
