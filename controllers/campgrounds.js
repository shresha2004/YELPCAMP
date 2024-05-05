let Campground=require('../Models/campground');
const {cloudinary}=require("../cloudinary");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapboxToken=process.env.MAPBOX_TOKEN;

const geocoder=mbxGeocoding({accessToken:mapboxToken})
module.exports.index= async (req,res)=>{
    let campgrounds= await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})

}

module.exports.newRenderForm=(req,res)=>{
  
    res.render('campgrounds/newCampground.ejs');
    
}

module.exports.createCampground=async (req, res,next) => {
   const geoData=await geocoder.forwardGeocode({
     query:req.body.campgrounds.location,
     limit:1
   }).send()
    const campground = new Campground( req.body.campgrounds);
    campground.geometry=geoData.body.features[0].geometry;
   campground.imageURL= req.files.map(f=>({url:f.path,filename:f.filename}))
   campground.author=req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success',' Successfully made a new campground!! ')
  
    res.redirect(`/campgrounds/${campground._id}`);
    
  
}

module.exports.showCampground=async (req,res)=>{
    const campground=await Campground.findById(req.params.id).populate({
        path:'reviews',
        populate:{
            path:'author'
    }
    }).populate('author');
  
  
 if(!campground){
    req.flash('error','Cannot find that campground!');
    res.redirect('/campgrounds');
 }
    res.render('campgrounds/show',{campground});
}

module.exports.renderEditForm=async(req,res)=>{
    
    let campground= await Campground.findById(req.params.id).populate('reviews');
    if(!campground){
        req.flash('error','Cannot find that campground!');
        res.redirect('/campgrounds');
     }
    
    res.render('campgrounds/edit',{campground})
 
    
}


module.exports.updateCampground=async (req,res)=>{
    let {id} =req.params;
   console.log(req.body);
     let camp= await Campground.findByIdAndUpdate(id,{...req.body.campgrounds})// Spread operator
     
    const imgs=req.files.map(f=>({url:f.path,filename:f.filename}))
     camp.imageURL.push(...imgs);
    await camp.save()
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
    await camp.updateOne({$pull:{imageURL:{filename:{$in:req.body.deleteImages}}}})
    console.log(camp)
    }
    req.flash('success',' Successfully updated campground!!')
     res.redirect(`/campgrounds/${camp._id}`)
 }

 module.exports.deleteCampground=async(req,res)=>{
    
   
    let {id} =req.params;
  const campground= await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
    req.flash('error','You do not have permission to do that');
   return res.redirect(`/campgrounds/${id}`);
  }
   await Campground.findByIdAndDelete(id);
   req.flash('success',' Successfully deleted the campground!!')
    res.redirect('/campgrounds'); 
}

