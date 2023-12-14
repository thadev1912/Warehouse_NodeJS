const logger = require('./logger'); 
const logStore=async(getInfoUser,req)=>
{  
   return await logger.customerLogger.info({message: getInfoUser.user +' has been store on '+req.route.path,router_name: req.route.path,user_by:getInfoUser.user});
}
const logUpdate=async(getInfoUser,req)=>
{  
   return await logger.customerLogger.info({message: getInfoUser.user +' has been update on '+req.route.path,router_name: req.route.path,user_by:getInfoUser.user});
}
const logDelete=async(getInfoUser,req)=>
{  
   return await logger.customerLogger.info({message: getInfoUser.user +' has been delete on '+req.route.path,router_name: req.route.path,user_by:getInfoUser.user});
}
const logAprrove=async(getInfoUser,req)=>
{  
   return await logger.customerLogger.info({message: getInfoUser.user +' has been approve on '+req.route.path,router_name: req.route.path,user_by:getInfoUser.user});
}
const logOrder=async(getInfoUser,req)=>
{  
   return await logger.customerLogger.info({message: getInfoUser.user +' has been order on '+req.route.path,router_name: req.route.path,user_by:getInfoUser.user});
}
const logCancel=async(getInfoUser,req)=>
{  
   return await logger.customerLogger.info({message: getInfoUser.user +' has been cancel on '+req.route.path,router_name: req.route.path,user_by:getInfoUser.user});
}
module.exports ={
    logStore,
    logUpdate,
    logDelete,
    logAprrove,
    logOrder,
    logCancel,

}