/**
 * Created by oxygen on 2017/10/20.
 */
/**************************个人日程表相关方法**************************/
const model = require('./model.js');
const express = require('express');
const multiparty = require('multiparty');    // 支持enctype="multipart/form-data"方式的表单提交
const uuid = require('uuid');                // 产生标识码
const fs = require('fs');
const router = express.Router();

const CalendarModel = model.CalendarModel;
const NoteModel = model.NoteModel;
const LeaveModel = model.LeaveModel;
const ReportModel = model.ReportModel;
var resData = {};

/**************************个人日程表相关方法**************************/
router.get('/calendar/items', (req, res) => {                   // 获取个人日程表数据
    CalendarModel.find({jobId: req.session.user.jobId}, (err, data) => {
        if(err) {
            console.log("error：" + err);
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '查询失败！'
            })
        } else {
            if(data.length > 0){
                res.send({
                    status: '1',     // status: 1 => 成功
                    msg: '查询成功！',
                    fcEvents: data[0].fcEvents,
                })
            } else {
                res.send({
                    status: '1',     // status: 1 => 成功
                    msg: '查询成功！',
                    fcEvents: [],
                })
            }
        }
    })
})

router.post('/calendar/addItem', (req, res) => {                    // 个人添加日程表单项
    CalendarModel.find({jobId: req.session.user.jobId}, (err, data) => {
        console.log(data);
        if(err) {
            console.log("error：" + err);
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '添加失败！'
            })
        } else {
            if(data.length > 0) {                                             // 更新
                CalendarModel.update({
                    jobId: req.session.user.jobId
                }, {
                    $set:{
                        fcEvents: req.body.fcEvents
                    }
                }, (err) => {
                    if(err){
                        console.log(err);
                        res.send({
                            status: '0',     // status: 0 => 失败
                            msg: '更新失败！'
                        })
                    }else {
                        res.send({
                            status: '1',     // status: 1 => 成功
                            msg: '更新成功！'
                        })
                    }
                });
            }else {                                                // 新增
                const calendarEntity = new CalendarModel(
                    {
                        jobId : req.body.jobId,
                        fcEvents : req.body.fcEvents,
                    }
                );
                calendarEntity.save((err) => {
                    if(err) {
                        console.log("error: " + err)
                        res.send({
                            status: '0',     // status: 0 => 失败
                            msg: '创建失败！'
                        })
                    } else {
                        res.send({
                            status: '1',     // status: 1 => 成功
                            msg: '创建成功！'
                        })
                    }
                });
            }
        }
    })
})
/**************************个人日程表相关方法**************************/

/**************************个人笔记本相关方法**************************/
router.post('/note/addNote', (req, res) => {
    NoteModel.find({}, (err, data) => {
        if(err) {
            console.log("error: " + err)
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '查询笔记本失败！'
            })
        } else{
            const ids = data.length + 1;
            let code;
            const pcode = req.body.code ? req.body.code : "";
            NoteModel.find({pcode: pcode}).sort('id').exec( (err, data) => {
                if(data.length === 0) {
                    code = '001';
                } else {
                    const nextCode = data.length + 1;
                    if( nextCode > 0 && nextCode < 10) {
                        code = '00'.concat(nextCode);
                    } else if(nextCode >= 10 && nextCode < 100) {
                        code = '0'.concat(nextCode);
                    } else if(nextCode >= 100 && nextCode < 999) {
                        code = nextCode.toString();
                    }
                }
                const NoteEntity = new NoteModel({
                    id: ids,
                    text: '',
                    code: pcode.concat(code),
                    pcode: pcode,
                    label: req.body.label,
                });
                NoteEntity.save((err) => {
                    if(err) {
                        console.log("error: " + err)
                        res.send({
                            status: '0',     // status: 0 => 失败
                            msg: '新建笔记失败！'
                        })
                    } else {
                        res.send({
                            status: '1',     // status: 1 => 成功
                            msg: '新建笔记成功！'
                        })
                    }
                });
            });
        }
    });
})

router.post('/note/editNoteName', (req, res) => {
    NoteModel.update({code: req.body.code}, {$set: {label: req.body.label}}, err => {
        if(err) {
            console.log("error: " + err)
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '修改笔记名称失败！'
            })
        } else{
            res.send({
                status: '1',     // status: 0 => 失败
                msg: '修改笔记名称成功！'
            })
        }
    });
})

router.post('/note/saveContent', (req, res) => {
    NoteModel.update({code: req.body.code}, {$set: {text: req.body.text}}, err => {
        if(err) {
            console.log("error: " + err)
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '修改笔记失败！'
            })
        } else{
            res.send({
                status: '1',     // status: 0 => 失败
                msg: '修改笔记成功！'
            })
        }
    });
})

