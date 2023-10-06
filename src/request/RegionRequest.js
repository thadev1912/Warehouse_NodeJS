const { check } = require('express-validator');
let RegionRequest = () => {
    return [
        check('region_id', 'Mã khu vực không được để trống').not().isEmpty(),
        check('region_name', 'Tên khu vực không được để trống').not().isEmpty(),
    ];
}
module.exports = {
    RegionRequest: RegionRequest,
};