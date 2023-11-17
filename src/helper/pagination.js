// pagination.js

const paginate=async(model, query, page = 1,limit) =>{
    const skip = (page - 1) * limit;
    const totalCountPromise =await model.countDocuments(query) // Đếm tổng số bản ghi
 const dataPromise =await model.find(query).skip(skip).limit(limit)

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
module.exports = {
    paginate,    
};