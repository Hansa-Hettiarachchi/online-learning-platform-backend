const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    content: { type: String }
});

module.exports = mongoose.model('Course', courseSchema);
