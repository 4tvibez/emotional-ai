import {existsSync} from "node:fs";
import {readFile, writeFile} from "node:fs/promises";

const file = new URL("../data/memory.json", import.meta.url);
const EMPTY = {
  facts:[],
  recent:[],
  summaries:[],
  relationship:{trustLevel:50,positiveMoments:0,negativeMoments:0,apologies:0,events:[]}
};

export class MemoryStore {
  constructor() {
    this.data = structuredClone(EMPTY);
    this.ready = this.load();
  }

  async load() {
    try {
      if (existsSync(file)) this.data = JSON.parse(await readFile(file, "utf8"));
      if (!this.data.relationship) this.data.relationship = structuredClone(EMPTY.relationship);
    } catch {
      this.data = structuredClone(EMPTY);
    }
  }

  async save() {
    await writeFile(file, JSON.stringify(this.data, null, 2));
  }

  async addFact(text, source = "conversation") {
    const value = String(text).trim();
    if (!value) return;
    if (!this.data.facts.some(x => x.text.toLowerCase() === value.toLowerCase())) {
      this.data.facts.push({text:value,source,createdAt:new Date().toISOString()});
      this.data.facts = this.data.facts.slice(-50);
      await this.save();
    }
  }

  async addRelationshipEvent(type, note) {
    if (!this.data.relationship) this.data.relationship = structuredClone(EMPTY.relationship);
    const r = this.data.relationship;
    if (type === "positive") {
      r.positiveMoments++;
      r.trustLevel = Math.min(100, r.trustLevel + 3);
    }
    if (type === "negative") {
      r.negativeMoments++;
      r.trustLevel = Math.max(0, r.trustLevel - 5);
    }
    if (type === "apology") {
      r.apologies++;
      r.trustLevel = Math.min(100, r.trustLevel + 6);
    }
    r.events.push({type,note,at:new Date().toISOString()});
    r.events = r.events.slice(-30);
    await this.save();
  }

  async addTurn(role, content) {
    this.data.recent.push({role,content,at:new Date().toISOString()});
    this.data.recent = this.data.recent.slice(-20);
    await this.save();
  }

  async rememberFromMessage(message) {
    const patterns = [
      /(?:my name is|i am|i'm) ([a-z][a-z .'-]{1,40})/i,
      /i live in ([a-z][a-z ,'-]{1,40})/i,
      /i like ([^.!?]{2,80})/i
    ];
    for (const pattern of patterns) {
      const match = message.match(pattern);
      if (match) await this.addFact(match[0]);
    }
  }

  async context() {
    await this.ready;
    if (!this.data.relationship) this.data.relationship = structuredClone(EMPTY.relationship);
    return {
      facts:this.data.facts.slice(-12),
      recent:this.data.recent.slice(-10),
      summaries:this.data.summaries.slice(-5),
      relationship:this.data.relationship
    };
  }

  async reset() {
    await this.ready;
    this.data = structuredClone(EMPTY);
    await this.save();
  }
}
