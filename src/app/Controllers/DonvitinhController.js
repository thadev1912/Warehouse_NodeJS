const db = require('../../../models/index');
var { validationResult } = require('express-validator');
const Sequelize = require('sequelize')
let index = async (req, res) => {
    try {
        let donvitinh = await db.Donvitinh.findAll();
        if (donvitinh) {
            res.status(200).json({
                success: true,
                data: donvitinh,
                messege: 'Lấy dữ liệu thành công!!!'
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
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let vattu = await db.Donvitinh.create({
            donvitinh: req.body.donvitinh,
          

        }
        );
        if (vattu) {
            res.json({
                status: 200,
                messege: 'Thêm dữ liệu thành công!!!'
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
let edit = async (req, res) => {
    try {
        //let ls_lop=await db.Donvitinh.findAll();
        let id = req.params.id;
        let vattu = await db.Donvitinh.findOne({
            where: { id: id },
            raw: true,
        });
        if (vattu) {
            console.log('Lấy dữ liệu thành công!!!');
            console.log(vattu);
            return res.status(200).json({
                success: true, data: vattu,
            });
        }
        else {
            throw new Error('Id not exsits on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let update = async (req, res) => {
    try {

        //console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(422).json({ errors: errors.array() });
            return;
        }
        let id = req.params.id;
        console.log(id);
        exitsId = await db.Donvitinh.findOne({
            where: { id: id },
        });
        if (exitsId) {
            let vattu = await db.Donvitinh.update({
                donvitinh: req.body.donvitinh,
            }, { where: { id: id } });
            if (vattu) {
                res.json({
                    status: 200,
                    messege: 'Cập nhật dữ liệu thành công!!!'
                });
            }
            else { throw new Error('Error Connect Server'); }
        }
        else {
            throw new Error('Id not exsits on Server');
        }

    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let destroy = async (req, res) => {
    try {
        let id = req.params.id;
        exitsId = await db.Donvitinh.findOne({
            where: { id: id },
        });
        if (exitsId) {
            let vattu = await db.Donvitinh.destroy({
                where: { id: id },
            });
            res.status(200).json({
                success: true, message: 'Delete Data Completed'
            });
        }

        else {
            throw new Error('Id not exsits on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let search = async (req, res) => {
    try {
        let txtSearch = req.body.txt_search;
        console.log(txtSearch);
        const Op = Sequelize.Op;
        let searchvattu = await db.Donvitinh.findAll({
            where: {
                ten_vattu: { [Op.like]: '%' + txtSearch + '%' },
            }
        });
        if (searchvattu.length === 0) {
            res.status(404).json({ message: 'Không tìm thấy dữ liệu nào cả!!!' });
        }
        else {
            res.status(200).json({ success: true, data: searchvattu, message: 'Search data comepleted' });
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
    store: store,
    edit: edit,
    update: update,
    destroy: destroy,
    search: search,
};
