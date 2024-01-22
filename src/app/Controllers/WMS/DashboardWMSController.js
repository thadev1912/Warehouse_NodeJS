
const ManagerWSM = require('../../models/wms/manager_wms');
const DetailManagerWSM = require('../../models/wms/detail_mangager_wms');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
let LocationReportWMS = async (req, res) => {
    try {
        const token = req.headers.token;
        getLocationArea = req.params.id;
        gettotalCount = await ManagerWSM.aggregate([
            {
                $match: { location_area: getLocationArea }
            },
            {
                $group: {
                    _id: null,
                    totalInstalled: { $sum: { $toInt: "$installed" } },
                    totalNextPhase: { $sum: { $toInt: "$next_phase" } },
                    totalActive_status: { $sum: { $toInt: "$active_status" } },
                    totalInactive_status: { $sum: { $toInt: "$inactive_status" } },
                    totalMaintenance_status: { $sum: { $toInt: "$maintenance_status" } },
                }
            },
        ]);  
        console.log(gettotalCount);
        _totalInstalled =  await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,gettotalCount?.[0]?.totalInstalled ?? 0);
        _totalNextPhase =  await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,gettotalCount?.[0]?.totalNextPhase ?? 0);
        _totalActive_status =  await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,gettotalCount?.[0]?.totalActive_status ?? 0);
        _totalInactive_status = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, gettotalCount?.[0]?.totalInactive_status ?? 0);
        _totalMaintenance_status = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, gettotalCount?.[0]?.totalMaintenance_status ?? 0);
        getData =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ManagerWSM.aggregate([
            {
                $match: { location_area: getLocationArea }
            },
            {
             //   $project: { _id: 1, area_id: 1, active_status: 1, inactive_status: 1,maintenance_status:1,installed:1,next_phase:1 }
             $project: { _id: 1, area_id: 1,installed:1,next_phase:1 }
            },
            {
                $lookup: {
                    from: "province_imsses",
                    localField: "area_id",
                    foreignField: "province_id",
                    as: "getProvinceData"
                }
            },
          
        ]));
        if ((getData)&& (gettotalCount)) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: {
                    getTotal: {
                        totalInstalled: _totalInstalled,
                        totalNextPhase: _totalNextPhase,
                      //  totalActive_status: _totalActive_status,
                      //  totalInactive_status: _totalInactive_status,
                      //  totalMaintenance_status: _totalMaintenance_status,
                    },
                    getData
                    
                },
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
            status:500,
            success: false,           
            error: err.message,
        });      
    }
}
let YearReportWMS =async(req,res)=>
{
    try {  
        const token = req.headers.token;     
        const getLocationArea = req.query.location;          
        //Sum by Year
        _getTotalActiveSumbyYear = [
            {
                $group: {
                    _id: { $year: "$installtion_date" },
                    // SumbyYear: {
                    //     $sum: { $toInt: "$active_status" }
                    // },
                    SumInstalledbyYear: {
                        $sum: { $toInt: "$installed" }
                    },
                    // SumNextPhasebyYear: {
                    //     $sum: { $toInt: "$next_phase" }
                    // }
                }
            },

            {
                $sort: {
                    "_id": 1
                }
            }
        ];
        if (getLocationArea !=='all') {
            _getTotalActiveSumbyYear.unshift({
                $match: {
                    location_area: getLocationArea
                }
            });
        }    
        getTotalActiveSumbyYear=await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await DetailManagerWSM.aggregate(_getTotalActiveSumbyYear));          
        console.log(getTotalActiveSumbyYear);    
                       _getTotalActiveStatus=[
                        {
                            $project: {
                              active: { $eq: ["$active_status", 1] },
                              inactive: { $eq: ["$active_status", 0] },
                              maintenance: { $eq: ["$active_status", 2] }
                            }
                          },               
                {
                    $group: {
                      _id: null,                                 
                      active: { $sum: { $cond: [{ $eq: ["$active", true] }, 1, 0] } },
                      inactive: { $sum: { $cond: [{ $eq: ["$inactive", true] }, 1, 0] } },
                      maintenance: { $sum: { $cond: [{ $eq: ["$maintenance", true] }, 1, 0] } }
                    }
                  }
            ];
                if (getLocationArea !== 'all') {
                    _getTotalActiveStatus.unshift({
                        $match: {
                            location_area: getLocationArea
                        }
                    });
                } 
                getTotalActiveStatus=  await DetailManagerWSM.aggregate(_getTotalActiveStatus);   
                console.log(getTotalActiveStatus);      
                _SumActive = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotalActiveStatus?.[0]?.active ?? 0); 
                _SumInactive = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,  getTotalActiveStatus?.[0]?.inactive ?? 0); 
                _SumMaintenance = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,  getTotalActiveStatus?.[0]?.maintenance ?? 0); 

                  //Sum all Next phase
        _getTotal=[
            {
                $group: {
                    _id: null,
                    qtyInstalled: {
                        $sum: { $toInt: "$installed" }
                    },
                    qtyNextPhase: {
                        $sum: { $toInt: "$next_phase" }
                    }
                   
                }
            }
        ];
        if (getLocationArea !=='all') {
            _getTotal.unshift({
                $match: {
                    location_area: getLocationArea
                }
            });
        } 
       
        getTotal=  await ManagerWSM.aggregate(_getTotal);  
        _qtyInstalled = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotal?.[0]?.qtyInstalled ?? 0);    
        _totalNextPhase = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotal?.[0]?.qtyNextPhase ?? 0);      
            if ((_getTotalActiveStatus)) {
                res.json({
                    status: 200,
                    message: 'Get Data Completed!!',
                    data: {
                        getTotal: {
                            getTotalActiveSumbyYear:getTotalActiveSumbyYear,
                            TotalActive: _SumActive, 
                            TotalInactive: _SumInactive,  
                            TotalMaintenance: _SumMaintenance,  
                            TotalInstalled:_qtyInstalled,
                            totalNextPhase:_totalNextPhase,                        
                                                                      }
                    },    
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
        status:500,
        success: false,           
        error: err.message,
    });      
}
}
let HeadersReportWMS =async (req,res)=>
{
    try
    {
     //Sum all Installed
     const token = req.headers.token;
     getData =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await DetailManagerWSM.aggregate([
        {
            $group: {
                _id:null,
                totalStation: { $sum: 1 },
                active_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 1] }, 1, 0] }
                },
                inactive_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 0] }, 1, 0] }
                },
                maintenance_status: {
                    $sum: { $cond: [{ $eq: ["$active_status", 2] }, 1, 0] }
                }
            }
        },
        {
            $project:{
                _id:0,
                totalStation:1,
                active_status:1,
                inactive_status:1,
                maintenance_status:1
            }
        }
    ])) ;
    if (getData) {
        res.json({
          status: 200,
          message: 'Get Data Completed',
          getData,
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
            status:500,
            success: false,           
            error: err.message,
        });      
    }
   
}

let showAllDetailWMS =async(req,res)=>
{  
  try
  {
      res.json('bạn gọi tôi à')
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
module.exports = {
    LocationReportWMS: LocationReportWMS,   
    YearReportWMS:YearReportWMS,
    HeadersReportWMS:HeadersReportWMS,
    showAllDetailWMS:showAllDetailWMS,
}