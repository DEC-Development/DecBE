"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function testBridge() {
    const send = (id, msg) => {
        setTimeout(() => {
            receiver.map(v => v({ id, message: msg }));
        }, 10);
    };
    const receiver = [];
    ;
    ;
    class SignType {
        constructor(name, transName) {
            this.name = name;
            this.transName = transName;
        }
        equals(sign) {
            return this.name == sign.name;
        }
    }
    const SIGN = {
        TypeGetterSign: new SignType("TypeGetterSign", "sign<tg>"),
        FunctionCallSign: new SignType("FunctionCallSign", "sign<fc>"),
        VarAddressGetterSign: new SignType("VarAddressGetterSign", "sign<vag>"),
        IsFunctionSign: new SignType("IsFunctionSign", "sign<isf>"),
        IsNotFunctionSign: new SignType("IsNotFunctionSign", "sign<isnf>")
    };
    function keys(obj) {
        const keys = Reflect.ownKeys(obj);
        let i = obj.__proto__;
        while (i) {
            for (let key of Reflect.ownKeys(i)) {
                keys.push(key);
            }
            i = i.__proto__;
        }
        return keys;
    }
    ;
    ;
    ;
    function eventGetter(filter) {
        return new Promise((resolve, reject) => {
            const res = (data) => {
                if (filter(data)) {
                    resolve(data);
                    receiver.splice(receiver.indexOf(res), 1);
                }
            };
            receiver.push(res);
        });
    }
    ;
    /**
     * * 生成指定范围内的随机整数
     *
     * @param {number} min - 范围的最小值（包含在内）
     *
     * @param {number} max - 范围的最大值（包含在内）
     *
     * @returns {number} 返回 min 和 max 之间的一个随机整数, 包括 min 和 max
     */
    function randomFloor(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    ;
    /**
     * * 生成符合规范的简化序列号
     *
     * @returns {string} - 返回一个基于当前时间戳和随机数的简化序列号
     */
    function BriefID() {
        /**
         * * 获取当前时间戳的后16位作为时间部分
         */
        const timePart = (new Date().getTime() & 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
        /**
         * * 获取一个随机数作为随机部分
         */
        const randomPart = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0').toUpperCase();
        /**
         * * 计算时间部分和随机部分之间的差值
         */
        const difference = (parseInt(randomPart, 16) - parseInt(timePart, 16) + 0x10000) % 0x10000;
        /**
         * * 将差值转换为4位十六进制字符串
         */
        const differencePart = difference.toString(16).padStart(4, '0').toUpperCase();
        // 拼接各部分以形成完整的ID字符串
        return `${randomPart}-${differencePart}-${timePart}`;
    }
    ;
    /**
     * * 定义了一个协议拦截器类, 用于处理函数调用前后的一些自定义逻辑
     */
    class ProtocolInterceptors {
        /**
         * * 当函数被调用时触发, 执行具体的函数并返回结果
         *
         * @param {ExportFunctionType} [func] 要被调用的函数
         *
         * @param {string} [name] 函数名
         *
         * @param {TransmissionDataType[]} [parameters] 函数参数列表
         *
         * @returns {Promise<TransmissionDataType>} - 返回函数执行的结果
         */
        onCalled(func, name, parameters) {
            return func(...parameters);
        }
        ;
        /**
         * * 在调用函数之前触发, 可以用于修改函数参数或执行一些前置处理
         *
         * @param callback 调用函数的回调
         *
         * @param {string} functionName 函数名
         *
         * @param {TransmissionDataType[]} parameters 函数参数列表
         *
         * @param {number} timeout 超时时间, 默认为200秒
         *
         * @param {server.Entity | server.Player | undefined} source 调用源, 可以是玩家或实体
         *
         * @returns {Promise<TransmissionDataType[]>} 返回回调执行的结果
         */
        onCalling(callback, functionName, parameters, timeout) {
            return callback(functionName, parameters, timeout);
        }
        ;
    }
    ;
    /**
     * * 统一推送协议
     */
    class BridgeProtocol {
        /**
         * * 构建 统一推送协议 对象 并 初始化拦截器
         */
        constructor() {
            /**
             * * 协议信息
             */
            this.protocolMessage = {
                /**
                 * * 协议版本
                 */
                protocolVersion: "v1.0.4.24.11.15",
                /**
                 * * 架构作者
                 */
                architectureAuthor: "aa剑侠",
                /**
                 * * 协议作者
                 */
                protocolAuthor: "钛宇-星光阁",
                /**
                 * * 协议发布时间
                 */
                releaseDate: "2024-11-14",
                /**
                 * * 联系方式
                 */
                contactEmail: "1965304849@qq.com"
            };
            /**
             * * 创建项目标识符 (用于标识项目) 默认采用简化序列号
             */
            this.projectId = BriefID();
            /**
             * * 接入 统一推送协议 的 函数列表
             */
            this.functionList = new Map();
            // 初始化协议拦截器对象
            this.protocolInterceptors = new ProtocolInterceptors();
            this.memoryAddress = new Map();
            this.memoryAddressGetter = new Map();
            // 初始化接收处理
            this.initReceive();
        }
        ;
        /**
         * * 初始化接收事件处理
         *
         * * 该方法用于订阅脚本事件接收通道, 处理接收到的数据并调用相应的功能函数
         */
        initReceive() {
            // 订阅脚本事件接收通道, 当有事件到达时处理数据
            receiver.push((data) => __awaiter(this, void 0, void 0, function* () {
                // 忽略带有返回结果的事件, 避免循环处理
                if (data.message.startsWith('return+'))
                    return;
                const name = data.id.split(':')[1];
                let getFunction = this.functionList.get(name);
                if (name.indexOf(".") !== -1) {
                    const [moduleLocation, functionName] = name.split(".");
                    const object = this.memoryAddress.get(parseInt(moduleLocation));
                    getFunction = object[functionName];
                    if (getFunction instanceof Function)
                        getFunction = getFunction.bind(object);
                }
                let sendbackMsg = (msg) => {
                    console.warn("return+" + msg);
                    send(data.id, `return+${msg}`);
                };
                /**
                 * * 将接收到的 数据 转换为 函数可用 的 参数数组
                 */
                const parameters = this.dataToTransmitString(data);
                //其他获取
                let result;
                if (parameters.length === 1 && parameters[0] instanceof SignType) {
                    if (parameters[0].equals(SIGN.TypeGetterSign)) {
                        if (getFunction instanceof Function) {
                            result = [SIGN.IsFunctionSign];
                        }
                        else {
                            result = [SIGN.IsNotFunctionSign, getFunction];
                        }
                    }
                }
                else {
                    // 函数调用
                    // 如果未找到对应的函数, 则不进行后续处理
                    if (getFunction === undefined)
                        return;
                    // 捕获函数执行过程中的异常
                    try {
                        if (getFunction instanceof Function) {
                            result = [this.protocolInterceptors.onCalled(getFunction, name, parameters)];
                        }
                        else {
                            result = [getFunction];
                            // throw new Error(`${name} is not a function`);
                        }
                        // 将处理结果通过命令形式返回给发送方
                    }
                    catch (error) {
                        //如果报错，返回报错
                        let errorFlow = '';
                        if (error instanceof Error)
                            errorFlow = (error.name + " : " + error.message + "\n" + error.stack);
                        else
                            errorFlow = errorFlow + (error);
                        result = [errorFlow];
                    }
                }
                if (!result)
                    throw new Error('result is undefined');
                sendbackMsg(this.arrayToTransmitString(result));
            }));
        }
        ;
        /**
         * * 向统一推送 的 功能列表 中 添加 或 更新功能
         *
         * * 此方法允许通过 键值对 的形式, 将 功能函数 添加 或 更新到 功能列表 中
         *
         * @param {Function} [func] - 要导出的函数
         *
         * @param {string} [functionName] - 函数公开名, 默认为函数名
         */
        exportFunction(func, functionName = func.name) {
            this.functionList.set(functionName, func);
        }
        ;
        /**
         * * 设置导出功能函数
         *
         * * 该方法允许传入多种形式的参数来定义导出函数
         *
         * * 可以是单个函数, 函数数组, 或者包含函数名称和函数本身的数组, 以适应不同的使用场景
         *
         * @param func 导出函数的定义, 可以是以下多种形式：
         *
         * - ExportFunctionType<any>：单个导出函数
         *
         * - ExportFunctionType<any>[]：导出函数的数组
         *
         * - [string, ExportFunctionType<any>][]：包含函数名称和函数本身的数组
         *
         * - [string, ExportFunctionType<any>]：单一的包含函数名称和函数本身的数组
         */
        set exportFunctions(func) {
            // 如果传入的是一个函数实例, 则直接调用exportFunction方法
            if (func instanceof Function) {
                this.exportFunction(func);
            }
            // 如果传入的是一个长度为2的数组, 且第一个元素是字符串, 第二个元素是函数, 则调用exportFunction方法, 并传入函数名称
            else if (func instanceof Array && func.length === 2 && typeof func[0] === 'string' && typeof func[1] === 'function') {
                this.exportFunction(func[1], func[0]);
            }
            // 对于其他情况, 遍历数组, 递归调用exportFunctions方法
            else {
                for (const item of func) {
                    this.exportFunctions = item;
                }
            }
        }
        ;
        /**
         * * 对一个模块进行解析，并返回一个可以进行调用的模块
         *
         *
         * @param {ExportFunctionUnion} [module] 模块实例, 该实例应为 ExportFunctionUnion 类型, 表示它可以是多个可能的导出函数类型
         *
         * @returns {T} 返回一个可被调用的模块
         */
        solve(module) {
            return new Proxy(module, {
                /**
                 * 当尝试设置代理对象的属性时触发
                 *
                 * 此处通过抛出错误来禁止设置属性, 确保模块的导出函数不会被外部直接修改
                 */
                "set": () => {
                    throw new Error("Cannot set property");
                },
                /**
                 * 当访问代理对象的属性时触发
                 *
                 * 该方法拦截对模块导出函数的调用, 并允许在实际调用之前执行额外的操作, 如参数处理等
                 *
                 * @param {ExportFunctionUnion} [_target] 代理的目标对象, 即传入的模块实例
                 *
                 * @param {string | symbol}  [name] 被访问的属性名称, 此处应为导出函数的名称
                 *
                 * @returns 返回一个函数, 该函数在被调用时会调用call方法, 并传入函数名和参数
                 */
                "get": (_target, name) => {
                    return (...para) => {
                        return this.call(name.toString(), para);
                    };
                }
            });
        }
        ;
        call(functionName_1, parameters_1) {
            return __awaiter(this, arguments, void 0, function* (functionName, parameters, timeout = 20 * 10) {
                const data = yield this.protocolInterceptors.onCalling((_functionName, _parameters, _timeout) => {
                    let res = this.post(_functionName, SIGN.FunctionCallSign, _parameters, _timeout);
                    return res;
                }, functionName, parameters, timeout);
                return data[0];
            });
        }
        ;
        post(functionName_1, typePost_1, parameters_1) {
            return __awaiter(this, arguments, void 0, function* (functionName, typePost, parameters, timeout = 20 * 10) {
                const callId = '-' + randomFloor(1000, 9999);
                if (!(typePost.equals(SIGN.FunctionCallSign)))
                    parameters = [typePost];
                if (!parameters)
                    throw new Error('Error in parameters');
                const arrayTransData = this.arrayToTransmitString(parameters);
                console.warn("postMessage: " + functionName + arrayTransData);
                const testDeclare = (data) => data.split(/:/)[0] == this.projectId + callId && data.split(/:/)[1] == functionName;
                // 执行命令以触发脚本事件, 并传递调用ID和参数
                send(`${this.projectId + callId}:${functionName}`, arrayTransData);
                const data = this.dataToTransmitString(yield eventGetter((data) => testDeclare(data.id) && data.message.split('+')[0] == 'return'));
                // 返回处理后的数据
                return data;
            });
        }
        ;
        callObject(objectAddress_1, functionName_1, parameters_1) {
            return __awaiter(this, arguments, void 0, function* (objectAddress, functionName, parameters, timeout = 20 * 10) {
                const data = this.call(objectAddress + "." + functionName, parameters !== null && parameters !== void 0 ? parameters : [], timeout);
                return data;
            });
        }
        dataToArray(data) {
            /**
             * * 待转换的字符串数组
             *
             * * 根据消息是否以"return+"开头, 决定是否分割字符串以获取实际待转换的部分
             *
             * * 然后按分号分割字符串, 得到每个单独的值进行后续处理
             */
            const strArray = (data.message.startsWith("return+") ? data.message.split("+")[1] : data.message).split(/;/);
            /**
             * *将字符串转换为 JSONArray
             *
             * *遍历每个字符串值, 尝试将其转换为相应的数据类型
             */
            const convertedArray = strArray.map(value => {
                /**
                 * * 尝试转换为数字
                 */
                const number = Number(value.trim());
                // 如果值是数值的字符串形式, 转换为数值
                if (!isNaN(number))
                    return number;
                // 如果值是 "true", 转换为布尔值 true
                else if (value.toLowerCase() === 'true')
                    return true;
                // 如果值是 "false", 转换为布尔值 false
                else if (value.toLowerCase() === 'false')
                    return false;
                // 如果值是一个数组, 移除方括号并按逗号分割
                else if (value.startsWith('[') && value.endsWith(']'))
                    return value.slice(1, -1).split(',').map(value => {
                        /**
                         * * 尝试将数组元素转换为数字
                         */
                        const parsedNumber = Number(value.trim());
                        // 如果值是数值的字符串形式, 转换为数值
                        if (!isNaN(parsedNumber))
                            return parsedNumber;
                        // 如果不是, 返回原始字符串
                        return value.trim();
                    });
                try {
                    /**
                     * * 尝试将字符串转换为 JSON 对象
                     */
                    const json = JSON.parse(value);
                    // 如果解析成功 则 返回 JSON 对象
                    if (typeof json === 'object' && json !== null)
                        return json;
                }
                // 如果解析失败, 返回原始字符串
                catch (_a) {
                    // 返回原始字符串
                    return value.trim();
                }
            });
            // 返回转换后的数组
            return convertedArray;
        }
        ;
        dataToTransmitString(data) {
            const parameters = this.dataToArray(data).map(type => {
                // 如果是字符串, 则尝试将其转换为 游戏实例对象 或 数字 或 字符串
                if (typeof type === 'string')
                    return this.typeConversion(type);
                // 如果是数组, 则尝试将其转换为 游戏实例对象 或 数字 或 字符串 的 数组
                else if (Array.isArray(type))
                    return type.map(value => {
                        // 对数组中的每个字符串, 尝试将其转换为 游戏实例对象 或 数字 或 字符串
                        if (typeof value === 'string')
                            return this.typeConversion(value);
                    });
                // 如果不是字符串或数组, 则直接返回原始值
                else
                    return type;
            });
            // 返回转换后的参数数组
            return parameters;
        }
        ;
        /**
         * * 解析特定的转义字符, 并将其转换为相应的对象引用。
         *
         * @param {string} [data] - 要解析的字符串数据。
         *
         * @param {server.Entity} [self] - 可选的自身实体对象, 用于获取块或维度信息。
         *
         * @param {server.Entity} [target] - 可选的目标实体对象, 用于替换'target'字符串。
         *
         * @returns {server.Entity | server.Block | server.Dimension | string} 解析后的对象或原始字符串。
         */
        typeConversion(data) {
            if (data.startsWith('x<') && data.endsWith('>'))
                return this.dataToJSON(data.slice(2, -1));
            else if (data.startsWith('object<') && data.endsWith('>')) {
                const [addressStr, keysStr] = data.slice(7, -1).split("|");
                const address = parseInt(addressStr);
                const keys = JSON.parse(keysStr);
                const inferrence = this;
                let firstThen = true;
                return new Proxy(new Object(), {
                    "get": function (target, prop) {
                        if (prop === 'then' && firstThen) {
                            firstThen = false;
                            return undefined;
                        }
                        if (!keys.includes(String(prop))) {
                            return inferrence.callObject(address, String(prop), []).then(type => {
                                return type;
                            });
                        }
                        else {
                            return (...args) => {
                                return inferrence.callObject(address, String(prop), args);
                            };
                        }
                    }
                });
            }
            else if (data === SIGN.IsFunctionSign.transName)
                return SIGN.IsFunctionSign;
            else if (data === SIGN.IsNotFunctionSign.transName)
                return SIGN.IsNotFunctionSign;
            else if (data === SIGN.TypeGetterSign.transName)
                return SIGN.TypeGetterSign;
            else if (data === SIGN.VarAddressGetterSign.transName)
                return SIGN.VarAddressGetterSign;
            // 如果数据不包含任何转义字符, 直接返回原始数据
            else
                return data;
        }
        ;
        /**
         * * 将字符串数据转换为JSON对象
         *
         * * 此函数旨在处理特定格式的字符串, 将其转换为易于操作的JSON对象
         *
         * * 它通过解析字符串中的键值对, 并根据特定规则转换值的类型（如数字、布尔值等）, 来构建JSON对象
         *
         *
         * @param {string} [data] - 以特定格式传递的字符串数据, 格式为"key1=value1:key2=value2"
         *
         * @returns {JSONObject} 返回一个JSONObject, 其中包含解析后的键值对
         */
        dataToJSON(data) {
            /**
             * * 初始化一个空对象来存储键值对
             */
            const result = {};
            /**
             * * 分割字符串以获取键值对
             */
            const pairs = data.split(':');
            // 遍历每个键值对
            pairs.forEach(pair => {
                /**
                 * * 获取 当前键值对 的键
                 */
                const key = pair.split('=')[0];
                /**
                 * * 获取 当前键值对 的值
                 */
                const value = pair.split('=')[1];
                /**
                 * * 尝试转换为数字
                 */
                const number = Number(value.trim());
                // 如果值是一个数组, 移除方括号并按逗号分割
                if (value.startsWith('[') && value.endsWith(']'))
                    result[key] = value.slice(1, -1).split(',').map(value => {
                        /**
                         * * 尝试将数组元素转换为数字
                         */
                        const parsedNumber = Number(value.trim());
                        // 如果值是数值的字符串形式, 转换为数值
                        if (!isNaN(parsedNumber))
                            return parsedNumber;
                        // 如果不是, 返回原始字符串
                        return value.trim();
                    });
                // 如果值是 "true", 转换为布尔值 true
                else if (value.toLowerCase() === 'true')
                    result[key] = true;
                // 如果值是 "false", 转换为布尔值 false
                else if (value.toLowerCase() === 'false')
                    result[key] = false;
                // 如果值是数值的字符串形式, 转换为数值
                else if (!isNaN(number))
                    result[key] = number;
                // 否则, 直接使用字符串值
                else
                    result[key] = value;
            });
            return result;
        }
        ;
        /**
         * * 将数组转换为自定义字符串表示, 方便传输
         * * 并将它们用分号( ; )分隔
         */
        arrayToTransmitString(array) {
            /**
             * * 将数组中的每个元素根据其类型转换为字符串
             */
            const elements = array.map((element) => {
                // 如果元素为null，直接返回字符串"null"
                if (element === null)
                    return 'null';
                // 对于 undefined, 直接返回字符串"undefined"
                if (element === undefined)
                    return 'undefined';
                // 对于布尔类型, 使用其toString方法转换为字符串
                if (typeof element === 'boolean')
                    return element.toString();
                // 对于字符串类型, 直接使用其toString方法
                if (typeof element === 'string')
                    return element.toString();
                // 对于数字类型, 使用其toString方法转换为字符串
                if (typeof element === 'number')
                    return element.toString();
                // 如果元素是数组
                if (Array.isArray(element)) {
                    // 如果数组中元素不是特定类型，使用join方法拼接为字符串
                    return '[' + element.join(',') + ']';
                }
                if (element instanceof SignType) {
                    if (element.equals(SIGN.FunctionCallSign))
                        return SIGN.FunctionCallSign.transName;
                    if (element.equals(SIGN.IsFunctionSign))
                        return SIGN.IsFunctionSign.transName;
                    if (element.equals(SIGN.IsNotFunctionSign))
                        return SIGN.IsNotFunctionSign.transName;
                    if (element.equals(SIGN.TypeGetterSign))
                        return SIGN.TypeGetterSign.transName;
                    if (element.equals(SIGN.VarAddressGetterSign))
                        return SIGN.VarAddressGetterSign.transName;
                }
                if ("__remote" in element) {
                    if (this.memoryAddressGetter.has(element)) {
                        return this.memoryAddressGetter.get(element);
                    }
                    else {
                        const address = randomFloor(-1000000, 10000000);
                        this.memoryAddressGetter.set(element, address);
                        this.memoryAddress.set(address, element);
                        return `object<${address}|${JSON.stringify(keys(element).filter(e => {
                            return element[e] instanceof Function && !e.toString().startsWith("_");
                        }))}>`;
                    }
                }
                // 对于其他对象类型，使用JSON.stringify方法转换为字符串
                return JSON.stringify(element);
            });
            // 将转换后的元素字符串用分号( ; )连接, 形成最终的字符串表示
            return elements.join(';');
        }
        ;
    }
    ;
    /**
     *
     * * 本系统仅为一套协议, 不涉及任何具体功能
     *
     * * 各项功能应由各个模组自己独立实现
     *
     * * 推送系统仅作为推送数据的载体
     *
     * * 推送系统不涉及任何数据处理
     *
     * * 推送系统不涉及任何数据存储
     *
     */
    const bridge = new BridgeProtocol();
    //端1
    function client1() {
        class Vector2 {
            constructor(x, y) {
                this.__remote = true;
                this.pi = 3.14;
                this.x = x;
                this.y = y;
            }
            add(a, b) {
                return new Vector2(a + this.x, this.y + b);
            }
        }
        function newVector2(a, b) {
            return new Vector2(a, b);
        }
        bridge.exportFunction(newVector2);
    }
    //端2
    function client2() {
        return __awaiter(this, void 0, void 0, function* () {
            class Vector2 {
                constructor(x, y) {
                    this.__remote = true;
                }
                add(a, b) {
                    return new Vector2(0, 0);
                }
            }
            let exportTest = {
                exportId: "",
                "newVector2": (a, b) => {
                    return new Vector2(a, b);
                }
            };
            const vec = yield bridge.solve(exportTest).newVector2(1, 2);
            console.warn((yield vec.add(999, 2)).x);
            console.warn(yield vec.pi);
        });
    }
}
testBridge();
//# sourceMappingURL=bridge.js.map