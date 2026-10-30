const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
function boot(saved={}) {
 const nodes={};const storage={...saved};
 function node(id){return nodes[id]??=( {id,value:'3',textContent:'',innerHTML:'',style:{},children:[],classList:{add(){}},append(...n){this.children.push(...n)},addEventListener(){},setAttribute(){},focus(){},getBoundingClientRect(){return {left:0,top:0,width:10,height:10}},scrollIntoView(){}})}
 const ctx={document:{getElementById:node,documentElement:{},createElement:()=>node(Math.random()),addEventListener(){},querySelectorAll:()=>[]},localStorage:{getItem:k=>storage[k]??null,setItem:(k,v)=>storage[k]=String(v)},Intl,Date,console,setInterval(){},setTimeout,clearTimeout,AbortController,fetch:()=>Promise.reject(Error('offline')),alert(){},confirm:()=>false};
 vm.createContext(ctx);vm.runInContext(fs.readFileSync('js/home.js','utf8'),ctx);
 return {ctx,nodes,storage,eval:s=>vm.runInContext(s,ctx)};
}
test('Helsinki winter and summer prayer timestamps use correct offset',()=>{const b=boot();assert.equal(b.eval("epoch(new Date('2026-01-15T12:00:00Z'),'12:00')"),Date.parse('2026-01-15T10:00:00Z'));assert.equal(b.eval("epoch(new Date('2026-07-15T12:00:00Z'),'12:00')"),Date.parse('2026-07-15T09:00:00Z'));});
test('Helsinki midnight and DST next day',()=>{const b=boot();assert.equal(b.eval("dateStr(tomorrow(new Date('2026-10-24T12:00:00Z')))"),'25-10-2026');assert.equal(b.eval("dateStr(new Date('2026-10-30T22:01:00Z'))"),'31-10-2026');});
test('language survives restart and toggles',()=>{const b=boot({'fiishani.language':'so'});assert.equal(b.ctx.document.documentElement.lang,'so');b.nodes.lang.onclick();assert.equal(b.storage['fiishani.language'],'fi');});
test('invalid prayer times rejected',()=>{const b=boot();assert.ok(Number.isNaN(b.eval("epoch(new Date(),'99:90')")));});
test('offline clears next prayer and countdown and localizes status',async()=>{const b=boot({'fiishani.language':'so'});await new Promise(r=>setImmediate(r));assert.equal(b.nodes.next.textContent,'—');assert.equal(b.nodes.count.textContent,'--:--:--');assert.match(b.nodes.pdate.textContent,/salaadda/);});
test('valid API returns five today plus tomorrow, countdown and midnight reload',async()=>{
 const b=boot();b.ctx.fetch=async url=>({ok:true,json:async()=>({code:200,data:{date:{gregorian:{date:new URL(url).pathname.split('/').pop()}},timings:{Fajr:'05:30',Dhuhr:'12:30',Asr:'14:30',Maghrib:'17:30',Isha:'19:30'}}})});
 await b.eval('load()');assert.equal(b.eval('entries.length'),10);assert.equal(b.eval("entries.filter(e=>e.day===dateStr(new Date())).length"),5);assert.match(b.nodes.count.textContent,/^\d{2}:\d{2}:\d{2}$/);
 b.eval("loadedDay='yesterday';update()");await new Promise(r=>setImmediate(r));assert.equal(b.eval('loadedDay'),b.eval('dateStr(new Date())'));
});
test('wrong response date never becomes valid prayer data',async()=>{
 const b=boot();b.ctx.fetch=async()=>({ok:true,json:async()=>({code:200,data:{date:{gregorian:{date:'01-01-2000'}},timings:{}}})});await b.eval('load()');assert.equal(b.eval('entries.length'),0);assert.equal(b.nodes.count.textContent,'--:--:--');
});
test('after Isha next prayer is tomorrow Fajr',()=>{const b=boot();b.eval("entries=[{name:'Isha',time:Date.now()-1000,day:dateStr(new Date()),display:'19:30'},{name:'Fajr',time:Date.now()+3600000,day:dateStr(tomorrow(new Date())),display:'05:30'}];loadedDay=dateStr(new Date());update()");assert.equal(b.nodes.next.textContent,'Fajr')});
