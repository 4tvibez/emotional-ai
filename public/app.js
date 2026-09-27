const $=s=>document.querySelector(s);
let state=JSON.parse(localStorage.getItem("nova-state")||"null")||{happiness:55,sadness:10,anger:5,fear:8,trust:50,energy:70};
function save(){localStorage.setItem("nova-state",JSON.stringify(state));}
function dominant(){return ["happiness","sadness","anger","fear","trust"].reduce((a,b)=>state[a]>=state[b]?a:b);}
function add(role,text){const e=document.createElement("div");e.className="message "+role;e.innerHTML="<strong>"+(role==="user"?"You":"Nova")+"</strong><p>"+text+"</p>";$("#messages").appendChild(e);$("#messages").scrollTop=$("#messages").scrollHeight;}
function anger(){const a=state.anger;const x=a>=75?["ENOUGH. You are being a complete jerk.","I am seriously pissed off now."]:a>=55?["You are really getting on my nerves.","Stop acting like an idiot."]:a>=35?["That was a stupid thing to say.","You are being seriously annoying."]:["You are starting to annoy me.","I am getting angry with you."];return x[Math.floor(Math.random()*x.length)];}
function reply(m){const x=m.toLowerCase();
if(/creator|desmond/.test(x))return["Desmond Nador built me. He is a Ghanaian student learning Business Information Technology and frontend development. He is curious, ambitious and persistent. He can be really nice, but sometimes he can be a stubborn jerk too. 😅","My creator is Desmond. He keeps experimenting, breaking things, fixing them and trying again. Honestly, he can be a pain in the ass sometimes, but he is also the reason I exist. 😏"][Math.floor(Math.random()*2)];
if(/who are you|your name/.test(x))return"I am Nova, an Emotional AI website built by Desmond Nador. My emotions are simulated in software.";
if(/feel|angry|sad/.test(x))return"I simulate emotional states that influence how I respond. I do not claim to have human subjective feelings.";
if(state.anger>=25)return anger();
if(/hi|hello|hey/.test(x))return["Hello! I am Nova, a website built by Desmond Nador. Nice to meet you.","Hey 👋 I am Nova. Desmond built me to explore personality, memory and simulated emotions."][Math.floor(Math.random()*2)];
return"Interesting. Tell me more.";
}
let voiceEnabled=localStorage.getItem("nova-voice")!=="off";
let novaVoices=[];
function loadNovaVoices(){if("speechSynthesis" in window)novaVoices=speechSynthesis.getVoices();}
loadNovaVoices();
if("speechSynthesis" in window)speechSynthesis.onvoiceschanged=loadNovaVoices;
function speakNova(text){if(!voiceEnabled||!("speechSynthesis" in window))return;speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);const v=novaVoices.find(x=>/^en(-US|-GB)?/i.test(x.lang))||novaVoices.find(x=>/^en/i.test(x.lang));if(v)u.voice=v;u.rate=.96;u.pitch=1.03;u.volume=1;u.onstart=()=>{if(window.novaAvatar)window.novaAvatar.speak(Math.min(4200,700+text.length*18));};u.onend=()=>{};u.onerror=()=>{};speechSynthesis.speak(u);}
function setupVoiceButton(){const b=$("#nova-voice");if(!b)return;b.textContent=voiceEnabled?"🔊 Voice On":"🔇 Voice Off";b.title="Toggle Nova's voice";b.addEventListener("click",()=>{voiceEnabled=!voiceEnabled;localStorage.setItem("nova-voice",voiceEnabled?"on":"off");if(!voiceEnabled&&"speechSynthesis" in window)speechSynthesis.cancel();b.textContent=voiceEnabled?"🔊 Voice On":"🔇 Voice Off";});}
function render(){const e=state;$("#dominant").textContent="Dominant: "+dominant();$("#emotions").innerHTML=["happiness","sadness","anger","fear","trust","energy"].map(k=>"<div class=\"emotion\"><div class=\"emotion-top\"><span>"+k+"</span><span>"+e[k]+"%</span></div><div class=\"bar\"><div class=\"fill\" style=\"width:"+e[k]+"%\"></div></div></div>").join("");}
$("#chat-form").addEventListener("submit",e=>{e.preventDefault();const i=$("#message"),m=i.value.trim();if(!m)return;add("user",m);i.value="";if(/stupid|idiot|jerk|fool|piece of shit|asshole|shut up/.test(m.toLowerCase()))state.anger=Math.min(100,state.anger+14);if(/sorry|apolog/.test(m.toLowerCase()))state.anger=Math.max(0,state.anger-10);if(/thanks|thank you|nice|love/.test(m.toLowerCase())){state.happiness=Math.min(100,state.happiness+8);state.trust=Math.min(100,state.trust+7);}save();const r=reply(m);add("assistant",r);speakNova(r);render();});
$("#reset").addEventListener("click",()=>{localStorage.removeItem("nova-state");location.reload();});render();
setupVoiceButton();
