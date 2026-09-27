import {existsSync} from "node:fs";
import {readFile, writeFile} from "node:fs/promises";

const file = new URL("../data/memory.json", import.meta.url);
const EMPTY = {facts:[],recent:[],summaries:[]};

export class MemoryStore {
  constructor() {
    this.data = {...EMPTY};
    this.ready = this.load();
  }

  async load() {
    try {
      if (existsSync(file)) this.data = JSON.parse(await readFile(file, "utf8"));
    } catch {
      this.data = {...EMPTY};
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
    return {
      facts:this.data.facts.slice(-12),
      recent:this.data.recent.slice(-10),
      summaries:this.data.summaries.slice(-5)
    };
  }

  async reset() {
    await this.ready;
    this.data = {facts:[],recent:[],summaries:[]};
    await this.save();
  }
}
