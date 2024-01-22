const CategoriesSim = require('../app/models/categories_sim');
const Notification = require('../app/models/notification_sim');
const RealtimeWarningSim = async (res, req) => {
    getCount = await CategoriesSim.find({ deadline_warning: "Sắp hết hạn" }).countDocuments();
    //console.log(getCount);
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;
    isCompleted = true;
    if (getCount > 0) {
        getNotification = new Notification({
            content_notification: getCount,
            date_notification: createDay,
            type_notification: '1',
        })
        getData = await getNotification.save();
        isCompleted = getData > 0 ? true : false;
        global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
    }
    if (isCompleted) {
        console.log('cập nhật tổng số lượng sim sắp hết hạn mới thành công!!!');
    }

}
const RealtimeCreateJobsheet = async (mergeCodeJobsheet,getInfoUser) => {   
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;   
    getNotification = new Notification({
        content_notification: mergeCodeJobsheet,
        date_notification: createDay,
        type_notification: '2',
        action_notification:'Create',
        user_id:getInfoUser.user,
    });
    getData = await getNotification.save();
    global.io.emit('eventChange', `Jobsheet ${mergeCodeJobsheet} vừa được tạo bởi ${getInfoUser.user}`);
}
module.exports = {
    RealtimeWarningSim,
    RealtimeCreateJobsheet,
};
