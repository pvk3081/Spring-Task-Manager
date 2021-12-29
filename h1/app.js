var express       =require("express");
var app           =express();
var bodyParser    =require("body-parser");
var mongoose      =require("mongoose");
var flash         = require("connect-flash");
var seedDB        = require("./seeds");
var Booking       = require("./models/booking");
var Review        = require("./models/review");
var passport      =require("passport");
var LocalStrategy = require("passport-local");
var User          = require("./models/user");
var methodOverride= require("method-override");

mongoose.connect("mongodb://localhost/hotel1");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/csss"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "You caught me",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
passport.authenticate('local', { successFlash: 'Welcome!' });

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.get("/", function(req,res){
    res.render("landing");
})


app.get("/home", function(req,res){
    res.render("landing");
});

app.get("/register", function(req,res){
    res.render("register");
});

app.post("/register", function(req,res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password,function(err,user){
        if(err){
              return res.render("register", {"error": err.message});
        }
        passport.authenticate("local")(req,res,function(){
             req.flash("success", "Welcome" + user.username);
            res.redirect("/home");
        })
    })
});

app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: true
    }), function(req, res){
});

// logic route
app.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Logged you out");
   res.redirect("/home");
});


app.get("/rooms", function(req,res){
    var rooms = [
        {name: "1 King Bed", image:"https://media-cdn.tripadvisor.com/media/photo-s/05/9d/46/70/park-hyatt-sydney.jpg"},
         {name: "2 Twin Beds", image:"https://media-cdn.tripadvisor.com/media/photo-s/11/58/6c/55/park-deluxe-room.jpg"}
        ]
        res.render("rooms",{rooms:rooms});
})

app.get("/dining", function(req,res){
    var dining = [
        {name: "Dining", image:"https://assets.hyatt.com/content/dam/hyatt/hyattdam/images/2017/08/02/1639/Park-Hyatt-Sydney-P187-Dining-Opera-House-Day.jpg/Park-Hyatt-Sydney-P187-Dining-Opera-House-Day.16x9.adapt.1280.720.jpg"}
        ]
        res.render("dining",{dining:dining});
})

app.get("/spa", function(req,res){
    var spa = [
        {name: "Spa", image:"https://d3bo8ky7bnf3xz.cloudfront.net/_novaimg/galleria/925571.jpg"}
        ]
        res.render("spa",{spa:spa});
})

app.get("/booking", isLoggedIn, function(req,res){
        res.render("booking");
})

app.post("/booking", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.user.username;
    var city = req.body.city;
    var room = req.body.room;
    var checkin = req.body.date1;
    var checkout = req.body.date2;
     var newBooking = {name: name, city: city, room: room, checkin: checkin, checkout:checkout}
       Booking.create(newBooking, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            req.flash("success", "You have successfully done your Booking :)");
            res.redirect("/home");
        }
    });

});

app.get("/bookinglist", isLoggedIn, function(req, res){
    var abc = req.user.username;
    // Get all campgrounds from DB
    Booking.find({name:abc}, function(err, allBookings){
       if(err){
           console.log(err);
       } else {
          res.render("bookinglist",{bookings:allBookings});
       }
    });
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

app.get("/review", isLoggedIn, function(req,res){

        res.render("review");
});

app.post("/review", function(req, res){
    // get data from form and add to campgrounds array
    var author = req.user.username;
    var text = req.body.text;
     var newReview = {author: author, text: text}
       Review.create(newReview, function(err, review){
        if(err){
             req.flash("error", "Something went Wrong");
            console.log(err);
        } else {
          review.author.id = req.user._id;
          review.author.username = req.user.username;
          review.save();
           req.flash("success", "Successfully Added your Review");
            res.redirect("/show");
        }
    });

});


app.get("/show", function(req, res){
    // Get all campgrounds from DB
    Review.find({}, function(err, allReviews){
       if(err){
           console.log(err);
       } else {
          res.render("show",{reviews:allReviews});
       }
    });
});

app.get("/show/:id/edit", checkReviewOwnership, function(req,res){
  
    Review.findById(req.params.id, function(err,foundReview){
          res.render("edit",{review:foundReview});
    })
})

app.put("/show/:id", checkReviewOwnership, function(req, res){
    // get data from form and add to campgrounds array
    var data = {text: req.body.text1};
   
      Review.findByIdAndUpdate(req.params.id, data, function(err, updatedReview){
          
        if(err){
            res.redirect("/home");
        }
        else{
            res.redirect("/show");
        }
    })
    
})


app.delete("/show/:id", checkReviewOwnership, function(req,res){

   Review.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/home");
        }
        else{
             req.flash("success", "Review deleted successfully");
            res.redirect("/show");
        }
    })
})


function checkReviewOwnership(req,res,next) {
        if(req.isAuthenticated()){
          Review.findById(req.params.id, function(err,foundReview){
          
        if(err)
        {
            req.flash("error", "Review Not found");
            res.redirect("back");
        }
        else
        {
             if(foundReview.author.id.equals(req.user._id)) {
               next();
            } else {
                req.flash("error","You do not have permission to do that");
                res.redirect("back");
            }
            
        }
    })
   
    }
    else{
        req.flash("error", "You need to be logged in to do that!");
        res.send("You need to be logged in");
    }
 
    
}


app.listen(process.env.PORT, process.env.IP, function(){
  console.log("Hotel Server has started");
});

