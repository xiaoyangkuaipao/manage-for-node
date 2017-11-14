/**
 * Created by oxygen on 2017/10/31.
 */
const model = require('./model.js');
const express = require('express');
const router = express.Router();

const RoomModel = model.RoomModel;
const BookingRoomModel = model.BookingRoomModel;
const timeSteps = ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"];
var resData = {};

router.post('/rooms', (req, res) => {
    let searchModel = {
        isUseful: true,             // 默认只能搜索能够使用的会议室
    };

    if(req.body.roomName) {
        searchModel.roomName = req.body.roomName;
    }

    if(req.body.roomFloor !== '0') {
        searchModel.roomFloor = req.body.roomFloor;
    }

    if(req.body.roomCapacity !== '0') {
        searchModel.roomCapacity = req.body.roomCapacity;
    }

    if(req.body.roomConfig.length !== 0) {
        req.body.roomConfig.forEach(item => {
            if(item === '投影仪') {
                searchModel.roomConfigProjector = true;
            }
            if(item === '视频设备') {
                searchModel.roomConfigVideo = true;
            }
            if(item === '电话会议设备') {
                searchModel.roomConfigTelephone = true;
            }
            if(item === '欢迎屏') {
                searchModel.roomConfigBigScreen = true;
            }
        })
    }

    RoomModel.find(searchModel, {_id: 1, roomName: 1, roomFloor:1}, (err, data) => {   // 1: 表示返回该字段 ； 0: 表示不返回该字段
        if(err) {
            console.log('error' + err);
            resData = {
                status: '0',
                msg: '查询会议室失败！',
            }
            res.send(resData);
        } else{
            let roomIds = [];
            var result = [];
            data.forEach(item => {
                let temp = {
                    roomId: item._id,
                    roomFloor: item.roomFloor,
                    roomName: item.roomName,
                    bookingTime: [],
                };
                roomIds.push(item._id);
                result.push(temp);
            })

            BookingRoomModel.find({
                bookingDate: req.body.bookingDate,
                roomId:{
                    $in: roomIds
                }
            },(err, bookingData) => {
                if(bookingData){
                    bookingData.forEach(item => {
                        if(result) {
                            result.forEach(r => {
                                console.log(r)
                                if(r.roomId.toString() == item.roomId.toString()){
                                    r.bookingTime = item.bookingTime;
                                }
                            })
                            console.log(result);
                        }
                    })
                }

                resData = {
                    status: '1',
                    msg: '查询会议室成功！',
                    data: result,
                }
                res.send(resData);
            })
        }
    })
})

router.post('/bookingRoom', (req, res) => {
    const roomId = req.body.roomId;
    const bookingDate = req.body.bookingDate;
    const bookingStartTime = req.body.startTime;
    const bookingEndTime = req.body.endTime;

    BookingRoomModel.findOne({
        roomId: roomId,
        bookingDate: bookingDate,
    }, (err, data) => {
        const stIndex = timeSteps.indexOf(bookingStartTime);
        const etIndex = timeSteps.indexOf(bookingEndTime);

        if(!data) {
            let bookingRoomEntity = new BookingRoomModel({
                roomId: roomId,
                bookingDate: bookingDate,
                bookingTime: timeSteps.slice(stIndex, etIndex+1),
            })

            bookingRoomEntity.save(err => {
                if(err) {
                    console.log("error: " + err)
                    resData = {
                        status: '0',     // status: 0 => 失败
                        msg: '预定失败！'
                    }

                } else{
                    resData = {
                        status: '1',     // status: 1 => 成功
                        msg: '预定成功！'
                    }
                }
                res.send(resData);
            })
        } else {
            if(data.bookingTime.indexOf(stIndex) === -1 && data.bookingTime.indexOf(etIndex) === -1) {
                BookingRoomModel.update({
                    roomId: roomId,
                    bookingDate: bookingDate,
                },{
                    $push: {
                        bookingTime: {
                            $each: timeSteps.slice(stIndex, etIndex+1),
                        }
                    }
                },(err) => {
                    if(err) {
                        console.log("error"+err);
                        resData = {
                            status: '0',
                            msg: '预定失败！'
                        }
                    }else {
                        resData = {
                            status: '1',
                            msg: '预定成功！'
                        }
                    }
                    res.send(resData);
                })
            } else{
                resData = {
                    status: '0',
                    msg: '时间冲突！',
                }
                res.send(resData);
            }
        }
    })
})

module.exports = router;