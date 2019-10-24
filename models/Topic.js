var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var TopicSchema = new Schema({
    // Title
    title: {
        type: String,
        required: true
    },
    // Summary
    summary: {
        type: String,
        required: true,
        unique: true
    },
    // Link
    link: {
        type: String,
        required: true
    },
    // Comments
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }
});
var Topic = mongoose.model("Topic", TopicSchema);
module.exports = Topic;