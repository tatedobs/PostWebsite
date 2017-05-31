var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    body: String,
    user: String
});
module.exports = mongoose.model("Comment", commentSchema);