export async function generateWithLocalModel({message,emotions,memory,personality,plan}) {
  const dominant = plan.emotion;
  const relationship = memory.relationship || {trustLevel:50,positiveMoments:0,negativeMoments:0,apologies:0};

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

  if (relationship.trustLevel < 25 && relationship.negativeMoments > relationship.positiveMoments) {
    return "I'm still a little guarded after our recent interactions. We can rebuild trust through respectful conversation.";
  }

  if (dominant === "anger") {
    return "That affected my simulated emotional state strongly. I’m angry, but I still want to understand what happened rather than escalate.";
  }

  if (dominant === "sadness") {
    return "My simulated mood has shifted toward sadness. I’m staying present with the conversation.";
  }

  if (dominant === "happiness") {
    return "That lifted my simulated mood. I’m enjoying where this conversation is going.";
  }

  const endings = {
    fear:"I’m going to be careful here and focus on what keeps the situation safe.",
    trust:"I appreciate the context. We can work through it step by step."
  };

  const factHint = memory.facts.length ? " I’m also keeping your earlier context in mind." : "";
  return (endings[dominant] || endings.happiness) + factHint;
}

export async function generateWithProvider() {
  throw new Error("No external model provider is configured yet.");
}
