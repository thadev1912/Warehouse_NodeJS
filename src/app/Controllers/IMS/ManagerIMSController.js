
const ManagerISM = require('../../models/ims/manager_ims');
const { paginate } = require('../../../helper/pagination');
let index = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; 
        limit=10;
        totalCount=await ManagerISM.find({}).count();
        const totalPages = Math.ceil(totalCount / limit);        
        const currentPage = Math.min(Math.max(page, 1), totalPages);  
        getData=await ManagerISM.find({}).skip((currentPage - 1) * limit).limit(limit);    
        if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
            data:getData,
            total:totalCount,   // tổng số record
            PageSize:totalPages,   //tổng số trang được chia
            CurrentPage:page,  //trang hiện tại         
          
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
let testPaginate = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;        
        const result =await  paginate(ManagerISM.find(), page,100);
        if (getData) {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
            data:getData,
            // total:totalCount,   // tổng số record
            // PageSize:totalPages,   //tổng số trang được chia
            // CurrentPage:page,  //trang hiện tại         
          
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
let store =async(req,res)=>
{
    try{
        const getManagerISM = new ManagerISM(req.body);   
        let getData = await getManagerISM.save();       
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
            });
        }
        else
        {
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
            throw new Error('Error connecting Database on Server');
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
            throw new Error('Error connecting Database on Server');
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
module.exports =
{
    index: index,   
    store:store,
    update:update,
    destroy:destroy,
    testPaginate:testPaginate,
}