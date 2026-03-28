import mongoose, { Schema, Document } from 'mongoose';
const CaseSchema = new Schema({
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientName: { type: String, required: true },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    disease: { type: String, required: true },
    hospitalName: { type: String, required: true },
    treatmentNeeded: { type: String, required: true },
    description: { type: String, required: true },
    headline: { type: String, required: true },
    targetAmount: { type: Number, required: true },
    raisedAmount: { type: Number, default: 0 },
    helpType: [{ type: String, enum: ['fund', 'blood', 'marrow'], default: ['fund'] }],
    documents: [{ type: String }],
    verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    isUrgent: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('Case', CaseSchema);
//# sourceMappingURL=Case.js.map