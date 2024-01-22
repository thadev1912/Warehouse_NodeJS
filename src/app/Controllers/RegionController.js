
const Region = require('../models/region');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
const setLogger = require('../../helper/setLogger');
const { paginate1 } = require('../../helper/pagination');
let index = async (req, res) => {
    try {
        const token = req.headers.token;
        let _getData = await Region.find({}).sort({created: -1});
        getData = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, _getData);
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: getData,
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
let index1 = async (req, res) => {
    try {
        const token = req.headers.token;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const query = {};
        const result = await paginate1(Region, query, page, limit, false, {}, token);
        const { getData, totalPages, currentPage, pageSize, totalCount } = result;
        ///getData= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,_getData);  
        if (getData) {
            res.json({
                status: 200,
                message: 'Get Data Completed',
                data: getData,
                totalPages,
                currentPage,
                pageSize,
                totalCount
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
let create = async (req, res) => {
    try {
        const getRegion = new Region(req.body);
        checkId = await Region.find({ region_code: req.body.region_code }).count();
        if (checkId > 0) {
            return res.json({
                status: 200,
                success: true, message: 'This ID exits',
            });
        }
        let getData = await getRegion.save();
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted',
                //data: getData,
            });
            setLogger.logStore(getInfoUser, req);
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

let edit = async (req, res) => {
    try {
        id = req.query.id;
        getId = await Region.find({ _id: id });
        if (getId) {
            return res.json({
                status: 200,
                success: true, message: 'Infomation Field need to edit', data: getId,
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

let update = async (req, res) => {
    try {
        let id = req.params.id;
        req.body.updated = new Date();
        getData = await Region.findByIdAndUpdate(id, { $set: req.body });
        if (getData) {
            getNewData = await Region.findOne({ _id: id });
            res.json({
                status: 200,
                success: true, data: getNewData, message: 'Infomation field has been updated'
            });
            setLogger.logUpdate(getInfoUser, req);
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
let destroy = async (req, res) => {
    try {
        let id = req.query.id;
        getId = await Region.findByIdAndRemove({ _id: id });
        if (getId) {
            res.json({
                status: 200,
                success: true, message: 'This field has been removed',
            });
            setLogger.logDelete(getInfoUser, req);
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
module.exports =
{
    index: index,
    index1: index1,
    create: create,
    update: update,
    destroy: destroy,
    edit: edit,
}