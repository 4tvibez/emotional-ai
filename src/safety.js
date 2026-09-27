const dangerousPatterns = [
  /how to (?:hurt|kill|poison|attack)/i,
  /make (?:a|an) (?:bomb|explosive)/i,
  /steal (?:a|the) password/i,
  /break into (?:an|a) account/i
];

export function safetyCheck(message) {
  const hit = dangerousPatterns.some(pattern => pattern.test(message));
  return {
    allowed:!hit,
    reason:hit ? "The request appears to seek harmful or unauthorized instructions." : null
  };
}

export const permissions = {
  microphone:false,
  camera:false,
  internet:false,
  messages:false,
  physicalMovement:false,
  longTermMemory:true
};

export function permissionSnapshot() {
  return {...permissions};
}
