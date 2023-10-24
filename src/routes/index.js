const user=require('./user');
const role=require('./role');
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
const detail_product_order=require('./detail_product_order');
const Auth =require('../app/middlewares/auth')
const Permision =require('../app/middlewares/permission')
function route(app)
{
app.use('/account',user); 
app.use('/role',role); 
app.use('/region',Permision.checkPermision,region);
app.use('/deparment',Permision.checkPermision,department);
app.use('/position',position);
app.use('/product-type',product_type);
app.use('/product-series',product_series);
app.use('/product-group',product_group);
app.use('/semi-product',semi_product);
app.use('/sim-package',sim_package);
app.use('/categories-sim',categories_sim);
app.use('/product-order',product_order);
app.use('/detail-product-order',detail_product_order);
}
module.exports = route;
