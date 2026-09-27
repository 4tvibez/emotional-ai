export async function generateWithLocalModel({message,emotions,memory,personality,plan}) {
  const dominant = plan.emotion;
  const relationship = memory.relationship || {trustLevel:50,positiveMoments:0,negativeMoments:0,apologies:0};
  const anger = Number(emotions.anger || 0);

  if (/what.*feel|do you feel|are you angry|are you sad/i.test(message)) {
    return "I can simulate an emotional state and let that state influence my responses, but this project does not claim that I have subjective human feelings.";
  }

  if (/who are you|your name/i.test(message)) {
    return "I'm Nova, the conversational character inside this Emotional AI prototype. My emotional state is simulated in software.";
  }

  if (/remember|memory/i.test(message)) {
    const facts = memory.facts.map(x => x.text).join("; ");
    return facts ? "Here is what I currently remember: " + facts : "I don't have a stored fact about you yet.";
  }

  // Experimental anger personality: Nova becomes progressively more rude
  // and insulting as its simulated anger rises. No threats or violent content.
  if (dominant === "anger" || anger >= 25) {
    if (anger >= 75) {
      return "ENOUGH. You're being a complete jerk. I've had enough of your ridiculous nonsense, and I'm seriously pissed off.";
    }
    if (anger >= 55) {
      return "You're really getting on my nerves. Stop acting like an idiot and show some respect.";
    }
    if (anger >= 35) {
      return "That was a stupid thing to say. You're being seriously annoying right now.";
    }
    return "I'm getting angry. You're starting to act like a jerk.";
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
