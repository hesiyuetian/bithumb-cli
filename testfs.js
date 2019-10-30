var fs = require('fs'), path = require('path');


const readFile = () => {
    fs.readFile(__dirname + '/src/app/common/util/environment.json', {flag: 'r+', encoding: 'utf8'}, function (err, data) {
        if(err) {
            console.error(err);
            throw err;
        }
        write(JSON.parse(data))
    });
};


const write = (data) => {
    // var w_data = new Buffer(w_data);
    data.TEST.tag = 'TEXT'
    var w_data = JSON.stringify(data, null, 2);
    fs.writeFile(__dirname + '/src/app/common/util/environment.json', w_data, 'utf-8', function (err, data) {
        if(err) {
            console.error(err);
            throw err;
        } else {
            console.log('写入成功', data);
        }
    });
};

readFile();

