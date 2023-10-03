
const Post = require('../../../models/rynandemo.')

let index = async (req, res)=>{
    console.log('bạn đang gọi tôi à!!!');
    console.log('bạn đang tôi thiệt phải không!!!');    
    let getData = await Post.find({});
    res.json({
        status: 200,
        messege: 'Thêm dữ liệu thành công!!!',
        data:getData,
    });
  }
let create = async (req, res) =>{
    const post = new Post({
        title:'Ngày 20/11',
        content: 'Nội dung triển khai',   
      
    });
   await post.save();   
    post.save().then(result => {
        res.json({post: result})
    })
}
  module.exports =
  {
    index:index,
    create:create,
  }