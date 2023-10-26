
const CategoriesSim = require('../models/categories_sim');
const SemiProduct = require('../models/semi_product');
//const SimPackage = require('../models/sim_packages');
//Lấy danh sách phòng ban
let index = async (req, res) => {
    try {      
        let getSemiProduct = await CategoriesSim.aggregate([
            {
                $addFields: {
                    semi_product_id: {
                        $toObjectId: "$semi_product_id"
                    },
                    sim_package_id: {
                        $toObjectId: "$sim_package_id"
                    }
                }
            },
            {
                $lookup: {
                    from: "semi_products",
                    localField: "semi_product_id",
                    foreignField: "_id",
                    as: "semi_products"
                }
            },
            {
                $lookup: {
                    from: "sim-packages",
                    localField: "sim_package_id",
                    foreignField: "_id",
                    as: "sim_package"
                }
            },
          
    
        ]);
        if (getSemiProduct) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                data: getSemiProduct,
            });
        } else {
            throw new Error('Error connecting Database on Server');
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, error: err.message });
    }   
}

let create = async (req, res) => {
    try {
        const getCategoriesSim = new CategoriesSim(req.body);
        getCategoriesSim.use_sim = '0';
        checkId = await CategoriesSim.find({ serial_sim: req.body.serial_sim }).count();
        if (checkId > 0) {
            return res.status(200).json({
                success: true, message: 'This ID exits!!',
            });
        }

        let getData = await getCategoriesSim.save();
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
        getId = await CategoriesSim.findOne({ _id: id });
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

let update = async (req, res) => {
    try {
        let id = req.params.id;
        getData = await CategoriesSim.findByIdAndUpdate(id, { $set: req.body })
        if (getData) {
            getNewData = await CategoriesSim.findOne({ _id: id });
            return res.status(200).json({
                success: true, data: getNewData, message: 'Infomation field has been updated !!'
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
const destroy = async (req, res) => {
    try {
        const id = req.query.id;

        // Kiểm tra xem có liên kết với semi_product không
        const semiProductCount = await SemiProduct.countDocuments({ categories_sim_id: id });

        if (semiProductCount > 0) {
            // Nếu có liên kết, không thực hiện xóa
            return res.status(400).json({
                success: false,
                message: 'Cannot delete Categories Sim as it is linked to Semi Products'
            });
        }

        // Nếu không có liên kết, thực hiện xóa
        await CategoriesSim.findByIdAndRemove(id)
        return res.status(200).json({
            success: true,
            message: 'Categories Sim has been deleted'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            success: false,
            error: err.message
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