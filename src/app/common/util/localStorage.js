
export const Storage = {
    setItem:(key, value)=> {
        window.localStorage[key] = value;
    },
    getItem: (key) => {
        return window.localStorage[key] == undefined ? '' : window.localStorage[key];
    },
    setObject(key, value) {
        try {
            window.localStorage[key] = JSON.stringify(value);
        } catch (e) {
            alert('本地储存写入错误，若为safari浏览器请关闭无痕模式浏览。');
        }
    },
    getObject(key) {
        return JSON.parse(window.localStorage[key] || '{}');
    },
    remove(key) {
        window.localStorage.removeItem(key);
    },
}

