const Telegram= require('./telegram');
const CategoriesSim = require('../app/models/categories_sim');
const NotificationSim = require('../app/models/notification_sim');
const User = require('../app/models/user');
const Notification = require('../app/models/notification');
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
        getNotification = new NotificationSim({
            content_notification: getCount,
            date_notification: createDay,
            type_notification: '1',
        })
        getData = await getNotification.save();
        isCompleted = getData > 0 ? true : false;
        const message = `Có ${getCount} sim sắp hết hạn. Thông tin đến nhóm`;
        global.io.emit('eventChange', `Có ${getCount} sim sắp hết hạn`);
        Telegram.sendMessageToGroup(message);
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
    //Telegram     
    getNotification = new NotificationSim({
        content_notification: mergeCodeJobsheet,
        date_notification: createDay,
        type_notification: '2',
        action_notification:'Create',
        user_id:getInfoUser.user,
    });
    getData = await getNotification.save();
    const message = `Jobsheet ${mergeCodeJobsheet} vừa được tạo bởi ${getInfoUser.user}`;
    global.io.emit('eventChange', `Jobsheet ${mergeCodeJobsheet} vừa được tạo bởi ${getInfoUser.user}`);
    Telegram.sendMessageToGroup(message);
}
const RealtimeCreateProductOrder = async (product_order_No,getInfoUser) => {   
    let today = new Date();
    dd = String(today.getDate()).padStart(2, '0');
    mm = String(today.getMonth() + 1).padStart(2, '0');
    yyyy = today.getFullYear();
    createDay = mm + '/' + dd + '/' + yyyy;  
    getUser=await User.find();    
    // getUser.map(async(user) => {
    //     console.log('giá trị user lấy được là',user);
    //     const getNotification = new Notification({
    //       content_notification: product_order_No,         
    //       date_notification: createDay,
    //       type_notification:'2',
    //       action_notification:'Create',
    //       created_by:getInfoUser.user,
    //       user_id:user._id,
    //     });
    //     getData =await getNotification.save();
    //     console.log(getData);
    // }); 
       const getNotification = new Notification({
          content_notification: product_order_No,         
          date_notification: createDay,
          type_notification:'3',
          action_notification:'Create',
          created_by:getInfoUser.user,         
        });
      getData =await getNotification.save();
    const message = `Yêu cầu sản xuất ${product_order_No} vừa được tạo bởi ${getInfoUser.user}`;
    global.io.emit('eventChange', `Yêu cầu sản xuất ${product_order_No} vừa được tạo bởi ${getInfoUser.user}`);
    Telegram.sendMessageToGroup(message);
}
module.exports = {
    RealtimeWarningSim,
    RealtimeCreateJobsheet,
    RealtimeCreateProductOrder,
};
