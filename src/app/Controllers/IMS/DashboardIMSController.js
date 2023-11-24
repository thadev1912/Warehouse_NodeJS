
const ManagerISM = require('../../models/ims/manager_ims');
const DetailProductOrder = require('../../models/ims/detail_mangager_ims');
let LocationReportIMS = async (req, res) => {
    try {
        gettotalCount = await ManagerISM.aggregate([          
            {
                $group: {
                    _id: null,
                    totalInstalled: { $sum: { $toInt: "$installed" } },
                    totalNextPhase: { $sum: { $toInt: "$next_phase" } },
                }
            },         
        ]);        
        getData = await ManagerISM.aggregate([
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
        if ((getData)&&(gettotalCount)) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: {getTotal:{totalInstalled:gettotalCount[0].totalInstalled,totalNextPhase:gettotalCount[0].totalNextPhase},getData},
                //getCount: gettotalCount
            });
        } else {
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
let YearReportIMS =async(req,res)=>
{
    try {
    //Sum by Year
    getTotalInstalledSumbyYear = await DetailProductOrder.aggregate([
       
       {
         $group: {
            _id: { $year: "$installtion_date" }, 
            SumbyYear: {
              $sum: { $toInt: "$active_status" } 
            }
          }
        },
        {
            $sort: {
                "_id": 1 
            }
        }  
       
    ]);    
    //Sum all Installed
    getTotalInstalled = await DetailProductOrder.aggregate([
        {
            $group: {                          
                _id: null,
                qty:{                 
                     $sum: { $toInt: "$active_status" } 
                }              
            }
          }        ]);    
 //Sum all Next phase
 getTotalNextPhase = await ManagerISM.aggregate([
    {
        $group: {                          
            _id: null,
            qty:{                 
                 $sum: { $toInt: "$next_phase" } 
            }              
        }
      }    
]); 
if((getTotalInstalledSumbyYear) &&(getTotalInstalled) &&(getTotalNextPhase)) {
    res.json({
        status: 200,
        message: 'Get Data Completed!!',
        data: {getTotal:{
            totalInstalledByYear:getTotalInstalledSumbyYear,
            SumInstalled:getTotalInstalled[0].qty,
            totalNextPhase:getTotalNextPhase[0].qty
              }},       
      
    });
} else {
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

module.exports = {
    LocationReportIMS: LocationReportIMS,
    YearReportIMS:YearReportIMS
}