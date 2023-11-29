const SemiProduct = require('../models/semi_product');
const SimPackage = require('../models/sim_packages');
const CategoriesSim = require('../models/categories_sim');

let index = async (req, res) => {
    try {
        let getSimPackage = await SimPackage.find({});
        let getCategoriesSim = await CategoriesSim.find({ use_sim: '0' });    
        // let getData = await SemiProduct.aggregate([
        //     {
        //         $addFields: {
        //             categories_sim_id: {
        //                 $toObjectId: "$categories_sim_id"
        //             }
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "categories_sims",                    
        //             localField: "categories_sim_id",
        //             foreignField: "_id",
        //             pipeline:[
        //                 {
        //                     $addFields: {                                
        //                         sim_package_id: { $toObjectId: "$sim_package_id" }
        //                     },                                       
        //                 },
        //                 {
        //                     $lookup: {
        //                         from: "sim-packages",
        //                         localField: "sim_package_id",
        //                         foreignField: "_id",
        //                         as: "SimpackageInfo",
        //                     },
        //                 }, 
        //             ],
        //             as: "category"
        //         }
        //     },
        //                 {$match:{semi_product_status:'9'}}
    
        // ]);    
        let getData = await SemiProduct.aggregate([
            {
                $addFields: {
                    categories_sim_id: {
                        $toObjectId: "$categories_sim_id"
                    }
                }
            },
            {
                $lookup: {
                    from: "categories_sims",                    
                   // localField: "categories_sim_id",
                    //foreignField: "_id",
                    let:{categories:'$categories_sim_id'},
                    pipeline:[
                       
                        {
                            $match:{
                            $expr:                             
                            { $eq: ["$_id", "$$categories"] }
                            }
                             
                        }
                    ,
                        {
                            $addFields: {                                
                                sim_package_id: { $toObjectId: "$sim_package_id" }
                            },                                       
                        },
                        {
                            $lookup: {
                                from: "sim-packages",
                                localField: "sim_package_id",
                                foreignField: "_id",                                
                                as: "SimpackageInfo",
                            },
                        }, 
                    ],
                    as: "category"
                }
            },
                        {$match:{semi_product_status:'9'}}
    
        ]);
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData, getSimPackage, getCategoriesSim
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
let create = async (req, res) => {
    try {  
        console.log(req.body);      
        const getSemiProduct = new SemiProduct(req.body);
        console.log(getSemiProduct._id.toString());
        getNha=getSemiProduct._id.toString();
        let getIdSim = req.body.categories_sim_id;
        PassInfo = new CategoriesSim({
            _id: req.body.categories_sim_id,
            board_name: req.body.semi_product_name,
            board_lot_number: req.body.semi_product_unit,
            activation_date: req.body.activation_date,
            purpose: req.body.purpose,
            sim_package_id: req.body.sim_package_id,
            expiration_date:req.body.expiration_date,
            semi_product_id:getNha,  
            semi_product_used:'0',          
        })
       
        console.log(PassInfo);        
        updateData = await CategoriesSim.findByIdAndUpdate(getIdSim, { $set: PassInfo, use_sim: '1' });
        let getData = await getSemiProduct.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted!!!',
                data: getData,
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

let edit = async (req, res) => {
    try {
       
        id = req.query.id;      
        getId = await SemiProduct.findOne({ _id: id });              
                if (getId) {           
            return res.json({
                status:200,
                success: true, message: 'Infomation Field need to edit!!', data: getId,
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
const update = async (req, res) => {
    try {       
        const id = req.params.id;
        const newSemiProductData = req.body;
        const oldSemiProductId = newSemiProductData.old_semi_product_id;        
        const newCategoriesSimId = newSemiProductData.categories_sim_id;     
        const updatedSemiProduct = await SemiProduct.findByIdAndUpdate(id, { $set: newSemiProductData }, { new: true });
        if (!updatedSemiProduct) {
           // throw new Error('Mục không tồn tại hoặc có lỗi khi cập nhật.');
           return res.json({
            status:404,
            success: false,                
            message: 'No Exits'
        });
        
        }      
        if (oldSemiProductId) {            
            const categoriesSimToUpdate = await CategoriesSim.findOne({ semi_product_id: oldSemiProductId });
            console.log('giá trị thông tin sim cũ',categoriesSimToUpdate);
            if (categoriesSimToUpdate) {
                const clearOldData = {                    
                    activation_date: '',
                    purpose: '',
                    sim_package_id: '',
                    expiration_date: '',
                    semi_product_id:'',
                };
                await CategoriesSim.findByIdAndUpdate(categoriesSimToUpdate._id, { use_sim: '0', $set: clearOldData });
            }
        }       
        if (newCategoriesSimId) {
            const categoriesSimData = {
                _id: newCategoriesSimId,               
                activation_date: newSemiProductData.activation_date,
                purpose: newSemiProductData.purpose,
                sim_package_id: newSemiProductData.sim_package_id,
                expiration_date: newSemiProductData.expiration_date,
                semi_product_id:oldSemiProductId.toString(),
            };
            const updatedCategoriesSim = await CategoriesSim.findByIdAndUpdate(newCategoriesSimId, { use_sim: '1', $set: categoriesSimData });
            if (!updatedCategoriesSim) {
                return res.json({
                    status:500,
                    success: false,                
                    message: 'Error connecting Database on Server'
                });
            }
        }       
        const updatedSemiProductData = await SemiProduct.findOne({ _id: id });
        return res.json({
            status:200,
            success: true,
            data: updatedSemiProductData,
            message: 'Thông tin đã được cập nhật!!!'
        });
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
const destroy = async (req, res) => {
    try {
        let id = req.query.id;
        console.log(id);       
        const semiProduct = await SemiProduct.findById(id);
        if (!semiProduct) {
            return res.json({
                status:404,
                success: false,
                message: 'Semi Product not found'
            });
        }       
        const simId = semiProduct.categories_sim_id;
        if (simId) {            
            await CategoriesSim.findByIdAndRemove(simId, { semi_product_id: id });
        } 
       
        await SemiProduct.findByIdAndRemove(id);   
        return res.json({
            status:200,
            success: true,
            message: 'Semi Product and associated Sim have been deleted'
        });
    }
    catch (err) {
        console.log(err);
        return res.json({
            status:500,
            success: false,           
            error: err.message,
        });      
    }
};
module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
   
}