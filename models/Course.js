const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});
// Adding text index to title and description to enable full-text search
courseSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Course', courseSchema);
