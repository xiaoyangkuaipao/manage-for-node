const model = require('./model.js');
const express = require('express');
const router = express.Router();

const UserModel = model.UserModel;

router.post('/login', (req, res) => {
    req.session.name ="oxygen";

    UserModel.findOne({jobId: req.body.jobId}, (err, data) => {
        let resData = {};
        if(data) {
            const userData = {
                role: data.role,
                name: data.name,
                jobId: data.jobId,
            };

            if(req.session.sign){                               // session还在有效期内
                resData = {
                    status: '1',
                    msg: '欢迎回来',
                    data: userData,
                }
            }else{
                if(req.body.password === data.password) {
                    req.session.sign =true;
                    req.session.user =userData;
                    resData = {
                        status: '1',
                        msg: '登录成功',
                        data: userData,
                    }
                }else {
                    resData = {
                        status: '0',
                        msg: '密码错误'
                    }
                }
            }
        }else{
            resData = {
                status: '0',
                msg: '用户不存在'
            }
        }
        res.send(resData);
    })
})

router.post('/register', (req, res) => {
    const userEntity = new UserModel(
        {
            name : req.body.name,
            jobId : req.body.jobId,
            duty : req.body.duty,
            dept : req.body.dept,
            entryTime : req.body.entryTime,
            password: this.md5.hex('8888888'),        // 默认密码
            role: 'user',                             // 设置角色
        }
    );          // 添加数据实例
    userEntity.save((err) => {
        if(err) {
            console.log("error: " + err)
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '创建失败！'
            })
        } else{
            res.send({
                status: '1',     // status: 1 => 成功
                msg: '创建成功！'
            })
        }
    });
})

module.exports = router;