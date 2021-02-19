# js基础知识

## 2021年面试总结
+ 浏览器缓存
+ XSS, CSRF, HTTPS
+ 深浅拷贝
+ 变量类型
+ 作用域
+ this指针
+ 箭头函数和普通函数
+ 原型链
+ 类型转换
+ 手写代码
+ 事件循环
+ v8垃圾回收
+ v8解释和编译
+ js内存机制
+ 异步编程
+ 本地存储
+ 事件防抖节流
+ 懒加载
+ 跨域
+ cookie
+ sessionStorage 和 localStorage
+ Http代理
+ 三次握手 四次挥手 状态码
+ BFC
+ 布局
+ 回流 重绘 
+ 输入URL到页面呈现(浏览器渲染机制)

## 浏览器缓存

### 从缓存位置区分
+ Service Worker
    - `Service Worker` 是运行在浏览器背后的独立线程, 一般用以实现缓存功能，可以拦截请求, 因此必须使用HTTPS协议来保障安全.
    - 他与其他浏览器内建的缓存机制不同, 它支持我们自由控制缓存哪些文件, 如何匹配缓存, 如何读取缓存, 并且缓存是可持续性的
    - 在PWA这样的概念中, `Service Worker`是其中的核心实现者, 可用作离线消息推送, 这个功能就是通过缓存来实现的
    - 要注意的是, 当`Service Worker`没有命中缓存的时候, 会调用fetch函数获取数据, 也就是说如果`Service Worker`没有命中缓存, 会根据缓存优先级去查找数据。但是不管是从Memory Cache还是从请求中获取新的数据， 浏览器都会显示我们是从`Service Worker`中获取的。
+ Memory Cache
    - `Memory Cache` 表示内存中的缓存, 主要包含的是当前页面中已经抓取的资源. 内存缓存读取比磁盘快, 但是在高效率读取的同时, 他的可持续性也非常短.会随着进程的释放而释放, 因此一旦我们关闭Tab页, 内存中的缓存也就释放了
    - 不能存储在计算机的内存中, 谷歌默认使用的堆内存大约在1.5个G, 不会给我们自由操作的空间
    - 内存缓存中有一个很重要的缓存资源是由preloader相关指令下载的资源。 他是常见优化手段之一, 可以一边解析js/css 一边请求下一个资源
    - 注意: 内存缓存在缓存资源时并不关心返回资源的HTTP缓存头Cache-Control是什么值, 同时资源的匹配也并非仅仅是对URL做匹配, 还可能对Content-type CORS等其他特征做校验
+ Disk Cache
    - `Disk Cache` 是存储在硬盘中的缓存, 读取速度慢了点, 但是什么都可以存, 对比内存缓存就胜在存储时效性和容量大。 
    - 在浏览器缓存中, 磁盘缓存覆盖面最大，他会根据HTTP Header来判断哪些资源需要缓存, 哪些资源不需要请求直接使用, 哪些资源已经过期需要重新请求
    - 关于 `内存缓存` 和 `磁盘缓存`
        + 一般来说, 对于大文件, 大概率不会丢在内存中, 反之优先
        + 当前系统内存使用较高会优先丢入磁盘
+ Push Cache
    - `Push Cache(推送缓存)`是HTTP/2中的内容, 当以上三种缓存都没有命中的时候, 他就会被使用。 它只在 `Session(会话)`状态中被使用, 一旦会话结束, 就会释放, 并且缓存时间很短, 在Chrome中大概只有5mins左右, 同时也严格执行HTTP头中的缓存指令
    - 一般分为以下几点
        + 所有资源都能被推送, 但Safari支持较差(老版本EDGE一样)
        + 可以推送no-cache和no-store
        + 一旦连接关闭, 推送缓存就释放
        + 多个页面可以使用同一个HTTP/2的连接, 也就是可以使用同一个 `Push Cache`, 主要是依赖浏览器的实现, 出于性能考虑, 浏览器会让相同域名但是不同的tab标签使用同一个HTTP连接
        + `Push Cache` 中的缓存只能被使用一次
        + 浏览器可以拒绝缓存推送
        + 可以给其他域推送缓存

### 如果以上四种缓存都没有命中的话，那么只能发起请求来获取资源了。
### 浏览器对于缓存的处理是根据第一次请求资源时返回的响应头来确定的。过程如下
+ 浏览器第一次发起HTTP请求, 在中间有一个叫`浏览器缓存`的位置
+ 查看在`浏览器缓存`中是否存在请求的缓存结果和缓存标识, 首次请求没有, 立即返回
+ 再次发起HTTP请求直达服务器
+ 服务器返回请求结果和缓存标识(缓存表示存储在响应头中, 比如ETag, 比如Last-modifyed)
+ 然后将该请求结果和缓存标识写入`浏览器缓存`中

#### 因此可以得出如下结论
+ 浏览器每次发起请求，都会先在浏览器缓存中查找该请求的结果以及缓存标识
+ 浏览器每次拿到返回的请求结果都会将该结果和缓存标识存入浏览器缓存
### 缓存策略分为两种, 并且都是通过HTTP Header实现
+ 强缓存：不会向浏览器发送请求, 直接从缓存中获取资源. 在控制台中可以看到请求返回200状态码, 但是Size显示from disk Cache 或者 from Memory Cache。
    - 可以通过设置`Expiress`或者`Cache-Control`实现
+ 协商缓存: 强缓存失效之后, 浏览器携带缓存标识向服务器发送请求, 由服务器根据缓存标识来决定是否使用缓存的过程
    - 主要有两种情况
        + 协商缓存生效, 返回304状态码从缓存中获取数据
            - 浏览器发起HTTP请求, 先到`浏览器缓存`
            - 该请求缓存结果失效(没有命中强缓存), 返回缓存标识
            - 浏览器携带缓存标识发起HTTP请求到服务器
            - 服务器返回304 标识资源没有更新
            - 浏览器向`浏览器缓存`中获取该请求的结果
            - 然后`浏览器缓存`返回该请求的结果
        + 协商缓存失效, 返回200和请求结果
            - 浏览器发起HTTP请求, 先到`浏览器缓存`
            - 该请求的缓存结果失效, 返回缓存标识
            - 携带缓存标识发起HTTP请求到服务器
            - 该资源已更新, 重新返回结果, 状态码200
            - 将新的返回结果和缓存标识写入缓存
    - 协商缓存可以通过设置两种HTTP Header实现
        - ETag
        - Last-Modified
### Expiress
表示缓存过期时间, 用来指定资源到期时间, 是服务端的具体的时间点。 也就是说, Expiress=max-age + 请求时间。需要和Last-modified结合使用, 同时受限于本地时间, 如果本地时间修改, 可能会造成缓存失效。
他告诉浏览器在缓存失效之前都可以直接从缓存中获取数据

### Cache-Control
+ HTTP/1.1中, Cache-Control是最重要的规则， 主要用于控制网页的缓存。比如当Cache-Control: max-age=300时, 代表当前请求在正确返回的5分钟内再次加载资源就会命中缓存
+ Cache-Control可以在请求头或者响应头中设置, 字段如下
    - public: 表示请求可以被客户端或代理服务器缓存
    - private: 表示请求只能被客户端缓存
    - max-age: 设置一个时间表示缓存从请求正确返回后多少秒过期
    - s-maxage: 和max-age一样, 并且覆盖max-age 只在代理服务器中生效
    - no-cache: 资源被缓存, 但是立即失效, 下次会发送请求验证资源是否过期(数据是否和服务器保持一致)
    - no-store: 不缓存任何响应
    - max-stale: 资源最大过期时间, 比如说设置30, 表示缓存过期30秒还能使用
    - min-fresh: 希望在多少秒内获取最新的响应
+ Expiress是一种过时的产物, 一般用于兼容性处理, Cache-Control优先级高于Expiress

### Last-Modified和if-Modified-Since
+ 第一次访问服务器资源的同时, 除了返回资源, 还会在Reponse Header上添加Last-Modified这个header, 值表示这个资源在服务器上最后修改的时间浏览器接收后缓存文件和header
+ 下一次请求时, 如果没有命中强缓存, 就会根据Last-Modified的值生成一个if-Modified-Since这个request header, 然后发送到服务器
+ 服务器根据if-Modified-Since和资源的最后修改时间作对比, 如果没有变化, 则返回304状态码， 浏览器去`浏览器缓存`中获取数据
+ 如果说if-Modified-Since比服务器的最后修改时间小, 则返回200状态码和新的Last-Modified这个缓存标识, 然后浏览器将新的数据和缓存标识存入`浏览器缓存`
+ `弊端`
    - 如果本地打开缓存文件, 即使没有对文件做修改还是会造成Last-Modified被修改, 然后服务器无法命中缓存, 也就无法返回新的数据了
    - 因为 Last-Modified 只能以秒计时, 如果在不可感知的时间内修改完文件, 那么服务器会认为资源还是命中了, 不会返回正确的资源

### ETag和if-None-Match
+ 和上述Last-Modified类似, 第一次请求资源时, 返回资源的同时也返回一个ETag, 同样放在Response Header中。
+ 下一次请求的时候如果没有命中强缓存, 则在Request Header中生成一个if-None-Match, 值就是ETag的值
+ 服务器接收到if-None-Match后会和自己的ETag做对比,如果不同, 则返回新的ETag和数据, 然后将数据和新的ETag存入缓存, 如果相同则返回304, 浏览器去`浏览器缓存`中拿数据

## 浏览器安全
### XSS注入
XSS 全称是 `Cross Site Scripting` 也就是 `跨站脚本攻击`, 为了和CSS区分, 才叫他XSS。
是指浏览器中执行恶意脚本(无论跨域还是同域), 从而拿到用户信息进行操作

一般为了完成下面的事情:
+ 窃取cookie
+ 监听用户行为, 比如输入账号密码后直接发送到黑客服务器
+ 修改DOM伪造登录表单
+ 在页面中生成浮窗广告

#### 通常情况下XSS攻击实现有三种
+ 存储型
    - `存储型`顾名思义就是将跨站脚本存储起来, 将脚本存储到了数据库, 然后客户端执行脚本达到攻击目的
    - 比如在评论区留下一个脚本`<script>while(!![]) {alert('你人没了！！')}</script>`, 这段脚本如果到了后端, 不做解析直接存储起来, 在页面渲染过程中就会执行这些脚本, 这样这个页面也就崩了
