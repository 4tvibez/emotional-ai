class NovaAvatar{
  constructor(root){
    this.root=root; this.status=document.querySelector("#avatar-status-text");
    this.voice=document.querySelector("#voice-bars"); this.stage=document.querySelector("#avatar-stage");
    this.head=this.root.querySelector(".avatar-head"); this.eyes=[...this.root.querySelectorAll(".iris")];
    this.timers=[]; this.motionOK=!matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(this.motionOK){this.scheduleBlink();this.scheduleIdleMotion();this.scheduleGaze();}
    this.stage.addEventListener("pointermove",e=>this.lookAt(e));
    this.stage.addEventListener("pointerleave",()=>this.resetLook());
  }
  clear(name){clearTimeout(this[name]);}
  scheduleBlink(){
    this.blinkTimer=setTimeout(()=>{this.blink();this.scheduleBlink()},2200+Math.random()*4300);
  }
  blink(){
    this.root.classList.add("blink");
    setTimeout(()=>this.root.classList.remove("blink"),110+Math.random()*70);
    if(Math.random()<.12)setTimeout(()=>{this.root.classList.add("blink");setTimeout(()=>this.root.classList.remove("blink"),100)},230);
  }
  scheduleIdleMotion(){
    this.idleTimer=setTimeout(()=>{if(!this.root.classList.contains("speaking"))this.idleTurn();this.scheduleIdleMotion()},3500+Math.random()*5000);
  }
  idleTurn(){
    const y=(Math.random()*2-1)*4, x=(Math.random()*2-1)*2;
    this.root.style.transform="translateY(15px) rotateY("+y+"deg) rotateX("+x+"deg)";
    setTimeout(()=>{this.root.style.transform=""},900+Math.random()*900);
  }
  scheduleGaze(){
    this.gazeTimer=setTimeout(()=>{this.setGaze((Math.random()*2-1)*7,(Math.random()*2-1)*4);this.scheduleGaze()},1400+Math.random()*2400);
  }
  setGaze(x,y){this.eyes.forEach(i=>i.style.transform="translate("+x+"px,"+y+"px)")}
  lookAt(e){
    const r=this.stage.getBoundingClientRect(), x=((e.clientX-r.left)/r.width-.5)*10, y=((e.clientY-r.top)/r.height-.5)*6;
    this.setGaze(x,y); this.root.style.transform="translateY(15px) rotateY("+x/2+"deg) rotateX("+(-y/3)+"deg)";
  }
  resetLook(){this.setGaze(0,0);this.root.style.transform=""}
  setState(emotions){
    const names=["happiness","sadness","anger","fear","trust"];
    const dominant=names.reduce((a,b)=>emotions[b]>emotions[a]?b:a,names[0]);
    this.root.classList.remove("happy","sad","angry","fear","trust");
    this.root.classList.add(dominant==="happiness"?"happy":dominant==="sadness"?"sad":dominant==="anger"?"angry":dominant==="fear"?"fear":"trust");
  }
  setStatus(text){this.status.textContent=text}
  speak(ms=1300){
    this.root.classList.add("speaking");this.voice.classList.add("active");this.setStatus("Speaking");
    clearTimeout(this.speakTimer);this.speakTimer=setTimeout(()=>{this.root.classList.remove("speaking");this.voice.classList.remove("active");this.setStatus("Idle")},ms);
  }
  listening(){this.root.classList.add("listening");this.setStatus("Listening")}
  idle(){this.root.classList.remove("listening");this.setStatus("Idle")}
}
window.novaAvatar=new NovaAvatar(document.querySelector("#nova-avatar"));
