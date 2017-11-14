/**
 * Created by oxygen on 2017/10/18.
 */
const express = require('express');  // require直接写模块名，会在各node_modules目录中找模块
const path = require('path');  // path模块用来解析路径
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');  // 引入 session 机制

const app = express();

app.listen('9100');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({         // 支持www-form-urlencoded方式的表单提交
    extended: true
}));
app.use(bodyParser({uploadDir:'./uploads'}));
app.use(cookieParser());
app.use(session({
    secret: 'oxygen',
    cookie: {maxAge: 60 * 1000 * 15}   // 设置session的有效期
}))

app.use((req, res ,next) => {                   // 判断用户是否登录
    if(req.path !==  '/user/login') {
        if(req.session.sign) {
            next()
        }else {
            res.send({
                status: '9',
                mag: '未登录',
            })
        }
    }else{
        next();
    }
})

//路由信息（接口地址）开始 存放在./routes目录下//
const user = require('./routes/user'); // 账号有关接口
const admin = require('./routes/admin');       // admin相关接口
const personal = require('./routes/personal'); // 个人项有关接口
const company = require('./routes/company'); // 公司项有关接口

app.use('/user', user);   //  在app中注册user接口
app.use('/personal', personal);   //  在app中注册personal接口
app.use('/company', company);   //  在app中注册company接口
app.use('/admin', admin);   //  在app中注册admin接口
