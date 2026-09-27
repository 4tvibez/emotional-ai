const clamp = n => Math.max(0, Math.min(100, Math.round(n)));

export const DEFAULT_EMOTIONS = {
  happiness: 55,
  sadness: 10,
  anger: 5,
  fear: 8,
  trust: 50,
  energy: 70
};

export class EmotionEngine {
  constructor(initial = {}) {
    this.values = {...DEFAULT_EMOTIONS, ...initial};
    this.lastEvent = "boot";
  }

  snapshot() {
    return {...this.values, dominant:this.dominant()};
  }

  dominant() {
    const keys = ["happiness","sadness","anger","fear","trust"];
    return keys.reduce((best,key) => this.values[key] > this.values[best] ? key : best, keys[0]);
  }

  apply(event, intensity = 1) {
    const changes = {
      greeting:{happiness:5,trust:2,energy:3},
      kindness:{happiness:8,trust:7,sadness:-3,anger:-2},
      insult:{happiness:-5,trust:-8,anger:14,sadness:4},
      apology:{trust:8,anger:-10,sadness:-4,happiness:4},
      confusion:{fear:4,energy:-3},
      success:{happiness:10,trust:3,energy:5},
      danger:{fear:18,energy:-5,trust:-4},
      goodbye:{sadness:5,happiness:-2}
    }[event] || {};

    for (const [key,delta] of Object.entries(changes)) {
      if (key in this.values) this.values[key] = clamp(this.values[key] + delta * intensity);
    }
    this.lastEvent = event;
    this.rebalance();
    return this.snapshot();
  }

  rebalance() {
    if (this.values.happiness > 75) this.values.sadness = clamp(this.values.sadness - 2);
    if (this.values.anger > 70) this.values.happiness = clamp(this.values.happiness - 3);
    if (this.values.fear > 70) this.values.energy = clamp(this.values.energy - 4);
    if (this.values.trust < 20) this.values.anger = clamp(this.values.anger + 2);
  }

  reset() {
    this.values = {...DEFAULT_EMOTIONS};
    this.lastEvent = "reset";
  }
}
