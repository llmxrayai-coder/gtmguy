const menu=document.querySelector('.menu-toggle');menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');menu.textContent=open?'Close ×':'Menu +';document.querySelector('#main-nav').classList.toggle('open',open)});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true')menu.click()});
for(const form of document.querySelectorAll('.lead-form')){const started=Date.now();let requestId=crypto.randomUUID();form.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;const button=form.querySelector('button[type=submit]'),status=form.querySelector('.form-status');button.disabled=true;status.className='form-status';status.textContent='Sending your details…';const values=Object.fromEntries(new FormData(form));values.consent=values.consent==='on';values.recording=values.recording==='on';values.started=started;values.id=requestId;try{const res=await fetch('/api/submissions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(values)});let result;try{result=await res.json()}catch{throw Error('Could not reach the form service. Please try again or email srichardroshan@gmail.com.')}if(!res.ok)throw Error(result.error||'Unable to save your inquiry. Please try again.');status.className='form-status success';status.textContent=form.dataset.kind==='series'?'Your application is saved. Richard can review it and contact you at the email you provided.':'Your project inquiry is saved. Richard can review your details and get in touch.';form.reset();requestId=crypto.randomUUID()}catch(err){status.className='form-status error';status.textContent=err.message+' Your entries have been kept.'}finally{button.disabled=false}})}

// Progressive motion: content and navigation work without animation support.
(()=>{
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false;try{paused=localStorage.getItem('gtm-motion')==='off'}catch{}
 const root=document.documentElement;
 const control=document.createElement('button');control.type='button';control.className='motion-control';document.body.append(control);
 // Cancel running effects safely, including infinite decorative effects.
 const stop=()=>document.getAnimations().forEach(a=>{try{a.finish()}catch{a.cancel()}});
 const update=()=>{const off=paused||reduced.matches;root.dataset.motion=off?'off':'on';control.textContent=off?'Motion off':'Pause motion';control.setAttribute('aria-label',reduced.matches?'Animations disabled by your device’s reduced-motion setting':off?'Enable website animations':'Pause website animations');control.setAttribute('aria-pressed',String(!off));control.disabled=reduced.matches;if(off)stop()};
 control.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('gtm-motion',paused?'off':'on')}catch{}update()});reduced.addEventListener('change',update);update();
 const ribbon=document.querySelector('.ribbon');
 if(ribbon){ribbon.setAttribute('aria-hidden','true');const original=ribbon.firstElementChild;const track=document.createElement('div');track.className='ribbon-track';original.className='ribbon-copy';ribbon.replaceChildren(track);track.append(original,original.cloneNode(true));}
 if(!('IntersectionObserver' in window)||!Element.prototype.animate)return;
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);if(root.dataset.motion==='off')continue;const el=entry.target;const siblings=[...el.parentElement.children];const index=Math.max(0,siblings.indexOf(el));const stagger=el.matches('.service-card,.proof-grid article,.journal-topics article,.toolkit article')?Math.min(index*90,240):0;el.animate([{opacity:.12,transform:'translateY(30px)'},{opacity:1,transform:'translateY(0)'}],{duration:700,delay:stagger,easing:'cubic-bezier(.2,.75,.2,1)',fill:'backwards'});}}, {threshold:.08,rootMargin:'0px 0px -25px 0px'});
 document.querySelectorAll('.section-heading,.service-card,.proof-grid article,.work-teaser>div,.series-block>div,.building-teaser>div,.closing,.jobs article,.journal-topics article,.toolkit article,.service-detail>div,.about-grid>div,.leadership-list article,.recognition,.form-section>div,.lead-form,.journal-note,.empty-panel,.episode-empty,.feature-copy,.screenshot-stack,.case-intro,.case-metrics,.case-chapter').forEach(el=>observer.observe(el));
})();

