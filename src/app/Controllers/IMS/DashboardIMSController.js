
const ManagerISM = require('../../models/ims/manager_ims');
const DetailManagerISM = require('../../models/ims/detail_mangager_ims');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
let LocationReportIMS = async (req, res) => {
    try {
        const token = req.headers.token;
        getLocationArea = req.params.id;
        gettotalCount = await ManagerISM.aggregate([
            {
                $match: { location_area: getLocationArea }
            },
            {
                $group: {
                    _id: null,
                    totalInstalled: { $sum: { $toInt: "$installed" } },
                    totalNextPhase: { $sum: { $toInt: "$next_phase" } },
                }
            },
        ]);        
        _totalInstalled = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, gettotalCount?.[0]?.totalInstalled ?? 0);
        _totalNextPhase = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, gettotalCount?.[0]?.totalNextPhase ?? 0);
        getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ManagerISM.aggregate([
            {
                $match: { location_area: getLocationArea }
            },
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
        ]));
        if ((getData) && (gettotalCount)) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: {
                    getTotal: {
                        totalInstalled: _totalInstalled,
                        totalNextPhase: _totalNextPhase
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
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let YearReportIMS = async (req, res) => {
    try {
        const token = req.headers.token;
        const getLocationArea = req.query.location;
        const _getYear=req.query.year||'all'
        console.log(_getYear);
        if(_getYear === 'all')
        {
            getYear='all'
        }
        else
        {
            getYear=parseInt(_getYear,10);
        }                  
        //Sum by Year
        _getTotalInstalledSumbyYear = [];
        if(_getYear ==='all')  
        {
            _getTotalInstalledSumbyYear.unshift(
                {
                    $group: {
                        _id: { $year: "$installtion_date" },
                        SumData: {
                            $sum: { $toInt: "$active_status" }
                        }
                    }
                },
                {
                    $sort: {
                        "_id": 1
                    }
                }
            );            
        }    
        else
            {
                _getTotalInstalledSumbyYear.unshift(
                {
                    $group: {
                        _id: { $month: "$installtion_date" },
                        SumData: {
                            $sum: { $toInt: "$active_status" }
                        }
                    }
                },
                {
                    $sort: {
                        "_id": 1
                    }
                }
            );         
            }    
       
        if (getLocationArea !=='all') {
            _getTotalInstalledSumbyYear.unshift({
                $match: {
                    location_area: getLocationArea
                }
            });
        } 
        if(_getYear !=='all')
        {
            _getTotalInstalledSumbyYear.unshift({
                $match: {
                    $expr: {
                        $eq: [{ $year: "$installtion_date" },getYear]
                    }
                  }
            });  
        }   
     getTotalInstalledSumbyYear=await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await DetailManagerISM.aggregate(_getTotalInstalledSumbyYear)); 
    
     coverData=await cryptJSon.decryptData(token,configCrypt.encryptionEnabled,getTotalInstalledSumbyYear)       
        //Sum all Installed
        _getTotalInstalled=[
            {
                $group: {
                    _id: null,
                    qty: {
                        $sum: { $toInt: "$active_status" }
                    }
                }
            }];
            if (getLocationArea !== 'all') {
                _getTotalInstalled.unshift({
                    $match: {
                        location_area: getLocationArea,
                    }
                });
            }
            if(_getYear !=='all')
            {
                _getTotalInstalled.unshift({
                    $match: {
                        $expr: {
                            $eq: [{ $year: "$installtion_date" },getYear]
                        }
                      }
                });  
            }   
        getTotalInstalled=  await DetailManagerISM.aggregate(_getTotalInstalled);           
        _SumInstalled = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotalInstalled?.[0]?.qty ?? 0);
        //Sum all Next phase
        _getTotalNextPhase=[
            {
                $group: {
                    _id: null,
                    qty: {
                        $sum: { $toInt: "$next_phase" }
                    }
                }
            }
        ];
        if (getLocationArea !=='all') {
            _getTotalNextPhase.unshift({
                $match: {
                    location_area: getLocationArea
                }
            });
        } 
        if(_getYear !=='all')
        {
            _getTotalNextPhase.unshift({
                $match: {
                    $expr: {
                        $eq: [{ $year: "$installtion_date" },getYear]
                    }
                  }
            });  
        }   
        getTotalNextPhase=  await ManagerISM.aggregate(_getTotalNextPhase);        
        _totalNextPhase = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotalNextPhase?.[0]?.qty ?? 0);
        if ((getTotalInstalledSumbyYear)&&(getTotalInstalled) && (getTotalNextPhase)) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: {
                    getTotal: {
                        totalInstalledByYear: getTotalInstalledSumbyYear,coverData,
                        SumInstalled: _SumInstalled,
                        totalNextPhase: _totalNextPhase,

                  
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
            status: 500,
            success: false,
            error: err.message,
        });
    }
}
let HeadersReportIMS = async (req, res) => {
    const token = req.headers.token;
    //Sum all Installed
    getTotalInstalled = await ManagerISM.aggregate([
        {
            $group: {
                _id: null,
                qty: {
                    $sum: { $toInt: "$installed" }
                }
            }
        }]);
    _SumInstalled = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotalInstalled?.[0]?.qty ?? 0);
    //Sum all Next phase
    getTotalNextPhase = await ManagerISM.aggregate([
        {
            $group: {
                _id: null,
                qty: {
                    $sum: { $toInt: "$next_phase" }
                }
            }
        }
    ]);
    _totalNextPhase = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getTotalNextPhase?.[0]?.qty ?? 0);
    // Location in International
    getLocationJaPan = await ManagerISM.aggregate([
        {
            $match: {
                location_area: 'JP'
            }
        },
        {
            $group: {
                _id: null,
                qty: {
                    $sum: { $toInt: "$installed" }
                }
            }
        },
    ]);
    _getLocationJaPan = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getLocationJaPan?.[0]?.qty ?? 0);
    // Location in VietNam
    getLocationVietNam = await ManagerISM.aggregate([
        {
            $match: {
                location_area: 'VN'
            }
        },
        {
            $group: {
                _id: null,
                qty: {
                    $sum: { $toInt: "$installed" }
                }
            }
        },
    ]);
    _getLocationVietNam = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, getLocationVietNam?.[0]?.qty ?? 0);
    if ((getTotalInstalled) && (getTotalNextPhase)) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: {
                getTotal: {
                    SumInstalled: _SumInstalled,
                    totalNextPhase: _totalNextPhase,
                    getLocationJaPan: _getLocationJaPan,
                    getLocationVietNam: _getLocationVietNam
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
let showAllDetailIMS = async (req, res) => {
    const token = req.headers.token;
    getId = req.params.id;
    getAllDetailIMS = '';
    checkgetId = await DetailManagerISM.find({ area_id: getId }).count();
    if (checkgetId > 0) {
        getAllDetailIMS = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await DetailManagerISM.find({ area_id: getId }));
    }
    else {
        getAllDetailIMS = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await DetailManagerISM.find());
    }

    if (getAllDetailIMS) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: getAllDetailIMS,
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
module.exports = {
    LocationReportIMS: LocationReportIMS,
    YearReportIMS: YearReportIMS,
    HeadersReportIMS: HeadersReportIMS,
    showAllDetailIMS: showAllDetailIMS,
}