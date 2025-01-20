var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/*
 * 原版接口
 */
import * as server from "@minecraft/server";
;
;
/**
 * * 定义一个接口，用于标识远程控制对象
 *
 * * 这个接口的主要作用是通过类型系统标记某个对象是否具有远程控制的能力
 *
 * @interface RemoteCtrlObject
 *
 * @property {boolean} __remote - 一个布尔值属性，用于标识该对象是否为远程控制对象
 */
export class RemoteCtrlObject {
    constructor() {
        this.__remote = true;
    }
    dispose() {
        if (bridge.memoryAddressGetter.has(this)) {
            bridge.memoryAddress.delete(bridge.memoryAddressGetter.get(this));
        }
    }
}
;
;
/**
 * 表示一种符号类型，提供基本的信息和比较功能。
 */
export class SignType {
    /**
     * 构造一个 SignType 实例。
     * @param name 符号类型的名称，用于唯一标识该符号。
     * @param transName 符号类型的翻译名称，用于国际化显示。
     */
    constructor(name, transName) {
        this.name = name;
        this.transName = transName;
    }
    ;
    /**
     * 比较当前符号类型是否与另一个符号类型相同。
     * 比较基于名称属性的一致性。
     * @param sign 要比较的另一个符号类型。
     * @returns 如果名称相同则返回 true，否则返回 false。
     */
    equals(sign) {
        return this.name == sign.name;
    }
}
;
/**
 * SIGN对象定义了一系列签名类型，用于在程序中标识不同的操作或表达式类型
 *
 * 每种签名类型都是SignType的实例，具有唯一的名称和符号表示
 */
export const SIGN = {
    // 类型获取签名，用于标识类型获取操作
    TypeGetterSign: new SignType("TypeGetterSign", "sign<tg>"),
    // 函数调用签名，用于标识函数调用操作
    FunctionCallSign: new SignType("FunctionCallSign", "sign<fc>"),
    // 变量地址获取签名，用于标识变量地址获取操作
    VarAddressGetterSign: new SignType("VarAddressGetterSign", "sign<vag>"),
    // 函数标识签名，用于标识某个实体是函数
    IsFunctionSign: new SignType("IsFunctionSign", "sign<isf>"),
    // 非函数标识签名，用于标识某个实体不是函数
    IsNotFunctionSign: new SignType("IsNotFunctionSign", "sign<isnf>")
};
/**
 * 获取对象及其原型链上的所有键
 *
 * 此函数的目的是深入对象的原型链，收集从对象本身到原型链末端的所有键
 *
 * 这包括了对象自身的属性和方法，以及其所有原型上的可枚举和不可枚举属性
 *
 * @param obj {any} - 输入的对象，将要检索其键
 *
 * @returns {Array} - 包含对象及其原型链上所有键的数组
 */
function keys(obj) {
    // 从对象本身开始，获取其所有键，包括可枚举和不可枚举的
    const keys = Reflect.ownKeys(obj);
    // 初始化指向对象的原型
    let i = obj.__proto__;
    // 遍历原型链，直到达到原型链的末端
    while (i) {
        // 遍历当前原型的所有键
        for (let key of Reflect.ownKeys(i)) {
            // 将键添加到结果数组中
            keys.push(key);
        }
        // 移动到下一个原型
        i = i.__proto__;
    }
    ;
    // 返回收集到的所有键
    return keys;
}
;
;
/**
 * * 创建一个 Promise, 该 Promise 在指定事件发生时解析
 *
 * @param {EventListener<T>} [lis] 事件监听器对象, 用于订阅和取消订阅事件
 *
 * @param {number} [timeout] 超时时间, 默认为 200 tick
 *
 * @param {(e: T) => boolean} [filter] 过滤函数, 用于判断事件是否满足条件
 *
 * @param {string} [type] 事件类型
 *
 * @returns {Promise<T>} 返回一个 Promise, 当满足条件的事件发生时解析, 否则在超时后拒绝
 */
