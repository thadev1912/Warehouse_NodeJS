const Department = require('../models/department');
//Lấy danh sách phòng ban
let index = async (req, res) => {
    try {
        let getData = await Department.find({});       ;
        if (getData) {
            res.json({
                status: 200,
                message: 'Lấy dữ liệu thành công!!!',
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
//Thêm mới khu vực
let create = async (req, res) => {
    try {

        const getDepartment = new Department(req.body);      
        checkId = await Department.find({ department_code:req.body.department_code}).count();      
        if (checkId>0) {
            return res.status(200).json({
                success: true, message: 'This ID exits!!',
            });
        }
        let getData = await getDepartment.save();       
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
        getId = await Department.findOne({ _id: id });
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
        getData = await Department.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {           
            getNewData = await Department.findOne({ _id: id });
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
        getId = await Department.findByIdAndRemove({ _id: id });
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
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
}