const Category = require('../Models/Category');

exports.getAllCategories = (req, res) => {
    Category.find().sort([
        ['createdAt', 'descending']
    ])
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Categories received',
                categories: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.getAllSubCategories = (req, res) => {
    var sub_categories=[]; 
    Category.find()
        .then((result) => {
            result.forEach(element => {
                element.sub_categories.forEach(val =>{
                        sub_categories.push(val)
                })
            });
            res.status(200).json({
                success: true,
                msg: 'Sub Categories received',
                sub_categories
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}


exports.getSubCategoryById = (req, res) => {
    Category.findOne({ _id: req.params.category_id })
        .then((result) => {
            console.log(result)
            res.status(200).json({
                success: true,
                msg: 'Sub Categories received',
                sub_categories: result.sub_categories
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.saveCategory = (req, res) => {
    console.log(req.body)
    console.log(req.file)
    const category = new Category({
        category_name: req.body.category_name,
        image: req.file.path,
    });
    category.save()
        .then(() => {
            res.status(201).json({
                success: true,
                msg: 'Category saved'
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.editCategory = (req, res) => {
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

exports.saveSubCategory = (req, res) => {
    console.log(req.files[0].path)
    Category.updateOne({ _id: req.body.category_id },
        {
            $push: {
                sub_categories: {
                    sub_category_name: req.body.sub_category_name,
                    image: req.files[0].path
                }
            }
        }
    )
        .then((resp) => {
            res.status(201).json({
                success: true,
                msg: 'Sub Category saved',
                resp
            });
        })
}

exports.editSubCategory = (req, res) => {
    Category.updateOne({
        // _id: req.params.category_id,
        "sub_categories._id": req.params.sub_category_id
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
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}