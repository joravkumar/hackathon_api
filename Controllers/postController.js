const Post = require('../Models/Post');

exports.getAllPost = (req, res) => {
    Post.find().sort([
        ['createdAt', 'descending']
    ])
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Posts received',
                posts: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.popularPost = (req, res) => {
    Post.find().sort([
        ['views', 'descending']
    ]).limit(9)
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Posts received',
                posts: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.threePopularPost = (req, res) => {
    Post.find().sort([
        ['views', 'descending']
    ]).limit(3)
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Posts received',
                posts: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.searchPost = (req, res) => {
    var search = [];
    Post.find()
        .then((result) => {
            result.forEach(element => {
                var check = element.post_name.includes(req.body.post_name.toLowerCase());
                if (check === true) {
                    search.push(element)
                }
            });
            res.status(200).json({
                success: true,
                msg: 'Post received',
                posts: search
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.getPostById = (req, res) => {
    Post.findOne({ _id: req.params.post_id }).populate('category_id', 'category_name')
        .then((result) => {
            console.log(result)
            var views = Number(result.views) + 1;
            Post.findOneAndUpdate({ _id: req.params.post_id }, {
                views: views
            }).then(response => {
                res.status(200).json({
                    success: true,
                    msg: 'Post received',
                    post: response,
                    category: result.category_id
                });
            })
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}


exports.getPosts = (req, res) => {
    Post.find({ sub_category_id: req.params.sub_category_id })
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Posts received',
                posts: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.savePost = (req, res) => {
    const post = new Post({
        ...req.body,
        image: req.files[0].path,
    });
    post.save()
        .then((result) => {
            res.status(201).json({
                success: true,
                msg: 'Post saved'
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}


exports.editPost = (req, res) => {
    Category.findOneAndUpdate({ _id: req.params.category_id }, req.body)
        .then(category => {
            res.status(200).json({
                success: true,
                msg: "Category edited successfully"
            });
        })
        .catch(err => {
            res.status(422).json({
                success: false,
                msg: err
            });
        })
}

exports.deletePost = (req, res) => {
    Post.updateOne({ _id: req.params.post_id },
        {
            is_active: false
        }
    )
        .then((resp) => {
            res.status(201).json({
                success: true,
                msg: 'Post Deleted',
                resp
            });
        })
}

exports.editSubCategory = (req, res) => {
    Category.updateOne({
        category_name: req.body.category_name,
        "sub_categories._id": req.body.sub_category_id
    },
        { $set: { "sub_categories.$.sub_category_name": req.body.sub_category_name } }
    )
        .then((resp) => {
            res.status(201).json({
                success: true,
                msg: 'Sub Category saved',
                resp
            });
        })
}