const Gateway = require('../../models/cm/gateway');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
const { ObjectId } = require('mongodb');
let index = async (req, res) => {
    try {
     const token = req.headers.token;
    // getGateway=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await Gateway.find());
    getGateway='';    
    const getGatewayCode=req.body.gateway_code||null;    
    const getGatewayType=req.body.gateway_type||null;  
    const getGatewayStatus=req.body.gateway_status||null;    
    console.log(getGatewayType);
    const pipeline=[
        {
            $match: {} 
        }
       
    ];
     if((getGatewayCode===null)&&(getGatewayType===null)&&(getGatewayStatus===null))
     {
        getGateway =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await Gateway.aggregate(pipeline));
     }
     else
     {
        if (getGatewayCode) {
            pipeline.push(
                {
                    $match: {                                      
                        gateway_code: { $regex: String(getGatewayCode), $options: "i" } ,                                       
                        }
                },
                 );
          }
          if (getGatewayType) {
            pipeline.push(
                {
                    $match: {                                      
                        gateway_type: { $regex: String(getGatewayType), $options: "i" } ,                                       
                        }
                },
                 );
          }
          if (getGatewayStatus) {
            pipeline.push(
                {
                    $match: {                                      
                        gateway_status: { $regex: String(getGatewayStatus), $options: "i" } ,                                       
                        }
                },
                 );
          }
          getGateway =await cryptJSon.encryptData(token,configCrypt.encryptionEnabled, await Gateway.aggregate(pipeline));
     }   
     if (getGateway) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: getGateway
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

let store = async (req, res) => {
    try {
        const getGateway = new Gateway(req.body);
        let getData = await getGateway.save();
        console.log()
        if (getData) {
            res.json({
                status: 200,
                messege: 'Add new field comleted',
                //data: getData,
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

let edit = async (req, res) => {
    try {
        res.json("bạn gọi tôi à")
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
        getGateway = await Gateway.findByIdAndUpdate(id, { $set: req.body });
        if (getGateway) {
            getNewData = await Gateway.findOne({ _id: id });
            res.json({
                status: 200,
                success: true, data: getNewData, message: 'Infomation field has been updated'
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
let destroy = async (req, res) => {
    try {
        console.log(req.query.id);
        let id =new ObjectId (req.query.id);
        getId = await Gateway.findByIdAndRemove({ _id: id });
        if (getId) {
            res.json({
                status: 200,
                success: true, message: 'This field has been removed',
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
module.exports =
{
    index: index,   
    store: store,
    update: update,
    destroy: destroy,
    edit: edit,
}