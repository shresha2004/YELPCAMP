let express=require('express')
let router=express.Router();
const catchAsync=require('../Utils/CatchAsync.js');
const ExpressError =require('../Utils/ExpressError.js');
let Campground=require('../Models/campground');
const Review=require('../Models/review.js')
const {isLoggedIn} =require('../middleware.js');
const {isAuthor,validateCampground}=require('../middleware.js');
const campgrounds=require('../controllers/campgrounds.js')
const multer=require('multer');

const {storage}=require('../cloudinary');
const upload=multer({storage});



router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),validateCampground,catchAsync(campgrounds.createCampground))
  
router.get('/news',isLoggedIn,campgrounds.newRenderForm);
router.get('/:id/edit',isLoggedIn,isAuthor,catchAsync(campgrounds.renderEditForm))


router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isAuthor,catchAsync(campgrounds.deleteCampground))


module.exports=router; 