+ 反射型
    - `反射型`XSS一般作为请求的一部分传给后端
    - 比如在浏览器的URL的最后添加一段 `?q=<script>while(!![]){alert('你人没了!!')}</script>`, 然后刷新的时候发起请求, 返回一段HTML, 其中就包含这个, 如果不做处理, 浏览器发现他是HTML的一部分, 就会直接执行, 然后页面就崩了
+ 文档型
    -   `文档型`XSS不会经过服务端, 而是作为中间人的角色, 在数据传输过程中劫持网络数据包, 然后修改里面HTML的文档
    - 劫持方式包括`wifi路由器劫持`和`本地恶意软件`等

#### 防范措施
+ 一个信念
    - 千万不要相信用户的任何输入, 无论前端还是后端一定要做好转码或者过滤
+ 两个利用
    - 利用CSP(`浏览器安全策略`)
        + 限制其他域资源加载
        + 进制向其他域提交数据
        + 提供上报机制, 帮助我们及时发现XSS
    - xss主要目的就是为了获取用户的登录信息, 因此利用cookie的属性之一`HttpOnly`, 加上该属性的cookie前端无法使用js获取cookie信息

### CSRF注入
+ `CSRF`是指`跨站请求伪造`, 是黑客诱导用户点击连接, 打开黑客网站, 然后黑客利用用户目前的登录状态发起跨站请求
+ 自动发get请求, 比如植入一个img标签, 上面的src属性, 会自动发送get请求
+ 自动发送post请求, 比如伪造一个自动提交的表单, 自动发送post请求
+ 诱导点击发送get请求, 比如一个a标签下面的href属性指向黑客的网站

#### CSRF并不会像XSS一样注入一个脚本, 而是利用服务器的验证漏洞和用户之前的登录状态来模拟用户进行操作

#### 防范措施
+ 验证来源网站
+ CSRF Tocken
+ 使用cookie的SameSite属性
    - 设置strict, 表示完全禁止第三方请求携带cookie
    - lax, 允许get类型的表单提交和a标签携带cookie跨域
    - none, 随便整

### HTTPS
`HTTPS`和`HTTP`之间并没有太大的区别, 主要就是HTTPS在HTTP和TCP之间增加了一个SSL层, 这一层让 Http 和 Tcp 的通信并不像之前一样直接通信, 而是经过一层对数据包的加密来通信, 这个中间层就是`SSL层`，也叫`安全层`
`安全层`的核心就是对数据进行`加解密`

`SSL层`实现:
+ 主要是通过一层非对称加密和数字证书来获取对称加密的秘钥, 在进行一次对称加密
+ 浏览器向服务器发送一个`client_random`和`加密方法列表`
+ 服务器向浏览器发送一个`server_random`和`加密方法列表`
+ 浏览器像CA验证数字证书, 通过之后会生成一个`pre_random` 然后使用非对称加密的公钥对`pre_random`加密在发送给服务器, 同时利用`client_random`, `server_random`, `pre_random`生成一个新的秘钥
+ 服务器拿到加密过后的`pre_random`使用非对称加密的私钥进行解析, 然后也是利用三个参数生成一个新的秘钥, 并且向浏览器发送确认信息
+ 之后双方的交流, 会不断的通过这种生成的秘钥对数据包进行加密
+ `数字证书`是第三方CA机构发出, 主要目的是为了让服务器证明自己, 放置黑客窃取非对称加密的公钥和私钥

## 深浅拷贝
### 浅拷贝
+ 所谓拷贝就是直接使用等号去将一个引用类型给一个新的变量, 由于js存储机制的原因, 这个赋值操作实际上是在栈中开辟一个新的地址, 赋值的实际上是原地址的指针, 这两个地址的指针, 都指向了堆中同一个位置, 因此改变其中一个, 另一个都改变了
+ 而浅拷贝是指仅仅只有引用类型下第一层的指针, 指向了堆中的新地址, 如果第一层中还是存在一个对象, 那么该对象内部键的指针依然指向原对象在堆中存储的地址

```
// 拷贝
const obj1 = {
    age: 20,
    name: 'xxx',
    address: {
        city: "shenzheng"
    },
    arr: ["a", "b", "c"]
}
const obj2 = obj1
obj2.address.city = "shanghai"
console.info(obj1.address.city) // shanghai

// 浅拷贝
const objq1 = {
    age: 20,
    name: 'xxx',
    address: {
        city: "shenzheng"
    },
    arr: ["a", "b", "c"]
}
const objq2 = Object.assign({}, objq1)
// 除此之外, 还有Array.prototype.slice, Array.prototype.concat()
```

### 深拷贝
不仅在栈中开辟一个新的地址, 内部所有层级的指针都指向堆中开辟的新地址

```
// 深拷贝
/**
* @param {Object} obj 要拷贝的对象
*/
const isObject = (target) => (typeOf target === 'object' || typeOf target === 'function') && target !== null;
function deepClone(target, map = new WeakMap()) {
    if (map.get(target)) {
        return target
    }
    if (isObject(target)) {
        map.set(target, true);
        const cloneTarget = Array.isArray(target) ? [] : {}
        for (let key in target) {
            if (target.hasOwnProperty(key)) {
                cloneTarget[key] = deepClone(target[key], map);
            }
        }
        return cloneTarget
    } else {
        return target
    }
}
// 使用
const obj2 = deepClone(obj1)
obj2.address.city = "shanghai"
console.info(obj1.address.city) // beijing
```
## v8垃圾回收
首先来说, v8对堆内存是存在限制的, 在64位系统下, 最多只能分配1.4个g的堆内存, 32位系统0.7个g,
对于栈内存来说, ESP指针下移, 上下文切换, 栈顶空间就被自动回收了

在js中, 所有的引用类型都是存储在堆中的, 比如创建一个对象, 就在堆中开辟一个内存区域, 不断的往里面写入成员, 那么堆的内存就越来越大, 让v8为他分配空间, 直到达到内存上限

设置内存上限的原因:
首先js是单线程, 意味着垃圾回收的时候, 其余逻辑都要暂停, 再次就是v8给的说明是, 在完全清空1.4G堆内存的情况下, 做一次垃圾回收需要50ms以上, 做一次非增量式回收, 甚至需要1s以上

当然, 堆内存的大小是可以调节的
```
// 新生代(单位是kb)
node --max-new -space-size = 2048 xxx.js
// 老生代(单位是mb)
node --max-old-space-size = 2048 xxx.js
```

js将堆内存分为两个部分
+ 新生代, 一般是临时分配的内存, 容量不大，存活时间短(上限是64位 32MB, 32位 16MB)
+ 老生代, 常驻内存, 存活时间久, 容量大

回收方式
+ 新生代
    - 将新生代一分为二, From表示正在使用的内存, to表示闲置的内存
    - 在进行垃圾回收的时候, v8将From部分的对象都检查一遍, 如果是存活的对象直接复制到to中(To中的内存是按顺序从头到尾放置的), 非存活对象直接回收
    - 当所有的存活对象都按顺序进入To中之后, 然后To和From身份对调, From中的内存被闲置, To中正在使用， 如此循环
    - 当然, 可能会出现存货对象在堆中分配不均匀的情况, 这就是所谓内存碎片, 需要使用一个算法对To中的内存进行整理(Scavenge算法), 也叫碎片整理
    - 新生代的劣势很明显, 就是只使用了一半的空间, 但是处理生命周期很短的对象, 这样的对象不多, 因此效率很高
+ 老生代
    - `晋升` 如果新生代中经过多次循环回收后, 依然还在From中存在, 那么就会将其移动到老生代中。 发生`晋升`的原因如下
        + 已经经历过一次Scavenge回收的对象
        + To(闲置)空间内存占用超过25%
    - 第一步, 进行标记-清除
        + 标记阶段: 遍历所有对象, 对他们做上标记, 然后对代码中`使用的变量`和`强引用`的变量取消标记, 剩下的都是要删除的变量
        + 清除阶段: 回收空间
    - 整理内存碎片, 在老生代中很暴力, 直接将存活对象往一端移动
+ 增量标记
    - 由于js是单线程, 因此垃圾回收的时候不可避免的会阻塞业务的进行, 如果老生代中回收任务很重, 耗时会非常恐怖, 严重影响性能, 为了避开这个问题, V8采用`增量标记`
    - `增量标记`: 也就是将一口气完成的标记任务, 分为一块一块的小块, 完成一小块标记就停一下去执行js逻辑, 然后在执行下面的部分, 如此循环下去, 直到标记阶段完成, 才进入清除阶段, 然后整理碎片
## v8解释和编译
以V8为例, 来理解一段js代码是如何执行的
首先需要明白, 机器是读不懂JS代码的, 机器只能理解特定的机器码, 如果要让JS的逻辑在机器上运行, 那就必须将JS的代码翻译成机器码, 然后让机器识别他.

JS属于解释性语言, 对于解释性语言来说, 解释器会对源代码做如下分析:
+ 通过词法分析和语法分析生成AST语法树
+ 生成字节码

然后解释器根据字节码来执行程序。但是JS整个执行过程实际上比这个更加复杂

首先, 生成AST树，分两个步骤， 词法分析和语法分析

词法分析,就是将一段代码分解成一个一个的token。
比如
```
let name = 'xiaomo'
```
就会将句子分成四个部分
+ 关键字: let
+ 变量名: name
+ 赋值: =
+ 字符串: 'xiaomo'

这四个token会根据语法规则转化为AST树

生成AST之后的编译都将依靠AST树而不是源代码, 生辰AST之后, 就会执行上下文

然后就是生成字节码

就是前面说的生成AST树之后, 通过v8的解释器来生成字节码, 但是字节码并不能让机器直接运行,早期的是将AST直接转换为机器码, 但是这样占用内存太大执行速度太慢了, 引发了严重的内存占用问题, 最终放弃了这样的实现方式

字节码是一种比机器码轻量很多的代码, 介于AST和机器码之间, 与特定类型的机器码无关, 字节码需要通过解释器转换为机器码再来执行

