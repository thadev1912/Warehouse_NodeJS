
const DetailManagerIMS = require('../../models/ims/detail_mangager_ims');
let index = async (req, res) => {
    try {
        getId = req.params.id;
        const page = parseInt(req.query.page) || 1;
        limit = 10;
        totalCount = await DetailManagerIMS.find({}).count();
        const totalPages = Math.ceil(totalCount / limit);
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        getData = await DetailManagerIMS.find({ area_id: getId }).skip((currentPage - 1) * limit).limit(limit);
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
                total: totalCount,   // tổng số record
                PageSize: totalPages,   //tổng số trang được chia
                CurrentPage: page,  //trang hiện tại         
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
        const getArrImage = req.files;
        reqName = new Date().toISOString().split('T')[0];
        const CovertArrayImageToJson = JSON.stringify(getArrImage.map(file => 'uploads/IMS/' + reqName + file.originalname));
        req.body.image = CovertArrayImageToJson;
        const getDetailManagerIMS = new DetailManagerIMS(req.body);
        let getData = await getDetailManagerIMS.save();
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
let update = async (req, res) => {
    try {
        if (req.files) {
            let id = req.params.id;
            const getArrImage = req.files;
            reqName = new Date().toISOString().split('T')[0];
            const CovertArrayImageToJson = JSON.stringify(getArrImage.map(file => 'uploads/IMS/' + reqName + file.originalname));
            req.body.image = CovertArrayImageToJson;
            getData = await DetailManagerIMS.findByIdAndUpdate(id, { $set: req.body });
            if (getData) {
                getNewData = await DetailManagerIMS.findOne({ _id: id });
                res.json({
                    status: 200,
                    messege: 'Infomation field has been updated !!!',
                    data: getNewData,
                });
            }
            else {
                throw new Error('Error connecting Database on Server');
            }
        }
        else
        {
            getData = await DetailManagerIMS.findByIdAndUpdate(id, { $set: req.body }); 
            if (getData) {
                getNewData = await DetailManagerIMS.findOne({ _id: id });
                res.json({
                    status: 200,
                    messege: 'Infomation field has been updated !!!',
                    data: getNewData,
                });
            }
            else {
                throw new Error('Error connecting Database on Server');
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}
let destroy = async (req, res) => {
    try {
        let id = req.params.id;
        getId = await DetailManagerIMS.findByIdAndRemove({ _id: id });
        if (getId) {
            res.json({
                success: true,
                status: 200,
                messege: 'This field has been removed!!!',
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
    store: store,
    update: update,
    destroy: destroy
}