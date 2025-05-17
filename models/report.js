import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    patientId:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    doctorId:{type:mongoose.Schema.Types.objectOd,red:'User',required:true},,
    reportName:{type:String,required:true},
    filePath:{type:String,required:true},
    uploadedAt:{type:Date,default:Date.now}
});

export default mongoose.model("Report",reportSchema);