现在就不用一次将字节码转换为机器码去执行了， 而是解释器逐行执行字节码转换机器码来执行, 省去了生成二进制文件的操作, 大大降低了内存的压力

在字节码的执行过程中, 如果发现一段字节码重复出现, 那么就会将这段字节码编译成机器码, 然后存储起来, 执行编译的工具就是v8的编译器，因此JS也不是完全的解释性语言。这段字节码叫做`热点代码`, 再这样的机制下, 执行的越久, 他的热点代码就越多, 执行速度也就越快, 这也是为什么在v8上运行js, 比python这类解释性语言, 还要快

总的来说就是:
+ 现将代码通过解释器的词法分析和语法分析生成AST树
+ 然后将AST树转换为字节码
+ 逐行执行字节码，遇到经常出现的字节码就启动编译器编译成机器码存储起来，下一次遇到就直接使用用以优化执行效率


## 箭头函数和普通函数的区别
+ 箭头函数没有自己的this, 内部的this继承自父级作用域, 他的指向永远不变, 永远指向创建时的父级作用域, 普通函数的this指向调用者
+ 箭头函数没有自己的arguments, 同样继承自父级作用域
+ 箭头函数不能作为构造函数
+ call/apply/bind无法改变箭头函数内部this指向
+ 箭头函数写法简单
+ 箭头函数没有prototype
+ 箭头函数当做generator使用, 没有yield关键字

## 事件防抖和节流
### 防抖
所谓防抖就是在规定时间内重复触发函数就刷新延迟时间, 防止连续点击
```
function debounce(fn, delay) {
    if (typeOf fn !== 'function') {
        throw new Error("参数一号位必须是函数")
    }
    let isTimer;
    let _this = this;
    return function(...args) {
        if (isTimer) {
            clearTimeout(isTimer)
        }
        isTimer = setTimeout(() => {
            fn.call(_this, args);
            isTimer = null;
        }, delay)
    }

}
```
### 节流
所谓节流就是在规定时间没有到, 都不会触发函数, 时间到了我也只触发一次该函数
```
function throttle(fn, delay) {
    if (typeOf fn !== 'function') {
        throw new Error('参数一号位必须是函数')
    }
    let isTimer;
    let _this = this;
    return function(...args) {
        if (isTimer) {
            return
        }
        isTimer = setTimeout(() => {
            fn.call(_this, args);
            isTimer = null;
        }, delay)
    }
}
```
### 箭头函数和类普通函数的 constructor 里bind的函数有什么区别
+ 普通函数: 在 babel 编译后，会被放在函数的 prototype 上
+ constructor 里 bind 的函数: 在编译后，它不仅会被放在函数的 prototype 里，而且每一次实例化，都会产生一个绑定当前实例上下文的变量(this.b = this.b.bind(this))。
+ 箭头函数：在 babel 编译后，每一次实例化的时候，都会调用 defineProperty 将箭头函数内容绑定在当前实例上下文上。





## sessionStorage 和 localStorage
+ 只有一个地方不同, 就是sessionStorage在窗口关闭就清除, 但是localStorage只能手动清除, 否则永久存储
+ 容量5MB
+ 不参与和服务端的交流

## 三次握手 四次挥手 状态码
### 三次握手
+ 三次握手是指建立一个TCP连接时, 需要客户端和服务器总共发出三个包。主要是为了确认双方的收发能力是否正常、指定自己的初始化序列号为后面的可靠性传送做准备。
+ 刚开始时客户端处于Closed状态, 服务端处于Listen状态
+ 第一次握手: 客户端向服务端发送一个SIN报文, 并指定客户端的初始化序列号ISN。此时客户端处于SYN_SEND状态。
    - 首部的同部位`SYN=1`,初始序号`seq=x`, SYN=1的报文段不能携带数据, 但是要消耗一个序号
+ 第二次握手: 服务器收到客户端发的SYN报文后, 会以自己的SYN报文作为应答, 并且也指定了自己的初始化序列号ISN.同时会把客户端的`ISN+1`作为ACK的值, 表示自己已经收到了客户端发送的SYN报文。此时服务端处于SYN_REVD状态
    - 报文段中 SYN=1, ACK=1, 确认号ack=x+1, 初始序号seq=y
+ 第三次握手: 客户端收到SYN报文之后, 会发送一个ACK报文, 也是一样把服务器的ISN+1作为ACK的值, 表示已经收到了服务端SYN报文, 此时客户端处于ESTABLISHED状态。服务器收到ACK报文之后, 也处于ESTABLISHED状态。此时双方的连接已经建立
+ 发送第一个SYN的一端将执行主动打开(active open), 接收这个SYN并发回下一个SYN的另一端执行被动打开(passive open)
+ webSocket中执行connect()将触发三次握手

#### 为什么需要三次握手, 两次握手行不行
##### 首先要明白三次握手的目的
+ 第一次握手, 客户端发包, 服务端收到了, 此时是为了确认客户端的发送能力和服务端的接收能力正常
+ 第二次握手, 服务端发包, 客户端收到了, 此时为了确认客户端的接收能力和服务端的发送能力正常。但是服务端并不能确认客户端的接收能力正常
+ 第三次握手, 客户端发包, 服务端收到了, 这样才能够让服务端也得出结论: 客户端的收发能力正常，服务端的收发能力正常
+ 因此需要三次握手

##### 如果改成两次
可能会出现客户端发包, 但是这个包丢失了, 于是客户端再一次重传发起连接请求。 后来收到了建立连接, 数据传完了释放连接, 在这个过程中, 客户端一共发了两个包, 一个丢失, 一个正常抵达, 但是没有抵达的那个包因为延迟问题, 在释放连接之后, 又抵达了服务端, 这样服务端就会误认为是客户端发起了连接请求, 于是返回一个SYN报文, 确认建立连接。然后客户端又忽略服务器的确认连接报文, 不发数据, 这样服务端就会一直重发, 发出大量的SYN报文, 浪费资源

#### 什么是半连接队列
+ 服务器第一次收到SYN包之后, 就会处于SYN_REVD状态, 此时双方还没有建立其连接, 服务器会把此种状态下请求连接放在一个队列里, 这就是半连接队列
+ 三次握手完成建立起的连接会放在另一个队列里，叫全连接队列。如果队列满了, 可能会出现丢包现象
+ SYN-ACK重传次数: 有一个最大上限的设置, 超过上限值就将连接从半连接队列中移除, 每一次重传间隔时间是不一定的, 一般是程指数增长

#### ISN是固定的吗
+ 当一端为建立连接而发送他的SYN时, 它为连接选择一个初始序号。ISN随时间而变化, 因此每个连接都将具有不同的ISN。ISN可以看作是一个32比特的计数器, 每4ms加一。这样选择序号的目的在于防止网络中被延迟的分组以后又被传送, 而导致某个连接的一方对它做出误解
+ 三次握手的其中一个重要的功能就是双方交换各自的ISN，以便让对方知道自己接下来接收数据的时候如何按照序列化去组装数据, 如果ISN固定，很容易被黑客猜到接下来的确认号, 因此ISN是动态生成的

#### 三次握手可以携带数据吗
+ 第三次可以携带数据, 前两次不行
+ 第三次握手时,客户端已经处于ESTABLESHED状态，对他来说连接已经建立起来了, 并且也知道服务器的收发能力正常, 因此是可以携带数据的

#### SYN攻击是什么
服务端的资源分配在于第二次握手,而客户端的资源是第三次握手完成后才分配的, 所以服务端容易受到SYN洪泛攻击。SYN攻击就是Client在短时间内伪造大量不存在的IP地址, 并向Server不停的发送SYN包, Server会回复包, 并等到Client确认, 由于源地址其实并不存在, 因此Server就会不停的重发, 直到超时, 这些伪造的SYN包将长时间占据半连接队列, 导致正常的SYN请求因为队满被放弃，从而引起网络拥塞, 甚至瘫痪.
+ 常见防御手段:
    - 缩短超时时间
    - 增加最大半连接数
    - 过滤网关防护
    - SYN cookies技术

### 四次挥手
+ 建立一个连接需要三次握手, 而终止一个连接需要四次挥手。这是由于TCP半关闭造成的。所谓半关闭其实就是TCP提供连接的一方在结束他的发送后还可以接受来自另一端的数据
+ TCP拆除连接需要发送四个包因此称为四次挥手, 客户端和服务端均可发起挥手动作(以下假设客户端发起挥手动作)
+ 第一次挥手: 客户端发起一个FIN报文, 客户端处于FIN_WAIT1状态, 报文中指定一个序列号
+ 第二次挥手: 服务端收到FIN之后, 会发送ACK报文, 且吧客户端的序列号值 +1 作为ACk报文的序列号, 表明已经收到了客户端的报文, 此时服务端处于CLOSE_WAIT状态
    - 即服务端收到了客户端的连接释放报文段(ACK=1, 确认号ack=u+1, 序列号seq=v), 服务端进入CLOSE_WAIT(关闭等待)状态, 此时的TCP处于半关闭状态, 客户端到服务端的连接释放。客户端收到服务端的确认后, 进入FIN_WAIT2状态, 等待服务端发起连接释放报文段
+ 第三次挥手: 如果服务端也想断开连接了, 就和第一次客户端一样,发送一个FIN报文给客户端, 并指定一个序列号, 此时服务端处于LAST_ACK状态（并没有要向客户端发送的数据, 纯粹发出一个释放报文）
+ 第四次挥手: 客户端收到FIN报文后, 一样发送一个ACK报文作为应答, 并且把服务端的序列号值+1作为自己的ACK报文的序列号值, 此时客户端处于TIME_WAIT状态。需要过一阵子以确保服务端收到自己的ACK报文之后才进入CLOSED状态, 服务端收到客户端发送的ACK之后, 就处于CLOSED状态了
    - 发出ACK之后, 客户端进入TIME_WAIT状态, 此时TCP连接还没有释放, 需要经过等待时间计时器设置的2MSL后, 客户端才进入CLOSED状态
+ 在socket中任何一方执行close()方法都会执行挥手操作

