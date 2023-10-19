import mongoose from "mongoose";

const Schema = mongoose.Schema({
  name:{type:String, require:true},
  email:{type:String, require:true},
  password:{type:String, require:true},  
})
const User = mongoose.model('user',Schema);
export default User;

