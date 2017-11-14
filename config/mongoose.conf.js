/**
 * Created by oxygen on 2017/10/24.
 */
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1:27017/management');  // 连接数据库，格式为mongodb：//{{ip地址：端口号}}/数据库名称

const db = mongoose.connection;                                  // 获得数据库连接的句柄

db.on('error',console.error.bind(console,'Link Error!'));

module.exports = {db, mongoose};
