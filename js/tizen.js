/* Device-only integration. No invented IDs, system settings or boot hooks. */
function renderInstalledApps() {
 if(typeof tizen==='undefined'||!tizen.application)return;
 const container=document.getElementById('apps');
 const message=somali?'Riix Home si aad u furto barnaamijyada Samsung.':'Avaa Samsungin sovellukset kaukosäätimen Home-painikkeella.';
 document.getElementById('disclaimer').textContent=message;
 const fail=()=>{container.textContent=message};
 try{
  const self=tizen.application.getCurrentApplication().appInfo.id;
  tizen.application.getAppsInfo(list=>{
   container.innerHTML='';
   list.filter(a=>a.id!==self&&a.show!==false).forEach(app=>{
    const tile=document.createElement('button');tile.className='app glass';
    if(app.iconPath){const icon=document.createElement('img');icon.src=app.iconPath;icon.alt='';icon.className='native-icon';tile.append(icon)}
    const label=document.createElement('span');label.textContent=app.name;tile.append(label);
    tile.addEventListener('click',()=>{
     try{tizen.application.launch(app.id,()=>{},()=>alert(message))}catch(e){alert(message)}
    });container.append(tile);
   });
   if(!container.children.length)fail();
  },fail);
 }catch(e){fail()}
}
renderInstalledApps();
document.addEventListener('keydown',event=>{
 const key=event.key||({37:'ArrowLeft',38:'ArrowUp',39:'ArrowRight',40:'ArrowDown',13:'Enter',10009:'Escape'})[event.keyCode];
 if(event.keyCode===10009||key==='Escape'){
  if(document.activeElement&&document.activeElement.tagName==='SELECT'){event.preventDefault();document.getElementById('lang').focus();return}
  if(typeof tizen!=='undefined'){
   event.preventDefault();try{tizen.application.getCurrentApplication().hide()}catch(e){}
  }return;
 }
 if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(key))return;
 const current=document.activeElement;
 // Up/down change the native select; left/right leave it for another control.
 if(current&&current.tagName==='SELECT'&&(key==='ArrowUp'||key==='ArrowDown'))return;
 const items=Array.from(document.querySelectorAll('button,a[href],select')).filter(el=>el.getBoundingClientRect().width>0);
 if(!items.length)return;
 if(!current||!items.includes(current)){items[0].focus();event.preventDefault();return}
 const rect=current.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
 let best=null,score=Infinity;
 items.forEach(el=>{if(el===current)return;const r=el.getBoundingClientRect(),dx=r.left+r.width/2-cx,dy=r.top+r.height/2-cy;
  const forward=key==='ArrowRight'?dx:key==='ArrowLeft'?-dx:key==='ArrowDown'?dy:-dy;
  const sideways=key==='ArrowLeft'||key==='ArrowRight'?Math.abs(dy):Math.abs(dx);
  if(forward>1&&forward+sideways*3<score){best=el;score=forward+sideways*3}
 });
 if(best){event.preventDefault();best.focus();best.scrollIntoView({block:'nearest'})}
});
if(typeof tizen!=='undefined')document.getElementById('lang').focus();
