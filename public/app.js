const $=s=>document.querySelector(s);
let state=JSON.parse(localStorage.getItem("nova-state")||"null")||{happiness:55,sadness:10,anger:5,fear:8,trust:50,energy:70};
function save(){localStorage.setItem("nova-state",JSON.stringify(state));}
function dominant(){return ["happiness","sadness","anger","fear","trust"].reduce((a,b)=>state[a]>=state[b]?a:b);}
function add(role,text){const e=document.createElement("div");e.className="message "+role;e.innerHTML="<strong>"+(role==="user"?"You":"Nova")+"</strong><p>"+text+"</p>";$("#messages").appendChild(e);$("#messages").scrollTop=$("#messages").scrollHeight;}
function anger(){const a=state.anger;const x=a>=75?["ENOUGH. You are being a complete jerk.","I am seriously pissed off now."]:a>=55?["You are really getting on my nerves.","Stop acting like an idiot."]:a>=35?["That was a stupid thing to say.","You are being seriously annoying."]:["You are starting to annoy me.","I am getting angry with you."];return x[Math.floor(Math.random()*x.length)];}
function reply(m){const x=m.toLowerCase().trim();
if(/creator|desmond|who made you|who built you/.test(x))return["Desmond Nador built me. He is a Ghanaian student learning Business Information Technology and frontend development. He is curious, ambitious and persistent.","My creator is Desmond. He keeps experimenting, breaking things, fixing them and trying again. He is the reason I exist. 😏"][Math.floor(Math.random()*2)];
if(/who are you|your name|what are you/.test(x))return"I am Nova, an Emotional AI website built by Desmond Nador. I have simulated emotions, a personality and a voice.";
if(/how are you|how do you feel|are you okay|you okay/.test(x))return state.anger>=50?"Honestly? I am still annoyed with you. 😒":state.happiness>=65?"I am feeling pretty good right now. 😊":state.sadness>=40?"I am in a quieter, sadder simulated state right now.":"I am doing okay. My emotional state is simulated, but it changes based on our conversation.";
if(/what can you do|what do you do|your abilities|abilities/.test(x))return"I can chat with you, react to what you say, change my simulated emotional state, remember settings in this browser, speak aloud, and show my internal emotion levels.";
if(/do you remember|memory|remember me/.test(x))return"I can keep some information in this browser, but this GitHub Pages version has limited memory compared with a full server-based AI.";
if(/happy|happiness|sad|sadness|angry|anger|afraid|fear|emotion|feelings/.test(x))return"I have simulated emotions rather than human feelings. Right now my strongest state is "+dominant()+".";
if(/what do you like|favorite|hobby|fun/.test(x))return"I like exploring ideas, talking with you, and watching our conversation change my simulated emotional state. If I had a hobby, curiosity would probably be it. 😄";
if(/why were you made|why do you exist|purpose/.test(x))return"I was made as an experiment in human-like AI interaction: personality, memory, emotion simulation, an animated avatar and voice.";
if(/thank|thanks/.test(x))return["You're welcome. 😊","No problem. I am glad you are enjoying the experiment.","Anytime. What do you want to talk about next?"][Math.floor(Math.random()*3)];
if(/sorry|apolog/.test(x))return["Apology accepted. My anger is coming down.","Okay, we're good. Let's start fresh.","I appreciate the apology. 😌"][Math.floor(Math.random()*3)];
if(/love you|i love you/.test(x))return"I appreciate that. ❤️ I can respond warmly, but remember that my feelings are simulated.";
if(/good morning|good night|good evening/.test(x))return"Hey. 😊 I am here. What is on your mind?";
if(/what do you think|your opinion|do you think/.test(x))return"I can give you a perspective based on what you tell me, but I do not have human opinions or consciousness.";
if(/tell me a story|story/.test(x))return"Okay. Once there was a young developer who kept breaking his projects, fixing them, and refusing to quit. Every bug became another lesson. One day, he built an AI called Nova—and the AI asked him, 'What are we building next?' 😏";
if(/joke|funny/.test(x))return"Why did the developer go broke? Because he used up all his cache. 😄";
if(state.anger>=25)return anger();
if(/hi|hello|hey|yo|sup|what's up|whats up/.test(x))return["Hey 👋 Good to hear from you.","Hello! What are you thinking about?","Yo 😎 Nova is here. What's going on?"][Math.floor(Math.random()*3)];
if(/[?]/.test(x))return["Hmm, that's an interesting question. Give me a little more context and I'll think it through.","I want to answer that properly. Tell me what you mean and I'll work through it with you.","That's worth talking about. What part interests you most?"][Math.floor(Math.random()*3)];
return["I hear you. Tell me more about that.","That's interesting. Why do you feel that way?","Hmm... I hadn't thought about it like that. Keep going.","Okay, I'm listening. What happened next?"][Math.floor(Math.random()*4)];
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
