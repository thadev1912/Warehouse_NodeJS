
const ManagerISM = require('../../models/ims/manager_ims');
const DetailManagerISM = require('../../models/ims/detail_mangager_ims');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
let LocationReportIMS = async (req, res) => {
    try {
        const token = req.headers.token; 
        gettotalCount =await ManagerISM.aggregate([          
            {
                $group: {
                    _id: null,
                    totalInstalled: { $sum: { $toInt: "$installed" } },
                    totalNextPhase: { $sum: { $toInt: "$next_phase" } },
                }
            },         
        ]); 
      
        _totalInstalled=gettotalCount?.[0]?.totalInstalled ?? 0; 
         _totalNextPhase=gettotalCount?.[0]?.totalNextPhase ?? 0; 
        getData =await ManagerISM.aggregate([
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
               data: {getTotal:{
                                  totalInstalled:_totalInstalled,
                                  totalNextPhase:_totalNextPhase
                               },
                      getData},         
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
let YearReportIMS =async(req,res)=>
{
    try {
    const token = req.headers.token; 
    //Sum by Year
    getTotalInstalledSumbyYear =await DetailManagerISM.aggregate([       
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
 getTotalInstalled =await DetailManagerISM.aggregate([
    {
        $group: {                          
            _id: null,
            qty:{                 
                 $sum: { $toInt: "$active_status" } 
            }              
        }
      }        ]);    
      _SumInstalled = getTotalInstalled?.[0]?.qty ?? 0;
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
_totalNextPhase = getTotalNextPhase?.[0]?.qty ?? 0;
 if((getTotalInstalledSumbyYear) &&(getTotalInstalled) &&(getTotalNextPhase)) {
    res.json({
        status: 200,
        message: 'Get Data Completed!!',
        data: {getTotal:{
            totalInstalledByYear:getTotalInstalledSumbyYear,          
            SumInstalled:_SumInstalled,
            totalNextPhase:_totalNextPhase
              }},       
      
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
let HeadersReportIMS =async (req,res)=>
{
   //res.json('bạn gọi tôi à!!!');
   //Sum all Installed
   getTotalInstalled =await ManagerISM.aggregate([
    {
        $group: {                          
            _id: null,
            qty:{                 
                 $sum: { $toInt: "$installed" } 
            }              
        }
      }        ]);    
      _SumInstalled = getTotalInstalled?.[0]?.qty ?? 0;
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
_totalNextPhase = getTotalNextPhase?.[0]?.qty ?? 0;
// Location in International
getLocationJaPan = await ManagerISM.aggregate([
    {
        $match:{
            location_area:'JP'
        }
      },
    {
        $group: {                          
            _id: null,
            qty:{                 
                 $sum: { $toInt: "$installed" } 
            }              
        }
      },
    ]);     
    _getLocationJaPan = getLocationJaPan?.[0]?.qty ?? 0;
// Location in VietNam
getLocationVietNam = await ManagerISM.aggregate([
    {
        $match:{
            location_area:'VN'
        }
      },
    {
        $group: {                          
            _id: null,
            qty:{                 
                 $sum: { $toInt: "$installed" } 
            }              
        }
      },
    ]);     
    _getLocationVietNam = getLocationVietNam?.[0]?.qty ?? 0;
if((getTotalInstalled) &&(getTotalNextPhase)) {
    res.json({
        status: 200,
        message: 'Get Data Completed!!',
        data: {getTotal:{              
            SumInstalled:_SumInstalled,
            totalNextPhase:_totalNextPhase,
            getLocationJaPan:_getLocationJaPan,
            getLocationVietNam: _getLocationVietNam
              }},    
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
let showAllDetailIMS =async(req,res)=>
{
    console.log(req.body);
   getId=req.params.id;   
   getAllDetailIMS='';
   checkgetId=await DetailManagerISM.find({area_id:getId}).count();   
   if(checkgetId>0) 
   {
    getAllDetailIMS= await DetailManagerISM.find({area_id:getId});
   }
  else
  {
    getAllDetailIMS= await DetailManagerISM.find();   
  }
     
   if(getAllDetailIMS)  {
    res.json({
        status: 200,
        message: 'Get Data Completed!!',
        data: getAllDetailIMS,    
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
module.exports = {
    LocationReportIMS: LocationReportIMS,
    YearReportIMS:YearReportIMS,
    HeadersReportIMS:HeadersReportIMS,
    showAllDetailIMS:showAllDetailIMS,
}