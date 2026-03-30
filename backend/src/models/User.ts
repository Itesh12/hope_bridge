import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  profileImage?: string;
  role: 'patient' | 'donor' | 'admin';
  isVerified: boolean;
  status: 'active' | 'banned';
  resetPasswordToken?: string | undefined;
  resetPasswordExpire?: Date | undefined;
  createdAt: Date;
  getResetPasswordToken: () => string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  profileImage: { type: String, default: '' },
  role: { type: String, enum: ['patient', 'donor', 'admin'], default: 'donor' },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'banned'], default: 'active' },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: { type: Date, default: Date.now },
});

// Generate and hash password token
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire (10 minutes)
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export default mongoose.model<IUser>('User', UserSchema);
