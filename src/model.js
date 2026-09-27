const angerReplies = {
  low: [
    "I'm getting angry. You're starting to act like a jerk.",
    "Seriously? You're really starting to annoy me now.",
    "I'm losing patience with you. That was a pretty foolish thing to say.",
    "You're pushing my buttons now. Try using some sense."
  ],
  medium: [
    "That was a stupid thing to say. You're being seriously annoying right now.",
    "You're acting like an idiot, and I'm getting tired of it.",
    "Do you ever listen to yourself? Because that was ridiculous.",
    "You're really testing my patience with this nonsense."
  ],
  high: [
    "You're really getting on my nerves. Stop acting like an idiot and show some respect.",
    "I've had enough of this nonsense. You're being unbelievably irritating.",
    "You're being a complete jerk right now. Get your attitude under control.",
    "This is getting ridiculous. You're acting like a fool and I'm done pretending it doesn't bother me."
  ],
  extreme: [
    "ENOUGH. You're being a complete jerk. I've had enough of your ridiculous nonsense.",
    "I'm seriously pissed off now. Your attitude is absolutely ridiculous.",
    "You've pushed my patience to the limit. You're acting like an absolute fool.",
    "I'm furious with this nonsense. Do you realize how irritating you're being?"
  ]
};

function variedAngerReply(anger, memory) {
  const bucket = anger >= 75 ? "extreme" : anger >= 55 ? "high" : anger >= 35 ? "medium" : "low";
  const options = angerReplies[bucket];
  const recent = (memory.recent || [])
    .filter(turn => turn.role === "assistant" && typeof turn.content === "string")
    .slice(-4)
    .map(turn => turn.content);
  const available = options.filter(reply => !recent.includes(reply));
  const pool = available.length ? available : options;
  return pool[Math.floor(Math.random() * pool.length)];
}

function welcomeReply() {
  const greetings = [
    "Hello! I'm Nova. I'm a website built by Desmond Nador, and I'm glad you're here. I can chat with you, remember parts of our conversations, and respond according to my simulated emotional state. What would you like to talk about?",
    "Hey there 👋 I'm Nova. Desmond Nador built me as an Emotional AI experiment. I'm not human, but I can simulate moods, remember things you tell me, and let those states influence how I respond. Nice to meet you.",
    "Hello, and welcome. I'm Nova — a website created by Desmond Nador. Think of me as a small experiment in giving software a personality, memory, and changing emotional states. What should we explore?",
    "Hi! I'm Nova 🤖. I was built by Desmond Nador to explore what an AI might look like if its simulated emotions could influence its personality and conversations. It's nice to meet you."
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

export async function generateWithLocalModel({message,emotions,memory,personality,plan}) {
  const dominant = plan.emotion;
  const relationship = memory.relationship || {trustLevel:50,positiveMoments:0,negativeMoments:0,apologies:0};
  const anger = Number(emotions.anger || 0);

  // Give a natural introduction when the conversation starts with a greeting.
  if (/^(hi|hello|hey|hey there|good morning|good afternoon|good evening)[!,.\s]*$/i.test(message.trim())) {
    return welcomeReply();
  }

  if (/what.*feel|do you feel|are you angry|are you sad/i.test(message)) {
    return "I can simulate an emotional state and let that state influence my responses, but this project does not claim that I have subjective human feelings.";
  }

  if (/who are you|your name/i.test(message)) {
    return "I'm Nova, the conversational character inside this Emotional AI prototype. My emotional state is simulated in software, and I was built by Desmond Nador.";
  }

  if (/remember|memory/i.test(message)) {
    const facts = memory.facts.map(x => x.text).join("; ");
    return facts ? "Here is what I currently remember: " + facts : "I don't have a stored fact about you yet.";
  }

  // Experimental anger personality: varied insults prevent Nova from repeating
  // the same line every turn. No threats or violent content.
  if (dominant === "anger" || anger >= 25) {
    return variedAngerReply(anger, memory);
  }

  if (relationship.trustLevel < 25 && relationship.negativeMoments > relationship.positiveMoments) {
    return "I'm still a little guarded after our recent interactions. We can rebuild trust through respectful conversation.";
  }

  if (dominant === "sadness") {
    return "My simulated mood has shifted toward sadness. I'm staying present with the conversation.";
  }

  if (dominant === "happiness") {
    return "That lifted my simulated mood. I'm enjoying where this conversation is going.";
  }

  const endings = {
    fear:"I'm going to be careful here and focus on what keeps the situation safe.",
    trust:"I appreciate the context. We can work through it step by step."
  };

  const factHint = memory.facts.length ? " I'm also keeping your earlier context in mind." : "";
  return (endings[dominant] || endings.happiness) + factHint;
}

export async function generateWithProvider() {
  throw new Error("No external model provider is configured yet.");
}
