import {EmotionEngine} from "./emotions.js";
import {MemoryStore} from "./memory.js";
import {personality} from "./personality.js";
import {planResponse} from "./planner.js";
import {safetyCheck,permissionSnapshot} from "./safety.js";
import {generateWithLocalModel} from "./model.js";

export function createConversationEngine() {
  const emotions = new EmotionEngine();
  const memory = new MemoryStore();

  return {
    async reply(message) {
      const clean = String(message).trim().slice(0,2000);
      if (!clean) return {error:"Please enter a message."};

      const safety = safetyCheck(clean);
      if (!safety.allowed) {
        emotions.apply("danger");
        await memory.addRelationshipEvent("negative","Unsafe request was blocked.");
        const response = "I can’t provide instructions for harming someone or breaking into an account. I can help with a safe alternative.";
        await memory.addTurn("user",clean);
        await memory.addTurn("assistant",response);
        return {response,blocked:true,...this.state()};
      }

      await memory.ready;
      await memory.addTurn("user",clean);
      await memory.rememberFromMessage(clean);

      const before = planResponse(clean,emotions.snapshot(),await memory.context());
      emotions.apply(before.event);

      if (["kindness","success","greeting"].includes(before.event)) {
        await memory.addRelationshipEvent("positive",before.event);
      }
      if (["insult","danger"].includes(before.event)) {
        await memory.addRelationshipEvent("negative",before.event);
      }
      if (before.event === "apology") {
        await memory.addRelationshipEvent("apology","The user apologized.");
      }

      const context = await memory.context();
      const plan = planResponse(clean,emotions.snapshot(),context);
      const response = await generateWithLocalModel({
        message:clean,
        emotions:emotions.snapshot(),
        memory:context,
        emotionalHistory:emotions.history,
        personality,
        plan
      });

      await memory.addTurn("assistant",response);
      return {response,blocked:false,plan,...this.state()};
    },

    state() {
      return {
        emotions:emotions.snapshot(),
        personality,
        permissions:permissionSnapshot(),
        memory:memory.data,
        emotionalHistory:emotions.history
      };
    },

    async reset() {
      emotions.reset();
      await memory.reset();
    }
  };
}
