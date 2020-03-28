var mongoose=require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose")


var userSchema= new mongoose.Schema({
	username: String,
	password: String
});


userSchema.plugin(passportLocalMongoose); //we had plugin the "passportLocalMongoose" to the "userSchema" so that passport authentication can be used in database of mongo where the schema is created.


module.exports = mongoose.model("User", userSchema) //this means that I am building a model from the schema named "userSchema" and the name of that model that I am building is "User".

