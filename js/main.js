(function(){
  'use strict';
  const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];
  const safe=(fn,name)=>{try{fn()}catch(e){console.warn('init',name,e)}};

  /* ---- Datos ---- */
  const services=[
    ['Suelos de madera','Instalación de parquet, tarima flotante y suelo laminado, con nivelado y rodapiés.','M3 8l9-4 9 4-9 4zM3 12l9 4 9-4M3 16l9 4 9-4'],
    ['Armarios y vestidores','Montaje de armarios empotrados y vestidores, con puertas correderas o abatibles.','M5 3h14v18H5zM12 3v18M9 12v2M15 12v2'],
    ['Puertas y ventanas','Instalación, cambio y ajuste de puertas de paso, de entrada y ventanas de madera.','M6 3h12v18H6zM15 12h.01'],
    ['Escaleras y barandillas','Revestimiento de escaleras, peldaños y barandillas en madera.','M3 20h5v-4h5v-4h5V8h3'],
    ['Exterior y pérgolas','Montaje de pérgolas, tarimas de terraza y cerramientos con madera tratada.','M3 9l9-5 9 5M5 9v11M19 9v11M9 9v11M15 9v11'],
    ['Reformas y reparaciones','Rodapiés, molduras, revestimientos de pared y arreglos de carpintería.','M14 6l4 4L8 20H4v-4zM13 7l4 4']
  ];
  const mats=[
    ['Roble','Resistente y de veta marcada.','#b98a56'],['Nogal','Oscuro, elegante y cálido.','#4a2c18'],
    ['Pino','Ligero y versátil.','#d8b88a'],['Castaño','Duradero, ideal en exterior.','#8a5a34'],['Iroko','Estable frente a la humedad.','#a8693a']
  ];

  /* ---- Render idempotente ---- */
  safe(()=>{const t=$('#mq');if(t.children.length)return;
    const w=['Suelos','Puertas','Armarios','Rodapiés','Escaleras','Reformas','Proyectos en madera'];
    const h=w.map(x=>`<span>${x} ✦</span>`).join('');t.innerHTML=h+h+h+h},'marquee');
  safe(()=>{const c=$('#cards');if(c.children.length)return;
    c.innerHTML=services.map(s=>`<article class="card reveal"><svg viewBox="0 0 24 24"><path d="${s[2]}"/></svg><h3>${s[0]}</h3><p>${s[1]}</p></article>`).join('')},'cards');
  safe(()=>{const m=$('#mats');if(m.children.length)return;
    m.innerHTML=mats.map(x=>`<div class="mat" tabindex="0" style="--w:repeating-linear-gradient(94deg,${x[2]} 0 30px,color-mix(in srgb,${x[2]} 82%,#000) 30px 33px,color-mix(in srgb,${x[2]} 92%,#fff) 33px 72px)"><div><b>${x[0]}</b><small>${x[1]}</small></div></div>`).join('')},'mats');
  $('#y').textContent=new Date().getFullYear();

  /* ---- Tema ---- */
  safe(()=>{const r=document.documentElement;
    try{const s=localStorage.getItem('josgai-theme');if(s)r.dataset.theme=s}catch(e){}
    $('#theme').onclick=()=>{
      const dark=r.dataset.theme?r.dataset.theme==='dark':matchMedia('(prefers-color-scheme:dark)').matches;
      r.dataset.theme=dark?'light':'dark';
      try{localStorage.setItem('josgai-theme',r.dataset.theme)}catch(e){}}},'theme');

  /* ---- Menú móvil ---- */
  safe(()=>{const m=$('#menu');$('#burger').onclick=()=>m.classList.toggle('open');
    $$('a',m).forEach(a=>a.onclick=()=>m.classList.remove('open'))},'menu');

  /* ---- Reveal con red de seguridad ---- */
  safe(()=>{const els=$$('.reveal');
    const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.05});
    els.forEach((e,i)=>{e.style.transitionDelay=(i%4)*70+'ms';io.observe(e)});
    setTimeout(()=>els.forEach(e=>e.classList.add('in')),6000)},'reveal');

  /* ---- Scroll: progreso, enlace activo, botón subir ---- */
  safe(()=>{const bar=$('#progress'),top=$('#top'),links=$$('nav a'),secs=links.map(a=>$(a.getAttribute('href')));
    const f=()=>{const h=document.documentElement,y=h.scrollTop;
      bar.style.width=(y/(h.scrollHeight-h.clientHeight)*100)+'%';top.classList.toggle('show',y>700);
      let k=0;secs.forEach((s,i)=>{if(s&&s.getBoundingClientRect().top<innerHeight*.4)k=i});
      links.forEach((a,i)=>a.classList.toggle('on',i===k))};
    addEventListener('scroll',f,{passive:true});f();
    top.onclick=()=>scrollTo({top:0,behavior:'smooth'})},'scroll');

  /* ---- Contadores ---- */
  safe(()=>{const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;io.unobserve(e.target);
      const el=e.target,n=+el.dataset.n,s=el.dataset.s,t0=performance.now();
      const tick=t=>{const p=Math.min((t-t0)/1500,1);el.textContent=Math.round(n*(1-Math.pow(1-p,3)))+s;if(p<1)requestAnimationFrame(tick)};
      requestAnimationFrame(tick)}),{threshold:.3});
    $$('[data-n]').forEach(e=>{e.textContent=e.dataset.n+e.dataset.s;io.observe(e)})},'counters');

  /* ---- Inclinación 3D en tarjetas ---- */
  safe(()=>{if(!matchMedia('(hover:hover)').matches)return;
    $$('.card').forEach(c=>{
      c.addEventListener('mousemove',e=>{const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        c.classList.add('done');c.style.transitionDelay='0ms';
        c.style.setProperty('--mx',(e.clientX-r.left)+'px');c.style.setProperty('--my',(e.clientY-r.top)+'px');
        c.style.transform=`perspective(700px) rotateY(${x*9}deg) rotateX(${-y*9}deg) translateY(-6px)`});
      c.addEventListener('mouseleave',()=>c.style.transform='')})},'tilt');

  /* ---- Filtro de galería ---- */
  safe(()=>{const bs=$$('#filters button'),ts=$$('.tile');
    bs.forEach(b=>b.onclick=()=>{bs.forEach(x=>x.classList.toggle('on',x===b));
      ts.forEach(t=>t.classList.toggle('hide',b.dataset.f!=='all'&&t.dataset.c!==b.dataset.f))})},'filter');

  /* ---- Parallax del hero ---- */
  safe(()=>{const r=$('.rings'),g=$('.grain');
    addEventListener('scroll',()=>{const y=Math.min(scrollY,900);r.style.marginTop=(y*.12)+'px';g.style.marginTop=(y*.05)+'px'},{passive:true})},'parallax');

  /* ---- Titular del hero palabra a palabra ---- */
  safe(()=>{const h=$('.hero h1');if(h.dataset.s)return;h.dataset.s=1;let i=0;
    const walk=n=>[...n.childNodes].forEach(c=>{
      if(c.nodeType===3){const f=document.createDocumentFragment();
        c.textContent.split(/(\s+)/).forEach(t=>{if(!t.trim()){f.append(t);return}
          const o=document.createElement('span'),s=document.createElement('span');o.className='w';s.textContent=t;s.style.animationDelay=(.2+i++*.13)+'s';o.append(s);f.append(o)});
        c.replaceWith(f)}else if(c.nodeType===1)walk(c)});
    walk(h)},'split');

  /* ---- Foco de luz y parallax con el ratón en el hero ---- */
  safe(()=>{if(!matchMedia('(hover:hover)').matches)return;
    const h=$('.hero'),r=$('.rings');let tx=0,ty=0,cx=0,cy=0,px=0,py=0,mx=0,my=0,run=false;
    const loop=()=>{cx+=(tx-cx)*.12;cy+=(ty-cy)*.12;mx+=(px-mx)*.08;my+=(py-my)*.08;
      h.style.setProperty('--mx',cx+'px');h.style.setProperty('--my',cy+'px');
      r.style.translate=(mx*-60)+'px '+(my*-60)+'px';
      if(Math.abs(tx-cx)+Math.abs(ty-cy)>.5||Math.abs(px-mx)>.001||Math.abs(py-my)>.001)requestAnimationFrame(loop);else run=false};
    h.addEventListener('mousemove',e=>{const b=h.getBoundingClientRect();tx=e.clientX-b.left;ty=e.clientY-b.top;px=tx/b.width-.5;py=ty/b.height-.5;
      if(!run){run=true;requestAnimationFrame(loop)}})},'hero-mouse');

  /* ---- Botones magnéticos ---- */
  safe(()=>{if(!matchMedia('(hover:hover)').matches)return;
    $$('.btn').forEach(b=>{
      b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();b.style.translate=((e.clientX-r.left-r.width/2)*.22)+'px '+((e.clientY-r.top-r.height/2)*.3)+'px'});
      b.addEventListener('mouseleave',()=>b.style.translate='')})},'magnet');

  /* ---- Línea del proceso que se dibuja ---- */
  safe(()=>{const s=$('.steps'),io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){s.classList.add('in');io.disconnect()}}),{threshold:.15});
    io.observe(s);setTimeout(()=>s.classList.add('in'),6000)},'steps');

  /* ---- Formulario (abre el correo del cliente) ---- */
  safe(()=>{$('#form').addEventListener('submit',e=>{e.preventDefault();
    const d=new FormData(e.target),
      body=`Nombre: ${d.get('n')}\nTeléfono: ${d.get('t')}\nTrabajo: ${d.get('s')}\n\n${d.get('m')}`;
    $('#ok').style.display='block';
    location.href='mailto:contacto@josgai.es?subject='+encodeURIComponent('Consulta web · '+d.get('s'))+'&body='+encodeURIComponent(body)})},'form');
})();