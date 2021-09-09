// 数组求和的方法
let getReduce = function (arr) {
    return arr.reduce(function (a, b) {
        return (+a) + (+b);
    })
};
//补零操作
function addZero(num) {
    if (parseInt(num) < 10) {
        num = '0' + num;
    }
    return num;
}
let xh = {
    // 毫秒转换为日期格式
    getMyDate(str) {
        var oDate = new Date(str),
            oYear = oDate.getFullYear(),
            oMonth = oDate.getMonth() + 1,
            oDay = oDate.getDate(),
            oHour = oDate.getHours(),
            oMin = oDate.getMinutes(),
            oSen = oDate.getSeconds(),
            // oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay) + ' ' + addZero(oHour) + ':' +
            //     addZero(oMin) + ':' + addZero(oSen);
            oTime = oYear + '-' + addZero(oMonth) + '-' + addZero(oDay)
        return oTime;
    },

    // 获取今天日期不带时分秒
    getToday() {
        var day1 = new Date();
        day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
        var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
        return s1
    },
    // 获取今天时间-0点
    getTodayStart() {
        var day1 = new Date();
        day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
        var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
        return s1 + ' 00:00:00'
    },
    // 获取今天时间23：59：59
    getTodayEnd() {
        var day1 = new Date();
        day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000);
        var s1 = day1.getFullYear() + "-" + (day1.getMonth() + 1) + "-" + day1.getDate();
        return s1 + ' 23:59:59'
    },

    /* 获取昨天日期：返回：2020-01-01 */
    getYesterday() {
        var time = (new Date).getTime() - 24 * 60 * 60 * 1000;
        var yesterday = new Date(time);
        var month = yesterday.getMonth();
        var day = yesterday.getDate();
        yesterday = yesterday.getFullYear() + "-" + (yesterday.getMonth() > 9 ? (yesterday.getMonth() + 1) : "0" + (yesterday.getMonth() + 1)) + "-" + (yesterday.getDate() > 9 ? (yesterday.getDate()) : "0" + (yesterday.getDate()));
        return yesterday
    },

    /* 获取前7天的日期 */
    getLastWeek(day) {
        console.log(day);
        var myDate = new Date(day);
        // 减7，不包含输入的日期，减6包含输入的日期
        myDate.setDate(myDate.getDate() - 6);
        var dateArray = [];
        var dateTemp;
        var flag = 1;
        for (var i = 0; i < 7; i++) {
            dateTemp = myDate.getFullYear() + "-" + (myDate.getMonth() > 9 ? (myDate.getMonth() + 1) : "0" + (myDate.getMonth() + 1)) + "-" + (myDate.getDate() > 9 ? (myDate.getDate()) : "0" + (myDate.getDate()));
            dateArray.push(dateTemp);
            myDate.setDate(myDate.getDate() + flag);
        }
        return dateArray;
    },
    // 获取图表title
    getECtitle(data) {
        let arr = [];
        for (let i = 0; i < data.length; i++) {
            arr[i] = data[i]['title']
        }
        return arr
    },

    // 转换柱形图下面的title
    getzhuXingTuTitle(data) {
        return data[0].detections
    },

    // 获取图表数据options: 
    getOptionsData(data) {
        let arr = [];
        let leng = data.length;
        for (let i = 0; i < leng; i++) {
            arr[i] = {}
            arr[i]['series'] = []
            for (let j = 0; j < data[i]['levels'].length + 1; j++) {
                arr[i]['series'][j] = {}
                arr[i]['series'][j]['data'] = []
                if (j === data[i]['levels'].length) {
                    // arr[i]['series'][j]['data'] = []
                    // 最后一个保存饼图的数据
                    for (let k = 0; k < data[i]['levels'].length; k++) {
                        arr[i]['series'][j]['data'][k] = {}
                        arr[i]['series'][j]['data'][k]['name'] = data[i]['levels'][k];
                        arr[i]['series'][j]['data'][k]['value'] = data[i]['pieData'][k];
                    }
                } else {
                    // 保存柱形图的数据                     
                    arr[i]['series'][j]['data'] = data[i]['data'][j]
                }

            }

        }
        return arr;
    },

    // 请求的数据转换为质量结果表单的数据
    async getZhiLiangJieGuoTable(job, data) {
        // 把请求的数合并到一个数组里
        let arr = [], he, tableData = [];
        for (let i = 0; i < data.length; i++) {
            if (job === data[i]['title']) {
                he = await getReduce(data[i].pieData);
                arr = data[i].pieData
            } else {
                // arr[]
            }
        }
        // 把和加到数组的末尾
        arr.push(he)
        // 把数组的值转换为对象；obj对应的table的por属性值
        let obj = ['you', 'liang', 'zhong', 'ca', 'total']
        tableData[0] = {}
        for (let i = 0; i < obj.length; i++) {
            tableData[0][obj[i]] = arr[i] + '(' + (he <= 0 ? 0 : parseInt(arr[i] / he) * 100) + '%)'
        }

        return tableData;
    },

    /*  */

    convertDataPassview(data) {
        let newArr = [];

        data.forEach((item, index) => {
            newArr[index] = {};

            let detailsList = item.details.length
            for (let i = 0; i <= detailsList; i++) {
                let key = [];
                if (i === detailsList) {
                    key.unshift('guize')
                    newArr[index][key[0]] = item.detectionType;
                } else {

                    key[i] = item.details[i].job;
                    newArr[index][key[i]] = item.details[i]['pass'] ? '1' : '0'

                }
            }
        })
        console.log(newArr);
        return newArr
    },
    /**
     * @description: 数据格式转换
     * @param {object} 
     * @return {Array} 
     */
    getSourceSummaryTableHeader(data) {
        console.log((data));
        let arr = [];
        for (let item in data[0]) {
            if (item === 'guize') {
                arr.unshift(item)
            } else {
                arr.push(item)
            }

        }

        return arr;
    },

    // 取到对象数组中某个属性的值，并返回一个数组
    objToArr(obj, name) {
        if (!(obj instanceof Array)) { return };

        let result = obj.map(function (item) {
            return item[name];
        });
        return result
    },

    // 根据对象中的属性进行去重
    filterArr(arr, name) {
        let hash = {};

        if (!(arr instanceof Array)) { return }

        // reduce累计器, ss是具体满足条件后返回的数据, item是数组依次循环的每一项
        return arr.reduce((ss, item) => {
            hash[item[name]] ? '' : hash[item[name]] = true && ss.push(item);
            // 1、判断对象的键值是否存在
            return ss;
        }, []);
    },

    // 根据属性名获取对应下标
    /* @obj:数组对象
        @property :对象的属性名：
        @name:匹配的值
    */
    findObjNameIndex(obj, property, name) {

        if (typeof name !== 'string') {
            alert('参数类型错误：' + name)
            return
        }
        
        let index = obj.findIndex((val, index, arr) => {
            return val[property] === name
        })
        return index;
    },

    /* 
    根据下标置顶
    */
    toFirst(fieldData, index) {
        if (index != 0) {
            fieldData.unshift(fieldData.splice(index, 1)[0]);
        }
    }
}
export default xh