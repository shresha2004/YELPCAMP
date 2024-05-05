const express=require('express')
const router=express.Router();
const passport=require('passport');
const { storeReturnTo } = require('../middleware');
const users=require('../controllers/users')
const User=require('../Models/user.js');



router.route('/register')
.get(users.renderRegister)
.post(users.register)



router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',{failureFlash:true,failureRedirect:'/login'}),users.login)



router.get('/logout',users.logout)

module.exports=router;