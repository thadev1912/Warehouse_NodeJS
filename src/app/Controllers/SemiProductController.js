const SemiProduct = require('../models/semi_product');
const SimPackage = require('../models/sim_packages');
const CategoriesSim = require('../models/categories_sim');

let index = async (req, res) => {
    try {
        let getSimPackage = await SimPackage.find({});
        let getCategoriesSim = await CategoriesSim.find({ use_sim: '0' });
       // let getData = await SemiProduct.find({});  
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
                    localField: "categories_sim_id",
                    foreignField: "_id",
                    as: "category"
                }
            },
          
    
        ]);
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getData, getSimPackage, getCategoriesSim
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

let create = async (req, res) => {
    try {
        console.log('giá trị golabal',req.body);
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
            throw new Error('Error connecting Database on Server');
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }
}

let edit = async (req, res) => {
    try {
       
        id = req.query.id;       
       
        getId = await SemiProduct.findOne({ _id: id });
       // console.log(getId);       
                if (getId) {           
            return res.status(200).json({
                success: true, message: 'Infomation Field need to edit!!', data: getId,
            });
        }
        else {
            throw new Error('Error connecting Database on Server');

        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }

}

const update = async (req, res) => {
    try {
        // Lấy dữ liệu từ yêu cầu
        const id = req.params.id;
        const newSemiProductData = req.body;
        const oldSemiProductId = newSemiProductData.old_semi_product_id;        
        const newCategoriesSimId = newSemiProductData.categories_sim_id;
        console.log('Id sim cũ',newCategoriesSimId)
        // Cập nhật thông tin của mục SemiProduct
        const updatedSemiProduct = await SemiProduct.findByIdAndUpdate(id, { $set: newSemiProductData }, { new: true });
        if (!updatedSemiProduct) {
            throw new Error('Mục không tồn tại hoặc có lỗi khi cập nhật.');
        }
        // Xác định và xóa thông tin cũ trong CategoriesSim nếu có
        if (oldSemiProductId) {
            console.log('Id bán thành phẩm cũ',oldSemiProductId)
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
        // Cập nhật hoặc tạo thông tin mới trong CategoriesSim
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
                throw new Error('Lỗi khi cập nhật hoặc tạo CategoriesSim.');
            }
        }
        // Trả về dữ liệu đã cập nhật
        const updatedSemiProductData = await SemiProduct.findOne({ _id: id });
        return res.status(200).json({
            success: true,
            data: updatedSemiProductData,
            message: 'Thông tin đã được cập nhật!!!'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
}
const destroy = async (req, res) => {
    try {
        let id = req.query.id;
        console.log(id);
        // Tìm semi_product cần xóa
        const semiProduct = await SemiProduct.findById(id)
;

        if (!semiProduct) {
            return res.status(404).json({
                success: false,
                message: 'Semi Product not found'
            });
        }
        //Xác định sim liên kết với semi_product
        const simId = semiProduct.categories_sim_id;
        if (simId) {
            // Xóa liên kết semi_product từ sim
            await CategoriesSim.findByIdAndRemove(simId, { semi_product_id: id });
        }     
        // Xóa semi_product
        await SemiProduct.findByIdAndRemove(id);   
        return res.status(200).json({
            success: true,
            message: 'Semi Product and associated Sim have been deleted'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
};
let destroy1 = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await SemiProduct.findByIdAndRemove({ _id: id });
        if (getId) {

            return res.status(200).json({
                success: true, message: 'This field has been removed!!!',
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

module.exports = {
    index: index,
    create: create,
    edit: edit,
    update: update,
    destroy: destroy,
    destroy1: destroy1,
}