#### 挥手为什么需要四次
+ 因为当服务器收到客户端的SYN连接请求后, 可以直接发送SYN+ACK报文。其中ACK报文是用来应答的, SYN报文是用来同步的。但是关闭连接时, 放服务端收到FIN报文后, 很可能并不会立即关闭socket, 所以只能先回复一个ACK报文表示你的断开请求我收到了, 只有等我所有的报文都发送完了, 我才能发送FIN报文, 因此不能一起发送, 所以挥手需要四次
#### 2MSL等待的意义
TIME_WAIT状态也被称为2MSL等待状态。 MSL是值报文段最大生存时间，他是任何一个报文段被丢弃前在网络内的最长时间。这个时间是有限的, 因为TCP报文段以IP数据报在网络内传输, 而IP数据报则有限制其生存时间的TTL字段

处理原则主要是当TCP执行主动关闭, 并发回最后的ACK, 该链接必须在TIME_WAIT状态停留时间为2倍的MSL, 这样可以让TCP再次发送最后的ACK以防这个ACK丢失(另一端超时重发最后的FIN)

意义：
+ 主要是保证客户端发送的最后一个ACK报文段能够抵达服务端(给他时间重发)
+ 防止 “已失效的连接请求报文段”再次出现在本连接中(发送最后一个ACK后, 等待2MSL, 就可以使本连接中持续时间所产生的所有报文段都从网络中消失, 移除出全连接队列)

### 常用状态码
+ 200 请求被正确处理
+ 301 请求被永久重定向
+ 302 请求被临时重定向
+ 303 使用GET临时重定向
+ 304 使用缓存
+ 400 服务器无法理解客户端发送的请求
+ 401 发送的请求需要认证
+ 404 资源未找到
+ 403 服务器收到了请求但是拒绝执行
+ 500 服务器内部错误 

## 从输入URL到页面呈现
### 网络
+ 首先要构建请求
+ 然后查找强缓存, 如果命中直接使用, 没有命中进入下一步
+ DNS域名解析
    - DNS是一个域名和IP的映射系统, 主要是TCP是和IP交流, 而不是和域名交流, 需要拿到一个对应的IP
+ 建立TCP连接
    - 三次握手
+ 发送HTTP请求
+ 网络响应
+ 进入解析过程
### 解析
+ 构建DOM树
    - 标记化
    - 建树算法
+ 样式计算
    - 格式化
    - 标准化
    - 计算规则: 继承和层叠
+ 生成布局树
+ 进入渲染阶段
### 渲染
+ 建立图层树
+ 生成绘制列表
+ 生成图块并栅格化
+ 显示器显示内容

## 变量类型和计算
## 值类型和引用类型

### 题目
+ typeof能判断哪些类型？
+ 何时使用 === 何时使用 ==
+ 值类型和引用类型的区别
+ 手写深拷贝

### 值类型(原始类型)

```
let a = 100;
let b = a;
a = 200;
console.info(b); // 100
// 这两个并不会相互干涉
```
#### js原始数据类型
undefined、boolean、number、string、symbol、null、bigint
### 引用类型

```
let a = {
    age: 20
}
let b = a;
b.age = 21;
console.info(a.age) // 21
// 因为是浅拷贝，b和a的地址是一致的，因此更新b的时候，a也同时更新
```

无论是值类型还是引用类型都是在栈里面存储的。

在值类型中，定义a的时候就在栈中开一个区域，将他的值100存入栈中，而定义b等于a的时候，又在栈中开一个新的区域，存入b的值100，因此改变值类型b的时候，并不会影响a。

而在引用类型中，定义a的时候，先在栈中开一个a的区域，键名为a，键值指向a的内存地址a，同时加入堆的概念。栈是一个从上往下的结构，堆是一个从下往上的结构，在内存足够的情况下，栈和堆并不会重合。而在栈中开辟a的同时，就会在堆中存放一个键名为内存地址a，键值为{age: 20}的结构。由于摸不清一个对象中究竟有多少数据，考虑到一个性能问题，因此js的引用类型都会采用这样的存储方式。而定义b，并且将a的值赋给b的时候，就直接将a在堆中的内存地址a赋值给了b，也就是说，在栈中，a和b指向了同一个堆的内存地址，因此，在修改b中age的时候，a的age，也发生同样的改变，因为他们从根本上说就是一个东西。这就是所谓的浅拷贝。


#### 常见引用类型(对象类型)
object、array、function
function也是特殊引用类型，但不用于存储数据，所以没有“拷贝、复制函数”这一说

### typeof运算符
+ 识别所有值类型
    - typeof "123" // string
    - typeof 10 // number
    - typeof 10n // bigint
    - typeof undefined // undefinen
    - typeof Symbol("a") // symbol
    - typeof true // boolean
+ 识别函数
    - typeof function() {} // function
    - typeof console.info() // function
+ 判断是否是引用类型(不可再细分)
    - typeof null // object(这是一个美丽的错位, 原因是因为js对于object的判断是判断地址前三位是不是000, 而null全是0, 因此导致错误判断为了object, 实际上他是原始类型, 存储在栈中)
    - typeof [] // object
    - typeof {} // object

### 类型转换
首先在js中, 类型转换只有三种情况, 分别是:
+ 转换为布尔值
+ 转换为数字
+ 转换为字符串

| 原始值 | 转换目标 | 结果
-------- | -------- | ------
number | 布尔值 | 除了0,-0, NaN 都是true
string | 布尔值 | 除了空字符串都是true
undefind、null | 布尔值 | false
引用类型 | 布尔值 | true
number | 字符串 | 5 => '5'
Boolean、函数、Symbol | 字符串 | 一般是什么样子就是两边加引号, 比如true => 'true'
数组 | 字符串 | [1，2，3] => "1, 2, 3"
对象 | 字符串 | '[object Object]'
string | 数字 | '1' => 1, 'a' => NaN
数组 | 数字 | 空数组为0, 如果是一个元素并且是数字或者是字符串类的数字那么就是转换为这个元素的数字, 其他元素为NaN
null | 数字 | 0
undefined | 数字 | NaN
除数组之外的引用类型 | 数字 | NaN
Symbol | 数字 | 抛错

#### 转换为Boolean
从上面那个表可以看出, 除了undefined、 null、false、 NaN、''、0、-0, 其他所有值都是true, 包括引用类型

#### 对象转原始类型
对象在转换为原始类型时会调用内置的 `[[ToPrimitive]]` 函数, 对于该函数来说, 算法逻辑如下:
+ 如果已经是原始类型, 那就不需要转换了
+ 如果需要转字符串类型就调用x.toString(), 转换为基础类型就返回。
+ 如果不是转字符串, 会先调用valueOf()方法, 如果没有转换为原始类型, 就会使用toString()如果还是没有转为原始类型, 抛错
+ 当然, 也可以使用`[Symbol.ToPrimitive]() {}`重写转换方法, 此方法优先级最高


```
const a = {
    valueOf() {
        return 10
    },
    toString() {
        return '10'
    },
    [Symbol.ToPrimitive]() {
        return 2
    }
}

console.info(a + 1); // 3
```
#### 加法运算符
他有两个特点:
+ 运算中其中一方为字符串, 那么就会把另一方也转换为字符串
+ 如果一方不是字符串或数字, 那么就会将它转换为数字或字符串

```
1 + '1' // '11'
true + true // 2
4 + [1,2,3] // '41,2,3'
1++1
```

还有一种表达式: `'a' + + 'b' // aNaN`

主要是由于 + 'b'是NaN, 所以结果是aNaN, 因此有些地方可以利用 `+ '1'`快速获取number

#### 减乘除运算符
只要一方是数字, 那么另一方就被转换为数字

```
4 * '3' // 12
4 * [] // 0
4 * [1,2,3] // NaN
```

### == 和 ===

区别： 对于双等, 如果类型不一致, 会先转换类型在进行比较, 如果是三等, 那必须要求类型和值都相等(实际上三等比较不了 +0和-0, 也比较不了NaN)
#### ==的判断流程
+ 1. 首先会判断两者类型是否相同, 如果相同就直接比较大小。
+ 2. 类型不相同的话, 那么就会进行类型转换
+ 3. 会判断是否在比对 `null` 和 `undefined` , 如果是直接返回 `true`
+ 4. 判断两者类型是否为 `string` 和 `number`, 是的话就将字符串转换为`number`
+ 5. 判断其中一方是否为 `boolean`, 是的话就把 `boolean` 转换为 `number` 在进行判断
+ 6. 判断其中一方是否为 `object` 并且另一方是`string`、`number`、`symbol`, 是的话就会把 `object` 转换为原始类型在进行判断
### 题目解答
+ typeof能够判断哪些类型
    - 识别所有值类型 
    undefined number string symbol bigint boolean
    - 识别函数
    function
    - 判断是否是引用类型(不可在细分)
    object
+ 何时使用=== 何时使用==
    - 除了判断是null或者undefined之外，其他都建议使用===(Object.is修复了三等对NaN和NaN, +0和-0的错误判断)
+ 值类型和引用类型的区别
    - 值类型赋值的时候，直接在栈中开辟内存，key为名，value就是他的值
    - 引用类型在栈中开辟内存，同时在堆中存储地址，栈中key为名，value存储的为内存地址名，该内存地址名对应堆中key，堆中value就是引用类型的值，因此引用类型直接赋值，就会将该引用类型在堆中的地址，赋值给新的引用类型变量
+ 手写深拷贝

```
function isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;
function deepClone(obj = {}, map = new weakMap()) {
    if (map.get(obj)) {
        return obj
    }
    let res = obj instanceof Array ? [] : {};
    if (isObject(obj)) {
        map.set(obj, true)
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                res[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key]
            }
        }
        return res
    } else {
        return obj
    }
}
```

## JS异步编程
### 并发和并行的区别
+ `并发`: `并发`是宏观概念, 分别有A和B两个任务, 在一段时间内通过任务间的切换完成了这两个任务, 这种情况称为并发
+ `并行`: `并行`是微观概念，假设CPU中有两个核心, 那么可以同时完成A和B两个任务。同时完成多个任务的情况就是并行。

### callbacks(回调函数)

#### 回调地狱的根本问题:
+ 1. 嵌套函数存在耦合性, 一旦有所改动, 就会牵一发而动全身
+ 2. 嵌套函数太多难以处理错误, 每一层都要处理
+ 3. 不能try catch, 不能直接return

### Generator

#### Generator是什么？
Generator(生成器)是一个带有`*`号的函数, 可以通过`yield`关键字`暂时执行`和`恢复执行`

