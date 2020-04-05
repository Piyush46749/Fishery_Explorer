var mongoose=require("mongoose");

var announcementSchema= new mongoose.Schema({
	fisherman_name : {
		type : String,
		required : true
	},
	fisherman_ID : {
		type : String,
		required :true
	},
	fishing_time : {
		type : String,
		required : true
	},
	fishing_date : {
		type : Date,
		required : true,
	}, 
	place : {
		type : String,
		required : true
	},
	details: [{
		species : String,
		weight : Number,
		target_species : {
			type : Boolean,
			default : false
		}
	}]
});

module.exports = mongoose.model("Announcement", announcementSchema,"Announcement");