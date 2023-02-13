const mongoose = require('mongoose')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campgrounds')
mongoose.set('strictQuery', false)



////////mongoose connection//////////
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Mongoose connection open!')
    })
    .catch(err => {
        console.log('Error Not working')
        console.log(err)
    })

////////mongoose connection//////////


///array for random numbers////
const sample = array => array[Math.floor(Math.random() * array.length)]

/////////////////////////


const seedDB = async () => {
    await Campground.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000)
        const price = Math.floor(Math.random() * 20) + 10
        const camp = new Campground({
            author: '63dec628e2d51c72f4461eee',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni nostrum tempore id tenetur',
            price,
            geometry: { 
                type: 'Point', 
                coordinates: [ cities[random1000].longitude,
                               cities[random1000].latitude  
                            ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dlohot2ln/image/upload/v1675851823/Yelpcamp/ol4rjymeanesac4bvjsc.jpg',
                    filename: 'Yelpcamp/ol4rjymeanesac4bvjsc',
                },
                {
                    url: 'https://res.cloudinary.com/dlohot2ln/image/upload/v1675849804/Yelpcamp/cohq2278fhqa0f81nhq1.jpg',
                    filename: 'Yelpcamp/cohq2278fhqa0f81nhq1',
                }
            ]
        })
        await camp.save()

    }

}
seedDB().then(() => {
    mongoose.connection.close()

})