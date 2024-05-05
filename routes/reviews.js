let express=require('express')
let router=express.Router({mergeParams:true});
const catchAsync=require('../Utils/CatchAsync.js');
const Review=require('../Models/review.js');
const ExpressError =require('../Utils/ExpressError.js');
let Campground=require('../Models/campground');
const {isAuthor}=require('../middleware.js')
const {validateReview,isLoggedIn,isReviewAuthor}=require('../middleware.js');
const reviews=require('../controllers/reviews.js')





router.post('/',isLoggedIn,validateReview,catchAsync(reviews.createReview))


router.delete('/:reviewId',isLoggedIn,isReviewAuthor,catchAsync(reviews.deleteReview)) 

module.exports=router;