const db = require('../../../models/index');
var { validationResult } = require('express-validator');
const Sequelize = require('sequelize')
let index = async (req, res) => {
    try {
        let phieunhapkho = await db.Phieunhapkho.findAll();
        if (phieunhapkho) {
            res.status(200).json({
                success: true,
                data: phieunhapkho,
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
        let vattu = await db.Phieunhapkho.create({
            ma_phieu: req.body.ma_phieu,
            id_nhanvien: req.body.id_nhanvien,
            id_kho: req.body.id_kho,
            id_nhacc: req.body.id_nhacc,
            id_lydo: req.body.id_lydo,
            ngaynhap:req.body.ngaynhap           

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
        //let ls_lop=await db.Phieunhapkho.findAll();
        let id = req.params.id;
        let vattu = await db.Phieunhapkho.findOne({
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
        exitsId = await db.Phieunhapkho.findOne({
            where: { id: id },
        });
        if (exitsId) {
            let vattu = await db.Phieunhapkho.update({
                ma_phieu: req.body.ma_phieu,
                id_nhanvien: req.body.id_nhanvien,
                id_kho: req.body.id_kho,
                id_nhacc: req.body.id_nhacc,
                id_lydo: req.body.id_lydo,
                ngaynhap:req.body.ngaynhap     
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
        exitsId = await db.Phieunhapkho.findOne({
            where: { id: id },
        });
        if (exitsId) {
            let vattu = await db.Phieunhapkho.destroy({
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
        let searchphieunhapkho = await db.Phieunhapkho.findAll({
            where: {
                ma_phieu: { [Op.like]: '%' + txtSearch + '%' },
            }
        });
        if (searchphieunhapkho.length === 0) {
            res.status(404).json({ message: 'Không tìm thấy dữ liệu nào cả!!!' });
        }
        else {
            res.status(200).json({ success: true, data: searchphieunhapkho, message: 'Search data comepleted' });
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