如下所示:

```
function* gen() {
  console.log("enter");
  let a = yield 1;
  let b = yield (function () {return 2})();
  return 3;
}
var g = gen() // 阻塞住，不会执行任何语句// enter
console.log(typeof g)  // object  看到了吗？不是"function"

console.log(g.next())  // { value: 1, done: false }
console.log(g.next())  // { value: 2, done: false }
console.log(g.next())  // { value: 3, done: true }
console.log(g.next()) // { value: undefined, done: true }
```
主要有几个关键的地方:
+ 调用gen函数后, 遇到yield程序会阻塞, 不会执行任何语句
+ 调用gen.next()后, 程序会继续执行, 直到遇到下一个yield, 并且next()可以传递参数, 代表的是上一次yield返回的值
+ next方法返回一个对象, 有两个属性`value`和`done`, value为`当前yield后面的结果`, done表示`是否执行完`, 遇到return, done就自动由false变为true

#### 是什么让生成器函数暂停和执行。
+ 生成器执行机制————`协程`
+ 协程是什么?
    - 协程是一种比线程更轻量的存在, 协程处于线程环境中, `一个线程可以存在多个协程`, 不像进程和线程, 协程不收操作系统控制, 是由具体的程序代码来控制的。
+ 多个协程可以一起执行吗？
    - 不行, 一个线程一次性只能执行一个协程, 比如当前协程A在执行, 还有另一个协程B, 如果要执行协程B, 就必须在A协程中将`JS线程的控制权转移给B协程`, 那么现在B执行, A就处于暂停状态
+ 协程性能较高
    - 因为他不受操作系统控制, 完全由用户自定义切换, 没有进程/线程的`上下文切换`开销

#### 如何让Generator的异步代码按顺序执行?
其实这里有两个问题:
1. `Generator`如何跟`异步`产生关系?
2. 怎么把`Generator`按顺序执行完毕?

##### thunk函数
要想知道`Generator`和异步的关系, 首先要搞清楚一个概念————thunk函数(偏函数), 虽然这只是实现两者关系的方式之一。(另一种方式是Promise)

举个例子, 比如现在我们要判断的数据类型, 可以写如下判断逻辑:

```
let isString = (obj) => {
    return Object.prototype.toString.call(obj) === '[object String]';
}

let isFunction = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Function]';
}

let isArray = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Array]';
}

let isSet = (obj) => {
    return Object.prototype.toString.call(obj) === '[object Set]';
}
```

但是这样出现了大量重复的函数, 因此可以做一次封装

```
let isType = (obj, type) => {
    return Object.prototype.toString.call(obj) === `[object ${type}]`;
}
```

这个isType函数被称为thunk函数。 核心逻辑是接收一定的参数产生一个定制化的函数, 然后使用定制化的函数去完成功能。

thunk函数的实现会比单个的判断函数复杂一点点，但就是这一点点的复杂大大方便了后续的操作

##### 异步执行的方式:
1. 利用thunk函数
2. 利用Promise
3. co库和Generator结合

### Promise
Promise 有三种形态:
+ 等待(pending)
+ 完成(resolved)
+ 拒绝(rejected)

Promise一旦从pending转换为了其他形态, 就不会再做改变了

在构造Promise得我时候, 构造函数内部的代码是立即执行的

Promise实现了链式调用, 每一次then返回的都是一个全新的Promise, 如果在then中return一个值, 就会被封装成一个Promise.resolve()

#### Promise 解决回调地狱
+ 返回值穿透
+ 错误冒泡(在最后一次去catch)
+ 回调函数延迟绑定

#### Promise缺点
+ 无法取消
+ 错误需要回调函数来捕获

### async/await
async将函数的返回值使用Promise.resolve()包裹了一下, 和then中处理返回值是一样的, 并且await只能配合async使用

async/await是终极异步解决方案, 凡是await都会当做同步处理

当然, 如果没有依赖性建议使用Promise.all, 否则的话, 性能会下降, 毕竟变成了同步执行。

### setTimeout, setInterval, requestAnimationFrame
前面两个实际上延迟时间是不准确的, 略有一点差距, 但是最后一个一定是16.6ms(一帧)执行一次(不掉帧的情况下)

最主要是JS是单线程, 前方代码执行, 也是要花时间的

可以使用requestAnimationFrame来封装 setInterval

```
function setInterval(callback, interval) {
  let timer
  const now = Date.now
  let startTime = now()
  let endTime = startTime
  const loop = () => {
    timer = window.requestAnimationFrame(loop)
    endTime = now()
    if (endTime - startTime >= interval) {
      startTime = endTime = now()
      callback(timer)
    }
  }
  timer = window.requestAnimationFrame(loop)
  return timer
}

let a = 0
setInterval(timer => {
  console.log(1)
  a++
  if (a === 3) cancelAnimationFrame(timer)
}, 1000)
```

## 手写Promise

### 简易版

对于`resolve`和`reject`的封装:
+ 首先两个函数都要先判断状态是不是pending状态, 只有pending状态才能改变状态
+ 当前状态改变之后, 就要将传入的值复制给当前的value
+ 然后遍历回调数组立即执行 


```
const PENDING = 'pending';
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
    const that = this;
    that.state = PENDING;
    that.value = null; // * 用于保存resolve或者reject传入的值
    that.resolveCallbacks = []; // * 保存then的回调
    that.rejectCallbacks = []; // * 保存catch的回调
    
    // * 完善resolve和reject
    funciton resolve(value) {
        if (that.state === PENDING) {
            that.value = value;
            that.state = RESOLVED;
            that.resolvedCallbacks.map(cb => cb(that.value))
        }
    }
    
    function reject(value) {
        if (that.state === PENDING) {
            that.value = value;
            that.state = REJECTED;
            that.rejectCallbacks.map(cb => cb(that.value))
        }
    }

    // * 执行函数
    try {
        //
        fn(resolve, reject);
    } catch (e) {
        reject(e)
    }
}

// * 接下来是then函数
MyPromise.prototype.then = function(onFulfilled, onRejected) {
    const that = this;
    // * 首先要判断是不是函数类型, 如果不是函数类型, 则创建一个函数赋值给对应的参数, 同时也实现了透传
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : r => throw{ r };
    if (that.state === PENDING) {
        // * Promise中then的回调延迟挂载
        that.resolveCallbacks.push(onFulfilled);
        that.rejectCallbacks.push(onRejected);
    }
    if (that.state === RESOLVED) {
        // * resolved状态直接执行
        onFulfilled(that.value)
    }
    if (that.state === REJECTED) {
        // * rejected状态直接执行
        onRejected(that.value)
    }
}
```

### 实现一个符合 Promise/A+ 规范的 Promise(稍微正式版)

```
const PENDING = 'pending';
const RESOLVED = 'resolved';
const REJECTED = 'rejected';

function MyPromise(fn) {
    const vm = this; // * 使用that替代全局this指向
    vm.state = PENDING;
    vm.value = null; // * 用于保存
    vm.resolvedCallbacks = []; // * 用于保存then中的回调
    vm.rejectedCallbacks = []; // * 用于保存catch中的回调

    // * 完善一个符合Promise A+ 的 resolve 和 reject
    function resolve(value) {
        // * 首先要判断传入的 value 是不是一个 Promise 类型
        if (value instanceof MyPromise) {
            return value.then(resolve, reject);
        }
        // * 由于resolve是一个异步操作, 因此将他们用setTimeout包裹起来, 保障执行顺序
        setTimeout(() => {
            if (vm.state === PENDING) {
                vm.value = value;
                vm.state = RESOLVED;
                vm.resolvedCallbacks.map(cb => cb(vm.value));
            }
        }, 0)
    }

    function reject(value) {
        setTimeout(() => {
            if (vm.state === PENDING) {
                vm.value = value;
                vm.state = REJECTED;
                vm.rejectedCallbacks.map(cb => cb(vm.value))
            }
        }, 0)
    }
}

MyPromise.prototype.then = function(onFulfilled, onRejected) {
    consst vm = this;
    // * 首先要判断是不是函数类型, 如果不是函数类型, 则创建一个函数赋值给对应的参数, 同时也实现了透传
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v;
    onRejected = typeof onRejected === 'function' ? onRejected : r => throw{ r };
    let promise2;

    // * 接下来需要改造then函数判断逻辑, 首先要新增一个变量 promise2
    // * 因为每一个then函数需要返回一个新的 Promise 对象, 该变量用于保存新的返回对象, 然后我们接下来是改造判断等待状态的逻辑
    // * 首先返回一个新的 Promise对象， 并在Promise中传入一个函数
    // * 基本逻辑和之前的一样， 往回调函数的数组中push函数
    // * 同样， 在执行过程中可能会出错， 因此使用try catch
    // * 规范规定， 执行onFulfilled 或者 onRejected 函数时会返回一个 x， 并且执行 Promise 解决过程， 这是为了不同的 Promise 都可以兼容使用， 比如 JQ 的 Promise 能兼容 ES6 的 Promise
     if (that.state === PENDING) {
         return ( promise2 = new MyPromise((resolve, reject) => {
             that.resolvedCallbacks.push(() => {
                 try {
                     const x = onFulfilled(that.value);
                     resolutionProcedure(promise2, x, resolve, reject)
                 } catch (r) {
                     reject(r)
                 }
             })

             that.rejectedCallbacks.push(() => {
                 try {
                     const x = onRejected(that.value);
                     resolutionProcedure(promise2, x, resolve, reject);
                 } catch (r) {
                     reject(r)
                 }
             })
         }))
     }

     if (that.state === RESOLVED) {
         return (promise2 = new MyPromise((resolve, reject) => {
             setTimeout(() => {
                 try {
                     const x = onFulfilled(that.value);
                     resolutionProcedure(promise2, x, resolve, reject);
                 } catch (r) {
                     reject(r)
                 }
             }, 0)
         }))
     }

     if (that.state === REJECTED) {
         return (promise2 = new MyPromise((resolve, reject) => {
             setTimeout(() => {
                 try {
                     const x = onRejected(that.value);
                     resolutionProcedure(promise2, x, resolve, reject);
                 } catch (err) {
                     reject(err)
                 }
             })
         }))
     }
}

// * 最后，也是最难的一部分，也就是实现兼容多种 Promise 的 resolutionProcedure 函数
// * 首先 Promise A+ 规范规定了 x 不能和 Promise2相等, 这样会引发循环引用的问题
function resolutionProcedure(promise2, x, resolve, reject) {
    if (promise2 === x) {
        return reject(new TypeError('有毛病'))
    }

    // * 然后需要判断 x 的类型
    // * 规范规定如果 x 是一个 Promise，那么需要判断一以下两种情况:
    // * 1. 如果 x 处于等待状态, Promise需保持为等待状态直至 x 被执行或拒绝
    // * 2. 如果 x 处于其他状态, 则用相同的值处理 Promise
    if (x instanceof MyPromise) {
        x.then(function(value) {
            resolutionProcedure(promise2, value, resolve, reject)
        }, reject)
    }

    // * 接着实现剩下的部分
    // * 首先创建一个变量called, 用于判断是否已经调用过函数
    // * 然后判断 x 是否是一个对象或者函数， 如果都不是， 就将 x 传入resolve中
    // * 如果x 是一个函数或者对象， 先把 x.then 的值赋值给 then， 然后判断then的类型， 如果不是函数就直接将 x 传入 resolve 中
    // * 如果then是函数类型， 那么就将x作为 then 方法的作用域this调用， 并且传入两个回调函数， 第一个是resolvePromise， 第二个是rejectPromise， 两个回调函数都要判断是否执行过函数
    // * 上面的代码只要有抛错， 就传入reject中执行
    let called = false;
    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
        try {
            let then = x.then;
            if (typeof then === 'function') {
                then.call(x,
                    y => {
                        if (called) return;
                        called = true;
                        resolutionProcedure(promise2, y, resolve, reject);
                    },
                    e => {
                        if (called) return;
                        called = true;
                        reject(e);
                    }
                )
            } else {
                resolve(x)
            }
        } catch (err) {
            if (called) return;
            called = true;
            reject(err);
        }
    } else {
        resolve(x)
    }
}
```

