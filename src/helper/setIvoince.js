
const IncrementCode = require('../app/models/increment_code_product_order');
const setInvoice=async(req,res) =>{    
   let currentYear = new Date().getFullYear().toString().slice(-2);
    let count = await IncrementCode.find().count();
    if (count == 0) {
        const getInvoice = new IncrementCode({
            invoice_number: 'YCSX'+currentYear+'.001',
        });
        await getInvoice.save();
    }    
    // getlastInvoice=await IncrementCode.findOne().sort({ created: -1 }).select('invoice_number');        
    // let invoiceNumber =getlastInvoice.invoice_number;
    // let getlastYear = invoiceNumber.match(/YCSX(\d+)\.\d+/);
    // let _getlastYear = getlastYear ? getlastYear[1] : null;     
    //     if(currentYear!==_getlastYear) 
    //     {
    //         getvalue='001';
    //         invoice_number = 'YCSX'+currentYear+'.'+getvalue;
    //         const getInvoice = new IncrementCode({
    //             invoice_number: invoice_number,
    //         });
    //         await getInvoice.save();
    //     }       
    }
module.exports = {
    setInvoice
};
