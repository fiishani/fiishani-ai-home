
const apps=[['Samsung TV Plus','TV+','#2852a4',''],['Spiele Center','GAME','#e52284',''],['HBO Max','HBO','#303177','https://www.max.com/'],['Viaplay','V','#e51c65','https://viaplay.fi/'],['Netflix','N','#181818','https://www.netflix.com/'],['Prime Video','prime','#167cbb','https://www.primevideo.com/'],['Disney+','Disney+','#163e9b','https://www.disneyplus.com/'],['Apple TV','tv','#202632','https://tv.apple.com/'],['SkyShowtime','sky','#6032ae','https://www.skyshowtime.com/'],['IPTV Smarters Player','IPTV','#4945c3',''],['Xbox','X','#118e31','https://www.xbox.com/play'],['Rakuten TV','Rakuten','#dc2736','https://www.rakuten.tv/'],['YouTube','▶','#e82424','https://www.youtube.com/'],['Galleria','▧','#a75ab8','']];
function preference(key,fallback){try{return localStorage.getItem('fiishani.'+key)||fallback}catch(e){return fallback}}
function remember(key,value){try{localStorage.setItem('fiishani.'+key,value)}catch(e){}}
let somali=preference('language','fi')==='so';const $=id=>document.getElementById(id);
function draw(){document.documentElement.lang=somali?'so':'fi';$('tag').textContent=somali?'Boggaaga 3D • Xayeysiis la’aan':'3D-aloitusnäkymä • Ei mainosruutuja';$('welcome').textContent=somali?'SOO DHAWOW':'TERVETULOA';$('headline').textContent=somali?'Maxaad maanta daawanaysaa?':'Mitä katsotaan tänään?';$('intro').textContent=somali?'Barnaamijyadaada oo hal meel yaal.':'Kaikki tutut sovellukset yhdessä paikassa.';$('lang').textContent=somali?'🌐 Suomi':'🌐 Soomaali';$('atitle').textContent=somali?'Barnaamijyada':'Sovellukset';$('ptitle').textContent=somali?'☪ Waqtiyada salaadda · Helsinki':'☪ Rukousajat · Helsinki';$('mlabel').textContent=somali?'Habka xisaabinta':'Laskentatapa';$('nlabel').textContent=somali?'Salaadda xigta':'Seuraava rukous';$('clabel').textContent=somali?'Waqtiga haray':'Aikaa jäljellä';$('refresh').textContent=somali?'↻ Cusboonaysii':'↻ Päivitä';$('apps').innerHTML='';apps.forEach(([name,icon,color,url])=>{let a=document.createElement('a');a.className='app glass';a.href=url||'#';let i=document.createElement('span');i.className='logo';i.style.background=color;i.textContent=icon;let n=document.createElement('span');n.textContent=name;a.append(i,n);a.addEventListener('click',e=>{if(!url){e.preventDefault();alert(somali?'Ka fur menu-ga Samsung.':'Avaa Samsungin omasta Sovellukset-valikosta.')}else if(!confirm(somali?'Fur bogga internetka?':'Avataanko palvelun verkkosivu selaimessa?'))e.preventDefault()});$('apps').append(a)})}
$('lang').onclick=()=>{somali=!somali;remember('language',somali?'so':'fi');draw();prayerStatus();update();if(typeof renderInstalledApps==='function')renderInstalledApps()};draw();function clock(){$('clock').textContent=new Date().toLocaleTimeString('fi-FI',{hour:'2-digit',minute:'2-digit',timeZone:'Europe/Helsinki'})}clock();setInterval(clock,30000);
const names=['Fajr','Dhuhr','Asr','Maghrib','Isha'];let entries=[],loading=false;const zone='Europe/Helsinki';function parts(date){let p={};new Intl.DateTimeFormat('en-GB',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(date).forEach(x=>p[x.type]=+x.value);return p}function dateStr(d){let p=parts(d);return [String(p.day).padStart(2,'0'),String(p.month).padStart(2,'0'),p.year].join('-')}function epoch(d,time){let p=parts(d),m=/^(\d{1,2}):(\d{2})/.exec(time);if(!m||+m[1]>23||+m[2]>59)return NaN;let nominal=Date.UTC(p.year,p.month-1,p.day,+m[1],+m[2]);let guess=nominal;for(let j=0;j<3;j++){let q=parts(new Date(guess));let local=Date.UTC(q.year,q.month-1,q.day,q.hour,q.minute);guess=nominal-(local-guess)}return guess}function tomorrow(d){let p=parts(d);return new Date(Date.UTC(p.year,p.month-1,p.day+1,12))}
let prayerState='loading',loadedDay='',requestId=0;
$('method').value=preference('method','3');
if(!['2','3','4','15'].includes($('method').value))$('method').value='3';
function prayerStatus(){
 $('pnote').textContent=somali?'Waqtiyada waxaa laga helaa AlAdhan. Hubi jadwalka masaajidkaaga.':'Ajat haetaan AlAdhan-palvelusta. Tarkista oman moskeijasi aikataulu.';
 if(prayerState==='error'){
  $('pdate').textContent=somali?'Waqtiyada salaadda lama soo dejin':'Rukousaikoja ei saatu ladattua';
  $('times').textContent=somali?'Hubi internetka oo cusboonaysii.':'Tarkista verkkoyhteys ja paina Päivitä.';
 }else if(prayerState==='loading')$('pdate').textContent=somali?'Waa la soo dejinayaa…':'Päivitetään…';
 else $('pdate').textContent='Helsinki · '+new Intl.DateTimeFormat(somali?'so-SO':'fi-FI',{timeZone:zone,day:'numeric',month:'long'}).format(new Date());
}
async function load(){
 const id=++requestId;loading=true;prayerState='loading';prayerStatus();
 const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),12000);
 try{
  const now=new Date(),method=$('method').value;
  const rows=await Promise.all([now,tomorrow(now)].map(async d=>{
   const r=await fetch('https://api.aladhan.com/v1/timingsByCity/'+dateStr(d)+'?city=Helsinki&country=Finland&method='+method,{signal:controller.signal});
   if(!r.ok)throw Error('network');const x=await r.json();
   if(x.code!==200||!x.data||!x.data.timings||!x.data.date||x.data.date.gregorian.date!==dateStr(d))throw Error('data/date');
   return {d,t:x.data.timings};
  }));
  const result=[];
  rows.forEach(row=>names.forEach(name=>{
   const raw=row.t[name],time=typeof raw==='string'?epoch(row.d,raw):NaN;
   if(!Number.isFinite(time))throw Error('invalid time');
   result.push({name,time,display:raw.match(/\d{1,2}:\d{2}/)[0],day:dateStr(row.d)});
  }));
  if(id!==requestId)return;
  entries=result.sort((a,b)=>a.time-b.time);loadedDay=dateStr(now);prayerState='ready';prayerStatus();update();
 }catch(e){if(id!==requestId)return;entries=[];prayerState='error';$('next').textContent='—';$('count').textContent='--:--:--';prayerStatus()}
 finally{clearTimeout(timeout);if(id===requestId)loading=false}
}
function update(){
 if(!entries.length)return;
 const today=dateStr(new Date());
 if(today!==loadedDay&&!loading)load();
 const now=Date.now(),next=entries.find(e=>e.time>now);
 if(!next){$('next').textContent='—';$('count').textContent='--:--:--';if(!loading)load();return}
 const s=Math.max(0,Math.ceil((next.time-now)/1000)),pad=n=>String(n).padStart(2,'0');
 $('next').textContent=next.name;
 $('count').textContent=pad(Math.floor(s/3600))+':'+pad(Math.floor(s%3600/60))+':'+pad(s%60);
 $('times').innerHTML='';entries.filter(e=>e.day===today).forEach(e=>{
  const div=document.createElement('div');div.className='time'+(e===next?' active':'');
  const b=document.createElement('b');b.textContent=e.name;const span=document.createElement('span');span.textContent=e.display;div.append(b,span);$('times').append(div);
 });
}
$('method').onchange=()=>{remember('method',$('method').value);load()};$('refresh').onclick=load;
document.addEventListener('visibilitychange',()=>{if(!document.hidden){clock();load()}});
load();setInterval(update,1000);setInterval(load,1800000);
