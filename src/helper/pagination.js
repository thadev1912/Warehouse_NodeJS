const configCrypt = require('../../config/cryptJson');
const cryptJSon = require('../helper/cryptJSon');
const paginate = async (model, query, page = 1, limit, useAggregate = false, pipeline, token) => {
    const skip = (page - 1) * limit;
    let totalCountPromise, dataPromise;

    if (useAggregate) {
        const aggregationPipeline = [
            pipeline,
            { $skip: skip },
            { $limit: limit },

        ];
        dataPromise = await model.aggregate(aggregationPipeline);
        totalCountPromise = model.countDocuments(query);
    }
    else {
        dataPromise = await model.find(query).skip(skip).limit(limit);
        totalCountPromise = model.countDocuments(query);
    }
    return Promise.all([totalCountPromise, dataPromise]).then(([totalCount, getData]) => {
        const totalPages = Math.ceil(totalCount / limit);
        return {
            getData,
            totalPages,
            currentPage: page,
            pageSize: limit,
            totalCount
        };
    });
}
const paginate1 = async (model, query, page = 1, limit, useAggregate = false, pipeline, token) => {
    const skip = (page - 1) * limit;
    let totalCountPromise, dataPromise;
    if (useAggregate) {
        const aggregationPipeline = [...pipeline];
        aggregationPipeline.push({ $skip: skip }, { $limit: limit }); // Thêm phần phân trang vào pipeline
        dataPromise = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, await model.aggregate(aggregationPipeline));
        const countResult = await model.aggregate([...aggregationPipeline.slice(0, -1), { $count: 'count' }]).exec();
        const _totalCount = countResult.length > 0 ? countResult[0].count : 0;
        _totalPages = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, Math.ceil(_totalCount / limit));
        totalCount = await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, _totalCount);
        return {
            getData: dataPromise,
            totalPages: _totalPages,
            currentPage: await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, page),
            pageSize: await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, limit),           
        };
    } else {
        dataPromise = await model.find(query).skip(skip).limit(limit);
        totalCountPromise = model.countDocuments(query);    
        const [_totalCount, _getData] = await Promise.all([totalCountPromise, dataPromise]);
        const _totalPages =await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,Math.ceil(_totalCount / limit));        
            return {
                getData:await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,_getData) ,
                totalPages: _totalPages,
                currentPage:  await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, page),
                pageSize: await cryptJSon.encryptData(token, configCrypt.encryptionEnabled, limit),                
                totalCount: await cryptJSon.encryptData(token, configCrypt.encryptionEnabled,_totalCount) 
            };        
    }
}

module.exports = {
    paginate,
    paginate1
};

