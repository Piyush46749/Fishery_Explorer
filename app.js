var express = require("express");
var app = express();
var bodyParser = require('body-parser');

//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var port = 3000;
 
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Fishery_explorer", {useNewUrlParser: true})

var Announcement = require("./models/announcement")

app.get("/addfishingdetails", function(req,res){
	res.render("")
});

app.post("/addfishingdetails", function(req,res){
    var len = req.body.details;
    console.log(len.length);
    for(var i = 0; i<len.length;i++){
        console.log(len[i].species);
        console.log(len[i].weight);
    }
	var sendData = new Announcement({
		fisherman_name : req.body.fisherman_name,
        fisherman_ID : req.body.fisherman_ID,
        fishing_time : req.body.fishing_time,
        fishing_date : req.body.fishing_date,
        place : req.body.place,
        details : req.body.details
	});
    sendData.save();
    res.json({"message" :"success"})
});

app.get('/getfishingdetails',async function(req,res){
    var updates = await Announcement.find().sort({fishing_date:-1});
    console.log(updates);
    res.json(updates);
});
app.get("/", (req, res) => {
    res.send("Hello World");
});
 
app.listen(port, () => {
  console.log("Server listening on port " + port);
});