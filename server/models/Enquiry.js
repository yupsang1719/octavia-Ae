import mongoose from 'mongoose'

const enquirySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  email:       { type: String, required: true, lowercase: true, trim: true },
  phone:       { type: String, trim: true },
  service:     {
    type: String,
    enum: ['implants','invisalign','bonding','veneers','whitening','botox','airflow','sixmonthsmile','general','other'],
  },
  location:    { type: String },
  message:     { type: String },
  source:      { type: String },
  status:      { type: String, enum: ['new','contacted','booked','closed'], default: 'new' },
  gdprConsent: { type: Boolean, required: true },
  createdAt:   { type: Date, default: Date.now },
})

export default mongoose.model('Enquiry', enquirySchema)
