import mongoose from "mongoose";

const QRCodeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, default: 'Untitled QR' },
  url: { type: String, required: true },
  config: {
    dotColor: String,
    dotColor2: String,
    dotGradient: Boolean,
    bgColor: String,
    qrShape: String,
    dotType: String,
    cornerType: String,
    cornerDotType: String,
    logo: String, // Store as Base64 or S3 URL
  },
  createdAt: { type: Date, default: Date.now }
});

const Qrmodel = mongoose.models.qrcodes || mongoose.model("qrcodes",QRCodeSchema);
export default Qrmodel;