## 原型和原型链
在ES2019中，用了一句短短的话，介绍了一下原型链--prototype chain
a prototype may have a non-null implicit reference to its prototype, and so on; this is called the prototype chain

### 原型对象和构造函数有什么关系
在JS中, 每当定义一个函数数据类型, 就带有一个prototype(除了Function.prototype.bind()), 而当执行new操作的时候, 这个函数就成了构造函数, 在他的实例上就会存在一个__proto__, 指向这个函数的prototype

换句话说, 每一个函数都有原型(prototype), 每一个对象都有__proto__

### 原型链
实际上就是JS通过prototype的__proto__属性指向父类对象的prototype, 直到指向Object为止

### 最简单的继承(寄生组合继承)

```
function Father() {

}
function Son() {
    Father.call(this)
}
Son.prototype = Object.create(Father.prototype)
Son.prototype.constructor = Son
```

### 面向对象的设计一定是最好的设计吗
其实并不, 比如Car这个类, 有一个加油的属性, 一般来说着实是所有的车都要加油, 但是新能源汽车的出现，如果也继承Car, 那么他这个属性就是多余的。

这就是说的父类无法完全描述清楚子类的需要, 但是子类会将父类的成员都继承下来

一旦子类发生变化, 父类又要跟着变化, 这样维护起来并不好(代码耦合性高)

#### 类似于golang
使用面向组合编程, 无疑是一个比较优秀的解决方案

先设计一系列零件， 然后使用他们进行拼装, 形成不同的实例或者类, 这样代码干净, 也容易复用, 维护起来只需要维护基本的零件就可以了

## 其他的API原理
### new操作符
+ 新生成一个对象
+ 绑定到原型
+ 绑定this
+ 执行构造函数
+ 返回新对象

#### new操作符目的
+ 让实例可以访问到私有属性
+ 让实例可以访问到构造函数原型(constructor.prototype)所在原型链上的属性
+ 构造函数返回的结果是一个引用数据类型

#### 实现一个new
```
function newFactory(ctor, ...args) {
    if (typeof ctor !== 'function') {
        throw new Error('newOperator function the first param be a function');
    }
    let obj = new Object();
    obj.__proto__  = Object.create(ctor.prototype);
    let res = ctor.apply(obj, ...args);

    let isObject = typeof res === 'object' && typeof res !== null;
    let isFunction = typeof res === 'function';
    return isObject || isFunction ? res : obj;
}
```
### 手写实现 bind/apply/call
#### call
```
function call(context, ...args) {
    let self = context || window;
    self.fn = this;
    let result = eval("self.fn(...args)");
    delete self.fn;
    return result;
}
```

#### apply
```
funtion apply(context, args) {
    let self = context || window;
    self.fn = this;
    let result = eval("self.fn(...args)");
    delete self.fn;
    return result;
}
```

#### bind
+ 对于普通函数, 只要是绑定this对象
+ 对于构造函数, 不仅是绑定this对象, 还需要继承原型链上的属性
```
function bind(context, ...args) {
    if (typeof this !== 'function') {
        throw new Error('请正确使用bind方法');
    }
    let self = this;
    let fbound = funtion() {
        self.apply(this instanceof self ? this : context, args.concat(Array.prototype.slice.call(arguments)));
    }
    // * 继承原型上的属性
    fbound = Object.create(this);
    return fbound;
}
```

### 浅拷贝(仅拷贝第一层的值, 从第二层开始都是拷贝的指向堆地址的指针)的手段有哪些
+ Array.prototype.slice
+ Object.assign
+ 解构赋值
+ 扩展运算符
+ Array.prototype.concat

### 谈谈对this的理解
+ call/apply/bind可以显示绑定this
+ 隐式绑定
    - 全局上下文: 默认指向window, 严格模式下指向undefined
    - 直接调用函数: 
        + 对于普通函数是指向调用它的作用域, 比如全局调用指向全局, 对象调用指向该对象
        + 箭头函数内部this永远指向箭头函数定义时的父级作用域
    - 对象.方法的调用方式
        + 对于普通函数指向这个对象
        + 对于箭头函数指向定义时的父级作用域
    - DOM事件绑定
        + onclick和addEventListener中this默认指向绑定事件的元素
    - new 构造函数绑定: 指向实例对象
    - 箭头函数: 指向定义时的父级作用域并且永远不变
## 题目
+ 如何准确判断一个变量是不是数组?
+ 手写一个简易的Jquer，考虑插件和扩展性
+ class的原型本质，怎么理解

### class和继承

#### class
class可以看作一个模板，内部有constructor、属性和方法

比如写一个学生类
```
// 类
class Student {
    constructor(name, number) {
        // 这里的this指向当前构建的实例
        this.name = name;
        this.number = number;
    }
    sayHi() {
        console.info(`姓名: ${this.name}, 学号: ${this.number}`)
    }
}

// 通过类声明一个实例
let xialuo = new Student("夏洛", 201613160911)
console.info(xialuo.name);
console.info(xialuo.number);
xialuo.sayHi()

```

#### ES2020新增使用#定义类的私有成员
#### 比如 
```
class People {
    #money
    constructor(name, major) {
        this.name = name
        this.major = major
        this.#money = major !== "学生" ? "screet" : "no money"
    }
    getMoney() {
        return this.#money
    }
    hasMoney() {
        console.info(`${this.name} has ${this.#money}`)
    }
}
```

#### 继承
+ extends关键字
+ super执行父类的构造函数
+ 扩展和重写父类的一些方法

```
// * 父类
class People {
    constructor(name) {
        this.name = name
    }
    #testself = "wc"
    eat() {
        console.info(`${this.name} eat something and ${this.#testself}`)
    }
}

// * 子类
class Student extends People {
    #testself = "mzl"
    constructor(name, number) {
        super(name)
        this.number = number
    }
    sayHi() {
        console.info(`姓名: ${this.name}, 学号: ${this.number}`)
    }
    getSelf() {
        return this.#testself
    }
}

