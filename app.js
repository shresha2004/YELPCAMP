// if(process.env.NODE_ENV !== "production"){
//     require('dotenv').config();
// }



require('dotenv').config();
let express= require('express');
const mongoose = require('mongoose');
let Campground=require('./Models/campground');
let methodOverride=require('method-override');
let ejsmate=require('ejs-mate');
const catchAsync=require('./Utils/CatchAsync.js');
const ExpressError =require('./Utils/ExpressError.js');
let Joi=require('joi')
const {campgroundSchema,reviewSchema}=require('./schemas.js')

let flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./Models/user.js');
const helmet=require('helmet');
const dbURL=process.env.DB_URL||'mongodb://127.0.0.1:27017/yelp-camp';
const session=require('express-session');
const MongoStore=require('connect-mongo');
const secret=process.env.SECRET|| 'thisshouldbeabettersecret!'


//process.env.DB_URL

// 'mongodb://127.0.0.1:27017/yelp-camp'



main().catch(err => console.log(err));
let app=express();
async function main() {
  await mongoose.connect(dbURL,{
   
  });
}

app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsmate);



const store=new MongoStore({
    mongoUrl: dbURL,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    }
})
const sessionConfig={
    store,
    name:'session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
    
        expires:Date.now() + 1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(flash());
 app.use(helmet({contentSecurityPolicy:false}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
  
    
    next();
})

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});


let path= require('path');
const campground = require('./Models/campground');

app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')))


const validateReview= (req,res,next)=>{
    const {error}=reviewSchema.validate(req.body);
    if(error){
        const msg=error.details.map(el=>el.message).join(',')
        throw new ExpressError(msg,400)
    }
    else{
        next();
    }

}


const validateCampground=(req,res,next)=>{
const {error} =campgroundSchema.validate(req.body);
if(error){
    const msg=error.details.map(el=>el.message).join(',')
    throw new ExpressError(msg,400)
}
else{
    next();
}}

const campgroundsRoutes=require('./routes/campgrounds');
app.use('/campgrounds',campgroundsRoutes);

const reviewsRoutes=require('./routes/reviews.js');
app.use('/campgrounds/:id/reviews',reviewsRoutes);
const registerRoutes=require('./routes/users');
app.use(registerRoutes);


app.get('/',(req,res)=>{
    res.render('home.ejs');
})

app.get('/fakeUser',async (req,res)=>{
    const user=new User({email:'shayan@gmail',username:'shayan'})
   const newUser= User.register(user,'kumar');
   res.send(newUser)
   console.log(newUser);

})



app.all('*',(req,res,next)=>{
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode=500}=err;
    if(!err.message) err.message="Oh no something went wrong"
    res.status(statusCode).render('./partials/error',{err});
    })

const port=process.env.PORT || 3500;

app.listen(port,()=>{
    console.log(`Serving on port ${port}`)
})




