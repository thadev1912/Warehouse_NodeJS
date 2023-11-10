const JobSheet = require('../models/jobsheet');
const ProductOrder = require('../models/product_order');
const Product = require('../models/product');
const SemiProduct = require('../models/semi_product');
let HeaderReport = async (req, res) => {
    try {
        //Jobsheet
        let quantityJobSheet = await JobSheet.find().count();
        let ProcessingJobSheet = await JobSheet.find({ jobsheet_status: '4' }).count();
        let CompletedJobSheet = await JobSheet.find({ jobsheet_status: '5' }).count();
        let CancelJobSheet = await JobSheet.find({ jobsheet_status: '6' }).count();    
        //ProductOrder
        let quantityProductOrder = await ProductOrder.find().count();
        let acceptProductOrder = await ProductOrder.find({ production_order_status: 1 }).count();
        let cancelProductOrder = await ProductOrder.find({ production_order_status: 2 }).count();
        //Product       
        let QuantityProduct = await Product.find().count();
        let CancelProduct = await Product.find({ product_status: '10' }).count();
        let ProcessingProduct = await Product.find({ product_status: '4' }).count();
        let CompletedProduct = await Product.find({ product_status: '9' }).count();
        let PassProduct = await Product.find({ product_result: '1' }).count();
        let FailProduct = await Product.find({ product_result: '0' }).count();
        //SemiProduct      
        let QuantitySemiProduct = await SemiProduct.find().count();
        let CancelSemiProduct = await SemiProduct.find({ semi_product_status: '10' }).count();
        let ProcessingSemiProduct = await SemiProduct.find({ semi_product_status: '4' }).count();
        let CompletedSemiProduct = await SemiProduct.find({ semi_product_status: '9' }).count();
        let PassSemiProduct = await SemiProduct.find({ semi_product_result: '1' }).count();
        let FailSemiProduct = await SemiProduct.find({ semi_product_result: '0' }).count();
        if ((quantityJobSheet)&&(QuantityProduct)&&(QuantitySemiProduct)) {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
               // infoJobSheet,selectDayJobSheet,
                JobSheet: { quantityJobSheet, ProcessingJobSheet, CompletedJobSheet, CancelJobSheet },
                ProductOrder: { quantityProductOrder, acceptProductOrder, cancelProductOrder,FailProduct },
                Product: { QuantityProduct, CancelProduct, ProcessingProduct, CompletedProduct,PassProduct,FailProduct },
                SemiProduct: { QuantitySemiProduct, CancelSemiProduct, ProcessingSemiProduct, CompletedSemiProduct,PassSemiProduct,FailSemiProduct },
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
let BarChartReport =async (req,res) => {
    try
    {
        let infoJobSheet = await JobSheet.find();
        let selectDayJobSheet =await JobSheet.aggregate([
         {
             $group: {
               _id: { created: '$created' }, // Nhóm theo ngày
               totalProductQuantity: { $sum: '$product_quantity' }, // Tính tổng product_quantity
             },
           },
        ]);
        if((infoJobSheet)&&(selectDayJobSheet))
        {
            res.json({
                status: 200,
                message: 'Get Data Completed!!',
                infoJobSheet,selectDayJobSheet,
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
 let PieChartReport =async(req,res) =>
 {
    let infoProduct = await Product.find();   
    let infoSemiProduct = await SemiProduct.find(); 
       //Đã hủy
    getCancelTotal=await JobSheet.aggregate([
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
      ]);
          //Đạt
    getPassTotal=await JobSheet.aggregate([
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
      ]);
                // Không Đạt
    getFailTotal=await JobSheet.aggregate([
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
      ]);
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
    throw new Error('Error connecting Database on Server');
}
}
let PerformanceReport =async(req,res)=>
{
  //
}

module.exports = {
    HeaderReport: HeaderReport,
    BarChartReport:BarChartReport,
    PieChartReport:PieChartReport,
    PerformanceReport:PerformanceReport,
}