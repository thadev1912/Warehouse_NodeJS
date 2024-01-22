const JobSheet = require('../models/jobsheet');
const ProductOrder = require('../models/product_order');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const cryptJSon = require('../../helper/cryptJSon');
const configCrypt = require('../../../config/cryptJson');
let HeaderReport = async (req, res) => {
  try {

    const token = req.headers.token;
    //Jobsheet
    let quantityJobSheet = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.find().count());
    let ProcessingJobSheet = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.find({ jobsheet_status: '4' }).count());
    let CompletedJobSheet = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.find({ jobsheet_status: '2' }).count());
    let CancelJobSheet = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.find({ jobsheet_status: '6' }).count());
    //ProductOrder
    let quantityProductOrder = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductOrder.find().count());
    let acceptProductOrder = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductOrder.find({ production_order_status: 1 }).count());
    let cancelProductOrder = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductOrder.find({ production_order_status: 2 }).count());
    //Product       
    let QuantityProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.find().count());
    let CancelProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.find({ product_status: '10' }).count());
    let ProcessingProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.find({ product_status: '4' }).count());
    let CompletedProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.find({ product_status: '9' }).count());
    let PassProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.find({ product_result: '1' }).count());
    let FailProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.find({ product_result: '0' }).count());
    //SemiProduct      
    let QuantitySemiProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.find().count());
    let CancelSemiProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.find({ semi_product_status: '10' }).count());
    let ProcessingSemiProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.find({ semi_product_status: '4' }).count());
    let CompletedSemiProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.find({ semi_product_status: '9' }).count());
    let PassSemiProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.find({ semi_product_result: '1' }).count());
    let FailSemiProduct = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.find({ semi_product_result: '0' }).count());
    // get Total Jobsheet by Year
    getTotalJobsheetByYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([
      {
        $project: {
          year: { $year: "$jobsheet_create_date" },
          jobsheet_code: 1,
          completedJobSheet: { $eq: ["$jobsheet_status", "2"] },  
        }
      },
      {
        $group: {
          _id: "$year",
          totalJobsheetByYear: { $sum: 1 },
          completedJobSheet: { $sum: { $cond: [{ $eq: ["$completedJobSheet", true] }, 1, 0] } },

        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));  
     // get Total ProducerOrder by Year 
     getTotalProductOrderByYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductOrder.aggregate([
      {
        $addFields: {
          production_order_create: { $toDate: "$production_order_create" }
        }
      },
      {
        $project: {
          year: { $year: "$production_order_create" },
          product_order_No: 1,
          acceptProductOrder: { $eq: ["$production_order_status", "1"] }, 
        }
      },
      {
        $group: {
          _id: "$year",
          totalProductOrder: { $sum: 1 },
          acceptProductOrder: { $sum: { $cond: [{ $eq: ["$acceptProductOrder", true] }, 1, 0] } },
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
 // get Total SemiProduct by Year 
 getTotalSemiProductByYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await SemiProduct.aggregate([
  {
    $lookup: {
      from: "jobsheets",
      localField: "jobsheet_code",
      foreignField: "jobsheet_code",
      as: "jobSheetData"
    }
  },
  {
    $unwind: "$jobSheetData"
  },
  {
    $project: {
      year: { $year: "$jobSheetData.jobsheet_create_date" },
      product_code: 1,
      completedSemiProduct:{ $eq: ["$semi_product_status","9"] }, 
    }
  },
  {
    $group: {
      _id: "$year",
      totalSemiProduct: { $sum: 1 },
      completedSemiProduct:{ $sum: { $cond: [{ $eq: ["$completedSemiProduct", true] }, 1, 0] } },
    }
  },
  {
    $sort: { _id: 1 }
  }
]));
getTotalProductByYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await Product.aggregate([
  {
    $lookup: {
      from: "jobsheets",
      localField: "jobsheet_code",
      foreignField: "jobsheet_code",
      as: "jobSheetData"
    }
  },
  {
    $unwind: "$jobSheetData"
  },
  {
    $project: {
      year: { $year: "$jobSheetData.jobsheet_create_date" },
      product_code: 1,
      completedProduct:{ $eq: ["$product_status","9"] }, 
    }
  },
  {
    $group: {
      _id: "$year",
      totalProduct: { $sum: 1 },
      completedProduct:{ $sum: { $cond: [{ $eq: ["$completedProduct", true] }, 1, 0] } },
    }
  },
  {
    $sort: { _id: 1 }
  }
]));
    res.json({
      status: 200,
      message: 'Get Data Completed',
      // infoJobSheet,selectDayJobSheet,
      JobSheet: { quantityJobSheet, ProcessingJobSheet, CompletedJobSheet, CancelJobSheet,getTotalJobsheetByYear },
      ProductOrder: { quantityProductOrder, acceptProductOrder, cancelProductOrder, FailProduct,getTotalProductOrderByYear },
      Product: { QuantityProduct, CancelProduct, ProcessingProduct, CompletedProduct, PassProduct, FailProduct,getTotalProductByYear },
      SemiProduct: { QuantitySemiProduct, CancelSemiProduct, ProcessingSemiProduct, CompletedSemiProduct, PassSemiProduct, FailSemiProduct,getTotalSemiProductByYear},
    });
    
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

const totalProductOrderByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getTotal = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductOrder.aggregate([
      {
        $addFields: {
          production_order_create: { $toDate: "$production_order_create" }
        }
      },
      {
        $project: {
          year: { $year: "$production_order_create" },
          product_order_No: 1
        }
      },
      {
        $group: {
          _id: "$year",
          totalProductOrder: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getTotal)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        totalProductOrder: getTotal,
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
const totalJobsheetByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getTotal = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([

      {
        $project: {
          year: { $year: "$jobsheet_create_date" },
          jobsheet_code: 1
        }
      },
      {
        $group: {
          _id: "$year",
          totalJobsheet: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getTotal)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        totalJobsheet: getTotal,
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
const totalProductByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getTotal = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.aggregate([
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $unwind: "$jobSheetData"
      },
      {
        $project: {
          year: { $year: "$jobSheetData.jobsheet_create_date" },
          product_code: 1
        }
      },
      {
        $group: {
          _id: "$year",
          totalProduct: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getTotal)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        totalProduct: getTotal,
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
const totalSemiProductByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getTotal = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await SemiProduct.aggregate([
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $unwind: "$jobSheetData"
      },
      {
        $project: {
          year: { $year: "$jobSheetData.jobsheet_create_date" },
          product_code: 1
        }
      },
      {
        $group: {
          _id: "$year",
          totalSemiProduct: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getTotal)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        totalSemiProduct: getTotal,
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
const listJobsheetByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getListJobsheetsByYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([
      {
        $project: {
          year: { $year: "$jobsheet_create_date" },
          jobsheet_code: 1
        }
      },
      {
        $group: {
          _id: "$year",
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getListJobsheetsByYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getListJobsheetsByYear,
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
const listDetailMonthJobsheetbyYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getYear = req.params.id;
    getlistDetailMonthbyYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([
      {
        $match: {
          jobsheet_create_date: {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $project: {
          month: { $month: "$jobsheet_create_date" }, 
          createNewJobSheet: { $eq: ["$jobsheet_status", "0"] },        
          processingJobSheet: { $eq: ["$jobsheet_status", "1"] },  
          completedJobSheet: { $eq: ["$jobsheet_status", "2"] },  
          cancelJobSheet  : { $eq: ["$jobsheet_status", "3"] }  
        }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
          createNewJobSheet: { $sum: { $cond: [{ $eq: ["$createNewJobSheet", true] }, 1, 0] } },
          processingJobSheet: { $sum: { $cond: [{ $eq: ["$processingJobSheet", true] }, 1, 0] } },
          completedJobSheet: { $sum: { $cond: [{ $eq: ["$completedJobSheet", true] }, 1, 0] } },
          cancelJobSheet: { $sum: { $cond: [{ $eq: ["$cancelJobSheet", true] }, 1, 0] } },
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getlistDetailMonthbyYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailMonthbyYear,
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
const listProductOrderByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getListProductOrderByYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await ProductOrder.aggregate([
      {
        $addFields: {
          production_order_create: { $toDate: "$production_order_create" }
        }
      },
      {
        $project: {
          year: { $year: "$production_order_create" },
          product_order_No: 1
        }
      },
      {
        $group: {
          _id: "$year",
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getListProductOrderByYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getListProductOrderByYear,
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
const listDetailMonthProductOrderbyYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getYear = req.params.id;
    getlistDetailMonthProductOrderbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await ProductOrder.aggregate([
      {
        $addFields: {
          production_order_create: { $toDate: "$production_order_create" },         
        }
      },
      {
        $match: {
          production_order_create: {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $project: {
          month: { $month: "$production_order_create" }, 
          createNewProductOrder: { $eq: ["$production_order_status", "0"] }, 
          acceptProductOrder: { $eq: ["$production_order_status", "1"] }, 
          cancelProductOrder: { $eq: ["$production_order_status", "2"] },  
                
      }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },  
          createNewProductOrder: { $sum: { $cond: [{ $eq: ["$createNewProductOrder", true] }, 1, 0] } },
          acceptProductOrder: { $sum: { $cond: [{ $eq: ["$acceptProductOrder", true] }, 1, 0] } },
          cancelProductOrder: { $sum: { $cond: [{ $eq: ["$cancelProductOrder", true] }, 1, 0] } }        
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
        
    if ((getlistDetailMonthProductOrderbyYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailMonthProductOrderbyYear,
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

const listSemiProductByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getListSemiProductByYear = await SemiProduct.aggregate([
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $unwind: "$jobSheetData"
      },
      {
        $project: {
          year: { $year: "$jobSheetData.jobsheet_create_date" },
         
        }
      },
      {
        $group: {
          _id: "$year",         
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    if ((getListSemiProductByYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getListSemiProductByYear,
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
const listDetailMonthSemiProductbyYear =async(req,res)=>
{
  try {
    const token = req.headers.token;     
    getYear=req.params.id;
    getlistDetailMonthSemiProductbyYear = await SemiProduct.aggregate([  
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $match: {
          "jobSheetData.jobsheet_create_date": {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $unwind: "$jobSheetData"
      },     
      {
        $project: {
          month: { $month: "$jobSheetData.jobsheet_create_date" },                  
          passSemiProduct:{ $eq: ["$semi_product_result","1"] }, 
          failSemiProduct:{ $eq: ["$semi_product_result","0"] }, 
        }
      },
      {
        $group: {
          _id: "$month",   
          count: { $sum: 1 },           
          passSemiProduct:{ $sum: { $cond: [{ $eq: ["$passSemiProduct", true] }, 1, 0] } },
          failSemiProduct:{ $sum: { $cond: [{ $eq: ["$failSemiProduct", true] }, 1, 0] } },

        }
      },
      {
        $sort: { _id: 1 }
      },    
    ]);
    if (getlistDetailMonthSemiProductbyYear) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailMonthSemiProductbyYear,
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
const listProductByYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getListProductByYear = await Product.aggregate([
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $unwind: "$jobSheetData"
      },
      {
        $project: {
          year: { $year: "$jobSheetData.jobsheet_create_date" },
         
        }
      },
      {
        $group: {
          _id: "$year",         
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    if ((getListProductByYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getListProductByYear,
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
const listDetailMonthProductbyYear =async(req,res)=>
{
  try {
    const token = req.headers.token;     
    getYear=req.params.id;
    getlistDetailMonthProductbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.aggregate([  
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $match: {
          "jobSheetData.jobsheet_create_date": {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $unwind: "$jobSheetData"
      },     
      {
        $project: {
          month: { $month: "$jobSheetData.jobsheet_create_date" }, 
          passProduct:{ $eq: ["$product_result","1"] }, 
          failProduct:{ $eq: ["$product_result","0"] }, 
        }
      },
      {
        $group: {
          _id: "$month",   
          count: { $sum: 1 },         
          passProduct:{ $sum: { $cond: [{ $eq: ["$passProduct", true] }, 1, 0] } },
          failProduct:{ $sum: { $cond: [{ $eq: ["$failProduct", true] }, 1, 0] } },
   
        }
      },
      {
        $sort: { _id: 1 }
      },    
    ]));
    if (getlistDetailMonthProductbyYear) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailMonthProductbyYear,
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

const listDetailProductOrderbyYear = async (req, res) => {
  try {
    const token = req.headers.token;   
    getlistDetailProductOrderbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await ProductOrder.aggregate([
      {
        $addFields: {
          production_order_create: { $toDate: "$production_order_create" },         
        }
      },      
      {
        $project: {
          year: { $year: "$production_order_create" }, 
          acceptProductOrder: { $eq: ["$production_order_status", "1"] }, 
          cancelProductOrder: { $eq: ["$production_order_status", "2"] },  
                
      }
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },  
          acceptProductOrder: { $sum: { $cond: [{ $eq: ["$acceptProductOrder", true] }, 1, 0] } },
          cancelProductOrder: { $sum: { $cond: [{ $eq: ["$cancelProductOrder", true] }, 1, 0] } }        
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
        
    if ((getlistDetailProductOrderbyYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailProductOrderbyYear,
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
const listDetailJobsheetbyYear = async (req, res) => {
  try {
    const token = req.headers.token;
    getlistDetailJobsheetbyYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([   
      {
        $project: {
          year: { $year: "$jobsheet_create_date" },  
          completedJobSheet: { $eq: ["$jobsheet_status", "5"] },  
          cancelJobSheet  : { $eq: ["$jobsheet_status", "6"] }  
        }
      },
      {
        $group: {
          _id: "$year",
          count: { $sum: 1 },         
          completedJobSheet: { $sum: { $cond: [{ $eq: ["$completedJobSheet", true] }, 1, 0] } },
          cancelJobSheet: { $sum: { $cond: [{ $eq: ["$cancelJobSheet", true] }, 1, 0] } },
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getlistDetailJobsheetbyYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailJobsheetbyYear,
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
const listDetailSemiProductbyYear =async(req,res)=>
{
  try {
    const token = req.headers.token;
    getlistDetailSemiProductbyYear = await SemiProduct.aggregate([  
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $unwind: "$jobSheetData"
      },     
      {
        $project: {
          year: { $year: "$jobSheetData.jobsheet_create_date" },         
          passSemiProduct:{ $eq: ["$semi_product_status","1"] }, 
          failSemiProduct:{ $eq: ["$semi_product_status","1"] }, 
        }
      },
      {
        $group: {
          _id: "$year",   
          count: { $sum: 1 },         
          passSemiProduct:{ $sum: { $cond: [{ $eq: ["$passSemiProduct", true] }, 1, 0] } },
          failSemiProduct:{ $sum: { $cond: [{ $eq: ["$failSemiProduct", true] }, 1, 0] } },
        }
      },
      {
        $sort: { _id: 1 }
      },    
    ]);
    if (getlistDetailSemiProductbyYear) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailSemiProductbyYear,
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
const listDetailProductbyYear =async(req,res)=>
{
  try {
    const token = req.headers.token;     
    getYear=req.params.id;
    getlistDetailProductbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await Product.aggregate([  
      {
        $lookup: {
          from: "jobsheets",
          localField: "jobsheet_code",
          foreignField: "jobsheet_code",
          as: "jobSheetData"
        }
      },
      {
        $match: {
          "jobSheetData.jobsheet_create_date": {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $unwind: "$jobSheetData"
      },     
      {
        $project: {
          year: { $year: "$jobSheetData.jobsheet_create_date" }, 
          passProduct:{ $eq: ["$product_status","1"] }, 
          failProduct:{ $eq: ["$product_status","1"] }, 
        }
      },
      {
        $group: {
          _id: "$year",   
          count: { $sum: 1 },         
          passProduct:{ $sum: { $cond: [{ $eq: ["$passProduct", true] }, 1, 0] } },
          failProduct:{ $sum: { $cond: [{ $eq: ["$failProduct", true] }, 1, 0] } },
   
        }
      },
      {
        $sort: { _id: 1 }
      },    
    ]));
    if (getlistDetailProductbyYear) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailProductbyYear,
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
const listDetailMonthProductOrderTypeByYear =async(req,res)=>
{
  try {
    const token = req.headers.token;
    getYear = req.params.id;
    getlistDetailMonthProductOrderbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,await ProductOrder.aggregate([
      {
        $addFields: {
          production_order_create: { $toDate: "$production_order_create" },         
        }
      },
      {
        $match: {
          production_order_create: {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $project: {
          month: { $month: "$production_order_create" }, 
          totalSemiProduct: { $eq: ["$product_order_type",0] }, 
          totalProduct: { $eq: ["$product_order_type",1] }, 
                
      }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },  
          totalSemiProduct: { $sum: { $cond: [{ $eq: ["$totalSemiProduct", true] }, 1, 0] } },
          totalProduct: { $sum: { $cond: [{ $eq: ["$totalProduct", true] }, 1, 0] } }        
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
        
    if ((getlistDetailMonthProductOrderbyYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailMonthProductOrderbyYear,
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
const listDetailMonthJobsheetTypeByYear =async(req,res)=>
{
  try {
    const token = req.headers.token;
    getYear = req.params.id;
    getlistDetailMonthbyYear = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([
      {
        $match: {
          jobsheet_create_date: {
            $gte: new Date(getYear, 0, 1),
            $lt: new Date(getYear, 12, 1)
          }
        }
      },
      {
        $project: {
          month: { $month: "$jobsheet_create_date" },       
          SemiProduct: { 
            $or:[
              { $eq: ["$product_type_code", "N"] },
              {  $eq: ["$product_type_code", "Q"]}
            ] 
          },
          Product: { 
            $or:[
              { $eq: ["$product_type_code", "P"] },
              {  $eq: ["$product_type_code", "R"]}
            ] 
          },
         // Product: { $eq: ["$product_type_code", "R"] },  
         
        }
      },
      {
        $group: {
          _id: "$month",
          count: { $sum: 1 },
          SemiProduct: { $sum: { $cond: [{ $eq: ["$SemiProduct", true] }, 1, 0] } },
          Product: { $sum: { $cond: [{ $eq: ["$Product", true] }, 1, 0] } },
          
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]));
    if ((getlistDetailMonthbyYear)) {
      res.json({
        status: 200,
        message: 'Get Data Completed',
        getlistDetailMonthbyYear,
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
const listDetailMonthSemiProductTypeByYear =async(req,res)=>

  {
    try {
      const token = req.headers.token;     
      getYear=req.params.id;
      getlistDetailMonthSemiProductbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([ 
        {
           $match:{
            $or:[
              { product_type_code:"N"}, 
              { product_type_code:"S"},  
            ] 
           }
        },      
        {
          $match: {
            jobsheet_create_date: {
              $gte: new Date(getYear, 0, 1),
              $lt: new Date(getYear, 12, 1)
            }
          }
        },        
        {
          $project: {
            month: { $month: "$jobsheet_create_date" },
            RDProduct: {
              $cond: [{ $eq: ["$product_type_code", "N"] }, "$product_quantity", 0]
            },
            SXProduct: {
              $cond: [{ $eq: ["$product_type_code", "S"] }, "$product_quantity", 0]
            }
          }
        },
        {
          $group: {
            _id: "$month",
           // count: { $sum: 1 },
            RDProduct: { $sum: "$RDProduct" },
            SXProduct: { $sum: "$SXProduct" },           
          }
        }, 
        {
          $project: {
            _id: 1,
         //   count: 1,
            RDProduct: 1,
            SXProduct: 1,
            count: { $add: ["$RDProduct", "$SXProduct"] },
          },
        },       
        {
          $sort: { _id: 1 }
        },    
      ]));
      if (getlistDetailMonthSemiProductbyYear) {
        res.json({
          status: 200,
          message: 'Get Data Completed',
          getlistDetailMonthSemiProductbyYear,
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
const listDetailMonthProductTypeByYear =async(req,res)=>

  {
    try {
      const token = req.headers.token;     
      getYear=req.params.id;
      getlistDetailMonthProductbyYear =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await JobSheet.aggregate([ 
        {
           $match:{
            $or:[
              { product_type_code:"P"},  //select Product
              { product_type_code:"R"},  //select Product
            ] 
           }
        },      
        {
          $match: {
            jobsheet_create_date: {
              $gte: new Date(getYear, 0, 1),
              $lt: new Date(getYear, 12, 1)
            }
          }
        },        
        {
          $project: {
            month: { $month: "$jobsheet_create_date" },          
            RDProduct: {
              $cond: [{ $eq: ["$product_type_code", "R"] }, "$product_quantity", 0]
            },
            SXProduct: {
              $cond: [{ $eq: ["$product_type_code", "P"] }, "$product_quantity", 0]
            }
          }
        },
        {
          $group: {
            _id: "$month",          
           // count: { $sum: 1 },
            RDProduct: { $sum: "$RDProduct" },
            SXProduct: { $sum: "$SXProduct" }
          }
        },
        {
          $project: {
            _id: 1,
         //   count: 1,
            RDProduct: 1,
            SXProduct: 1,
            count: { $add: ["$RDProduct", "$SXProduct"] },
          },
        },
        {
          $sort: { _id: 1 }
        },    
      ]));
      if (getlistDetailMonthProductbyYear) {
        res.json({
          status: 200,
          message: 'Get Data Completed',
          getlistDetailMonthProductbyYear,
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
module.exports = {
  HeaderReport: HeaderReport,
  totalProductOrderByYear: totalProductOrderByYear,
  totalJobsheetByYear: totalJobsheetByYear,
  totalProductByYear: totalProductByYear,
  totalSemiProductByYear: totalSemiProductByYear,
  listJobsheetByYear: listJobsheetByYear,
  listDetailMonthJobsheetbyYear: listDetailMonthJobsheetbyYear,
  listProductOrderByYear: listProductOrderByYear,
  listDetailMonthProductOrderbyYear: listDetailMonthProductOrderbyYear,
  listSemiProductByYear: listSemiProductByYear,
  listDetailMonthSemiProductbyYear:listDetailMonthSemiProductbyYear,
  listProductByYear: listProductByYear,
  listDetailMonthProductbyYear:listDetailMonthProductbyYear,
  listDetailProductOrderbyYear:listDetailProductOrderbyYear,
  listDetailJobsheetbyYear:listDetailJobsheetbyYear,
  listDetailSemiProductbyYear:listDetailSemiProductbyYear,
  listDetailProductbyYear:listDetailProductbyYear,
  //get Semi/Product
  listDetailMonthProductOrderTypeByYear:listDetailMonthProductOrderTypeByYear,
  listDetailMonthJobsheetTypeByYear:listDetailMonthJobsheetTypeByYear,
  listDetailMonthSemiProductTypeByYear:listDetailMonthSemiProductTypeByYear,
  listDetailMonthProductTypeByYear:listDetailMonthProductTypeByYear,
  
     
}