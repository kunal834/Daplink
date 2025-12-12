import mongoose from "mongoose";

const ReviewSchema = mongoose.Schema({

    targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
    clientname : {
        type: String,
        required: true
    },
    profession: {
        type: String ,
        requied: true
    },
    rating:{
        type: Number,
        min: 1,
        max: 5
    },
    message:{
        type: String,
        required: true
    }

})

const Review = mongoose.models.reviews || mongoose.model("reviews" , ReviewSchema);

export default Review;
