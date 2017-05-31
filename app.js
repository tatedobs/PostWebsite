var passportLocalMongoose   = require("passport-local-mongoose"),
    expressSanitizer        = require("express-sanitizer"),
    Comment                 = require("./models/comment"),
    methodOverride          = require("method-override"),
    LocalStrategy           = require("passport-local"),
    post                    = require("./models/post"),
    User                    = require("./models/user"),
    bodyParser              = require("body-parser"),
    seedDB                  = require("./seeds.js"),
    mongoose                = require("mongoose"),
    passport                = require("passport"),
    express                 = require("express"),
    app                     = express();



seedDB();


//APP CONFIG
mongoose.connect("mongodb://localhost/post_app");
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "NYfd7a9340nesEE|488$Xz8KwGOOS7",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(express.static("public"));
app.use(methodOverride("_method"));


//=============================
// ROUTES
// ============================

app.get("/", function(req, res) {
    res.redirect("/posts");
})

// INDEX ROUTE
app.get("/posts", function(req, res) {
    post.find({}, function(err, posts) {
        if(err) {
            res.redirect("/error");
        } else {
            res.render("index", {posts: posts});
        }
    });
});

// NEW ROUTE
app.get("/posts/new", isLoggedIn, function(req, res) {
    res.render("new");
});

// SHOW ROUTE
app.get("/posts/:id", function(req, res) {
    post.findById(req.params.id).populate("comments").exec(function(err, foundpost) {
        if(err) {
            res.redirect("/posts");
        } else {
            res.render("show", {post: foundpost});
        }
    });
});

// EDIT ROUTE
app.get("/posts/:id/edit", isLoggedIn, function(req, res) {
    post.findById(req.params.id, function(err, foundpost) {
        if(err) {
            res.redirect("/posts");
        } else {
            res.render("edit", {post: foundpost});
        }
    });
});

// CREATE ROUTE
app.post("/posts", isLoggedIn, function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    req.body.post.image = req.body.post.image.replace(/\s/g,'');
    post.create(req.body.post, function(err, newpost) {
        if(err || !/\S/.test(newpost.title)) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});

// UPDATE ROUTE
app.put("/posts/:id", isLoggedIn, function(req, res) {
    req.body.post.body = req.sanitize(req.body.post.body);
    req.body.post.image = req.body.post.image.replace(/\s/g,'');
    post.findByIdAndUpdate(req.params.id, req.body.post, function(err, updatedpost) {
        if(err || !/\S/.test(updatedpost.title)) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts/" + req.params.id);
        }
    });
});

// DESTROY ROUTE
app.delete("/posts/:id", isLoggedIn, function(req, res) {
    post.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect("/posts");
        } else {
            res.redirect("/posts");
        }
    });
});




//=============================
// COMMENT ROUTES
// ============================

app.post("/posts/:id/comments", isLoggedIn, function(req, res) {
    post.findById(req.params.id, function(err, post) {
        if(err) {
            console.log(err);
            res.redirect("/posts");
        } else {
            var commentBody = req.body.comment.body;
            var defaultUser = req.user.username;
            Comment.create({user: defaultUser, body: commentBody}, function(err, comment) {
                if(err) {
                    console.log(err);
                } else if(!/\S/.test(comment.body)) {
                    res.redirect("/posts/" + post._id);
                } else {
                    post.comments.push(comment);
                    post.save();
                    res.redirect("/posts/" + post._id);
                }
            });
        }
    })
});




//=============================
// AUTH ROUTES
// ============================
app.get("/register", function(req, res) {
    res.render("register");
});


app.post("/register", function(req, res) {
    req.body.username
    req.body.password
    User.register(new User({username: req.body.username}), req.body.password, function(err, user) {
        if(err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/posts");
        });
    })
});

app.get("/login", function(req, res) {
   res.render("login"); 
});


app.post("/login", passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/register"
    }), function(req, res) {
        
    }
);


app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/posts");
});





function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login")
}








app.listen(process.env.PORT, process.env.IP, function() {
    console.log("Server started!");
});