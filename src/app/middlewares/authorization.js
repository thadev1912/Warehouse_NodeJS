const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const middlewarePermision = {
    checkPermision: async (req, res, next) => {       
        //console.log('truyền từ midleware1 là', getInfoUser)
        if (getInfoUser) {
            const _id = new ObjectId(getInfoUser._id);
            getRole = await middlewarePermision.getRoles(_id);           
            const _getPermissionGroup = getRole[0].role_permission_group.map(JSON.parse).flat();           
            requestRouterName = req.route.path;                   
            const isCan = await middlewarePermision.hasPermission(_getPermissionGroup, requestRouterName);
            //console.log(isCan);
            if (isCan) {
                next();
            }
            else {
                return res.json({
                    status: 403,
                    messege: 'Your have not permission on this page',
                });
            }
        }
    },
    getRoles: async (data) => {
        getData = await User.aggregate([
            {
                $match: {
                    _id: data,
                },
            },
            {
                $lookup: {
                    from: 'user_roles',
                    localField: '_id',
                    foreignField: 'user_id',
                    as: 'userRole',
                },
            },
            {
                $unwind: '$userRole',
            },
            {
                $lookup: {
                    from: 'role_permissions',
                    localField: 'userRole.role_permission_id',
                    foreignField: '_id',
                    as: 'rolePermission',
                },
            },
            {
                $unwind: {
                    path: '$rolePermission',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $group: {
                    _id: null,
                    role_permission_group: { $addToSet: '$rolePermission.role_permission_group' },
                },
            },
            {
                $project: {
                    _id: 0,
                    role_permission_group: 1,
                },
            },
        ]);
        return getData
    },
    hasPermission: async (_getPermissionGroup, requiredPermission) => {
        return _getPermissionGroup.some(permission => permission === requiredPermission);
    }
}
module.exports = middlewarePermision