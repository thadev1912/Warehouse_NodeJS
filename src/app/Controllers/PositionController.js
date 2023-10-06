const Position = require('../models/position')
//Lấy danh sách chức danh
let index = async (req, res) => {
    try {
        let getData = await Position.find({});
        if (getData) {
            res.json({
                status: 200,
                messege: 'Lấy dữ liệu thành công!!!',
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
//Thêm mới chức danh
let create = async (req, res) => {
    try {
        const getPosition = new Position(req.body);
        let getData = await getPosition.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Đã thêm mới dữ liệu!!!',
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
//Chỉnh sửa chức danh
let edit = async (req, res) => {
    try {
        id = req.query.id;
        getId = await Position.findOne({ _id: id });
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
//Cập nhật chức danh
let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await Position.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await Position.findOne({ _id: id });
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
        getId = await Position.findByIdAndRemove({ _id: id });
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