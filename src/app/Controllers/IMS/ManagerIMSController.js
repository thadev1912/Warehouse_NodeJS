
const ManagerISM = require('../../models/ims/manager_ims');
const ProvinceISM = require('../../models/ims/province_ims');
const DetailManagerIMS = require('../../models/ims/detail_mangager_ims');
const { paginate } = require('../../../helper/pagination');
const { paginate1 } = require('../../../helper/pagination');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
const setLogger = require('../../../helper/setLogger');
let index = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.query.limit);       
        const token = req.headers.token;
        let getProvinces =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ProvinceISM.find({}));        
        _countInstalled = await countInstalled();
        getData =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await ManagerISM.aggregate([
            {
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
            },
        ]));
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: { getData, provinces: getProvinces },
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
let testlist = async (req, res) => {
    try {
        const token = req.headers.token;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;       
             
        let getProvinces =await ProvinceISM.find({});        
        _countInstalled = await countInstalled();
      
               const pipeline =     
            {
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
           } ;        
         
                 
          
             result = await paginate(ManagerISM, {}, page, limit,true, pipeline); 
            const { getData, totalPages, currentPage, pageSize, totalCount } = result;      
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: { getData, provinces: getProvinces },
                totalPages,
                currentPage,
                pageSize,
                totalCount
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
let testlist1 = async (req, res) => {
    try {
        console.log(req.body);
        console.log(req.query);       
        const token = req.headers.token;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const getSearch = req.query.getSearch || null;
        console.log(getSearch);       
        let getProvinces =await ProvinceISM.find({});        
        _countInstalled = await countInstalled(); 
               const pipeline =[              
                {
                    $lookup: {
                        from: "province_imsses",
                        localField: "area_id",
                        foreignField: "province_id",
                        as: "getProvinceData"
                    }
                },
           { $unwind: "$getProvinceData" }, 

         
        ];          
           if (getSearch) {
            pipeline.push(
                { $match:
                    {                    
                        $or: [
                          { "getProvinceData.province_name": { $regex: getSearch, $options: "i" } },   
                                          
                           ]
                      },                                        
                }             
                 );
          }
             result = await paginate1(ManagerISM, {}, page, limit,true, pipeline,token); 
            const { getData, totalPages, currentPage, pageSize, totalCount } = result;      
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: { getData, provinces: getProvinces },
                totalPages,
                currentPage,
                pageSize,
                totalCount
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

let testPaginatewithFind = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const result = await paginate(ManagerISM, {}, page, 10, false);
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
        const result = await paginate(ManagerISM, {}, page, 6, true, pipeline);
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
        getAreaId = req.body.area_id;
        location_area = getAreaId > 64 ? 'JP' : 'VN';
        req.body.location_area = location_area;
        const getManagerISM = new ManagerISM(req.body);
        let getData = await getManagerISM.save();
        if (getData) {
            setLogger.logStore(getInfoUser,req);
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
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
        req.body.updated=new Date();
        getData = await ManagerISM.findByIdAndUpdate(id, { $set: req.body });
        if (getData) {
            getNewData = await ManagerISM.findOne({ _id: id });
            setLogger.logUpdate(getInfoUser,req);
            res.json({
                status: 200,
                messege: 'Infomation field has been updated !!!',
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
        getInfo = await ManagerISM.findOne({ _id: id });
        console.log('thông tin giá trị', getInfo);
        checkIdProvince = await DetailManagerIMS.findOne({ area_id: getInfo.area_id }).count();
        console.log('giá trị đếm được', checkIdProvince);
         await countInstalled();
        if (checkIdProvince > 0) {
            await DetailManagerIMS.deleteMany({ area_id: getInfo.area_id });
        }
        getId = await ManagerISM.findByIdAndRemove({ _id: id });
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
        res.json({
            status: 500,
            success: false,
            error: err.message
        });
    }
}
let countInstalled = async (req, res) => {
    _countInstalled = await ManagerISM.aggregate([
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
        return ManagerISM.findOneAndUpdate(
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
    store: store,
    update: update,
    destroy: destroy,
    testPaginatewithFind: testPaginatewithFind,
    testPaginatewithAggragate: testPaginatewithAggragate,   
    countInstalled: countInstalled,
    testlist:testlist,
    testlist1:testlist1,
}