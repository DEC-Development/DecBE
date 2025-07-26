// 用于在 worldLoad 后延迟初始化静态属性
import { world } from "@minecraft/server";
/**
 * 直接装饰静态变量，worldLoad后自动赋值
 * 用法：@lateinit(() => world.gameRules) static gamerules: GameRules;
 */
export default function lateinit(initializer) {
    return function (target, propertyKey) {
        world.afterEvents.worldLoad.subscribe(() => {
            target[propertyKey] = initializer();
        });
    };
}
//# sourceMappingURL=lateinit.js.map