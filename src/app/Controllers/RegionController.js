
const Region = require('../models/region');
const { checkRegion } = require('../../request/RegionRequest');
//Lấy danh sách khu vực
let index = async (req, res) => {
    try {
        let getData = await Region.find({});
        if (getData) {
            res.json({
                status: 200,
                message: 'Lấy dữ liệu thành công!!!',
                data:getData,
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
//Thêm mới khu vực
let create = async (req, res) => {
    try {
        const getRegion = new Region(req.body);      
        checkId = await Region.find({ region_code:req.body.region_code}).count();      
        if (checkId>0) {
            return res.status(200).json({
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getRegion.save();       
        if (getData) {
            res.json({
                status: 200,
                messege: 'Đã thêm mới dữ liệu!!!',
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
//Chỉnh sửa khu vực
let edit = async (req, res) => {
    try {
        id = req.query.id;
        getId = await Region.findOne({ _id: id });
        if (getId) {
            return res.status(200).json({
                success: true, message: 'Thông tin cần chỉnh sửa!!', data: getId,
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
//Cập nhật khu vực
let update = async (req, res) => {
    try {        
        let id = req.params.id;        
        getData = await Region.findByIdAndUpdate(id, { $set: req.body });        
        if (getData) {
            getNewData = await Region.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Cập nhật dữ liệu thành công!!!'
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
        getId = await Region.findByIdAndRemove({ _id: id });
        if (getId) {
            return res.status(200).json({
                success: true, message: 'Xóa dữ liệu thành công!!!',
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
module.exports =
{
    index: index,
    create: create,
    update: update,
    destroy: destroy,
    edit: edit,
}