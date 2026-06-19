import mongoose from 'mongoose'

const treatmentLinkSchema = new mongoose.Schema(
  { label: String, href: String },
  { _id: false }
)

const teamMemberSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, trim: true },
  role:        { type: String, required: true, trim: true },
  eyebrow:     { type: String, trim: true },
  category:    {
    type: String,
    enum: ['dentist','hygienist','therapist','nurse','trainee-nurse','marketing','receptionist','practice-manager','other'],
    default: 'other',
  },
  specialisms:   [String],
  gdcNumber:     { type: String, default: '' },
  initials:      { type: String, trim: true },
  image:         { type: String, default: '' },
  bio:           { type: String, default: '' },
  bioExtended:   [String],
  qualifications:[String],
  treatments:    [treatmentLinkSchema],
  bookingService:{ type: String, default: '' },
  ctaHeading:    { type: String, default: '' },
  ctaBody:       { type: String, default: '' },
  prescriptionNotice: { type: Boolean, default: false },
  hasPage:       { type: Boolean, default: false },
  metaTitle:     { type: String, default: '' },
  metaDesc:      { type: String, default: '' },
  published:     { type: Boolean, default: false },
  order:         { type: Number, default: 0 },
  createdAt:     { type: Date, default: Date.now },
})

export default mongoose.model('TeamMember', teamMemberSchema)
