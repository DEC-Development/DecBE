export default class BidirectionalMap extends Map {
    has(key) {
        return super.has(key);
    }
    get(key) {
        return super.get(key);
    }
    set(key, value) {
        super.set(key, value);
        super.set(value, key);
        return this;
    }
    delete(key) {
        if (!this.has(key))
            return false;
        const value = this.get(key);
        if (value === undefined)
            return false;
        super.delete(key);
        super.delete(value);
        return true;
    }
}
//# sourceMappingURL=BidirectionalMap.js.map