var express = require('express');
var router = express.Router();
const User= require("../models/userModel")
const passport = require("passport");
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(User.authenticate()));
const Coffee = require("../models/coffeeModel")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('signup', { title: 'Express' });
});
router.post('/signup',async function(req, res, next) {
  // money.create(req.body).then(()=>res.redirect('/signin')).catch((err)=>res.send(err));
   try {
     const data=await User.register(
       { username: req.body.username, email: req.body.email },
       req.body.password
   
     )
     res.redirect("/signin")
   } catch (error) {
     res.send(error)
   }
   
 });
 
router.get('/signin', function(req, res, next) {
  res.render('signin', { admin: req.user  });
});

router.post('/signin',passport.authenticate("local" ,{
  successRedirect : "/profile",
  failureRedirect: "/signup",
}),
 function(req, res, next) {
  res.render('signin', { admin: req.user  });
});
router.get('/profile',isLoggedIn, function(req, res, next) {
  res.render('profile', { title: 'Express' });
});
router.get("/order",isLoggedIn,function (req, res, next) {
  res.render("order", { admin: req.user  });
});

router.post("/order",isLoggedIn, async function (req, res, next) {
  try {
      const coffee = new Coffee(req.body);
      req.user.coffees.push(coffee._id);
      coffee.user = req.user._id;
      await coffee.save();
      await req.user.save();
      res.redirect("/details");
  } catch (error) {
      res.send(error);
  }
});
router.get("/details", isLoggedIn, async function (req, res, next) {
  try {
      const { coffees } = await req.user.populate("coffees");
      console.log(req.user, coffees);
      res.render("details", { admin: req.user, coffees });
  } catch (error) {
      res.send(error);
  }
});
router.get("/update/:id",async function (req, res, next) {
  try {
   const add= await Coffee.findById(req.params.id);
    res.render("update",{ elem: add });
  } catch (error) {
   res.send(error); 
  }
})
router.post("/update/:id",async function (req, res, next) {
  try {
    await Coffee.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/details");
   } catch (error) {
    res.send(error); 
   }
});

router.get("/delete/:id",async function (req, res, next) {
  try {
    await Coffee.findByIdAndDelete(req.params.id);
    res.redirect("/details");
  } catch (error) {
   res.send(error); 
  }
});


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/signin");
  }
}

router.get('/signout', function(req, res, next) {
  req.logout(() => {
    res.redirect("/signin");
});
});
module.exports = router;
