
const Region = require('../../../models/region')
//Lấy danh sách khu vực
let index = async (req, res) => {
    console.log('bạn đang gọi tôi à!!!');

    let getData = await Region.find({});
    res.json({
        status: 200,
        messege: 'Lấy dữ liệu thành công!!!',
        data: getData,
    });
}
//Thêm mới khu vực
let create = async (req, res) => {
    //  const getRegion = new Region({
    //     region_id: '8888',       
    //     region_333: '8888', 
    // });
    const getRegion = new Region(req.body)
    await getRegion.save();
    getRegion.save().then(result => {
        res.json({ region: result })
    })
}
//Cập nhật khu vực
let edit = async (req, res) => {

}
let destroy = async (req, res) => {
    Region.remove({ _id: req.body.id }, (err) => {
        if (err) { return res.json({ err }) }
        res.json({ 'mess': 'Delete success' })
    });
}
module.exports =
{
    index: index,
    create: create,
    edit: edit,
    destroy: destroy,
}