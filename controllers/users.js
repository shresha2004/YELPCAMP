const User=require('../Models/user.js');

module.exports.renderRegister=(req,res)=>{
    res.render('users/register')
}


module.exports.register=async(req,res)=>{
    try{
   const {email,username,password}=req.body;
   const user= new User({email,username});
   const registeredUser=await User.register(user,password);
   req.login(registeredUser, err=>{
       if (err) return next(err);
       req.flash('success','Welcome to yelp Camp!');
       res.redirect('/campgrounds');
   });
   
   }
   catch(e){
       req.flash('error',e.message);
       res.redirect('/register')
   }
}

module.exports.renderLogin=(req,res)=>{
    res.render('users/login');
}

module.exports.login=(req,res)=>{
    req.flash('success','welcome back!');
 

    res.redirect('/campgrounds');
}

module.exports.logout=(req,res)=>{
    req.logout(function(err) {
        if (err) {
    
          console.error(err);
          return res.status(500).send('Error logging out');
        }
        req.flash('success','Goodbye')
        res.redirect('/campgrounds');
      });
    
}