// * 子类
class Teacher extends People {
    #money
    constructor(name, major) {
        super(name)
        this.major = major
        this.#money = this.major === "语文" ? 9000 : ""
    }
    teach() {
        console.info(`${this.name} teach ${this.major}`)
    }
    getMoney() {
        console.info(this.#money)
    }
}

let xialuo = new Student("夏洛", 201613160911)
console.log(xialuo.name); // 夏洛
console.info(xialuo.number); // 201613160911
xialuo.sayHi() // 姓名：夏洛，学号： 201613160911
xialuo.eat() // 夏洛eat something and wc
console.info(xialuo.getSelf()) // wc

let wang = new Teacher("王老师", "语文")
console.info(wang.name) // 王老师
console.info(wang.major) // 语文
wang.teach() // 王老师 teach 语文
wang.eat() // 王老师 eat something and wc
wang.getMoney() // 9000
```

#### 类型判断 instanceof
+ 手写 instanceof
```
funciton instanceof(left, right) {
    let prototype = right.prototype;
    left = left.__proto__
    while(true) {
        if (left === null) {
            return false;
        }
        if (prototype === left) {
            return true;
        }
        left = left.__proto__;
    }
}
```

##### instanceof也可以用于判断原始类型
```
class PrimitiveNumber{
    static [Symbol.hasInsatance](x) {
        return typeof x === 'number'
    }
}
```

##### 如上三个类的一些判断
+ xialuo instanceof Student
// true
+ xialuo instanceof People
// true
+ xialuo instanceof Object
// true

+ [] instanceof Array
// true
+ [] instanceof Object
// true
+ {} instanceof Object
// true

A instanceof B // 只要A是B构建出来的，就是true

所有的引用类型instanceof一个Object都是true
Object也是所有class的父类

typeof Student // function
typeof People // function

class本质只是一个语法糖，本质上还是通过function来实现的

以上面继承的为例子
```
xialuo.__proto__; // 这个东西里面有一个constructor和一个sayHi()

// 此时可以使用
xialuo.__proto__.sayHi() //得到的结果是
// 姓名: undefined, 学号: undefined
Student.prototype; // 也是一个sayHi和constructor

// 实际上Prototype是一个隐式原型，而__proto__是一个显式原型

// 并且xialuo.__proto__ = Student.prototype
// 也就是说实例的__proto__和类的prototype指向的是同一处

```

#### 原型关系
 + 每个class都有一个隐式引用prototype
 + 每一个实例都可以通过一个显式引用__proto__去访问class的隐式引用prototype
 + 实例的__proto__指向对应class的prototype

#### 基于原型的执行规则
+ 获取属性xialuo.name或执行方法xialuo.sayHi()时
+ 先在自身的属性和方法中寻找
+ 如果找不到，就去显示引用__proto__中寻找，而这个__proto__恰好就指向了class的隐式引用prototype

#### 原型链
说起这个原型链，又要回到ES2019
在ES2019中，用了一句短短的话，介绍了一下原型链--prototype chain
a prototype may have a non-null implicit reference to its prototype, and so on; this is called the prototype chain(原型可能具有对其原型的非空隐式引用，依此类推；这称为原型链)

本身__proto__出现就是为了解决在实例中无法直接访问隐式引用prototype，需要使用Object.getPrototypeOf(实例)来访问，于是很多浏览器私自开了一个口直接访问类(构造函数)的原型，这个口，就是__proto__，直到ES2015规范只好向事实低头，将__proto__属性纳入了规范的一部分。

实际上__proto__的实现很简单
就是在Object的隐式引用prototype上定义了一个叫做__proto__的属性，并且将它挂载到了每一个Object的派生类上，作为一个类似于不可枚举属性的属性，实际上看起来像一个不可枚举属性，但__proto__并不是不可枚举属性，当然，也不是可枚举属性，因为使用Object.getOwnPropertyNames()访问不到该属性
所以是，表面上看在对象里存在一个__proto__属性，实际上，它只是开发者工具为了方便让开发者查看原型，故意渲染出来的虚拟节点。虽然跟对象的其他属性并列，看起来像一个不可枚举属性，但实际上它并不在该对象中
访问对象的__proto__触发了Object.prototype上的__proto__的get方法

__proto__实现如下
```
let test = {
    get __proto__() {
        return Object.getPrototypeOf(this)
    },
    set __proto__() {
        return Object.setPrototypeOf(this, value)
    }
}
```

一条带有子类继承父类的原型链，主要就是子类的隐式引用prototype的显式引用__proto__指向父类的prototype
同时，在js中，所有的引用类型，都继承自Object，而Object没有父类了，因此Object.__proto__指向空值。

比如在之前的例子中，就有如下一条原型链
xialuo.__proto__ === Student.prototype
xialuo.__proto__.__proto__ === Student.prototype.__proto__ === People.prototype
xialuo.__proto__.__proto__.__proto__ === Student.prototype.__proto__.__proto__ === People.prototype.__proto__ === Objcet.prototype

Object.prototype.__proto__ === null

##### 重要提示
+ class是Es6语法规范，由ECMA委员会发布
+ ECMA只规定语法规则，即我们代码的书写规范，不规定如何实现
+ 以上实现方式都是V8引擎的实现方式，也是主流的

#### JS原型链继承

在js中，有两类原型继承的方式: 显式原型继承和隐式原型继承
区别：是否由开发者亲自操作
##### 显式原型继承
所谓显式原型继承就是亲自将某一个对象设置为另一个对象的原型
```
const obj_a = {a: 1};
const obj_b = {b: 1};
Object.setPrototypeOf(obj_b, obj_a); // 将obj_a设置为obj_b的原型
```

##### 隐式原型继承
将某些函数称之为constructor, 专门用来做属性初始化
function User(firstname, lastname) {
    this.firstname = firstname
    this.lastname = lastname
}
同时约定，constructor函数有一个特殊属性叫做prototype
User.prototype = Object.create(Object.prototype)

使用new关键字去创建新对象
然后再内部偷偷的做一个创建对象，关联原型和属性初始化等一系列过程
function User(firstname, lastname) {
    this.firstname = firstname
    this.lastname = lastname
}

User.prototype = Object.create(Object.prototype)
const user = new User("Jade", "GU")

实际上这种操作比较繁琐，因此出现了一个叫做字面量的东西，将原来的多个步骤融合成了一步进行操作
比如说新建一个对象
let obj = {
    firstname: "JADE",
    lastname: "GU"
}

这个操作实际上是两个步骤融合的
第一步是使用new Object()去创建一个对象
第二步是进行原型继承，由于这种继承看不到，因此就是隐式原型继承同时设置属性

##### 两个构造函数之间继承
```
// 不需要中间对象版本
function Human(age, ...args) {
    this.age = age
}
Human.prototype.showAge = function() {
    console.info(this.age)
}
function User(name, ...args) {
    Human.call(this, ...args)
    this.name = name
}
User.prototype.showName = function() {
    console.info(this.name)
}
User.prototype.constructor = User
Object.setPrototypeOf(User.prototype, Human.prototype)

// 使用中间对象版
function Student(name, ...args) {
    this.name = name || "none"
}
Student.prototype.hello = () => {
    console.info(this.name)
}

function PrimaryStudent(grade, ...args) {
    Student.call(this, ...args)
    this.grade = grade || 1
}
// 空函数
function F() {}
F.prototype = Student.prototype
PrimaryStudent.prototype = new F()
PrimaryStudent.prototype.constructor = PrimaryStudent
PrimaryStudent.prototype.getGrade = function () {
    return this.grade;
}

// 可以封装一个继承的函数
const inherit = (SuperConstructor, properites) => {
    let {constructor} = properites
    let SubConstructor = function(...args) {
        SuperConstructor.call(this, ...args)
        constructor.call(this, ...args)
    }

    SubConstructor.prototypes = {
        ...properites,
        constructor: SubConstructor
    }
    Object.setPrototypeOf(SubConstructor.prototype, SuperConstructor.prototype)

    return SubConstructor
}
```

## 作用域和闭包

### 题目
+ this的不同应用场景如何取值?
+ 手写bind函数
```
// bind-demo
Function.prototype.bind1 = function(self, ...args) {
    // 将参数拆解为数组
    // arguments 可以获取一个函数所有的参数，是一个列表不是一个数组
    const args = Array.prototype.slice.call(arguments) // 将一个列表变为数组

    // 获取this (数组第一项)
    const t = args.shift() // 将第一个值取出来，改变原数组

    // 由于这是一个class中一个成员方法的this，指向类的实例，也就是fn1
    // 所以这里的this就是fn1.bind()中的fn1
    const self = this

    // 返回一个函数
    return function() {
        return self.apply(t, args)
    }
}
```
+ 实际开发中闭包的应用场景，举例说明

```
// 1.隐藏数据，只提供API
function createCache() {
    const data = [] // 闭包中的数据，被隐藏，不被外界访问
    return {
        set: function(key, val) {
            data[key] = val
        },
        get: function(key) {
            return data[key]
        }
    }
}

// 2.
```

### 作用域
```
let a = 0; // 全局变量
function fn1() {
    let a1 = 100; // 函数&&块级变量
    function fn2() {
        let a2 = 200; // 函数&&块级变量
        function fn3() {
            let a3 = 300; // 函数&&块级变量
            // 在这个块中，只有a3不是自由变量
            return a + a1 + a2 + a3
        }
        fn3()
    }
    fn2()
}
console.info(fn1())
```

+ 全局作用域
    - 在全局申明的变量，任何位置都可以访问
+ 函数作用域
    - 在函数内部申明的变量，只能在当前函数内部使用
+ 块级作用域
    - 一个大括号就是一个块，超出这个大括号使用就报错
+ 自由变量
    - 一个变量在当前作用域没有定义，但就被使用了
    - 向上级作用域，一层一层依次寻找，直到找到为止
    - 如果全局作用域都没有找到，就报错 xxx is not defined

+ 闭包(作用域应用的特殊情况，有两种表现)
    - 函数作为参数被传递
    - 函数作为返回值被返回

+ 闭包有三个特效:
    + 1.函数嵌套函数;
    + 2.函数内部可以引用外部的参数和变量;
    + 3.参数和变量不会被垃圾回收机制回收。

```
// 函数作为返回值
function create() {
    let a = 100;
    return function() {
        console.info(a)
    }
}
let fn = create()
let a = 200
fn() // 100

// 函数作为参数
function print(fn) {
    let a = 200;
    fn()
}
let a = 100
function fn() {
    console.info(a)
}
print(fn) // 100

// 主要是由于函数寻找自由变量会从定义他自己的作用域开始去寻找
// 而不是在函数执行的时候
```

### this
应用场景
+ 作为普通函数调用
+ 使用call apply bind调用
+ 作为对象方法被调用
+ class方法中被调用
+ 箭头函数中调用

#### this取什么值是在函数执行的时候确认的，而不是函数定义的时候

```
function fn1() {
    console.info(this)
}

fn1() // window

fn1.call({x: 100}) // {x: 100}
const fn2 = fn1.bind({x: 200})
fn2() // {x: 200}

const zhangsan1 = {
    name: '张三',
    sayHi() {
        // this就是当前对象
        console.info(this)
    },
    wait() {
        setTimeout(function() {
            // this指向window
            console.info(this)
        }, 100)
    }
}

const zhangsan2 = {
    name: '张三',
    sayHi() {
        // 普通函数的this，指向调用的位置
        // this就是当前对象
        console.info(this)
    },
    wait() {
        setTimeout(() => {
            // 箭头函数的this永远取它上级作用域的this
            // 因此这里的this指向wait这个函数，所以this指向当前对象
            console.info(this)
        }, 100)
    }
}

class People {
    constructor(name) {
        this.name = name
        this.age = 20
    }
    sayHi() {
        console.info(this)
    }
}
// class中constructor的this代表正在创建的实例，class内部的函数this指向创建的实例
const zhangsan = new People("张三")
zhangsan.sayHi() // zhangsan对象
```

#### Object.is 和 === 的区别?
=== 作为判断时, 会将 NaN === NaN 判断为false, 并且 +0 和 -0 判断为true, 但实际上这样的方式是错误的, 会造成很多问题
Object.is做判断, 以上都是相反的, 因此更加规范
```
funciton is(x, y) {
    if (x === y) {
        // 使用 1/x === 1/y 做判断主要是因为 1/+0 为 +infinity; 1/-0 为 -infinity
        return x !== 0 || y !== 0 || 1/x === 1/y
    } else {
        return x !== x && y !== y
    }
}
```

#### Symbol.toPrimitive
对象的Symbol.toPrimitive属性。指向一个方法。该对象被转化为原始类型的值时，会调用这个办法，返回该对象对应的原始类型值。
Symbol.toPrimitive被调用时,会接受一个字符串参数，表示当前运算的模式，一个有三种模式:
+ Number:该场合需要转成数值
+ String:该场合需要转成字符串
+ Default:该场合可以转成数值，也可以转成字符串。

在Object执行类型转换时若存在Symbol.toPrimitive则优先级最高, 其次是valueOf, 最后是toString

### 四种扁平化方法
#### 直接遍历
```
function flatten(arr, result) {
arr.forEach(item => {
    if (item instanceof Array) {
        flatten(item, result)
    } else {
        result.push(item)
    }
})
return result
}
```
#### 累加器
```
function flatten(arr) {
    return arr.reduce((accumulator, cur) => {
        return accumulator.concat(Array.isArray(cur) ? flatten(cur) : cur)
    })
}
```
#### 使用扩展运算符
```
function flatten(arr) {
    whilt(arr.some(item => item instanceof Array)) {
        arr = [].concat(...item)
    }
    return arr
}
```
#### 使用ES6中flat方法
```
function flatten(arr) {
    return arr.flat(Infinity)
}
```
### 手写一系列数组方法
#### 手写map方法
```
Array.prototype.map = function(callbackFn, thisArg) {
    if (this === null || this === undefined) {
        throw new TypeError("cannot read property 'map' of null or undefined");
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + "is not a function");
    }

