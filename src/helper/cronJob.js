const cron = require('node-cron');
const IncrementCode = require('../app/models/increment_code_product_order');
const CategoriesSim = require('../app/models/categories_sim');
const Notification = require('../app/models/notification_sim');
function startCronJob() {   

    // Run The First Day in New Year
    cron.schedule('0 0 1 1 *', async () => {
        let currentYear = new Date().getFullYear().toString().slice(-2);
        getlastInvoice = await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');
        let invoiceNumber = getlastInvoice.invoice_number;
        let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
        let _getlastYear = getlastYear ? getlastYear[1] : null;
        if (currentYear !== _getlastYear) {
            getvalue = '001';
            invoice_number = 'YCSX' + currentYear + '.' + getvalue;
            const getInvoice = new IncrementCode({
                invoice_number: invoice_number,
            });
            await getInvoice.save();
        }
    });
     // Count Deadline Warning Sim One New Day
      cron.schedule('0 0 * * *', async() => {
        getCount= await CategoriesSim.find({deadline_warning:"Sắp hết hạn"}).countDocuments();
        //console.log(getCount);
        let today = new Date();
        dd = String(today.getDate()).padStart(2, '0');
        mm = String(today.getMonth() + 1).padStart(2, '0');
        yyyy = today.getFullYear();
        createDay = mm + '/' + dd + '/' + yyyy;
        getNotification=new Notification({
            content_notification:'Có '+getCount+' Sắp hết hạn',
            date_notification:createDay,
        })
         isCompleted =await getNotification.save();
        if(isCompleted)
        {
            console.log('cập nhật tổng số lượng sim sắp hết hạn mới thành công!!!');
        }
      });

}
module.exports = startCronJob;
