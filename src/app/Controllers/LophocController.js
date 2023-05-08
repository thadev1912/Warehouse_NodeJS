const { where } = require('sequelize');
const db = require('../../../models/index');
let index = async (req, res) => {
    try {
        let lophoc = await db.Lophoc.findAll();

        if (lophoc) {
            //console.log(lophoc);   
            res.render('lophoc/lophoc', { lophoc });
        }
        else {
            console.log('Lỗi kết nối!!!');
        }

    }
    catch (err) {
        console.log(err);
    }
};
let create = async (req, res) => {
    res.render('lophoc/them_lophoc');
}
let store = async (req, res) => {
    let data = req.body;
    console.log(data);
    try {
        let lophoc = db.Lophoc.create({
            ma_lop: req.body.txt_ma_lop,
            ten_lop: req.body.txt_ten_lop,
            gvcn: req.body.txt_gvcn,
        });
        if (lophoc) {
            console.log('Thêm dữ liệu thành công!!!');
            res.redirect('/lophoc');
        }
        else {
            console.log('Lỗi kết nối!!!');
        }
    }
    catch (err) {
        console.log(err);
    }
}
let edit = async (req, res) => {
    try {
        let id = req.params.id;
        let lophoc = await db.Lophoc.findOne({
            where: { id: id },
            raw: true,
        });
        if (lophoc) {
            console.log(lophoc);
            console.log('Lấy dữ liệu thành công!!');
            res.render('lophoc/sua_lophoc', { lophoc });
        }
        else {
            console.log('Lỗi kết nối CSDL!!');
        }
    }
    catch (e) {
        console.log(e);
    }


}
let update = async (req, res) => {
    try {
        let id = req.body.txt_id;
        //console.log(data);
        let exits_id = await db.Lophoc.findOne({
            where: { id: id },
        });
        if (exits_id) {
            let lophoc = db.Lophoc.update({
                ma_lop: req.body.txt_ma_lop,
                ten_lop: req.body.txt_ten_lop,
                gvcn: req.body.txt_gvcn,
            },
                {
                    where: { id: id },
                });
            if (lophoc) {
                console.log('Cập nhật dữ liệu thành công!!!');
                res.redirect('/lophoc');
            }
            else {
                console.log('vui lòng kiểm tra lại thông tin!!!');
            }
        }
        else {
            console.log('ID không tồn tại trong CSDL!!!');
        }
    }
    catch (e) {
        console.log(e);
    }
}
let destroy = async(req,res) =>
{
    try{
        let id=req.params.id;
        console.log(id);
        let lophoc=await db.Lophoc.destroy({
            where:{id:id},
        });
        if(lophoc)
        {
            console.log('Xóa dữ liệu thành công!!!');
            res.redirect('/lophoc');
        }
        else
        {
            console.log('Lỗi kết nối CSDL!!!');
        }
    }
    catch(e)
    {
        console.log(e);
    }
   
}
module.exports = {
    index: index,
    create: create,
    store: store,
    edit: edit,
    update: update,
    destroy:destroy,
}