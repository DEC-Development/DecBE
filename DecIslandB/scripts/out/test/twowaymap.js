"use strict";
(() => {
    class BidirectionalMap extends Map {
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
    const bidirectionalMap = new BidirectionalMap();
    bidirectionalMap.set(1, 'one');
    console.log(bidirectionalMap.get(1)); // 输出 'one'
    console.log(bidirectionalMap.get('one')); // 输出 1
    bidirectionalMap.delete(1);
    console.log(bidirectionalMap.has(1)); // 输出 false
    console.log(bidirectionalMap.has('one')); // 输出 false
})();
//# sourceMappingURL=twowaymap.js.map