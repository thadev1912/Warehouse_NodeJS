

const ProvinceISM = require('../../models/ims/province_ims');
const ManagerWMS = require('../../models/wms/manager_wms');
const LocationISM = require('../../models/ims/location');
const DetailManagerWMS = require('../../models/wms/detail_mangager_wms');
const StandardWMS = require('../../models/wms/standard_wms');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
let index = async (req, res) => {
    try {
        const token = req.headers.token;
        let getProvinces =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProvinceISM.find({}));
        countActiveStatus();
        //lấy theo nhóm ID Location_area
         getDetailbyLocation=await DetailManagerWMS.aggregate([
            {
                $group:{
                    _id:"$location_area",                 
                  }
            }
         ])
         const covertArrayLocation= getDetailbyLocation.map(item => item._id);       
        _getLocation=await LocationISM.find();        
        const getLocation =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await _getLocation.filter(record => covertArrayLocation.includes(record.location_code)));        
        getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ManagerWMS.aggregate([
            {
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
            },
            // {
            //     $sort: {
            //         created: -1 
            //     }
            // },              
        ]));      
        getSelectYear=await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await DetailManagerWMS.aggregate([
            {
                $group:{
                    _id:{$year:"$installtion_date"
                    }
                }
            },
            {
                $project: {
                  _id: 0,
                  year: "$_id"
                }
              },
            {
                $sort:{
                    year:1
                }
            }
        ]));           
        if (getProvinces) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data:getData,getProvinces,getLocation,getSelectYear
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
        getAreaId = req.body.area_id;
        location_area = getAreaId > 100 ? 'JP' : 'VN';
        req.body.location_area = location_area;
        const getManagerWSM = new ManagerWMS(req.body);
        let getData = await getManagerWSM.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field completed',
                //data: getData,
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
        let id = req.params.id;
        req.body.updated = new Date();
        getData = await ManagerWMS.findByIdAndUpdate(id, { $set: req.body });
        if (getData) {
            getNewData = await ManagerWMS.findOne({ _id: id });
            res.json({
                status: 200,
                messege: 'Infomation field has been updated',
                //  data: getNewData,
            });
        }
        else {
            return res.json({
                status: 500,
                success: false,
                message: 'Error connecting Database on Server'
            });
        }
    } catch (err) {
        console.log(err);
        res.json({
            status: 500,
            success: false,
            error: err.message
        });
    }
}
let destroy = async (req, res) => {
    try {
        let id = req.params.id;
        console.log(id);
        getInfo = await ManagerWMS.findOne({ _id: id });        
        checkIdProvince = await DetailManagerWMS.findOne({ area_id: getInfo.area_id }).count();            
        if (checkIdProvince > 0) {
            await DetailManagerWMS.deleteMany({ area_id: getInfo.area_id });
        }       
        await countActiveStatus();
        getId = await ManagerWMS.findByIdAndRemove({ _id: id });
        if (getId) {
            res.json({
                success: true,
                status: 200,
                messege: 'This field has been removed',
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
        res.json({
            status: 500,
            success: false,
            error: err.message
        });
    }
}
const countActiveStatus=async(req,res)=>
{
    _countInstalled = await DetailManagerWMS.aggregate([
        {
            $group: {
                _id: "$area_id",
                totalStation: { $sum: 1 },
                totalInstalled: { $sum: { $toInt: "$installed" } },
                active_status: {
                    $sum: { $cond: [{ $eq: ["$active_status",1] }, 1, 0] }
                },
                inactive_status: {
                    $sum: { $cond: [{ $eq: ["$active_status",0] }, 1, 0] }
                },
                maintenance_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 2] }, 1, 0] }
                }
            }
        }
    ]);   
    const updateManagerWMS = await _countInstalled.map(function (data) {        
        return ManagerWMS.findOneAndUpdate(
            { area_id: data._id },
            { $set: {
                installed:data.totalInstalled,
                active_status: data.active_status,
                inactive_status: data.inactive_status,
                maintenance_status:data.maintenance_status,
                totalStation:data.totalStation }
            },
            { new: true }      
        );
    });
    return Promise.all(updateManagerWMS).then(data => {
        data.forEach(res => {
            res;
        })
    })
}
module.exports =
{
    index: index,
    store: store,
    update: update,
    destroy: destroy,
    countActiveStatus:countActiveStatus,
}   