function eventGetter(lis, timeout = 20 * 10, filter, type) {
    return new Promise((resolve, reject) => {
        /**
         * * 定义过滤函数, 当事件满足条件时, 取消订阅并返回事件
         *
         * @param {T} [e] 事件对象
         */
        const f = (e) => {
            if (filter(e)) {
                lis.unsubscribe(f);
                resolve(e);
            }
        };
        // 订阅事件
        lis.subscribe(f);
        // 设置超时, 如果超时未触发事件, 则取消订阅并拒绝 Promise
        server.system.runTimeout(() => {
            lis.unsubscribe(f);
            reject(`${type} Timeout after ${timeout}ms`);
        }, timeout);
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
     * * 获取当前时间戳的后 16 位 作为时间部分
     */
    const timePart = (server.system.currentTick & 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
    /**
     * * 获取一个随机数作为随机部分
     */
    const randomPart = Math.floor(Math.random() * 0x10000).toString(16).padStart(4, '0').toUpperCase();
    /**
     * * 计算时间部分和随机部分之间的差值
     */
    const difference = (parseInt(randomPart, 16) - parseInt(timePart, 16) + 0x10000) % 0x10000;
    /**
     * * 将差值转换为 4 位 十六进制 字符串
     */
    const differencePart = difference.toString(16).padStart(4, '0').toUpperCase();
    // 拼接各部分以形成完整的ID字符串
    return `${randomPart}-${differencePart}-${timePart}`;
}
;
/**
 * * 定义了一个协议拦截器类, 用于处理函数调用前后的一些自定义逻辑
 */
export class ProtocolInterceptors {
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
    onCalling(callback, functionName, parameters, timeout, source) {
        return callback(functionName, parameters, timeout, source);
    }
    ;
}
;
/**
 * * 统一推送协议
 */
export class BridgeProtocol {
    /**
     * * 构造函数用于初始化通信相关的数据结构和拦截器
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
        this.functionList = new Map([['help', () => { this.help(); }]]);
        /**
         * * 当前包函数 的 文本描述 用于 在游戏中反馈给调用者
         */
        this.describe = [];
        // 初始化协议拦截器对象
        this.protocolInterceptors = new ProtocolInterceptors();
        // 初始化内存地址获取器映射表
        this.memoryAddressGetter = new Map();
        // 初始化内存地址映射表
        this.memoryAddress = new Map();
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
        server.system.afterEvents.scriptEventReceive.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            // 忽略带有返回结果的事件, 避免循环处理
            if (data.message.startsWith('return+'))
                return;
            /**
             * * 获取 本次通讯 期望引用 的 函数 的 名称
             */
            const name = data.id.split(':')[1];
            /**
             * * 从 功能列表中 查询对应 的 函数
             */
            let getFunction = this.functionList.get(name);
            // 如果函数名包含".",则表示需要从对象中获取函数
            if (name.indexOf(".") !== -1) {
                /**
                 * * 将函数名按"."分割为模块名和函数名
                 */
                const [targetId, moduleLocation, functionName] = name.split(".");
                if (targetId !== this.projectId)
                    return;
                /**
                 * * 从内存地址映射表中获取对象
                 */
                const object = this.memoryAddress.get(parseInt(moduleLocation));
                // 尝试从对象中获取函数
                getFunction = object[functionName];
                // 如果获取到的是函数，则将其绑定到对象上
                if (getFunction instanceof Function)
                    getFunction = getFunction.bind(object);
            }
            ;
            /**
             * * 定义函数调用结果的处理函数，用于将结果发送回调用方
             *
             * @param msg - 待发送的消息
             */
            let sendbackMsg = (msg) => {
                server.world.getDimension('overworld').runCommand(`scriptevent ${data.id} return+${msg}`);
            };
            /**
             * * 将接收到的数据转换为函数可用的参数数组
             */
            const parameters = this.dataToTransmitString(data);
            /**
             * * 初始化传输数据类型
             */
            let result;
            // 如果参数只有一个且是获取类型的标识，则处理函数类型查询
            if (parameters.length === 1 && parameters[0] instanceof SignType) {
                // 如果是类型查询标识，则返回函数类型标识
                if (parameters[0].equals(SIGN.TypeGetterSign)) {
                    // 如果是函数，返回函数标识
                    if (getFunction instanceof Function) {
                        result = [SIGN.IsFunctionSign];
                    }
                    // 如果不是函数，返回非函数标识和值
                    else {
                        result = [SIGN.IsNotFunctionSign, getFunction];
                    }
                }
            }
            else {
                // 如果未找到对应的函数，则不进行后续处理
                if (getFunction === undefined)
                    return;
                // 尝试调用函数，并捕获可能发生的异常
                try {
                    // 如果是函数，则调用并处理结果
                    if (getFunction instanceof Function) {
                        result = [this.protocolInterceptors.onCalled(getFunction, name, parameters)];
                    }
                    // 如果不是函数，则直接返回值
                    else {
                        result = [getFunction];
                        // throw new Error(`${name} is not a function`);
                    }
                }
                // 如果发生异常，构造错误信息并返回
                catch (error) {
                    let errorFlow = '';
                    if (error instanceof Error)
                        errorFlow = (error.name + " : " + error.message + "\n" + error.stack);
                    else
                        errorFlow = errorFlow + (error);
                    result = [errorFlow];
                }
            }
            // 如果结果未定义，则抛出错误
            if (!result)
                throw new Error('result is undefined');
            // 发送处理结果回调用方
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
        this._exportFunction(func, functionName);
    }
    ;
    _exportFunction(func, functionName = func.name) {
        this.functionList.set(functionName, func);
    }
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
            this._exportFunction(func);
        }
        // 如果传入的是一个长度为2的数组, 且第一个元素是字符串, 第二个元素是函数, 则调用exportFunction方法, 并传入函数名称
        else if (func instanceof Array && func.length === 2 && typeof func[0] === 'string' && typeof func[1] === 'function') {
            this._exportFunction(func[1], func[0]);
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
     * * 显示帮助信息的方法
     *
     * * 该方法主要用于向世界广播功能描述、协议版本信息、描述信息和函数列表
     *
     * * 它通过发送消息到服务器的世界频道并打印到控制台来实现
     */
    help() {
        /**
         * * 定义帮助信息的标题
         */
        const title = '=+==+==+==+==+=< 功能描述 >=+==+==+==+==+=';
        /**
         * * 定义函数列表的标题
         */
        const functionListTitle = '=+==+==+==+==+=< 函数列表 >=+==+==+==+==+=';
        /**
         * * 发送消息到世界频道并打印到控制台
         *
         * @param {string} message - 要发送和打印的消息
         */
        const sendMessage = (message) => {
            server.world.sendMessage(message);
            console.log(message);
        };
        // 发送标题和协议版本信息
        sendMessage(title);
        sendMessage(`协议版本: ${this.protocolMessage.protocolVersion}`);
        // 发送描述信息
        this.describe.forEach(value => { var _a; return sendMessage(typeof value !== 'string' ? (_a = value.text) !== null && _a !== void 0 ? _a : JSON.stringify(value) : value); });
        // 发送函数列表标题
        sendMessage(functionListTitle);
        // 发送函数名称列表
        this.functionList.forEach((_, name) => sendMessage(name));
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
    /**
     * 异步调用一个函数，并通过协议拦截器处理调用过程
     *
     * @param functionName 要调用的函数名称
     *
     * @param parameters 函数调用的参数列表，为TransmissionDataType类型的数组
     *
     * @param timeout 调用的超时时间，默认为 200 tick（20 * 10）
     *
     * @param source 调用的源，可以是服务器的玩家或实体，用于追踪调用上下文
     *
     * @returns 返回一个Promise，解析为函数调用的结果，类型为TransmissionDataType
     */
    call(functionName, parameters, timeout = 20 * 10, source) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * 通过协议拦截器处理函数调用，以便在调用前后添加额外的处理逻辑
             */
            const data = yield this.protocolInterceptors.onCalling(
            // 定义一个函数，用于实际执行函数调用
            (_functionName, _parameters, _timeout, _source) => {
                /**
                 * 执行函数调用，并返回调用结果
                 */
                let res = this.post(_functionName, SIGN.FunctionCallSign, _parameters, _timeout, _source);
                return res;
            }, functionName, parameters, timeout, source);
            // 返回调用结果的第一个元素，因为结果可能是一个数组，但这里只需要第一个元素
            return data[0];
        });
    }
    /**
     * 异步执行一个脚本事件，并等待结果返回
     *
     * @param functionName 脚本事件的名称
     *
     * @param typePost 签名类型，用于验证和标识事件
     *
     * @param parameters 传递给脚本事件的参数数组
     *
     * @param timeout 等待事件响应的超时时间，默认为200tick
     *
     * @param source 触发脚本事件的来源，可以是玩家或实体，默认为世界维度
     *
     * @returns 返回一个Promise，解析为接收到的事件数据数组
     *
     * 此函数用于向游戏服务器发送脚本事件，并等待相应的响应它主要用于跨系统的数据交互和功能调用
     */
    post(functionName, typePost, parameters, timeout = 20 * 10, source) {
        return __awaiter(this, void 0, void 0, function* () {
            // 生成一个唯一的调用ID，用于标识和匹配事件响应
            const callId = '-' + randomFloor(1000, 9999);
            // 根据签名类型决定参数的处理方式如果类型不是函数调用签名，则将签名作为第一个参数
            if (!(typePost.equals(SIGN.FunctionCallSign)))
                parameters = [typePost];
            // 如果没有提供参数，则抛出错误
            if (!parameters)
                throw new Error('Error in parameters');
            // 将参数数组转换为传输字符串
            const arrayTransData = this.arrayToTransmitString(parameters);
            // 定义一个测试函数，用于验证接收到的事件是否与当前调用相关
            const testDeclare = (data) => data.split(/:/)[0] == this.projectId + callId && data.split(/:/)[1] == functionName;
            // 执行命令以触发脚本事件, 并传递调用ID和参数
            (source !== null && source !== void 0 ? source : server.world.getDimension('overworld')).runCommand(`scriptevent ${this.projectId + callId}:${functionName} ${arrayTransData}`);
            // 等待脚本事件接收, 并在指定时间内返回结果
            const data = this.dataToTransmitString(yield eventGetter(server.system.afterEvents.scriptEventReceive, timeout, (data) => testDeclare(data.id) && data.message.split('+')[0] == 'return', functionName));
            // 返回处理后的数据
            return data;
        });
    }
    ;
    /**
     * 异步调用指定对象上的方法
     *
     * 此函数封装了对特定对象地址上的方法进行调用的过程它通过将对象地址和函数名
     * 组合来调用相应的方法，并允许传递参数和设置超时此外，还可以指定调用的源
     *
     * @param objectAddress 对象的地址，用于定位对象
     *
     * @param functionName 要调用的方法的名称
     *
     * @param parameters 可选参数，传递给方法的参数数组
     *
     * @param timeout 超时设置，默认为200毫秒
     *
     * @param source 可选参数，指定调用的源可以是玩家或实体
     *
     * @returns 返回一个Promise，解析为方法调用的结果
     */
    callObject(targetId, objectAddress, functionName, parameters, timeout = 20 * 10, source) {
        return __awaiter(this, void 0, void 0, function* () {
            // 组合对象地址和函数名，构造完整的调用路径
            // 调用方法，并传递参数和超时设置，以及可能的调用源
            const data = this.call(targetId + "." + objectAddress + "." + functionName, parameters !== null && parameters !== void 0 ? parameters : [], timeout, source);
            // 返回调用结果
            return data;
        });
    }
    ;
    /**
     * * 将接收到的服务器脚本事件命令消息转换为 JSONArray
     *
     * * 此函数处理的消息格式特殊, 包含多种数据类型表示, 如数字、布尔值、字符串和数组
     *
     * * 它通过一系列的条件判断和转换操作, 将字符串形式的数据转换为相应的JavaScript数据类型
     *
     * @param {server.ScriptEventCommandMessageAfterEvent} [data] 从服务器接收到的脚本事件命令消息, 包含待转换的字符串信息
     *
     * @returns {JSONArray} - 返回一个转换后的 JSONArray, 包含各种 JavaScript 数据类型
     */
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
    /**
     * * 将接收到的 数据 转换为 传输数据 类型数组
     *
     * * 此函数主要用于处理从服务器接收到的脚本事件命令消息, 并将其转换为适合传输的数据类型数组
     *
     * @param {server.ScriptEventCommandMessageAfterEvent} [data] 从服务器接收到的脚本事件命令消息, 包含源实体和命令数据
     *
     * @returns {TransmissionDataType[]} 返回一个传输数据类型数组, 包含转换后的数据
     */
    dataToTransmitString(data) {
        var _a, _b, _c, _d;
        /**
         * * 获取 发送推送信息 的 实体的本身
         */
        const self = data.sourceEntity;
        /**
         * * 获取 发送推送信息 的 实体的目标
         *
         * * 如果源实体有目标, 则使用目标实体；否则, 尝试从源实体的视角方向获取实体列表中的第一个实体作为目标
         */
        const target = (_b = (_a = data.sourceEntity) === null || _a === void 0 ? void 0 : _a.target) !== null && _b !== void 0 ? _b : (_d = (_c = data.sourceEntity) === null || _c === void 0 ? void 0 : _c.getEntitiesFromViewDirection()[0]) === null || _d === void 0 ? void 0 : _d.entity;
        /**
         * * 将字符串转换为实体或数字或字符串
         *
         * * 此步骤旨在将接收到的字符串数据转换为更具体的数据类型, 以便后续处理和传输
         */
        const parameters = this.dataToArray(data).map(type => {
            // 如果是字符串, 则尝试将其转换为 游戏实例对象 或 数字 或 字符串
            if (typeof type === 'string')
                return this.typeConversion(type, self, target);
            // 如果是数组, 则尝试将其转换为 游戏实例对象 或 数字 或 字符串 的 数组
            else if (Array.isArray(type))
                return type.map(value => {
                    // 对数组中的每个字符串, 尝试将其转换为 游戏实例对象 或 数字 或 字符串
                    if (typeof value === 'string')
                        return this.typeConversion(value, self, target);
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
    typeConversion(data, self, target) {
        var _a;
        // 如果数据是'target', 返回目标实体对象
        if (data === 'target')
            return target;
        // 如果数据是'self', 返回自身实体对象
        else if (data === 'self')
            return self;
        // 如果数据以'e<'开头并以'>'结尾, 解析为实体标识符并返回相应的实体对象
        else if (data.startsWith('e<') && data.endsWith('>')) {
            /**
             * * 提取实体标识符
             */
            const entityId = data.slice(2, -1);
            // 获取并返回实体对象
            return server.world.getEntity(entityId);
        }
        // 解析以'es<'开头并以'>'结尾的数据, 将其转换为实体查询选项, 并获取符合条件的实体列表
        else if (data.startsWith('es<') && data.endsWith('>')) {
            /**
             * * 移除前后标记并解析为 JSON 对象
             */
            const proto = this.dataToJSON(data.slice(3, -1));
            /**
             * * 创建一个空对象, 用于存储实体查询选项
             */
            const options = {};
            /**
             * * 创建一个映射, 用于将简写键替换为实际的查询选项键
             */
            const replace = new Map([
                ['c', 'closest'],
                ['r', 'maxDistance'],
                ['rm', 'minDistance'],
                ['tags', 'tags'],
                ['_tags', 'excludeTags'],
                ['familys', 'families'],
                ['_familys', 'excludeFamilies'],
                ['name', 'name'],
                ['_names', 'excludeNames'],
                ['type', 'type'],
                ['_types', 'excludeTypes'],
                ['rx', 'maxVerticalRotation'],
                ['rxm', 'minVerticalRotation'],
                ['ry', 'maxHorizontalRotation'],
                ['rym', 'minHorizontalRotation'],
            ]);
            // 遍历解析后的JSON对象的键
            Object.keys(proto).forEach(key => {
                /**
                 * * 将简写键替换为实际的查询选项键
                 */
                const newKey = replace.get(key);
                // 如果替换成功, 则将该选项添加到查询选项中
                if (newKey)
                    options[newKey] = proto[key];
            });
            // 如果没有指定发信源实体, 则抛出错误
            if (!self)
                throw new Error('实体转义符 => 解析错误: 需要指定 发信源实体');
            // 使用查询选项获取符合条件的实体列表
            return self.dimension.getEntities(Object.assign({ location: self.location }, options));
        }
        // 如果数据以'b<'开头并以'>'结尾, 解析为块位置并返回相应的块对象
        else if (data.startsWith('b<') && data.endsWith('>')) {
            /**
             * * 获取 转义符信息
             */
            const split = data.slice(2, -1).split('.');
            /**
             * * 提取方块位置
             */
            const [x, y, z] = split.map(x => x.trim()).map(Number);
            // 检查是否提供了正确的参数数量
            if (split.length !== 4)
                throw new Error('方块转义符 => 解析错误: 正确格式为: b<x.y.z.dimension>');
            // 检查[x, y, z]是否都是数值
            if (isNaN(x) || isNaN(y) || isNaN(z))
                throw new Error('方块转义符 => 解析错误: x, y, z 必须是数值');
            // 检查split[3]是否是字符串
            if (typeof split[3] !== 'string')
                throw new Error('方块转义符 => 解析错误: dimension 必须是字符串');
            // 使用自身实体的维度获取块对象
            return (_a = server.world.getDimension(split[3])) === null || _a === void 0 ? void 0 : _a.getBlock({ x, y, z });
        }
        // 如果数据以'd<'开头并以'>'结尾, 解析为维度名称并返回相应的维度对象
        else if (data.startsWith('d<') && data.endsWith('>')) {
            /**
             * * 提取维度名称
             */
            const dimensionName = data.slice(2, -1);
            // 获取并返回维度对象
            return server.world.getDimension(dimensionName);
        }
        // 如果数据以'x<'开头并以'>'结尾, 解析为JSON字符串并返回相应的对象
        else if (data.startsWith('x<') && data.endsWith('>'))
            return this.dataToJSON(data.slice(2, -1));
        // 当数据以 'object<' 开头并以 '>' 结尾时，处理对象代理的创建
        else if (data.startsWith('object<') && data.endsWith('>')) {
            // 提取地址字符串和键字符串，它们之间通过 "|" 分隔
            const [targetID, addressStr, keysStr] = data.slice(7, -1).split("|");
            // 将地址字符串转换为数字
            const address = parseInt(addressStr);
            // 将键字符串解析为字符串数组
            const keys = JSON.parse(keysStr);
            // 保存对当前实例的引用，以便在代理中使用
            const inferrence = this;
            // 标记是否首次访问 'then' 属性
            let firstThen = true;
            // 返回一个代理对象，该代理对象用于拦截对属性的访问
            return new Proxy(new Object(), {
                "get": function (target, prop) {
                    // 如果访问的是 'then' 属性且是首次访问，则标记为已访问并返回 undefined
                    if (prop === 'then' && firstThen) {
                        firstThen = false;
                        return undefined;
                    }
                    // 如果属性键不在已知的键数组中，则远程调用对象方法
                    if (!keys.includes(String(prop))) {
                        // 返回一个 Promise，它将远程调用对象的属性并解析返回的类型
                        return inferrence.callObject(targetID, address, String(prop), []).then(type => {
                            return type;
                        });
                    }
                    else {
                        // 如果属性键在已知的键数组中，则返回一个函数，该函数将调用远程对象的方法
                        return (...args) => {
                            // 返回一个 Promise，它将远程调用对象的方法并传递参数
                            return inferrence.callObject(targetID, address, String(prop), args);
                        };
                    }
                }
            });
        }
        // 当数据等于某个特定符号的传输名称时，返回相应的符号实例
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
                // 如果数组中每个元素都是 Block 实例，调用 blockToString 方法
                if (element.every(value => value instanceof server.Block))
                    return this.blockToString(element);
                // 如果数组中每个元素都是 Entity 实例，调用 entityToString 方法
                if (element.every(value => value instanceof server.Entity))
                    return this.entityToString(element);
                // 如果数组中每个元素都是 Dimension 实例，调用 dimensionToString 方法
                if (element.every(value => value instanceof server.Dimension))
                    return this.dimensionToString(element);
                // 如果数组中元素不是特定类型，使用join方法拼接为字符串
                return '[' + element.join(',') + ']';
            }
            // 如果元素是Block实例，调用blockToString方法
            if (element instanceof server.Block)
                return this.blockToString(element);
            // 如果元素是Entity实例，调用entityToString方法
            if (element instanceof server.Entity)
                return this.entityToString(element);
            // 如果元素是Dimension实例，调用dimensionToString方法
            if (element instanceof server.Dimension)
                return this.dimensionToString(element);
            // 检查元素是否是 SignType 类型的实例
            if (element instanceof SignType) {
                // 如果元素等于 FunctionCallSign，则返回对应的传输名称
                if (element.equals(SIGN.FunctionCallSign))
                    return SIGN.FunctionCallSign.transName;
                // 如果元素等于 IsFunctionSign，则返回对应的传输名称
                if (element.equals(SIGN.IsFunctionSign))
                    return SIGN.IsFunctionSign.transName;
                // 如果元素等于 IsNotFunctionSign，则返回对应的传输名称
                if (element.equals(SIGN.IsNotFunctionSign))
                    return SIGN.IsNotFunctionSign.transName;
                // 如果元素等于 TypeGetterSign，则返回对应的传输名称
                if (element.equals(SIGN.TypeGetterSign))
                    return SIGN.TypeGetterSign.transName;
                // 如果元素等于 VarAddressGetterSign，则返回对应的传输名称
                if (element.equals(SIGN.VarAddressGetterSign))
                    return SIGN.VarAddressGetterSign.transName;
            }
            // 检查元素是否具有 "__remote" 属性，这通常表示它是一个远程对象
            if ("__remote" in element) {
                // 检查内存地址获取器是否已经为该元素分配了地址
                if (this.memoryAddressGetter.has(element)) {
                    // 如果已经分配了地址，则返回该地址
                    return this.memoryAddressGetter.get(element);
                }
                else {
                    // 如果没有分配地址，则生成一个随机的内存地址
                    const address = randomFloor(-1000000, 10000000);
                    // 将元素和生成的地址存储在内存地址获取器中
                    this.memoryAddressGetter.set(element, address);
                    // 同时在内存地址映射中存储元素，以便可以通过地址访问元素
                    this.memoryAddress.set(address, element);
                    // 返回一个对象字符串，包含地址和元素的所有函数键（不包括以 "_" 开头的键）
                    // 这些键将用于在代理中拦截对这些函数的调用
                    return `object<${bridge.projectId}|${address}|${JSON.stringify(keys(element).filter(e => { return element[e] instanceof Function; }))}>`;
                }
            }
            // 对于其他对象类型，使用JSON.stringify方法转换为字符串
            return JSON.stringify(element);
        });
        // 将转换后的元素字符串用分号( ; )连接, 形成最终的字符串表示
        return elements.join(';');
    }
    ;
    /**
     * * 将 方块 或 方块数组 转换为 字符串形式
     *
     * @param {server.Block | server.Block[]} [input] - 方块 或 方块数组
     *
     * @returns {string} - 游戏对象的字符串表示
     *
     * @throws {Error} - 如果输入的参数类型错误时, 则抛出错误
     */
    blockToString(input) {
        /**
         * * 将 游戏对象 转换为 字符串表示
         */
        const toString = (_block) => `b<${_block.x}.${_block.y}.${_block.z}.${_block.dimension.id.split(':')[1]}>`;
        // 检查 输入 是否为 对象数组
        if (Array.isArray(input) && input.every(value => value instanceof server.Block)) {
            // 使用逗号分隔数组中的每个元素, 并包裹在方括号中
            return `[${input.map(toString).join(',')}]`;
        }
        // 检查 输入 是否为 单个对象
        else if (input instanceof server.Block) {
            // 直接转换 单个对象
            return toString(input);
        }
        // 如果输入既不是 数组 也不是 单个对象, 抛出错误
        else {
            throw new Error('无效输入：输入必须是 server.Block 对象或 server.Block 对象数组');
        }
    }
    ;
    /**
     * * 将 实体 或 实体数组 转换为 字符串形式
     *
     * @param {server.Entity | server.Entity[]} [input] - 实体 或 实体数组
     *
     * @returns {string} - 游戏对象的字符串表示
     *
     * @throws {Error} - 如果输入的参数类型错误时, 则抛出错误
     */
    entityToString(input) {
        /**
         * * 将 游戏对象 转换为 字符串表示
         */
        const toString = (_entity) => `e<${_entity.id}>`;
        // 检查 输入 是否为 对象数组
        if (Array.isArray(input) && input.every(value => value instanceof server.Entity)) {
            // 使用逗号分隔数组中的每个元素, 并包裹在方括号中
            return `[${input.map(toString).join(',')}]`;
        }
        // 检查 输入 是否为 单个对象
        else if (input instanceof server.Entity) {
            // 直接转换单个对象
            return toString(input);
        }
        // 如果输入既不是数组也不是单个对象, 抛出错误
        else {
            throw new Error('无效输入：输入必须是 server.Entity 对象或 server.Entity 对象数组');
        }
    }
    ;
    /**
     * * 将 维度 或 维度数组 转换为 字符串形式
     *
     * @param {server.Dimension | server.Dimension[]} [input] - 维度 或 维度数组
     *
     * @returns {string} - 游戏对象的字符串表示
     *
     * @throws {Error} - 如果输入的参数类型错误时, 则抛出错误
     */
    dimensionToString(input) {
        /**
         * * 将 维度对象 转换为 字符串表示
         */
        const toString = (_dimension) => `d<${_dimension.id}>`;
        // 检查 输入 是否为 对象数组
        if (Array.isArray(input) && input.every(value => value instanceof server.Dimension)) {
            // 使用逗号分隔数组中的每个元素, 并包裹在方括号中
            return `[${input.map(toString).join(',')}]`;
        }
        // 检查 输入 是否为 单个对象
        else if (input instanceof server.Dimension) {
            // 直接转换单个对象
            return toString(input);
        }
        // 如果输入既不是 数组 也不是 单个对象, 抛出错误
        else {
            throw new Error('无效输入：输入必须是 server.Dimension 对象或 server.Dimension 对象数组');
        }
    }
    ;
    /**
     * * 将实体查询选项转换为字符串
     *
     * * 该方法用于将服务器端的实体查询选项格式化为一个简化的字符串表示
     *
     * @param {server.EntityQueryOptions} [options] - 实体查询选项的对象, 包含多种查询参数, 如距离、标签、家族、名称、类型等
     *
     * @returns {string} 返回格式化后的查询字符串
     */
    entityFilterToString(options) {
        /**
         * * 创建一个映射, 用于将实际的查询选项键替换为简写键
         */
        const reverseReplace = new Map([
            ['closest', 'c'],
            ['maxDistance', 'r'],
            ['minDistance', 'rm'],
            ['tags', 'tags'],
            ['excludeTags', '_tags'],
            ['families', 'familys'],
            ['excludeFamilies', '_familys'],
            ['name', 'name'],
            ['excludeNames', '_names'],
            ['type', 'type'],
            ['excludeTypes', '_types'],
            ['maxVerticalRotation', 'rx'],
            ['minVerticalRotation', 'rxm'],
            ['maxHorizontalRotation', 'ry'],
            ['minHorizontalRotation', 'rym'],
        ]);
        /**
         * * 创建一个数组, 用于存储简写键和值的字符串对
         */
        const pairs = [];
        // 遍历输入的查询选项
        Object.keys(options).forEach(key => {
            /**
             * * 将实际的查询选项键替换为简写键
             */
            const newKey = reverseReplace.get(key);
            // 将键和值转换为字符串对, 并添加到数组中
            if (newKey)
                pairs.push(`${newKey}=${options[key]}`);
        });
        /**
         * * 将数组中的字符串对连接成一个字符串, 并用冒号分隔
         */
        const resultString = pairs.join(':');
        // 返回格式化的字符串
        return `es<${resultString}>`;
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
// 默认导出 统一推送协议 实例
export default bridge;
//# sourceMappingURL=BridgeProtocol.js.map