router.post('/note/deleteNote', (req, res) => {
    NoteModel.find({pcode: req.body.code}, (err, data) => {
        if(data.length == 0) {
            NoteModel.remove({code: req.body.code}, err => {
                if(err) {
                    console.log("error: " + err)
                    res.send({
                        status: '0',     // status: 0 => 失败
                        msg: '删除笔记失败！'
                    })
                } else{
                    res.send({
                        status: '1',     // status: 0 => 失败
                        msg: '删除笔记成功！'
                    })
                }
            });
        }else{
            res.send({
                status: '0',
                msg: '请删除该笔记包含的子笔记！',
            })
        }
    })

})

router.post('/note/getNoteContent', (req, res) => {
    NoteModel.find({code: req.body.code}, (err, data) => {
        if(err) {
            console.log("error: " + err)
            res.send({
                status: '0',     // status: 0 => 失败
                msg: '查看笔记失败！'
            })
        } else{
            res.send({
                status: '1',     // status: 0 => 失败
                msg: '查看笔记成功！',
                text: data[0].text,
            })
        }
    })
})

router.get('/note/notebooks', (req, res) => {
    NoteModel.find({}, (err, data) => {
        if(err) {
            console.log("error" + err);
            res.send({
                status: '0',
                msg: '查询记事本失败!'
            })
        } else {
            let noteBooks = [];
            data.forEach(item => {
                if(!item.pcode) {
                    noteBooks.push({
                        label: item.label,
                        pcode: item.pcode,
                        code: item.code,
                        children: [],
                    });
                }else {
                    noteBooks.forEach(i => {
                       if(i.code === item.pcode) {
                           if(i.children) {
                               i.children.push({
                                   label: item.label,
                                   pcode: item.pcode,
                                   code: item.code,
                                   children: [],
                               })
                           } else {
                               noteBooks.push({
                                   label: item.label,
                                   pcode: item.pcode,
                                   code: item.code,
                                   children: [],
                               });
                           }
                       }
                   })
                }
            });
            res.send({
                data: noteBooks,
                status: '1',
                msg: '查询记事本成功!',
            })
        }
    });
})
/**************************个人笔记本相关方法**************************/

/**************************个人工作报告相关方法**************************/
router.post('/report', (req, res) => {
    let report = new multiparty.Form();  // 设置默认值，防止fs跨磁盘操作,且文件夹必须存在
    report.encoding = 'utf-8';
    report.uploadDir = "temp/reports/";   // 注意:默认的上传目录或你指定的上传目录都只是临时目录，此后还需将上传的文件移动至相应的文件目录
    report.parse(req, (err, fields, files) => {
        if(err) console.error(err);
        const temp_path = files.file[0].path;
        const ex = uuid.v1();
        const target_path = './upload/reports/' + ex + '-' + files.file[0].originalFilename;
        const reportTime = [fields.date1, fields.date2];
        fs.rename(temp_path, target_path, err => {
            if(err) console.error(err);

            fs.unlink(temp_path, () => {
                if(err) console.error(err);

                const reportEntity = new ReportModel({
                    reportName: fields.name,
                    reportTime: reportTime,
                    reportNote: fields.desc,
                    reportUrl: target_path,
                })

                reportEntity.save(err => {
                    if(err) {
                        console.log("error: " + err)
                        resData = {
                            status: '0',     // status: 0 => 失败
                            msg: '提交失败！'
                        }

                    } else{
                        resData = {
                            status: '1',     // status: 1 => 成功
                            msg: '提交成功！'
                        }
                    }
                    res.send(resData);
                })
            })
        })
    })
})
/**************************个人工作报告相关方法**************************/

/**************************个人请假事宜相关方法**************************/
router.post('/leave', (req, res) => {
    const leaveEntity = new LeaveModel({
        jobId: req.session.user.jobId,
        name: req.session.user.name,
        leaveType: req.body.leaveType,
        leaveLength: req.body.leaveLength,
        leavePeriod: req.body.leavePeriod,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        reason: req.body.reason,
    })

    leaveEntity.save(err => {
        if(err) {
            console.log("error: " + err)
            resData = {
                status: '0',     // status: 0 => 失败
                msg: '请假失败！'
            }

        } else{
            resData = {
                status: '1',     // status: 1 => 成功
                msg: '请假成功！'
            }
        }
        res.send(resData);
    })
})
/**************************个人请假事宜相关方法**************************/

module.exports = router;