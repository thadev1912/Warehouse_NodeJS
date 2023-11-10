const DetailProductOrder = require('../models/detail_product_order');
const User = require('../models/user');
let index = async (req, res) => {
    try {
       
       let getData = await DetailProductOrder.find({});
       
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
        console.log(req.body);
        const getDetailProductOrder = new DetailProductOrder(req.body);   
        let getData = await getDetailProductOrder.save();         
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
            });
        }
        else
        {
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}


let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await DetailProductOrder.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await DetailProductOrder.findOne({ _id: id });
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
let destroy = async (req, res) => {
    try {
        
        let id = req.query.id;
        console.log(id);
        getId = await DetailProductOrder.findByIdAndRemove({ _id: id });        
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

module.exports = {
    index: index,
    store:store, 
    update:update,   
    destroy:destroy,   
}