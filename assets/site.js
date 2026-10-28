document.documentElement.classList.add('js');
document.addEventListener('DOMContentLoaded',function(){
 var WA='2347088654508',d=document,calm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 /* scroll reveal: a scroll handler, not IntersectionObserver (fast flings leave gaps with observers) */
 var rv=[].slice.call(d.querySelectorAll('.rv')),ticking=false,lastY=window.pageYOffset||0;
 function reveal(){ticking=false;var y=window.pageYOffset||0,jump=Math.abs(y-lastY)>innerHeight*0.8;lastY=y;rv=rv.filter(function(el){var r=el.getBoundingClientRect();if(r.top<innerHeight*0.94){if(jump)el.classList.add('fast');el.classList.add('in');return false}return true})}
 /* the tide: the route line fills as you scroll through chapter 1 (used once) */
 var route=d.getElementById('route');
 function tide(){if(!route)return;if(calm){route.style.setProperty('--p',1);return}var r=route.getBoundingClientRect(),p=(innerHeight*0.66-r.top)/r.height;route.style.setProperty('--p',Math.max(0.04,Math.min(1,p)).toFixed(3))}
 /* which chapter is on screen: lights the thumb rail and the top links */
 var secs=['find','enter','book'].map(function(id){return d.getElementById(id)}).filter(Boolean),links=[].slice.call(d.querySelectorAll('[data-sec]'));
 function spy(){var cur='';secs.forEach(function(s){if(s.getBoundingClientRect().top<innerHeight*0.45)cur=s.id});links.forEach(function(a){a.classList.toggle('on',a.getAttribute('data-sec')===cur)})}
 function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(function(){reveal();tide();spy()})}}
 var endT=null;window.addEventListener('scroll',function(){onScroll();clearTimeout(endT);endT=setTimeout(function(){reveal();tide();spy()},120)},{passive:true});
 window.addEventListener('resize',onScroll);window.addEventListener('load',onScroll);reveal();tide();spy();setTimeout(reveal,300);
 /* choose your day: three lanes reshape the booking panel (opacity only) */
 var tabs=[].slice.call(d.querySelectorAll('.tabs button')),lanes=[].slice.call(d.querySelectorAll('.lane')),form=d.querySelector('form.book');
 function setLane(l){
  tabs.forEach(function(b){b.setAttribute('aria-selected',b.getAttribute('data-lane')===l)});
  lanes.forEach(function(p){p.classList.toggle('on',p.getAttribute('data-lane')===l)});
  if(form){form.querySelector('[name=kind]').value=l;var n=form.querySelector('.nights'),e=form.querySelector('.evnote');if(n)n.classList.toggle('on',l==='room');if(e)e.classList.toggle('on',l==='event');
   form.querySelector('.kindname').textContent={day:'a day visit',room:'a room for the night',event:'an event or a group day'}[l]}
 }
 tabs.forEach(function(b){b.addEventListener('click',function(){setLane(b.getAttribute('data-lane'))})});
 [].forEach.call(d.querySelectorAll('a[data-lane]'),function(a){a.addEventListener('click',function(){setLane(a.getAttribute('data-lane'))})});
 if(tabs.length)setLane((form&&form.getAttribute('data-start'))||'day');
 /* booking form -> ready-written WhatsApp message */
 var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
 function nice(v){var p=v.split('-');if(p.length!==3)return v;var x=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));return DAYS[x.getUTCDay()]+' '+(+p[2])+' '+MON[+p[1]-1]+' '+p[0]}
 var today=new Date(Date.now()+3600000).toISOString().slice(0,10);
 if(form){var date=form.querySelector('[name=date]'),err=form.querySelector('.ferr');if(date)date.min=today;
  if(!tabs.length){var k0=form.getAttribute('data-start')||'day';form.querySelector('[name=kind]').value=k0;var n0=form.querySelector('.nights');if(n0)n0.classList.toggle('on',k0==='room');var kn=form.querySelector('.kindname');if(kn)kn.textContent={day:'a day visit',room:'a room for the night',event:'an event or a group day'}[k0]}
  form.addEventListener('submit',function(e){e.preventDefault();
   var dv=date.value,nm=(form.querySelector('[name=name]').value||'').trim();
   if(!dv||!nm){err.textContent=!dv?'Please pick the day you want to come.':'Please type your name.';err.classList.add('show');(!dv?date:form.querySelector('[name=name]')).focus();return}
   err.classList.remove('show');
   var k=form.querySelector('[name=kind]').value,ad=form.querySelector('[name=adults]').value||'1',ch=form.querySelector('[name=children]').value||'0',nt=form.querySelector('[name=nights]'),note=(form.querySelector('[name=note]')||{}).value||'';
   var what=k==='room'?('a room for '+((nt&&nt.value)||'1')+' night(s), arriving on '+nice(dv)):(k==='event'?('an event or a group day on '+nice(dv)):('a day visit on '+nice(dv)));
   var msg='Hello Barracuda Beach Resort. I would like to '+(k==='event'?'ask about ':'book ')+what+'. Adults: '+ad+'. Children: '+ch+'.'+(k==='event'&&note?' What I have in mind: '+note.trim()+'.':'')+' My name is '+nm+'. Please tell me if that day is open and what it costs. Thank you.';
   var url='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);var w=window.open(url,'_blank','noopener');if(!w){location.href=url}})}
 /* copy the words to tell a driver */
 var cp=d.getElementById('copySay');
 if(cp){cp.addEventListener('click',function(){var t=d.getElementById('sayText').textContent;
  function done(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy'},2200)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){cp.textContent='Press and hold the words'})}else{cp.textContent='Press and hold the words'}})}
});
