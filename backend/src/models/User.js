import mongoose, { Schema, Document } from 'mongoose';
const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['patient', 'donor', 'admin'], default: 'donor' },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model('User', UserSchema);
//# sourceMappingURL=User.js.map