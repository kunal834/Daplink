import mongoose from "mongoose";

const contactSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true
    
    },
    email: {
        type: String,
          required: true
       
    },
    subject: {
        type: String,
          required: true
    
    },
    moredetails: { 
        type: String,
       required: true
    }
}, { timestamps: true }); 

 const UserQuerymodel =  mongoose.models.queries ||  mongoose.model("queries", contactSchema);
 export default UserQuerymodel;
 