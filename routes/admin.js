/**
 * Created by oxygen on 2017/10/30.
 */
const model = require('./model.js');
const express = require('express');
const router = express.Router();

const RoomModel = model.RoomModel;
var resData = {};

router.get('/allRooms', (req, res) => {
    RoomModel.find({}, (err, data) => {
        let resData = {};
        if(err) {
            console.log("error"+err);
            resData = {
                status: '0',
                msg: '会议室查询失败！'
            }
        }else {
            resData = {
                status: '1',     // status: 1 => 成功
                msg: '会议室查询成功！',
                data: data,
            }
        }
        res.send(resData);
    })
})

router.post('/manageRoom', (req, res) => {
    if(req.body.type === 'add') {
        RoomModel.find({roomName: req.body.roomName, roomFloor: req.body.roomFloor}, (err, data) => {
            if(err) {
                console.log("error"+err);
                resData = {
                    status: '0',
                    msg: '会议室新增失败！'
                }
            }else {
                if(data.length > 1) {
                    resData = {
                        status: '0',
                        msg: '会议室名称重复！'
                    }
                }else {
                    const roomEntity = new RoomModel({
                        roomName: req.body.roomName,
                        roomFloor: req.body.roomFloor,
                        roomCapacity: req.body.roomCapacity,
                        roomConfigProjector: req.body.roomConfigProjector,
                        roomConfigVideo: req.body.roomConfigVideo,
                        roomConfigTelephone: req.body.roomConfigTelephone,
                        roomConfigBigScreen: req.body.roomConfigBigScreen,
                        isUseful: req.body.isUseful,
                        roomInfo:{

                        },
                    })
                    roomEntity.save(err => {
                        if(err) {
                            console.log("error: " + err)
                            resData = {
                                status: '0',     // status: 0 => 失败
                                msg: '会议室新增失败！'
                            }

                        } else{
                            resData = {
                                status: '1',     // status: 1 => 成功
                                msg: '会议室新增成功！'
                            }
                        }
                        res.send(resData);
                    })
                }
            }
        })
    } else if (req.body.type === 'edit'){
        RoomModel.update({roomName: req.body.roomName, roomFloor: req.body.roomFloor}, {$set:{
            roomName: req.body.roomName,
            roomFloor: req.body.roomFloor,
            roomCapacity: req.body.roomCapacity,
            roomConfigProjector: req.body.roomConfigProjector,
            roomConfigVideo: req.body.roomConfigVideo,
            roomConfigTelephone: req.body.roomConfigTelephone,
            roomConfigBigScreen: req.body.roomConfigBigScreen,
            isUseful: req.body.isUseful,
        }},(err) => {
            if(err) {
                console.log("error"+err);
                resData = {
                    status: '0',
                    msg: '会议室修改失败！'
                }
            }else {
                resData = {
                    status: '1',
                    msg: '会议室修改成功！'
                }
            }
            res.send(resData);
        })
    } else if(req.body.type === 'delete'){
        RoomModel.remove({roomName: req.body.roomName, roomFloor: req.body.roomFloor}, (err) => {
            if(err) {
                console.log("error"+err);
                resData = {
                    status: '0',
                    msg: '会议室删除失败！'
                }
            }else {
                resData = {
                    status: '1',
                    msg: '会议室删除成功！'
                }
            }
            res.send(resData);
        })
    }
})

module.exports = router;