/**
 * Name:Simba.js
 * 
 * Author:Simba
 * 
 * Version:2019-04   v1.0 
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        (global = global || self, global._ = factory());
}(this, function () {

    //工具对象
    const _ = {
        //把_对象名让出去，同时返回自身
        noConflict() {
            window._ = null
            return this
        },
        /**
         * 扩展方法
         */
        extend(source, target) {
            target = target || this
            for (const key in source) {
                if (!target[key]) target[key] = source[key]
            }
        }
    }

    //工具
    _.extend({
        eq(a, b) {
            return a === b
        },
        //生成随机的颜色 如#a2dd05
        getRndColor() {
            let colorStr = "#";
            let str = "ABCDEF123456789";
            for (let i = 0; i < 6; i++) {
                colorStr += str[Math.floor(Math.random() * str.length)];
            }
            return colorStr;
        },
        loadingbar: {
            config: {
                color: "blue"
            },
            start() {
                var loadingbar = document.getElementById("loadingbar")
                if (!loadingbar) {
                    loadingbar = document.createElement("div")
                    loadingbar.setAttribute("id", 'loadingbar')
                    loadingbar.style.backgroundColor = this.config.color
                    document.body.appendChild(loadingbar)
                }
                loadingbar.style.display = "block"
            },
            finish() {
                var loadingbar = document.getElementById("loadingbar")
                if (loadingbar) loadingbar.style.display = "none"
            }
        },
        formatMs2Obj(total) {
            var h = _.repairZero(Math.floor(total / 3600))
            var m = _.repairZero(Math.floor((total - h * 3600) / 60))
            var s = _.repairZero(Math.floor(total - h * 3600 - m * 60))
            return {
                h,
                m,
                s
            }
        },
        convertMysqlTime2JSTime(val) {
            return new Date(new Date(val).toISOString().replace("T", ' ').split('.')[0])
        },
        getQueryParams() {
            if (!location.search) return null
            var query = location.search.replace("?", '')
            return this.convertStr2Obj(query, '&')
        },
        convertStr2Obj(str, splitCode) {
            var obj = {}
            if (!str) return obj
            var queryarr = str.split(splitCode)
            queryarr.forEach(r => {
                var temparr = r.split('=')
                obj[temparr[0]] = temparr[1]
            })
            return obj
        },
        convertObj2Str(params) {
            if (!params) return ''
            return Object.keys(params).map(key => {
                return key + "=" + params[key]
            }).join('&')
        },
        log() {
            //将数组通过某字符变成字符串
            console.log(Array.prototype.join.call(arguments, ' '))
        },
        /**
         * 补零
         */
        repairZero(num) {
            return num < 10 ? ("0" + num) : num
        },
        /**
         * 合并字符串
         */
        makeStr(...args) {
            return args.join('')
        },
        /**
         * 加载script
         */
        loadScript(url, callback) {
            const head = document.getElementsByTagName("head")[0]
            var script = document.createElement("script")
            script.src = this.makeStr(url, "?", this.random())
            script.charset = "utf-8"
            script.async = true
            if (callback) script.onload = callback
            head.appendChild(script)
        },
        isArray(obj) {
            if (Array.isArray) return Array.isArray(obj)
            return this.toString(obj) === '[object Array]'
        },
        isFuction(obj) {
            return this.toString(obj) === '[object Function]'
        },
        toString(obj) {
            return Object.prototype.toString.call(obj)
        },
        // 获取最终位置，防止出画面
        calcPostion(left, top, maxLeft, maxTop, minLeft = 0, minTop = 0) {
            if (left < minLeft) left = minLeft
            else if (left > maxLeft) left = maxLeft
            if (top < minTop) top = minTop
            else if (top > maxTop) top = maxTop
            return {
                left,
                top
            }
        }
    })

    /**
     * 函数相关的扩展
     */
    _.extend({
        //防抖函数
        debounce(fn, wait) {
            let timer = null
            return function () {
                if (timer) clearTimeout(timer)
                timer = setTimeout(() => {
                    fn.apply(this, arguments)
                    timer = null
                }, wait);
            }
        },
        //节流函数
        throttling(fn, wait) {
            let endTime = +new Date
            return function () {
                if (+new Date - endTime < wait) return console.log('too busy');
                fn.apply(this, arguments)
                endTime = +new Date
            }
        }
    })

    /**
     * 字符串原型扩展
     */
    _.extend({
        reverse() {
            return this.split('').reverse().join('')
        },
        /**
         * 判断相等
         */
        equals(str) {
            return this === str
        },
        /**
         * 判断是否包含某字符串
         */
        includes(str) {
            return this.indexOf(str) > -1
        },
        /**
         * 判断是否以某字符串做开头
         */
        startsWith(str) {
            return this.indexOf(str) === 0
        },
        /**
         * 转数字
         */
        toNumber() {
            var result = parseFloat(this)
            return isNaN(result) ? 0 : result
        },
        /**
         * 首字母大写
         */
        toCapitalized() {
            return this[0].toUpperCase() + this.substring(1)
        },
        /**
         * 马赛克  张*丰
         */
        mosaic(start, end, code = "*") {
            if (!start && start !== 0) throw new Error("参数有误")
            if (isNaN(start) || start < 0 || start >= this.length)
                throw new Error("参数有误")
            if (!end || end >= this.length) end = this.length
            if (isNaN(end) || end <= start) throw new Error("参数有误")

            var left = this.substring(0, start)
            var middle = code.repeat(end - start)
            end = this.substring(end)
            return left + middle + end
        },
        /**
         * 字符串溢出省略
         */
        limit(count = 50) {
            if (this.length <= count) return this
            return this.substring(0, count) + "..."
        }
    }, String.prototype)

    /**
     * 字符串相关的扩展
     */
    _.extend({
        trim(str) {
            if (!str) return ''
            return str.trim()
        },
        checkStrNullOrEmpty(str) {
            return !str || str.trim() === ''
        },
        hasVal(str) {
            return !this.checkStrNullOrEmpty(str)
        },
        checkStrLength(str, len) {
            return str && str.trim().length >= len
        }
    })

    /**
     * 时间扩展
     */

    _.extend({
        parseTime(str, code = '/') {
            return new Date(str).getFormatText(code)
        }
    })

    _.extend({
        /**
         * 用于省份汉字与拼音转换，
         * 陕西和山西拼音一样，所以参考echarts地图文件的命名方式
         * 陕西的拼音改成shanxi1
         */
        getProvinceEName(province) {
            let obj = { "北京": "beijing", "上海": "shanghai", "天津": "tianjin", "重庆": "chongqing", "香港": "xianggang", "澳门": "aomen", "安徽": "anhui", "福建": "fujian", "广东": "guangdong", "广西": "guangxi", "贵州": "guizhou", "甘肃": "gansu", "海南": "hainan", "河北": "hebei", "河南": "henan", "黑龙江": "heilongjiang", "湖北": "hubei", "湖南": "hunan", "吉林": "jilin", "江苏": "jiangsu", "江西": "jiangxi", "辽宁": "liaoning", "内蒙古": "neimenggu", "宁夏": "ningxia", "青海": "qinghai", "陕西": "shanxi1", "山西": "shanxi", "山东": "shandong", "四川": "sichuan", "台湾": "taiwan", "西藏": "xizang", "新疆": "xinjiang", "云南": "yunnan", "浙江": "zhejiang" }
            return obj[province]
        }
    })


    _.extend({

        getNumberText() {
            var now = this
            var yy = now.getFullYear()
            var mm = _.repairZero(now.getMonth() + 1)
            var dd = _.repairZero(now.getDate())
            var hh = _.repairZero(now.getHours())
            var mi = _.repairZero(now.getMinutes())
            var ss = _.repairZero(now.getSeconds())
            return [yy, mm, dd, hh, mi, ss].join('')
        },

        /**
         * 获取格式化时间文本
         */
        getFormatText(code = '/') {
            var now = this
            var yy = now.getFullYear()
            var mm = _.repairZero(now.getMonth() + 1)
            var dd = _.repairZero(now.getDate())
            var hh = _.repairZero(now.getHours())
            var mi = _.repairZero(now.getMinutes())
            var ss = _.repairZero(now.getSeconds())
            return [yy, mm, dd].join(code) + ' ' + [hh, mi, ss].join(':')
        },
        /**
         * 获取年月日文本
         */
        getFormatDate() {
            return this.getFormatText().split(' ')[0]
        },
        /**
         * 获取时分秒文本
         */
        getFormatTime() {
            return this.getFormatText().split(' ')[1]
        },
        /**
         * 获取星期几文本
         */
        getFormatWeek() {
            return "日一二三四五六"[this.getDay()]
        }
    }, Date.prototype)

    /**
     * 数组扩展
     */
    _.extend({
        /**
         * 元素在数组中第一次出现位置
         */
        indexOf(obj) {
            for (let i = 0; i < this.length; i++) {
                if (this[i] === obj) return i
            }
            return -1
        },
        /**
         * 元素在数组中最后出现位置
         */
        lastIndexOf(obj) {
            for (let i = this.length - 1; i >= 0; i--) {
                if (this[i] === obj) return i
            }
            return -1
        },
        /**
         * 向数组末尾添加元素
         */
        push(obj) {
            this[this.length] = obj
        },
        //数组拼接成字符串
        join(code = "") {
            var str = ""
            for (let i = 0; i < this.length; i++) {
                str += (this[i] + code)
            }
            return str.substring(0, str.length - 1)
        },
        /*
         * 删除一个元素
         */
        remove(obj) {
            var index = this.indexOf(obj)
            if (index > -1) this.removeAt(index)
        },
        /**
         * 根据下标删除一个元素
         */
        removeAt(index) {
            if (index >= 0 && index < this.length) {
                this.splice(index, 1)
            }
        },
        /**
         * 删除元素
         */
        removeAll(obj) {
            //找元素在数组中的位置
            var index = this.indexOf(obj)
            //如果找到了
            if (index > -1) {
                //从数组中根据下标删掉
                this.removeAt(index)
                //再次调用自身,直到数组中找不到此元素为止
                arguments.callee.call(this, obj)
            }
        },
        /**
         * 根据下标删除一段元素
         */
        splice(index, count) {
            for (let i = index; i < this.length - 1; i++) {
                this[i] = this[i + count]
            }
            for (let i = 0; i < count; i++) this.pop()
        },
        /**
         * 删除第一个元素
         */
        shift() {
            var result = this[0]
            this.splice(0, 1)
            return result
        },
        /**
         * 数组翻转
         */
        reverse() {
            for (let i = 0; i < Math.floor(this.length / 2); i++) {
                var temp = this[i]
                this[i] = this[this.length - 1 - i]
                this[this.length - 1 - i] = temp
            }
        },

        /**
         * 在指定位置添加元素
         */
        insertAt(index, obj) {
            if (index < 0 || index > this.length) throw new Error("参数有误")
            for (let i = this.length - 1; i >= index; i--) {
                this[i + 1] = this[i]
            }
            this[index] = obj
            return this.length
        },
        /**
         * 往开头添加元素
         */
        unshift(obj) {
            return this.insertAt(0, obj)
        },
        /**
         * 删除最后一个元素
         */
        pop() {
            var result = this[this.length - 1]
            this.length -= 1
            return result
        },
        forEach(fn) {
            for (let i = 0; i < this.length; i++) {
                fn(this[i], i)
            }
        },
        some(fn) {
            for (let i = 0; i < this.length; i++) {
                if (fn(this[i], i)) return true
            }
            return false
        },
        every(fn) {
            for (let i = 0; i < this.length; i++) {
                if (!fn(this[i], i)) return false
            }
            return true
        },
        count(fn) {
            var result = 0
            this.forEach(function (item, i) {
                if (fn(item, i)) result++
            })
            return result
        },
        filter(fn) {
            var result = []
            this.forEach(function (item, i) {
                if (fn(item, i)) result.push(item)
            })
            return result
        },
        map(callback) {
            var arr = []
            for (let i = 0; i < this.length; i++) {
                var result = callback(this[i], i)
                arr.push(result)
            }
            return arr
        },
        includes(obj) {
            return this.some(function (item) {
                return item === obj
            })
        }
    }, Array.prototype)

    //Math 扩展
    _.extend({
        isLeapYear(year) {
            return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
        },
        //数字转换为英文字母
        toENChar(val) {
            return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[val]
        },
        /**
         * 判断是否是奇数
         */
        isOdd(num) {
            return num % 2 !== 0
        },

        /**
         * 判断是否是偶数
         */
        isEven(num) {
            return num % 2 === 0
        },

        /**
         * 随机整数(max,min)
         */
        rnd(max, min = 0) {
            return Math.round(Math.random() * (max - min)) + min
        }
    }, Math)

    //Cookie扩展
    _.extend({
        setCookie(key, val, expires) {
            if (typeof val === 'object')
                val = JSON.stringify(val)
            let now = new Date()
            now.setMinutes(now.getMinutes() + expires)
            document.cookie = `${key}=${encodeURI(val)};expires=${now.toUTCString()}`
        },
        removeCookie(key) {
            this.setCookie(key, null, -1)
        },
        getCookie(key) {
            let obj = {}
            document.cookie.split('; ').forEach(r => {
                let kv = r.split('=')
                obj[kv[0]] = decodeURI(kv[1])
            })
            if (key) {
                let res = null
                try {
                    res = JSON.parse(obj[key])
                } catch (error) {
                    res = obj[key]
                }
                return res
            }
            return obj
        },
    })

    /**
     * 对象相关的扩展
     */

    _.extend({
        keys(obj) {
            let arr = []
            for (const key in obj) {
                arr.push(key)
            }
            return arr
        },
        //模拟实现vuex中的mapState方法
        mapState(fileds) {
            let obj = {}
            fileds.forEach(key => {
                obj[key] = function () {
                    return this.$store.state[key]
                }
            })
            return obj
        }
    })

    if (global.Vue) {
        global.Vue.prototype.$sb = _
    }

    /**
     * 公开全局对象
     */
    return _
}))