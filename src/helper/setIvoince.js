
const IncrementCode = require('../app/models/increment_code_product_order');
const setInvoice=async(req,res) =>{    
    //let currentYear='23'
   let currentYear = new Date().getFullYear().toString().slice(-2);
    let count = await IncrementCode.find().count();
    if (count == 0) {
        const getInvoice = new IncrementCode({
            invoice_number: 'YCSX'+currentYear+'.001',
        });
        await getInvoice.save();
    }    
    getlastInvoice=await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');        
    let invoiceNumber =getlastInvoice.invoice_number;
    let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
    let _getlastYear = getlastYear ? getlastYear[1] : null;     
    //hàm kiểm tra năm đó tồn hay chưa
    let lastInvoiceOfCurrentYear = await IncrementCode.findOne({ invoice_number: { $regex: 'YCSX' + currentYear } }).sort({ invoice_number: -1 });
    
        if(currentYear!==_getlastYear)         
        {
            if (!lastInvoiceOfCurrentYear)
            {
                getvalue='001';
                invoice_number = 'YCSX'+currentYear+'.'+getvalue;
                const getInvoice = new IncrementCode({
                    invoice_number: invoice_number,
                });
                await getInvoice.save();
            }
            else
            {
               
    let lastInvoiceNumber = lastInvoiceOfCurrentYear.invoice_number;
    let lastOrderNumber = parseInt(lastInvoiceNumber.split('.')[1]); 
   // let nextOrderNumber = lastOrderNumber + 1; // Tăng số thứ tự lên 1
    let nextInvoiceNumber = 'YCSX' + currentYear + '.' + ('000' + lastOrderNumber).slice(-3);     
    const newInvoice = new IncrementCode({
        invoice_number: nextInvoiceNumber,
    });
    await newInvoice.save();
            }
           
        }       
    }
module.exports = {
    setInvoice
};