    let O = Object(this);
    let T = thisArg || this;
    
    let len = O.length >>> 0; // 防止出现非整数, 如果是undefined将变成0
    let A = new Array(len); // 创建一个新的原数组长的空数组

    for (let k = 0; k < len; k++) {
        if (k in O) {
            let kValue = O[k];
            let mappedValue = callbackFn.call(T, kValue, k, O);
            A[k] = mappedValue;
        }
    }
    return A;
}
```
#### 手写reduce累加器
```
Array.prototype.reduce = function(callbackFn, initValue) {
    if (this === null || this === undefined) {
        throw new TypeError("cannot read property 'map' of null or undefined");
    }
    if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
        throw new TypeError(callbackFn + 'is not a function!');
    }

    let O = Objecat(this);
    let len = O.length >>> 0;
    let k = 0;
    let accumulator = initValue;
    if (accumulator === undefined) {
        for (; k < len; k++) {
            if (k in O) {
                accumulator = O[k]; // * 如果没有默认的初试累加值默认采用第一个作为累加值, 同时退出循环并且完成第一次遍历
                k++;
                break;
            }
        }
    }
    if (k === len && accumulator === undefined) {
        throw new TypeError('each element of the array is empty');
    }
    for (; k < len; k++) {
        if (k in O) {
            accumulator = callbackFn.call(undefined, accumulator, O[k], k, O); // * 每一次遍历触发传入的回调函数, 参数依次是 累加值 当前值 序列号和当前数组
        }
    }
    return accumulator;
}
```
#### 手写数组push方法
```
Array.prototype.push = function(...items) {
  let O = Object(this);
  let len = O.length >>> 0;
  let argCount = items.length >>> 0;
  // * 2 ** 53 - 1 为JS能表示的最大整数
  if (len + argCount > 2 ** 53 - 1) {
    throw new TypeError("The number of array is over the max value retricted!");
  }
  for (let i = 0; i < argCount; i++) {
    O[len + i] = items[i];
  }
  let newLength = len + argCount;
  O.length = newLength;
  return newLength;
}
```
#### 手写数组pop方法
```
Array.prototype.pop = function() {
  let O = Object(this);
  let len = this.length >>> 0;
  if (len === 0) {
    O.length = 0;
    return undefined;
  } else {
    len--;
    let value = O[len]
    delete O[len];
    O.length = len;
    return value;
  }
}
```
#### 手写数组filter方法
```
Array.prototype.filter = function(callbackFn, thisArg) {
  if (this === null || this === undefined) {
    throw new TypeError("cannot read property 'filter' of null or undefined!");
  }
  if (Object.prototype.toString.call(callbackFn) !== '[object Function]') {
    throw new TypeError(callbackFn + "is not a function");
  }
  let O = Object(this);
  let len = O.length >>> 0;
  // let T = thisArg || this
  let resLen = 0
  let res = []
  for (let i = 0; i < len; i++) {
    if (i in O) {
      if (callbackFn.call(thisArg, O[i], i, O)) {
        res[resLen++] = O[i]
      }
    }
  }
  return res
}
```

#### 手写数组splice方法
+ 主要要解决的问题就是删除元素大于增加元素, 需要向前移动剩余元素,同时减小数组长度, 删除元素小于增加元素, 需要将新增元素位置后面的元素向后移动为新增元素空出位置
+ 需要对开始下标小于0的参数进行处理, splice方法当他的开始下标小于0的时候会用 长度 - 开始下标的绝对值 判断是否小于0, 如果小于0则使用0, 如果不是则直接使用该结果, 如果下标大于数组长度则直接使用数组长度
+ 对删除数目进行处理, 如果删除数目过小则直接为0, 过大则从开始下标直接删完, 不传也是删完
+ 对Object.freeze和Object.seal后的数组进行判断, 如果是冻结数组则判断是否有删除和新增值, 只要存在则报错, 如果是封闭对象, 则判断删除数目和新增数目是否一致, 一致则可以, 不一致则报错
```
const sliceDeleteElements = function(array, startIndex, deleteCount, deleteArr) {
  for (let i = 0; i < deleteCount; i++) {
    if (startIndex + i in array) {
      deleteArr[i] = array[startIndex + i]
    }
  }
}
const movePostElements = function(array, startIndex, len, deleteCount, addElements) {
  if (deleteCount > addElements.length) {
    // * 删除元素等于插入元素, 不需要移动
    if (deleteCount === addElements.length) {
      return
    } else if (deleteCount > addElements.length) {
      // * 删除元素大于插入元素
      for (let i = startIndex + deleteCount; i < len; i++) {
        let fromIndex = i;
        let toIndex = i - (deleteCount - addElements.length);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex]
        } else {
          delete array[toIndex]
        }
      }
      // * 将目标数组长度后面的都删除
      for (let i = len - 1; i >= len + addElements.length - deleteCount; i--) {
        if (i in array) {
          delete array[i]
        }
      }
    } else if (deleteCount < addElements.length) {
      // * 删除元素小于插入元素
      // * 从后往前遍历, 给中间留出新增数据的位置即可
      for (let i = len - 1; i >= startIndex + deleteCount; i--) {
        let fromIndex = i;
        let toIndex = i + (addElements.length - deleteCount);
        if (fromIndex in array) {
          array[toIndex] = array[fromIndex]
        } else {
          delete array[toIndex]
        }
      }
    }
    
  }
}
// * 处理负数startIndex
const computedStartIndex = function(startIndex, len) {
  if (startIndex < 0) {
    // * splice为负索引时, 会使用长度减去索引的绝对值来作为开始索引，如果该值还是小于0, 那么就会直接使用0
    return startIndex + len > 0 ? startIndex + len : 0
  }
  return startIndex > len ? len : startIndex
}
// * 处理删除数目deleteCount
const computedDeleteCount = function(startIndex, deleteCount, len, arguementsLen) {
  if (argumentsLen === 1) {
    // * 删除数没有传, 默然将整个数组从开始下标直接删除
    return len - startIndex
  }
  // * 删除数过小
  if (deleteCount < 0) {
    return 0
  }
  // * 删除数过大
  if (deleteCount > len - startIndex) {
    return len - startIndex
  }
  return deleteCount
}
Array.prototype.splice = function(startIndex, deleteCount, ...addElements) {
  // * 处理密闭对象和冻结对象
  if (Object.isSealed(array) && deleteCount !== addElements.length) {
    throw new TypeError("the object is a sealed object!")
  } else if (Object.isFrozen(array) && (deleteCount > 0 || addElements.length > 0)) {
    throw new TypeError("the object is a frozen object")
  }
  
  // * 获取参数长度
  let arguementsLen = arguments.length;
  // * 获取当前数组
  let array = Object(this);
  // * 获取当前数组长度
  let len = array.length >>> 0;
  // * 定义需要删除的数组长度的空数组
  let deleteArr = new Array(deleteCount);
  
  let startIndex = computedStartIndex(startIndex, len);
  let deleteCount = computedDeleteCount(startIndex, deleteCount, len, arguementsLen);
  // * 拷贝删除的元素
  sliceDeleteElements(array, startIndex, deleteCount, deleteArr);
  // * 移动删除元素后面的元素
  movePostElements(array, startIndex, len, deleteCount, addElements);
  // * 插入新元素
  for (let i = 0; i < addElements.length; i++) {
    array[startIndex + i] = addElements[i];
  }
  array.length = len - deleteCount + addElements.length;
  return deleteArr;
}
```

### eventLoop
+ 1.一开始整段脚本作为第一个宏任务执行
+ 2.当执行过程中同步代码直接执行, 宏任务进入宏任务队列, 微任务进入微任务队列
+ 3.当前宏任务执行完出队, 检查微任务队列, 如果有则依次执行, 直到微任务队列为空
+ 4.执行浏览器UI线程的渲染工作
+ 5.检查是否存在web worker任务, 有则执行
+ 6.执行队首新的宏任务, 回到 2 继续, 依次循环, 直到宏任务队列和微任务队列都空了

### js处理回调的方式
+ 使用同步回调，直到异步任务进行完，再进行后面的任务。
+ 使用异步回调，将回调函数放在进行宏任务队列的队尾。
+ 使用异步回调，将回调函数放到当前宏任务中的最后面。

### 为什么Promise解决了回调地狱
#### Promise用了三个技术来解决这个问题
+ 回调函数延迟绑定。
+ 返回值穿透。
+ 错误冒泡。

#### 效果
+ 实现链式调用，解决多层嵌套问题
+ 实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题

#### 为什么Promise的回调要放在微任务中
+ 采用异步回调替代同步回调解决了浪费 CPU 性能的问题。
+ 放到当前宏任务最后执行，解决了回调执行的实时性问题。