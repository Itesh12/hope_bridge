import mongoose, { Document } from 'mongoose';
export interface ICase extends Document {
    createdBy: mongoose.Types.ObjectId;
    patientName: string;
    age: number;
    location: string;
    disease: string;
    hospitalName: string;
    treatmentNeeded: string;
    description: string;
    headline: string;
    targetAmount: number;
    raisedAmount: number;
    helpType: ('fund' | 'blood' | 'marrow')[];
    documents: string[];
    verificationStatus: 'pending' | 'approved' | 'rejected';
    isUrgent: boolean;
    isVerified: boolean;
    createdAt: Date;
}
declare const _default: mongoose.Model<ICase, {}, {}, {}, mongoose.Document<unknown, {}, ICase, {}, mongoose.DefaultSchemaOptions> & ICase & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, ICase>;
export default _default;
//# sourceMappingURL=Case.d.ts.map