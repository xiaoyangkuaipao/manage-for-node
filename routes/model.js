/**
 * Created by oxygen on 2017/10/31.
 */
/**
 * Created by oxygen on 2017/10/18.
 */
const model = require('../config/mongoose.conf.js');
const db = model.db;
const mongoose = model.mongoose;

const UserSchema = new mongoose.Schema({                  // 定义数据类型，这一操作不影响实际数据库的操作
    jobId: String,
    name: String,
    password: String,
    dept: String,
    duty: String,
    role: String,
    entryTime: Date,
});

const CalendarSchema = new mongoose.Schema({                  // 定义数据类型，这一操作不影响实际数据库的操作
    jobId: String,
    fcEvents: [{
        end: String,
        start: String,
        title: String,
    }],
});

const RoomSchema = new mongoose.Schema({                  // 定义数据类型，这一操作不影响实际数据库的操作
    roomId: Number,
    roomName: String,
    roomFloor: String,
    roomCapacity: String,
    roomConfigProjector: Boolean,
    roomConfigVideo: Boolean,
    roomConfigTelephone: Boolean,
    roomConfigBigScreen: Boolean,
    isUseful: Boolean,
});

const BookingRoomSchema = new mongoose.Schema({                  // 定义数据类型，这一操作不影响实际数据库的操作
    roomId: String,
    roomName: String,
    bookingDate: String,
    bookingTime: Array,
});

const NoteSchema = new mongoose.Schema({
    id: Number,   // 笔记的索引
    level: Number,   // 笔记的层级
    text: String,   // 笔记文本内容
    code: String,   // 笔记code
    label: String,   // 笔记的名称
    pcode: String,   // 笔记pcode
});

const ReportSchema = new mongoose.Schema({
    jobId: String,
    name: String,
    reportName: String,
    reportTime: Array,
    reportNote: String,
    reportUrl: String,
});

const LeaveSchema = new mongoose.Schema({
    jobId: String,
    name: String,
    leaveType: Number,
    leaveLength: Boolean,
    leavePeriod: Boolean,
    startTime: Date,
    endTime: Date,
    reason: String,
});

const NoteModel = db.model('notes', NoteSchema);                      // 定义数据表collection，其中‘note’为数据表名

const RoomModel = db.model('rooms', RoomSchema);           // 定义数据表collection，其中‘rooms’为数据表名

const BookingRoomModel = db.model('bookingrooms', BookingRoomSchema);           // 定义数据表collection，其中‘bookingrooms’为数据表名

const ReportModel = db.model('reports', ReportSchema);           // 定义数据表collection，其中‘reports’为数据表名

const LeaveModel = db.model('leaves', LeaveSchema);           // 定义数据表collection，其中‘leaves’为数据表名

const CalendarModel = db.model('calendars', CalendarSchema);           // 定义数据表collection，其中‘calendar’为数据表名

const UserModel = db.model('user', UserSchema);           // 定义数据表collection，其中‘users’为数据表名

module.exports = {NoteModel, RoomModel, BookingRoomModel, CalendarModel, UserModel, ReportModel, LeaveModel};