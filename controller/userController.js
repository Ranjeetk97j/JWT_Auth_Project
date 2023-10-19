import User from "../model/user.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import transporter from "../config/emailConfig.js";

export const register = async (req, res) =>{
    // console.log(req.body);
    const {name, email, password, password_confirmation, tc} = req.body;
    const user = await User.findOne({ email:email })
    if(user){
        res.send({"status":"failed","message":"Email already exists"});
    }else{
        // console.log(req.body)
        if(name && email && password && password_confirmation && tc){
            if(password === password_confirmation){
                try{
                    const salt = await bcrypt.genSalt(10)
                    const hashPassword = await bcrypt.hash(password, salt)
                    const doc = new User({
                        name : name,
                        email : email,
                        password : hashPassword,
                        tc : tc
                    })
                    await doc.save()
                    const saved_user = await User.findOne({email:email})
                    //Generate JWT Token
                    const token = jwt.sign({userId:saved_user._id},
                        process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                    res.status(201).send({"status":"Success", "message":"Successfully Register","token":token})
                }catch(err){
                    console.log(err)
                    res.send({"status":"failed", "message":"Unable to Register"})
                }
            }else{
                res.send({"status":"failed", "message":"Password and confirmation password doesn't match"})
            }
        }else{
            res.send({"status":"failed","message":"All field are required"})
        }
    }
}

export const login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        if(email && password){
            const user = await User.findOne({email : email})
            if(user != null){
                const isMatch = await bcrypt.compare(password, user.password)
                if((user.email===email) && isMatch){
                    //Generate JWT Token
                    const token = jwt.sign({userId:user._id},
                    process.env.JWT_SECRET_KEY,{expiresIn:'5d'})

                    res.send({"status":"success","message":"Login Success", "token":token})
                }else{
                    res.send({"status":"failed","message":"Email or Password is not valid"})
                }
            }else{
                res.send({"status":"failed","message":"You are not a Registered User"})
            }

        }else{
            res.send({"status":"failed","message":"All field are required"})
        }

    }catch(err){
        res.send({"status":"failed", "message":"Unable to Login"})
    }

}

export const changePassword = async(req, res)=>{
    const {password, password_confirmation} = req.body
    if(password && password_confirmation){
        if(password !== password_confirmation){
            res.send({"status":"failed", "message":"New Password and Confirm New Password doesn't match"})
        }else{
            const salt = await bcrypt.genSalt(10)
            const newHashPassword = await bcrypt.hash(password, salt)
            // console.log(req.user._id);
            await User.findByIdAndUpdate(req.user._id,{$set: {password:newHashPassword}})
            res.send({"status":"Success", "message":"Success fully"});
        }
    }else{
        res.send({"status":"failed","message":"All Fields are Required"})
    }
}


export const loggedUser = async (req, res) =>{
    res.send({"user":req.user})
}


export const sendUserPasswordResetEmail = async (req, res) => {
    const {email} = req.body
    if(email){
        const user = await User.findOne({email: email});
        if(user){
            const secret = user._id + process.env.JWT_SECRET_KEY
            const token = jwt.sign({userId: user._id}, secret, {expiresIn:"15m"})
            const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
            console.log(link)
            // let info = await transporter.sendMail({
            //     from:process.env.EMAIL_FROM,
            //     to: user.email,
            //     subject:"Geekshop - Password Reset Link",
            //     html:`<a href=${link} >Click Here</a> to Reset Your Password`
            // })


            res.send({"status":"success","message":"Password Reset Email Sent... Please Check Your Email"})
            // res.send({"status":"success","message":"Password Reset Email Sent... Please Check Your Email", "info":info})

        }else{
            res.send({"status":"failed","message":"Email doen't exists"})
        }
    }else{
        res.send({"status":"failed","message":"Email Field are required"})
    }
}

export const userPasswordReset = async(req, res) =>{
    const {password, password_confirmation} = req.body;
    const {id, token} = req.params;
    const user = await User.findById(id)
    const new_token = user._id + process.env.JWT_SECRET_KEY
    try {
        jwt.verify(token, new_token)
        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed", "message":"New Password and Confirm New Password doesn't match"})

            }else{
                const salt = await bcrypt.genSalt(10)
                const newHashPassword = await bcrypt.hash(password, salt)
                await User.findByIdAndUpdate(user._id, {$set:{password:newHashPassword}})
                res.send({"status":"success", "message":"Password Reset Successfully"})

            }

        }else{
            res.send({"status":"failed","message":"All Fields are required"})
        }
    } catch (err) {
        console.log(err)
        res.send({"status":"failed","message":"Invalid Token"})
    }
}



