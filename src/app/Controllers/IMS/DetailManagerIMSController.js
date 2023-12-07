
const DetailManagerIMS = require('../../models/ims/detail_mangager_ims');
const ManagerIMS = require('../../models/ims/manager_ims');
const ProvincesIMS = require('../../models/ims/province_ims');
const { ObjectId } = require('mongodb');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
let index = async (req, res) => {
    try {      
        const token = req.headers.token; 
        getId = new ObjectId(req.params.id);   
        totalCount = await DetailManagerIMS.find({}).count();      
        getinfoManagerIMS=await ManagerIMS.findOne({_id:getId});     
        getProvinceId=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await ProvincesIMS.findOne({province_id:getinfoManagerIMS.area_id}));  
        //console.log(getProvinceId);      
       getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await DetailManagerIMS.find({ area_id: getProvinceId.province_id }));
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,getProvinceId,              
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
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
        await updatecountInstalled();
        await updateLocationReportIMS();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                //data: getData,
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
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
                    //data: getNewData,
                });
            }
            else {
                return res.json({
                    status:500,
                    success: false,                
                    message: 'Error connecting Database on Server'
                });
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
                return res.json({
                    status:500,
                    success: false,                
                    message: 'Error connecting Database on Server'
                });
            }
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let destroy = async (req, res) => {
    try {
        let id = req.params.id;
        getId = await DetailManagerIMS.findByIdAndRemove({ _id: id });
        await updatecountInstalled();
        await updateLocationReportIMS();
        if (getId) {
            res.json({
                success: true,
                status: 200,
                messege: 'This field has been removed!!!',
            });
        }
        else {
            return res.json({
                status:500,
                success: false,                
                message: 'Error connecting Database on Server'
            });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
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
                $project:{ _id:1,area_id:1,installed:1,next_phase:1}
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
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let updatecountInstalled = async (req, res) => {    
    _countInstalled= await ManagerIMS.aggregate([
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
    const updateManagerIMS = await _countInstalled.map(function(data) {
        return ManagerIMS.findOneAndUpdate(
          { area_id: data._id },
          { installed: data.totalActiveStatus },
          { new: true }
        );
      });
     return Promise.all(updateManagerIMS).then(data=>{
        data.forEach(res=>{
            res;
        })            
     })
     .catch(err=>{
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
    store: store,
    update: update,
    destroy: destroy,
    updateLocationReportIMS:updateLocationReportIMS,
    updatecountInstalled:updatecountInstalled,
    
}