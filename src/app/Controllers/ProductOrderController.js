const ProductOrder = require('../models/product_order');
const DetailProductOrder = require('../models//detail_product_order');
const IncrementCode = require('../models/increment_code_product_order');
const User = require('../models/user');
let index = async (req, res) => {
    try {

         let getData = await ProductOrder.find({}).sort({product_order_No:-1}); 
            if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

let store = async (req, res) => {
    try {
        //cần gắn mã phiếu vào
        console.log(req.body);
        const getProductOrder = new ProductOrder(req.body);
        getProductOrder.production_order_status = '0';
        getProductOrder.production_order_receiver = null;
        let getData = await getProductOrder.save();
        runIncrementInvoice();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let infotoCreate = async (req, res) => {
    try {
        //gửi thông id user lên
        //   const getIdUser = new ObjectId(req.query.id); đã truyền thông tin sẵn rồi!
        lastInvoice = await IncrementCode.findOne().sort({ invoice_number: -1 }).select('invoice_number');
        getDetailProductOrder = await DetailProductOrder.find({ product_order_code: lastInvoice.invoice_number }); //lấy danh sách chi tiết phiếu theo mã phiếu hiện hành
        // getInfoCreate = await User.aggregate([
        //     {
        //         $project: {
        //             _id: 1,
        //             fullname: 1,
        //             region_id: 1,
        //             position_id: 1,
        //             department_id: 1,

        //         }
        //     },

        //     {
        //         $lookup: {
        //             from: "regions",
        //             localField: "region_id",
        //             foreignField: "_id",
        //             as: "getRegion"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "positions",
        //             localField: "position_id",
        //             foreignField: "_id",
        //             as: "getPostion"
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "departments",
        //             localField: "department_id",
        //             foreignField: "_id",
        //             as: "getDepartment"
        //         }
        //     },
        //     {
        //         $match: {
        //             _id: getIdUser,
        //         }
        //     }
        // ]);
        if (lastInvoice) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: lastInvoice, getDetailProductOrder
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let edit=async (req,res) => {
   getId=req.params.id; 
     getData =await ProductOrder.aggregate([
        {
            $lookup: {
                from: "detail_product_orders",
                localField: "product_order_No",
                foreignField: "product_order_code",
                as: "dataDetail"
            }
        },
        {
            $match: {product_order_No:getId}
        }
     ]);
     if (getData) {
        return res.status(200).json({
            success: true, message: 'Infomation Field need to edit!!', data: getData,
        });
    }
    else {
        throw new Error('Error connecting Database on Server');

    }

} 
let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await ProductOrder.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await ProductOrder.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!!'
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let showdetail = async (req, res) => {
    try {
        getId = req.params.id;
        let getData = await DetailProductOrder.find({ product_order_code: getId });
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (error) {

    }


}
let approve = async (req, res) => {   
    id = req.params.id;
    getdata = req.body.production_order_receiver;    
    updateInfo = new ProductOrder({
        _id: req.params.id,
        production_order_status: '1',
        production_order_receiver: getdata,
    });
    getData = await ProductOrder.findByIdAndUpdate(id, { $set: updateInfo });
    if (getData) {
        return res.status(200).json({
            success: true, message: 'This field has been updated!!!',
        });
    }
    else {
        throw new Error('Error connecting Database on Server');
    }
}
let reapprove =async(req,res) => {   
    id = req.params.id;       
    updateInfo = new ProductOrder({
        _id: req.params.id,
        production_order_status: '0',
        production_order_receiver: null,
    });
    getData = await ProductOrder.findByIdAndUpdate(id, { $set: updateInfo });
    if (getData) {
        return res.status(200).json({
            success: true, message: 'This field has been updated!!!',
        });
    }
    else {
        throw new Error('Error connecting Database on Server');
    }

}
let cancel =async(req,res) => {   
    id = req.params.id;       
    updateInfo = new ProductOrder({
        _id: req.params.id,
        production_order_status: '2',
        production_order_receiver: null,
    });
    getData = await ProductOrder.findByIdAndUpdate(id, { $set: updateInfo });
    if (getData) {
        return res.status(200).json({
            success: true, message: 'This field has been updated!!!',
        });
    }
    else {
        throw new Error('Error connecting Database on Server');
    }

}
let destroy = async (req, res) => {
    try {
        let id = req.query.id;
        getIDDetail = await DetailProductOrder.findOne({ product_order_code: id });
        if (getIDDetail) {
            await DetailProductOrder.findByIdAndRemove({ _id: getIDDetail._id });
        }
        getId = await ProductOrder.findByIdAndRemove({ _id: id });

        if (getId) {

            return res.status(200).json({
                success: true, message: 'This field has been removed!!!',
            });
        }
        else {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}
let runIncrementInvoice = async (req, res) => {
    let count = await IncrementCode.find().count();
    if (count == 0) {
        const getInvoice = new IncrementCode({
            invoice_number: 'YCSX23.001',
        });
        await getInvoice.save();
    }
    else {
        latest = await IncrementCode.findOne().sort({ invoice_number: -1 }).limit(1);
        /// string = parseInt(latest.invoice_number.match(/\d/g).join(""));    
        string = latest.invoice_number.match(/\.(\d+)/);
        getvalue = parseInt(string[1]);
        getvalue += 1;
        invoice_number = 'YCSX23.' + String(getvalue).padStart(3, '0');
        const getInvoice = new IncrementCode({
            invoice_number: invoice_number,
        });
        await getInvoice.save();
    }
}

module.exports = {
    index: index,
    store: store,
    edit:edit,
    update: update,
    showdetail: showdetail,
    approve: approve,
    reapprove:reapprove,
    cancel:cancel,
    destroy: destroy,
    infotoCreate: infotoCreate,
    runIncrementInvoice: runIncrementInvoice,
}