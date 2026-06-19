import mongoose from 'mongoose'

const blogPostSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, required: true, unique: true },
  excerpt:     { type: String, required: true, maxlength: 160 },
  body:        { type: String, required: true },
  category:    { type: String, enum: ['dental','aesthetics','local','news'] },
  tags:        [String],
  author:      { type: String, default: 'Dr AC' },
  featuredImg: { type: String },
  seoTitle:    { type: String },
  seoDesc:     { type: String },
  location:    { type: String },
  published:   { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt:   { type: Date, default: Date.now },
})

export default mongoose.model('BlogPost', blogPostSchema)
