import ExSystem from "../../utils/ExSystem.js";
export function eventDecoratorFactory(manager, target) {
    for (let i of ExSystem.keys(target)) {
        const v = Reflect.getMetadata("eventName", target, i);
        if (v) {
            const condition = Reflect.getMetadata("eventCondition", target, i);
            for (let index = 0; index < v.length; index++) {
                if (condition[index]) {
                    manager.register(v[index], (e) => {
                        if (condition[index](target, e)) {
                            target[i].call(target, e);
                        }
                    });
                }
                else {
                    manager.register(v[index], target[i].bind(target));
                }
            }
        }
    }
}
export function registerEvent(eventName, condition) {
    return function (target, propertyName, descriptor) {
        let v1 = Reflect.getMetadata("eventName", target, propertyName), v2 = Reflect.getMetadata("eventCondition", target, propertyName);
        if (!v1) {
            v1 = [], v2 = [];
            Reflect.defineMetadata("eventName", v1, target, propertyName);
            Reflect.defineMetadata("eventCondition", v2, target, propertyName);
        }
        v1.push(eventName);
        v2.push(condition);
    };
}
//# sourceMappingURL=eventDecoratorFactory.js.map