// Short, dismissible first-visit intro; navigation never depends on it.
(()=>{
 const root=document.documentElement, intro=document.querySelector('.race-intro');
 if(intro){
  let seen=false;try{seen=sessionStorage.getItem('career-intro')==='seen'}catch{}
  if(!seen&&root.dataset.motion!=='off'){
   intro.hidden=false;
   const skip=intro.querySelector('button');skip.focus({preventScroll:true});
   let done=false;
   const finish=()=>{if(done)return;done=true;intro.hidden=true;try{sessionStorage.setItem('career-intro','seen')}catch{}if(document.activeElement===skip){const target=document.querySelector('.racing-hero h1');target?.setAttribute('tabindex','-1');target?.focus({preventScroll:true});}};
   skip.addEventListener('click',finish);document.addEventListener('keydown',e=>{if(e.key==='Escape')finish()});
   // A tab press exits the intro instead of trapping the visitor.
   skip.addEventListener('keydown',e=>{if(e.key==='Tab')finish()});
   new MutationObserver(()=>{if(root.dataset.motion==='off')finish()}).observe(root,{attributes:true,attributeFilter:['data-motion']});
   setTimeout(finish,1800);
  }
 }
 const progress=document.querySelector('.reading-progress');let pending=false;
 const update=()=>{const height=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${height>0?Math.min(1,Math.max(0,scrollY/height)):0})`;pending=false};
 if(progress){addEventListener('scroll',()=>{if(!pending){pending=true;requestAnimationFrame(update)}},{passive:true});addEventListener('resize',update);update()}
 document.querySelectorAll('#main-nav a').forEach(a=>a.addEventListener('click',()=>{if(menu?.getAttribute('aria-expanded')==='true')menu.click()}));
})();

// The real homepage replaces the generated screen during the camera push.
(()=>{
 const overlay=document.querySelector('.film-intro');if(!overlay)return;
 const video=overlay.querySelector('video'),skip=overlay.querySelector('.cockpit-skip'),replay=document.querySelector('.replay-intro'),surface=document.querySelector('#portfolio-surface');
 const off=()=>document.documentElement.dataset.motion==='off'||matchMedia('(prefers-reduced-motion: reduce)').matches;
 let active=false,frame=0,timer=0,previous=null,merging=false;
 const siblings=[...document.body.children].filter(x=>x!==overlay&&x.tagName!=='SCRIPT');
 const finish=()=>{if(!active)return;active=false;clearTimeout(timer);cancelAnimationFrame(frame);video.pause();video.muted=true;overlay.hidden=true;overlay.style.opacity='';surface.style.removeProperty('--portal-scale');surface.style.removeProperty('--portal-opacity');document.body.classList.remove('intro-active','portal-active');siblings.forEach(x=>{if(x.dataset.filmInert==='set'){x.inert=false;delete x.dataset.filmInert}});if(previous&&previous!==document.body)previous.focus({preventScroll:true});else{const h=document.querySelector('.hero-intro h1');h?.setAttribute('tabindex','-1');h?.focus({preventScroll:true})}};
 const tick=()=>{
  if(!active)return;
  const t=video.currentTime;
  if(t>=6.16){
   if(off()){finish();return}
   if(!merging){merging=true;document.body.classList.add('portal-active');scrollTo({top:0,behavior:'instant'})}
   const p=Math.min(1,Math.max(0,(t-6.16)/1.55)),ease=1-Math.pow(1-p,2.2);
   surface.style.setProperty('--portal-scale',String(.095+.905*ease));
   surface.style.setProperty('--portal-opacity',String(Math.min(1,(t-6.16)/.10)));
   overlay.style.opacity=String(1-Math.max(0,(p-.58)/.42));
   if(!video.muted)video.volume=.65*(1-Math.max(0,(p-.45)/.55));
   if(p>=1){finish();return}
  }
  frame=requestAnimationFrame(tick);
 };
 const start=(manual=false)=>{
  if(active||(!manual&&off()))return;
  previous=document.activeElement;merging=false;active=true;overlay.hidden=false;overlay.classList.toggle('manual-play',manual);document.body.classList.add('intro-active');
  siblings.forEach(x=>{if(!x.inert){x.inert=true;x.dataset.filmInert='set'}});skip.focus({preventScroll:true});
  video.src=video.getAttribute('src')||'/assets/system-intro.mp4';video.currentTime=0;video.muted=false;video.volume=.65;
  video.play().catch(error=>{if(!active)return;if(error.name!=='NotAllowedError')throw error;video.muted=true;return video.play()}).then(()=>{if(active)frame=requestAnimationFrame(tick)}).catch(finish);timer=setTimeout(finish,14000);
 };
 skip.addEventListener('click',finish);replay.hidden=false;replay.addEventListener('click',()=>start(true));video.addEventListener('ended',finish);video.addEventListener('error',finish);
 overlay.addEventListener('keydown',e=>{if(e.key==='Escape')finish();if(e.key==='Tab'){e.preventDefault();skip.focus()}});
 new MutationObserver(()=>{if(off())finish()}).observe(document.documentElement,{attributes:true,attributeFilter:['data-motion']});
 document.addEventListener('visibilitychange',()=>{if(document.hidden)finish()});addEventListener('pagehide',finish);start();
})();
