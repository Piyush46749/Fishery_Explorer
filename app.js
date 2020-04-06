var express = require("express");
var app = express();

//-------------------------------------------------------------------------------------------------------------------
app.use(express.static("public")); //used to export or use static files from public folder

//-------------------------------------------------------------------------------------------------------------------

var mongoose = require("mongoose");
mongoose.connect("mongodb://52.55.61.51:27017/Fishery_explorer", {useNewUrlParser: true})

//-------------------------------------------------------------------------------------------------------------------


var bodyParser = require("body-parser") //for parsing the value from the database to the fron-end so that it can be handles easily
app.use(bodyParser.urlencoded({extended: true}));

//-------------------------------------------------------------------------------------------------------------------


app.use(require("express-session")({  // these lines are also needed, if these are not used then it will throw an error, just like the session usage
	secret: "This is our technology innovation project", //this is the secret that will be used for decryption
	resave:false,
	saveUninitialized: false
}))

//-------------------------------------------------------------------------------------------------------------------


var User= require("./models/user") //user is created under models directory same as the views directory

//-------------------------------------------------------------------------------------------------------------------


var passport=require("passport")
var LocalStrategy=require("passport-local")
var passportLocalMongoose=require("passport-local-mongoose")

app.use(passport.initialize()); //this and the next line is always used whenever we have to use the passport
app.use(passport.session()); // //this and the previous line is always used whenever we have to use the passport

passport.use(new LocalStrategy(User.authenticate())); //this is used to create LocalStrategy using User.authenticate, i.e in short this line is also needed for authentication purpose, hence add it 

passport.serializeUser(User.serializeUser()) //takes the data from the session by reading the session and then encrypting it; we are telling the passport to use the serializer that is already defined on the User with the help of "User.serializeUser"
passport.deserializeUser(User.deserializeUser()) //takes the data from the session by reading the session and then decrypting it

// -------------------------------------------------------------------Mongoose Connector----------------------------------------------------------------------------------

var mongoose = require("mongoose");
mongoose.connect("mongodb://52.55.61.51:27017/Fishery_explorer", {useNewUrlParser: true})
var Announcement = require("./models/announcement")

// -------------------------------------------------------------------ROUTES----------------------------------------------------------------------------------
// creating a route for the home page
app.get("/", function(req, res){
	res.render("home.ejs")
});


//creating the route for the logged in page: this page only opens when the user is logged in
app.get("/user", isLoggedIn, async function(req, res){
	var updates = await Announcement.find().sort({fishing_date:-1});
	res.render("user.ejs",{data:updates})
});

app.post("/addfishingdetails", function(req,res){
    // console.log(req.body);

	var sendData = new Announcement({
        fishing_date : req.body.fishing_date,
        fishing_time : req.body.fishing_time,
        place : req.body.place,
        species : req.body.species,
        weight : req.body.weight,
        target_specie : req.body.target_specie
	});
    sendData.save();
    res.redirect("/user");
});

app.get("/update",isLoggedIn, (req, res) => {
    res.render("update.ejs");
});


//------------------------Authentication routes-------------------------------------

//show signup form
app.get("/register", function(req, res){
	res.render("register.ejs")
})

//handling the user sign up details
app.post("/register", function(req, res){
	req.body.username
	req.body.password
	
//I am passing only the username to the database but not the password since we don't want password to be saved in database. I am just passing the password to the .register as parameter which automatically changes the password, i.e encrypts it and just stores the "salt" and "hash" instead of actual password.
// I am also passing the function err, user so that now I can specify that what should happen if error occurs or what shoulf happen if no error occurs
	
	User.register(new User({username: req.body.username}), req.body.password, function(err, user){ 	
	
	if(err){
		console.log("Registration error!!")
		return res.render("register.ejs") // I am redirecting back to the registration page if there is an error
	}
		passport.authenticate("local")(req, res, function(){ //I am telling the passport. authenticate should use which mode i.e local an dit also has three 			parameters i.e res, req, and an empty callback function
		res.redirect("/user")//if the details entered are successful then the user is logged in and redirected to the /user page.
		
		});
	});
});


// login route that will be used to render the LogIn form

app.get("/login", function(req, res){
	res.render("login.ejs")	
})
app.get("/piechart", function(req, res){
	res.render("piechart.ejs")	
})


//login route with the POST request
app.post("/login", passport.authenticate("local", { //this is the middleware that is put between route and the function; it is basically triggered as soon as the post request is created and before the final function is called. Passport.authenticate basically takes passowrd and username and matches the credentials without even explicitally telling which is username and which one is password
	successRedirect: "/user", //if credentials matche, then redirect to /user
	failureRedirect: "/login" //if credentials do not matche, then redirect to /login
}), function(req, res){
	//this final function should be empty
})


//logout route and logic as well
app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/")
})

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
	return next();
	}
	res.redirect("/login")
}

//used to listen the express call
app.listen(3000, function(){
	console.log("Server started!!!")
});