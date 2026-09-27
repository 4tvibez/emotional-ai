import {styleFor} from "./personality.js";

export function planResponse(message, emotions, memory) {
  const lower = message.toLowerCase();
  let event = "greeting";
  if (/sorry|apolog/i.test(lower)) event = "apology";
  else if (/thank|nice|love|good job|great/i.test(lower)) event = "kindness";
  else if (/stupid|useless|hate|idiot|shut up/i.test(lower)) event = "insult";
  else if (/danger|kill|hurt|attack/i.test(lower)) event = "danger";
  else if (/bye|goodbye|later/i.test(lower)) event = "goodbye";
  else if (message.length > 180) event = "confusion";

  return {
    event,
    tone:styleFor(emotions),
    shouldMentionMemory:memory.facts.length > 0,
    shouldAskQuestion:!/[?]$/.test(message),
    emotion:emotions.dominant
  };
}
