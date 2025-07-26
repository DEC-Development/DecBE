export function zeroIfNaN(i) {
    const s = (typeof i === "string" ? parseFloat(i) : i);
    return isNaN(s) ? 0 : s;
}
export function falseIfError(func) {
    try {
        return func();
    }
    catch (err) {
        return false;
    }
}
export function minecraft(str) {
    if (str.startsWith("minecraft:")) {
        return str;
    }
    else {
        return "minecraft:" + str;
    }
}
//# sourceMappingURL=tool.js.map