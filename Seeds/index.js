
const mongoose = require('mongoose');
//let axios=require('axios');
const cities=require('./cities');
let  {places,descriptors}=require('./seedHelpers')
let Campground=require('../Models/campground') 
main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp',{
   
  });
}

const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error"));
db.once("open",()=>{
    console.log("Database connected");
});

const sample = array => {
    if (!Array.isArray(array) || array.length === 0) {
      return undefined; // or any default value you prefer
    }
    return array[Math.floor(Math.random() * array.length)];
  };
  
const seedDB= async()=>{
    await Campground.deleteMany({});
    for (let i=0;i<300;i++){
        const random100=Math.floor(Math.random() *1000);
        let price = Math.floor(Math.random()*20) + 10;
       const camp= new Campground({
            author:'6626a5af6ef54d986b7b3fbc',
            location: `${cities[random100].city} , ${cities[random100].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
           
            description:'Udupi is a quaint town nestled in the southern Indian state of Karnataka, renowned for its rich cultural heritage and delectable cuisine. Famous for its intricate temples, serene beaches, and vibrant markets, Udupi offers a blend of spirituality, history, and natural beauty',
            price,
             geometry: {
               type: 'Point', 
                coordinates: [  cities[random100].longitude, cities[random100].latitude ] },
            imageURL: [
              {
                url: 'https://res.cloudinary.com/dtyu88isr/image/upload/v1714135023/YelpCamp/ktorpspr4ihxyfpd6a4n.png',
                filename: 'YelpCamp/ktorpspr4ihxyfpd6a4n',
                
              },
              {
                url: 'https://res.cloudinary.com/dtyu88isr/image/upload/v1714135025/YelpCamp/dvdwqxwl4fhzydidzfwk.png',
                filename: 'YelpCamp/dvdwqxwl4fhzydidzfwk',
              
              }
            ],
        })
        await camp.save();
    }
  

}

seedDB().then(()=>{
    mongoose.connection.close(); 

});


