import mongoose, {Document, Schema, ObjectId} from "mongoose";
import bcrypt from "bcryptjs";

export interface UserType extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    bio: string;
}

const userSchema: Schema = new Schema<UserType>({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type:String,
        required:true
    },
    bio: {
        type:String,
        required: true
    }
});

userSchema.pre("save", async function(next){
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password as string, 8);
    }
    next();
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;