var mongoose = require("mongoose");

var StudentSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    balance: {
        type: Number,
        default: 0
    },
    courses: [{
        id_course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        lesson_number: []
    }],
    course_studied: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    iq: [{
        value: Number,
        date: Date
    }],

});
// ,
    // {
    //     toObject: { virtuals: true },
    //     toJSON: { virtuals: true }
    // });
StudentSchema.virtual("totalIq").get(function () {
    let total = 0;
    if (this.iq.length) {
        this.iq.forEach(element => {
            total += element.value;
        });
    }
    return total;
});
module.exports = mongoose.model('Student', StudentSchema);
