const db = require('../../../models/index')

let tintucdatxanh = async (req, res) => {

   try {
      let data = await db.Tintucdatxanh.findAll();
      return res.render('tintucdatxanh/tintucdatxanh', { data });
   }
   catch (e) {
      console.log(e);
   }
};

let them_tintucdatxanh = (req, res) => {
   return res.render('tintucdatxanh/them_tintucdatxanh');
}
let luu_tintucdatxanh = async (req, res) => {
   try {
      await db.Tintucdatxanh.create({
         tieude_baiviet: req.body.txt_tieude,
         noidung_baiviet: req.body.txt_noidung,
         danhmuc_baiviet: req.body.txt_danhmuc,
         tacgia_baiviet: req.body.tacgia_baiviet,
      })
      //res.json(req.body.txt_tieude);
      return res.redirect('/tintucdatxanh');
   }
   catch (e) {
      console.log(e)
   }

}
let sua_tintucdatxanh = async (req, res) => {
   try {
      let info = req.params.id;
      let data = await db.Tintucdatxanh.findOne({
         where: { id: info },
         raw: true,
      });
      //console.log(data);
      return res.render('tintucdatxanh/sua_tintucdatxanh', { data });
   }
   catch (e) {
      console.log(e)
   }
}
let capnhat_tintucdatxanh = async (req, res) => {
   try {
      let data = req.body;
      await db.Tintucdatxanh.update({
         tieude_baiviet: req.body.txt_tieude,
         noidung_baiviet: req.body.txt_noidung,
         danhmuc_baiviet: req.body.txt_danhmuc,
         tacgia_baiviet: req.body.tacgia_baiviet,
      },
         {
            where: { id: data.id },
         });
      return res.redirect('/tintucdatxanh');
   }
   catch (e) {
      console.log(e)
   }
}
let xoa_tintucdatxanh = async (req, res) => {
   try {
      let info = req.params.id;
      await db.Tintucdatxanh.destroy({
         where: { id: info },
      });
      return res.redirect('/tintucdatxanh');
   }
   catch (e) {
      console.log(e)
   }
}

module.exports = {
   tintucdatxanh: tintucdatxanh,
   them_tintucdatxanh: them_tintucdatxanh,
   luu_tintucdatxanh: luu_tintucdatxanh,
   sua_tintucdatxanh: sua_tintucdatxanh,
   capnhat_tintucdatxanh: capnhat_tintucdatxanh,
   xoa_tintucdatxanh: xoa_tintucdatxanh,
};
