const AwdTube = require('../../models/cm/awd_tube');
const Gateway = require('../../models/cm/gateway');
const cryptJSon = require('../../../helper/cryptJSon');
const configCrypt = require('../../../../config/cryptJson');
const { ObjectId } = require('mongodb');
const { ListbySearch } = require('../IMS/ManagerIMSController');
let index = async (req, res) => {
    try {      
     const token = req.headers.token;
     getAwdTube='';
     const getAwdTubeName=req.body.awdTube_name||null;   
     const getGatewayCode=req.body.gateway_code||null;    
     const getAwdTubeType=req.body.awdTube_type||null;    
     const getAwdTubeStatus=req.body.awdTube_status||null;   
    selectGateway= await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await Gateway.find());   
       const pipeline =[
        {
            $addFields: {
                gateway_id: {
                    $toObjectId: "$gateway_id"
                }
            }
        },
        {
            $lookup: {
                from: "gateways",
                localField: "gateway_id",
                foreignField: "_id",
                as: "getData"
            }
        },
    ]
    if((getAwdTubeName===null)&&(getGatewayCode===null)&&(getAwdTubeType===null)&&(getAwdTubeStatus===null))
    {
        getAwdTube=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await AwdTube.aggregate(pipeline));   
    }
     else
     {
        if (getAwdTubeName) {
            pipeline.push(
                {
                    $match: {                                      
                        awdTube_name: { $regex: String(getAwdTubeName), $options: "i" } ,                                       
                        }
                },
                 );
          }
          if (getGatewayCode) {
            pipeline.push(
                {
                    $match: {                                      
                        "getData.gateway_code": { $regex: String(getGatewayCode), $options: "i" } ,                                       
                        }
                },
                 );
          }
            if (getAwdTubeType) {               
                pipeline.push(
                    {
                        $match: {                                      
                            awdTube_type: { $regex: String(getAwdTubeType), $options: "i" } ,                                       
                            }
                    },
                    );
            }
          if (getAwdTubeStatus) {            
            pipeline.push(
                {
                    $match: {                                      
                        active_status: { $regex: String(getAwdTubeStatus), $options: "i" } ,                           
                        }
                },
                 );
          }
          getAwdTube=await cryptJSon.encryptData(token,configCrypt.encryptionEnabled,await AwdTube.aggregate(pipeline));   
     }
     if (getAwdTube) {
        res.json({
            status: 200,
            message: 'Get Data Completed',
            data: getAwdTube,selectGateway
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
        
        const getAwdTube = new AwdTube(req.body);
        let getData = await getAwdTube.save();       
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
        console.log(id);
        req.body.updated = new Date();
        getAwdTube = await AwdTube.findByIdAndUpdate(id, { $set: req.body });
        if (getAwdTube) {
            getNewData = await AwdTube.findOne({ _id: id });
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
        getId = await AwdTube.findByIdAndRemove({ _id: id });
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