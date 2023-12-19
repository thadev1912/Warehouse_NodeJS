		
const paginate = async (model, query, page = 1, limit, useAggregate = false, pipeline) => {
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
const paginate1 = async (model, query, page = 1, limit, useAggregate = false, pipeline) => {
    const skip = (page - 1) * limit;
    let totalCountPromise, dataPromise;
     
    if (useAggregate) { 
        const aggregationPipeline = [...pipeline]; // Tạo một bản sao của pipeline ban đầu
        aggregationPipeline.push({ $skip: skip }, { $limit: limit }); // Thêm phần phân trang vào pipeline
        dataPromise = await model.aggregate(aggregationPipeline);

        const countResult = await model.aggregate([...aggregationPipeline.slice(0, -1), { $count: 'count' }]).exec();
        const totalCount = countResult.length > 0 ? countResult[0].count : 0;
      
        return {
            getData: dataPromise,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            pageSize: limit,
            totalCount
        };
    } else {       
        dataPromise = await model.find(query).skip(skip).limit(limit);
        totalCountPromise = model.countDocuments(query);
        
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
}

module.exports = {
    paginate, 
    paginate1   
}; 

