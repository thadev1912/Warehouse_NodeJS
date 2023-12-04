const JobSheet = require('../models/jobsheet');
const ProductOrder = require('../models/product_order');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
const cryptJSon = require('../../helper/cryptJSon');
let HeaderReport = async (req, res) => {
    try {
      const token = req.headers.token;
        //Jobsheet
        let quantityJobSheet =await cryptJSon.encryptData(token,await JobSheet.find().count());        
        let ProcessingJobSheet =await cryptJSon.encryptData(token, await JobSheet.find({ jobsheet_status: '4' }).count());
        let CompletedJobSheet =await cryptJSon.encryptData(token,await JobSheet.find({ jobsheet_status: '5' }).count());
        let CancelJobSheet = await cryptJSon.encryptData(token,await JobSheet.find({ jobsheet_status: '6' }).count());    
        //ProductOrder
        let quantityProductOrder =await cryptJSon.encryptData(token,await ProductOrder.find().count());
        let acceptProductOrder = await cryptJSon.encryptData(token,await ProductOrder.find({ production_order_status: 1 }).count());
        let cancelProductOrder = await cryptJSon.encryptData(token,await ProductOrder.find({ production_order_status: 2 }).count());
        //Product       
        let QuantityProduct = await cryptJSon.encryptData(token,await Product.find().count());
        let CancelProduct = await cryptJSon.encryptData(token,await Product.find({ product_status: '10' }).count());
        let ProcessingProduct = await cryptJSon.encryptData(token,await Product.find({ product_status: '4' }).count());
        let CompletedProduct = await cryptJSon.encryptData(token,await Product.find({ product_status: '9' }).count());
        let PassProduct = await cryptJSon.encryptData(token,await Product.find({ product_result: '1' }).count());
        let FailProduct = await cryptJSon.encryptData(token,await Product.find({ product_result: '0' }).count());
        //SemiProduct      
        let QuantitySemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find().count());
        let CancelSemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find({ semi_product_status: '10' }).count());
        let ProcessingSemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find({ semi_product_status: '4' }).count());
        let CompletedSemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find({ semi_product_status: '9' }).count());
        let PassSemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find({ semi_product_result: '1' }).count());
        let FailSemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find({ semi_product_result: '0' }).count());
        //console.log(FailSemiProduct);
       // console.log(quantityJobSheet,QuantityProduct,QuantitySemiProduct)
       // if ((quantityJobSheet!==0)&&(QuantityProduct1==0)&&(QuantitySemiProduct!==0)) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
               // infoJobSheet,selectDayJobSheet,
                JobSheet: { quantityJobSheet, ProcessingJobSheet, CompletedJobSheet, CancelJobSheet },
                ProductOrder: { quantityProductOrder, acceptProductOrder, cancelProductOrder,FailProduct },
                Product: { QuantityProduct, CancelProduct, ProcessingProduct, CompletedProduct,PassProduct,FailProduct },
                SemiProduct: { QuantitySemiProduct, CancelSemiProduct, ProcessingSemiProduct, CompletedSemiProduct,PassSemiProduct,FailSemiProduct },
            });
        
        // else {
        //   return res.json({
        //     status:500,
        //     success: false,                
        //     message: 'Error connecting Database on Server'
        // });
        // }
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
let BarChartReport =async (req,res) => {
    try
    {
        const token = req.headers.token;
        let infoJobSheet = await cryptJSon.encryptData(token,await JobSheet.find());
        let selectDayJobSheet =await cryptJSon.encryptData(token,await JobSheet.aggregate([
         {
             $group: {
               _id: { created: '$created' }, 
               totalProductQuantity: { $sum: '$product_quantity' }, 
             },
           },
        ]));        
        if((infoJobSheet)&&(selectDayJobSheet))
        {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                infoJobSheet,selectDayJobSheet,
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
 let PieChartReport =async(req,res) =>
 {
  try {
    const token = req.headers.token;
    let infoProduct = await cryptJSon.encryptData(token,await Product.find());   
    let infoSemiProduct = await cryptJSon.encryptData(token,await SemiProduct.find()); 
       //Cancel
    getCancelTotal=await cryptJSon.encryptData(token,await JobSheet.aggregate([
        {
            $lookup: {
              from: "products",
              localField: "jobsheet_code",
              foreignField: "jobsheet_code",
              as: "dataProduct"
            }
          },
          {
            $lookup: {
              from: "semi_products",
              localField: "jobsheet_code",
              foreignField: "jobsheet_code",
              as: "dataSemiProduct"
            }
          },
          {
            $project: {
              dataProduct: {
                $filter: {
                  input: "$dataProduct",
                  as: "product",
                  cond: { $eq: ["$product.product_status", "10"] }
                }
              },
              dataSemiProduct: {
                $filter: {
                  input: "$dataSemiProduct",
                  as: "semiProduct",
                  cond: { $eq: ["$semiProduct.semi_product_status", "10"] }
                }
              }
            }
          },
          {
            $project: {
              totalProducts: { $size: "$dataProduct" },
              totalSemiProducts: { $size: "$dataSemiProduct" }
            }
          },
          {
            $project: {
              total: {
                $add: [
                  "$totalProducts",
                  "$totalSemiProducts"
                ]
              }
            }
          }
      ]));
          //Pass
    getPassTotal=await cryptJSon.encryptData(token,await JobSheet.aggregate([
        {
            $lookup: {
              from: "products",
              localField: "jobsheet_code",
              foreignField: "jobsheet_code",
              as: "dataProduct"
            }
          },
          {
            $lookup: {
              from: "semi_products",
              localField: "jobsheet_code",
              foreignField: "jobsheet_code",
              as: "dataSemiProduct"
            }
          },
          {
            $project: {
              dataProduct: {
                $filter: {
                  input: "$dataProduct",
                  as: "product",
                  cond: { $eq: ["$product.product_result", "1"] }
                }
              },
              dataSemiProduct: {
                $filter: {
                  input: "$dataSemiProduct",
                  as: "semiProduct",
                  cond: { $eq: ["$semiProduct.semi_product_result", "1"] }
                }
              }
            }
          },
          {
            $project: {
              totalProducts: { $size: "$dataProduct" },
              totalSemiProducts: { $size: "$dataSemiProduct" }
            }
          },
          {
            $project: {
              total: {
                $add: [
                  "$totalProducts",
                  "$totalSemiProducts"
                ]
              }
            }
          }
      ]));
                // Fail
    getFailTotal=await cryptJSon.encryptData(token,await JobSheet.aggregate([
        {
            $lookup: {
              from: "products",
              localField: "jobsheet_code",
              foreignField: "jobsheet_code",
              as: "dataProduct"
            }
          },
          {
            $lookup: {
              from: "semi_products",
              localField: "jobsheet_code",
              foreignField: "jobsheet_code",
              as: "dataSemiProduct"
            }
          },
          {
            $project: {
              dataProduct: {
                $filter: {
                  input: "$dataProduct",
                  as: "product",
                  cond: { $eq: ["$product.product_result", "0"] }
                }
              },
              dataSemiProduct: {
                $filter: {
                  input: "$dataSemiProduct",
                  as: "semiProduct",
                  cond: { $eq: ["$semiProduct.semi_product_result", "0"] }
                }
              }
            }
          },
          {
            $project: {
              totalProducts: { $size: "$dataProduct" },
              totalSemiProducts: { $size: "$dataSemiProduct" }
            }
          },
          {
            $project: {
              total: {
                $add: [
                  "$totalProducts",
                  "$totalSemiProducts"
                ]
              }
            }
          } 
      ]));
    if((infoProduct)&&(infoSemiProduct))
    {
        res.json({
            status: 200,
            message: 'Get Data Completed!!',
            infoProduct,infoSemiProduct,
            PieChart:{getCancelTotal,getPassTotal,getFailTotal


            }
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


module.exports = {
    HeaderReport: HeaderReport,
    BarChartReport:BarChartReport,
    PieChartReport:PieChartReport,
   
}