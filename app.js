///// all the require's////////

if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}




const express = require('express')
const app = express()
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campgrounds')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const {campgroundSchema, reviewSchema} = require('./schemas.js')
const Review = require('./models/review')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const userRoutes = require('./routes/users')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize')
const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp'
const MongoStore = require('connect-mongo')



///////////////////////////////
mongoose.set('strictQuery', true);


const store = new MongoStore({
    mongoUrl: dbUrl,
    secret: 'perfectsecret!',
    touchAfter: 24 * 60 * 60
})

store.on('error',function(e) {
    console.log('Session Store Error',e)
})

////sessioncreation////
const sessionConfig = {
    store,
    name: 'bleh',
    secret: 'perfectsecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure: true,
        expires: Date.now() + 1000 /*ms*/ * 60 /*sec*/ * 60 /*mins*/ * 24 /*hours*/ * 7 /*days*/,
        maxAge: 1000 /*ms*/ * 60 /*sec*/ * 60 /*mins*/ * 24 /*hours*/ * 7 /*days*/
    }
}
////////////////////////////////



/////middlewares////
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,'public')))
app.use(
    mongoSanitize({
      replaceWith: '_',
    }),
  )
app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
/////middlewares///


////flash////
app.use((req,res,next)=>{
    //console.log(req.session) //just to show whats happening in the session when im req.
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})


////////mongoose connection//////////
mongoose.connect(dbUrl,{useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log('Mongoose connection open!')
    })
    .catch(err=>{
        console.log('Error Not working')
        console.log(err)
    })
////////mongoose connection//////////


////view/////
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
////view/////



/////Restructuring into new route using midddleware//////
app.use('/',userRoutes)
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/reviews',reviewRoutes)



///root directory///
app.get('/', (req,res)=>{
    res.render('home')
})
//////rooot////////




app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found!!!',404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err
    if(!err.message) err.message = 'Oh No! Something Went Wrong!'
    res.status(statusCode).render('error', {  err  })

})


////listen port////

app.listen(3000, ()=>{
    console.log('Yelpcamp server on port 3000!')
})

///////////////////