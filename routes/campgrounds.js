const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const Campground = require('../models/campgrounds')
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')
const {storage} = require('../cloudinary')
const upload = multer({storage})

/////root routes////
router.route('/')
    .get(catchAsync( campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createForm))

//////////////*********//////

router.get('/new', isLoggedIn, campgrounds.newForm)

//id routes//
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

    

///update////
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.editCampground))
//////////


module.exports = router