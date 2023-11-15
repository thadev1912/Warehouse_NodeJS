

// pagination.js
const paginate=(model,query, page = 1, limit)=> {
    const skip = (page - 1) * limit;
   const totalPages = model.countDocuments(query).exec();
   // const dataPromise =await model.find(query).skip(skip).limit(limit).exec();
   const dataPromise = model.find(query).skip(skip).limit(limit).exec();
    console.log(dataPromise);
    return Promise.all([totalPages, dataPromise]).then(([totalCount, data]) => {
        const totalPages = Math.ceil(totalCount /limit);
        return {
            data,
            totalPages,
            currentPage: page,
            pageSize: limit,
            totalCount
        };
    });
}
module.exports = {
    paginate:paginate
};
// const page = parseInt(req.query.page) || 1; 
// limit=5;
// totalCount=await ManagerISM.find({}).count();
// const totalPages = Math.ceil(totalCount / limit);        
// const currentPage = Math.min(Math.max(page, 1), totalPages); 



// pagination.js

// function paginate(query, page = 1, limit = 100) {
//     const skip = (page - 1) * limit;
//     const totalCountPromise = query.model.countDocuments(query.getQuery()).exec(); // Đếm tổng số bản ghi

//     const dataPromise = query.skip(skip).limit(limit).exec();

//     return Promise.all([totalCountPromise, dataPromise]).then(([totalCount, data]) => {
//         const totalPages = Math.ceil(totalCount / limit);
//         return {
//             data,
//             totalPages,
//             currentPage: page,
//             pageSize: limit,
//             totalCount
//         };
//     });
// }

// module.exports = {
//     paginate
// };
