/* Barracuda v3. Nothing in this file moves the page: no scrollTo, no scrollIntoView, no hash links, no smooth scroll.
   Booking and directions open as sheets in place; a tap changes what is on a sheet, never where the page is. */
document.addEventListener('DOMContentLoaded',function(){
 var d=document,root=d.documentElement,WA='2347088654508';
 /* sheets (native dialog) */
 var sheets={};
 function shut(dl){root.classList.remove('locked');if(dl.close)dl.close();else dl.removeAttribute('open')}
 [].forEach.call(d.querySelectorAll('dialog.sheet'),function(dl){
  sheets[dl.getAttribute('data-sheet')]=dl;
  dl.addEventListener('close',function(){root.classList.remove('locked')});
  dl.addEventListener('click',function(e){if(e.target===dl)shut(dl)});
  [].forEach.call(dl.querySelectorAll('[data-close]'),function(b){b.addEventListener('click',function(){shut(dl)})});
 });
 function openSheet(name){var dl=sheets[name];if(!dl)return;root.classList.add('locked');if(dl.showModal){if(!dl.open)dl.showModal()}else{dl.setAttribute('open','')}}
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
 /* booking form -> a ready-written WhatsApp message (no payment on the site) */
 var DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],MON=['January','February','March','April','May','June','July','August','September','October','November','December'];
 function nice(v){var p=v.split('-');if(p.length!==3)return v;var x=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));return DAYS[x.getUTCDay()]+' '+(+p[2])+' '+MON[+p[1]-1]+' '+p[0]}
 if(form){
  var date=form.querySelector('[name=date]'),err=form.querySelector('.ferr');
  if(date)date.min=new Date(Date.now()+3600000).toISOString().slice(0,10);
  form.addEventListener('submit',function(e){e.preventDefault();
   var dv=date.value,nm=(form.querySelector('[name=name]').value||'').trim();
   if(!dv||!nm){err.textContent=!dv?'Please pick the day you want to come.':'Please type your name.';err.classList.add('show');(!dv?date:form.querySelector('[name=name]')).focus();return}
   err.classList.remove('show');
   var k=form.querySelector('[name=kind]').value,ad=form.querySelector('[name=adults]').value||'1',ch=form.querySelector('[name=children]').value||'0',nt=form.querySelector('[name=nights]'),note=(form.querySelector('[name=note]')||{}).value||'';
   var what=k==='room'?('a room for '+((nt&&nt.value)||'1')+' night(s), arriving on '+nice(dv)):(k==='event'?('an event or a group day on '+nice(dv)):('a day visit on '+nice(dv)));
   var msg='Hello Barracuda Beach Resort. I would like to '+(k==='event'?'ask about ':'book ')+what+'. Adults: '+ad+'. Children: '+ch+'.'+(k==='event'&&note?' What I have in mind: '+note.trim()+'.':'')+' My name is '+nm+'. Please tell me if that day is open and what it costs. Thank you.';
   var url='https://wa.me/'+WA+'?text='+encodeURIComponent(msg);var w=window.open(url,'_blank','noopener');if(!w){location.href=url}});
 }
 /* copy the words to tell a driver (every copy button on the page) */
 [].forEach.call(d.querySelectorAll('.copySay'),function(cp){cp.addEventListener('click',function(){
  var t=cp.parentNode.querySelector('.sayText').textContent;
  function done(){cp.textContent='Copied';setTimeout(function(){cp.textContent='Copy'},2200)}
  if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t).then(done,function(){cp.textContent='Press and hold the words'})}else{cp.textContent='Press and hold the words'}})});
});
