export async function generateWithLocalModel({message,emotions,memory,personality,plan}) {
  const dominant = plan.emotion;

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

  const endings = {
    happiness:"That sounds interesting. I’m enjoying the direction of this conversation.",
    sadness:"That sounds meaningful. I’m here to work through it with you.",
    anger:"I’m taking that seriously, but I want to keep the conversation constructive.",
    fear:"I’m going to be careful here and focus on what keeps the situation safe.",
    trust:"I appreciate the context. We can work through it step by step."
  };

  const factHint = memory.facts.length ? " I’m also keeping your earlier context in mind." : "";
  return (endings[dominant] || endings.happiness) + factHint;
}

export async function generateWithProvider() {
  throw new Error("No external model provider is configured yet.");
}
