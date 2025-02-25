export class HexTile {
    constructor(id, task, description, conditions, rules, tier, url) {
        this.id = id;
        this.task = task;
        this.description = description;
        this.conditions = conditions;
        this.rules = rules;
        this.tier = tier;
        this.url = url;
        this.location = [];
        this.unlockable = false;
        this.unlocked = false;
        this.completed = false;
    }
}