
const DetailManagerIMS = require('../../models/ims/detail_mangager_ims');
const ManagerIMS = require('../../models/ims/manager_ims');
const ProvincesIMS = require('../../models/ims/province_ims');
const { ObjectId } = require('mongodb');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
const setLogger = require('../../../helper/setLogger');
const fs = require('fs');
const { paginate1 } = require('../../../helper/pagination');
let index = async (req, res) => {
    try {
        const token = req.headers.token;
        getId = req.params.id;               
        getinfoManagerIMS = await ManagerIMS.findOne({ _id: getId });       
        _getProvinceId = await ProvincesIMS.findOne({ province_id: getinfoManagerIMS.area_id });
        getProvinceId =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProvincesIMS.findOne({ province_id: getinfoManagerIMS.area_id }).select(['province_id','province_name']));
        getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await DetailManagerIMS.find({area_id: _getProvinceId.province_id}));     
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData, getProvinceId,
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let index1 = async (req, res) => {
    try {
        const token = req.headers.token;
        getId = req.params.id; 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;    
        const getSearch = req.body.getSearch || null;               
        getinfoManagerIMS = await ManagerIMS.findOne({ _id: getId });       
        _getProvinceId = await ProvincesIMS.findOne({ province_id: getinfoManagerIMS.area_id });
        getProvinceId =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProvincesIMS.findOne({ province_id: getinfoManagerIMS.area_id }).select(['province_id','province_name']));
        //getData =await DetailManagerIMS.find({area_id: _getProvinceId.province_id});   
       const pipeline =[
        {
            $match: {             
                area_id: _getProvinceId.province_id ,                                        
                                         
            }
        },   
       ];
       if (getSearch) {
        pipeline.push(
            {
                $match: {
                    $or:[                          
                      { name_station: { $regex: getSearch, $options: "i" }} ,
                      { address_of_station: { $regex: getSearch, $options: "i" }} ,
                      { customer: { $regex: getSearch, $options: "i" }} ,
                                             
                    ]
                }
            },
             );
      }
       result = await paginate1(DetailManagerIMS, {}, page, limit,true, pipeline,token); 
       const { getData, totalPages, currentPage, pageSize, totalCount } = result; 
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData, getProvinceId,
                totalPages,
                currentPage,
                pageSize,
                totalCount
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let store = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.files);
        const getArrImage = req.files;
        // reqName = new Date().toISOString().split('T')[0];
        const CovertArrayImageToJson = JSON.stringify(getArrImage.map(file => 'uploads/IMS/' + file.originalname));
        req.body.image = CovertArrayImageToJson;
        const getDetailManagerIMS = new DetailManagerIMS(req.body);
        let getData = await getDetailManagerIMS.save();
        await updatecountInstalled();
        await updateLocationReportIMS();
        if (getData) {
            setLogger.logStore(getInfoUser,req);
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                //data: getData,
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let update = async (req, res) => {
    try {
        //Có sự thay đổi hình ảnh....
        if (req.files) {
            console.log('giá trị ảnh', req.files);
            console.log('giá trị body', req.body);
            getArrDelete = req.body.delete_images;
            console.log('giá trị ArrayDelete là:',getArrDelete);
            //***********GENERAL**********
            let id = req.params.id;
            console.log(id);
            //lấy giá trị hình ảnh mới
            const _getArrImage_New = req.files;
            const getArrImage_New = [];
            _getArrImage_New.forEach(item => {
            getArrImage_New.push(item.originalname);
            });
            console.log('giá trị hình ảnh mới',getArrImage_New);
            //lấy giá trị hình ảnh cũ từ database
            getInfo = await DetailManagerIMS.find({ _id: id });              
            _getArrNameImage = getInfo[0].image;
            const _getArrImage_Old = JSON.parse(_getArrNameImage);
            const getArrImage_Old = _getArrImage_Old.map(path => {
                const getArrImage_Old = path.substring(path.lastIndexOf('/') + 1);
                return getArrImage_Old;
                                });          
            console.log('giá trị hình ảnh cũ',getArrImage_Old);   
            if (getArrDelete === 'undefined') {              
               console.log('chạy vào hàm bình thường');         
                     
                getArrUpdate = getArrImage_Old.concat(getArrImage_New);
                console.log('giá trị nhập lại', getArrUpdate);
                const CovertArrayImageToJson = JSON.stringify(getArrUpdate.map(fileName => 'uploads/IMS/' + fileName));
                req.body.image = CovertArrayImageToJson;
                getData = await DetailManagerIMS.findByIdAndUpdate(id, { $set: req.body });               
                if (getData) {
                    getNewData = await DetailManagerIMS.findOne({ _id: id });
                    setLogger.logUpdate(getInfoUser,req);
                    res.json({
                        status: 200,
                        messege: 'Infomation field has been updated !!!',
                        //data: getNewData,
                    });
                }
                else {
                    return res.json({
                        status: 500,
                        success: false,
                        message: 'Error connecting Database on Server'
                    });
                }
            }
            else 
            {
                console.log('chạy vào hàm xóa dữ liệu trùng');
                _getArrDelete =JSON.parse(getArrDelete);
                console.log('giá trị đã được chuyển đổi cần xóa',_getArrDelete);
                isComplete=true;
                for (const fileName of _getArrDelete){                    
                    const filePath = './public/uploads/IMS/' + fileName;
                    if (fs.existsSync(filePath)) {
                      // Xóa file trong storage của multer
                     await fs.unlink(filePath, (err) => {
                        if (err) {
                          console.error(err);
                          return;
                        }
                        console.log(`Tệp ảnh '${fileName}' đã được xóa khỏi storage của multer`);
                      });
                    }                  
                    // Kiểm tra xem fileName có tồn tại trong data_old, nếu có thì xóa phần tử đó
                    const index = getArrImage_Old.indexOf(fileName);
                    if (index !== -1) {
                      getArrImage_Old.splice(index, 1);
                    }
                    console.log('giá trị đã xóa sau khi trùng lần cuối',getArrImage_Old);
                    console.log(getArrImage_New);
                    getArrUpdate = getArrImage_Old.concat(getArrImage_New);
                    console.log('giá trị nhập lại', getArrUpdate);
                    const CovertArrayImageToJson = JSON.stringify(getArrUpdate.map(fileName => 'uploads/IMS/' + fileName));
                req.body.image = CovertArrayImageToJson;
                getData = await DetailManagerIMS.findByIdAndUpdate(id, { $set: req.body });
               isComplete= getData?true:false;               
                  };
                  if (isComplete) {
                    getNewData = await DetailManagerIMS.findOne({ _id: id });
                    setLogger.logUpdate(getInfoUser,req);
                    res.json({
                        status: 200,
                        messege: 'Infomation field has been updated !!!',
                        //data: getNewData,
                    });
                }
                else {
                    return res.json({
                        status: 500,
                        success: false,
                        message: 'Error connecting Database on Server'
                    });
                }
            }
        }
        // Không có sự thay đổi hình ảnh....
        else  {
            let id = req.params.id;
            getData = await DetailManagerIMS.findByIdAndUpdate(id, { $set: req.body });
            if (getData) {
                getNewData = await DetailManagerIMS.findOne({ _id: id });
                setLogger.logUpdate(getInfoUser,req);
                res.json({
                    status: 200,
                    messege: 'Infomation field has been updated !!!',
                    data: getNewData,
                });
            }
            else {
                return res.json({
                    status: 500,
                    success: false,
                    message: 'Error connecting Database on Server'
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let destroy = async (req, res) => {
    try {
        let id = new ObjectId(req.params.id);
        getId = await DetailManagerIMS.findByIdAndRemove({ _id: id });
        await updatecountInstalled();
        await updateLocationReportIMS();
        if (getId) {
            setLogger.logDelete(getInfoUser,req);
            res.json({
                success: true,
                status: 200,
                messege: 'This field has been removed!!!',
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let updateLocationReportIMS = async (req, res) => {
    try {
        gettotalCount = await ManagerIMS.aggregate([
            {
                $group: {
                    _id: null,
                    totalInstalled: { $sum: { $toInt: "$installed" } },
                    totalNextPhase: { $sum: { $toInt: "$next_phase" } },
                }
            },
        ]);
        getData = await ManagerIMS.aggregate([
            {
                $project: { _id: 1, area_id: 1, installed: 1, next_phase: 1 }
            },
            {
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
            }
        ]);
    }
    catch (err) {
        console.log(err);
        return res.json({
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let updatecountInstalled = async (req, res) => {
    _countInstalled = await ManagerIMS.aggregate([
        {
            $lookup: {
                from: "detail_manager_imsses",
                localField: "area_id",
                foreignField: "area_id",
                as: "details"
            }
        },
        {
            $unwind: "$details" // Unwind để có thể tính tổng active_status trong từng document của ManagerIMSSchema
        },
        {
            $group: {
                _id: "$area_id",
                totalActiveStatus: { $sum: { $toInt: "$details.active_status" } }
            }
        },
        {
            $project: {
                _id: 1,
                totalActiveStatus: 1
            }
        }
    ]);
    const updateManagerIMS = await _countInstalled.map(function (data) {
        return ManagerIMS.findOneAndUpdate(
            { area_id: data._id },
            { installed: data.totalActiveStatus },
            { new: true }
        );
    });
    return Promise.all(updateManagerIMS).then(data => {
        data.forEach(res => {
            res;
        })
    })
        .catch(err => {
            res.json({
                status: 500,
                success: false,
                error: err.message
            });
        });
}
module.exports =
{
    index: index,
    index1: index1,
    store: store,
    update: update,
    destroy: destroy,
    updateLocationReportIMS: updateLocationReportIMS,
    updatecountInstalled: updatecountInstalled,

}