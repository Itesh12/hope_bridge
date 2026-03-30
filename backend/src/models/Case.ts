import mongoose, { Schema, Document } from 'mongoose';

export interface ICase extends Document {
  createdBy: mongoose.Types.ObjectId;
  patientName: string;
  age: number;
  location: string;
  disease: string;
  category: 'Cancer' | 'Accident' | 'Pediatric' | 'Transplant' | 'Cardiac' | 'Other';
  hospitalName: string;
  treatmentNeeded: string;
  description: string;
  headline: string;
  targetAmount?: number;
  raisedAmount: number;
  helpType: ('fund' | 'blood' | 'marrow' | 'other')[];
  otherHelpDetail?: string;
  patientImage?: string;
  coverImage?: string;
  documents: string[]; // URLs up to 5
  rejectionReason?: string;
  isUrgent: boolean;
  isVerified: boolean;
  createdAt: Date;
}

const CaseSchema: Schema = new Schema({
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  age: { type: Number, required: true },
  location: { type: String, required: true },
  disease: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Cancer', 'Accident', 'Pediatric', 'Transplant', 'Cardiac', 'Other'], 
    default: 'Other',
    required: true 
  },
  hospitalName: { type: String, required: true },
  treatmentNeeded: { type: String, required: true },
  description: { type: String, required: true },
  headline: { type: String, required: true },
  targetAmount: { type: Number, default: 0 },
  raisedAmount: { type: Number, default: 0 },
  helpType: [{ type: String, enum: ['fund', 'blood', 'marrow', 'other'], default: ['fund'] }],
  otherHelpDetail: { type: String },
  patientImage: { type: String },
  coverImage: { type: String },
  documents: {
    type: [String],
    validate: [
      (val: string[]) => val.length <= 5,
      '{PATH} exceeds the limit of 5'
    ]
  },
  verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  rejectionReason: { type: String, default: '' },
  isUrgent: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICase>('Case', CaseSchema);
