
const ManagerISM = require('../../models/ims/manager_ims');
const ProvinceISM = require('../../models/ims/province_ims');
const { paginate } = require('../../../helper/pagination');
let index = async (req, res) => {
    try {
        let getProvinces = await ProvinceISM.find({});
        const page = parseInt(req.query.page) || 1;
        _countInstalled = await countInstalled(); 
        getData=await ManagerISM.aggregate([
            {   
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
            },
        ]); 
        
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: { getData, provinces: getProvinces },               
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
let testPaginatewithAggragate = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        //const result = await paginate(ManagerISM, {}, page, 10);
        const pipeline = 
            {
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
            };
        const result = await paginate(ManagerISM, {}, page, 10,true,pipeline);
        const { getData, totalPages, currentPage, pageSize, totalCount } = result;
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
                totalPages,
                currentPage,
                pageSize,
                totalCount
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
let testPaginatewithFind = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await paginate(ManagerISM, {}, page,10,false);      
        const { getData, totalPages, currentPage, pageSize, totalCount } = result;
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData,
                totalPages,
                currentPage,
                pageSize,
                totalCount
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
        const getManagerISM = new ManagerISM(req.body);
        let getData = await getManagerISM.save();
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
        let id = req.params.id;
        getData = await ManagerISM.findByIdAndUpdate(id, { $set: req.body });
        if (getData) {
            getNewData = await ManagerISM.findOne({ _id: id });
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
        getId = await ManagerISM.findByIdAndRemove({ _id: id });
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
        res.json({
            status: 500,
            success: false,
            error: err.message
        });
    }
}
let countInstalled = async (req, res) => {    
        _countInstalled= await ManagerISM.aggregate([
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
            return ManagerISM.findOneAndUpdate(
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
    testPaginatewithAggragate: testPaginatewithAggragate,
    testPaginatewithFind:testPaginatewithFind,
    countInstalled: countInstalled,
}