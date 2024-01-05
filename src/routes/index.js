const user=require('./user');
const region=require('./region');
const department=require('./department');
const position=require('./position');
const product_type=require('./product_type');
const product_series=require('./product_series');
const product_group=require('./product_group');
const semi_product=require('./semi_product');
const sim_package=require('./sim_package');
const categories_sim=require('./categories_sim');
const product_order=require('./product_order');
const import_excel=require('./importExcels');
const detail_product_order=require('./detail_product_order');
const jobsheet=require('./jobsheet');
const welding=require('./welding');
const assemble=require('./assemble');
const dashboard=require('./dashboard');
const quality_control=require('./qualtity_control');
const permission=require('./role_permission');
const all_router_name=require('./all_router_name');
const insertdata=require('./insertdata');
//IMS
const manager_ims=require('../routes/ims/manager_ims');
const detail_manager_ims=require('../routes/ims/detail_manager_ims');
const dashboard_ims=require('../routes/ims/dashboard_ims');
//Midleware
const Auth =require('../app/middlewares/authenticatetion');
const Permision =require('../app/middlewares/authorization');
function route(app)
{
app.use('/account',user);
app.use('/region',region);
app.use('/deparment',department);
app.use('/position',position);
app.use('/product-type',product_type);
app.use('/product-series',product_series);
app.use('/product-group',product_group);
app.use('/semi-product',semi_product);
app.use('/sim-package',sim_package);
app.use('/categories-sim',categories_sim);
app.use('/product-order',product_order);
app.use('/detail-product-order',detail_product_order);
app.use('/import-excel',import_excel);
app.use('/jobsheet',jobsheet);
app.use('/welding',welding);
app.use('/assemble',assemble);
app.use('/dashboard',Auth.checkAuth,dashboard);
app.use('/quality-control',quality_control);
app.use('/permission',permission);
app.use('/manager-ims',manager_ims);
app.use('/detail_manager-ims',detail_manager_ims);
app.use('/dashboard-ims',dashboard_ims);
app.use('/all_router_name',all_router_name);
app.use('/insertdata',insertdata);
}
module.exports = route;
