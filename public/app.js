const $ = s => document.querySelector(s);

function addMessage(role,text){
  const el=document.createElement("div");
  el.className="message "+role;
  const name=document.createElement("strong");
  name.textContent=role==="user"?"You":"Nova";
  const p=document.createElement("p");
  p.textContent=text;
  el.append(name,p);
  $("#messages").appendChild(el);
  $("#messages").scrollTop=$("#messages").scrollHeight;
}

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
}

function render(state){
  const e=state.emotions;
  $("#dominant").textContent="Dominant: "+e.dominant;
  const labels=["happiness","sadness","anger","fear","trust","energy"];
  $("#emotions").innerHTML=labels.map(k =>
    '<div class="emotion"><div class="emotion-top"><span>'+k+'</span><span>'+e[k]+'%</span></div><div class="bar"><div class="fill" style="width:'+e[k]+'%"></div></div></div>'
  ).join("");
  $("#permissions").innerHTML=Object.entries(state.permissions).map(([k,v]) =>
    '<div class="permission">'+k+'<span>'+(v?"ON":"OFF")+'</span></div>'
  ).join("");
  const facts=(state.memory.facts||[]).slice(-6);
  $("#memory").innerHTML=facts.length ? facts.map(x => '<div class="memory-item">'+escapeHtml(x.text)+'</div>').join("") : '<div class="memory-item">No stored facts yet.</div>';
}

async function refresh(){
  const res=await fetch("/api/state");
  render(await res.json());
}

$("#chat-form").addEventListener("submit",async event=>{
  event.preventDefault();
  const input=$("#message");
  const message=input.value.trim();
  if(!message)return;
  addMessage("user",message);
  input.value="";
  const res=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})});
  const data=await res.json();
  addMessage("assistant",data.response||data.error||"No response.");
  render(data);
});

$("#reset").addEventListener("click",async()=>{
  await fetch("/api/reset",{method:"POST"});
  $("#messages").innerHTML="";
  addMessage("assistant","Reset complete. Emotional state and memory have been cleared.");
  refresh();
});

refresh();
