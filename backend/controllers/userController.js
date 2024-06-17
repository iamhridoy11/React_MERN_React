import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import validator from "validator"

// Login user

const loginUser = async (req,res) => {
    const {email,password} = req.body

    try {
        const user = await userModel.findOne({email})

        if (!user) {
            res.json({success:false, message:"User does not exist"})
        }
        
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.json({success:false, message:"Invalid credentials"})
        }

        const token = createToken(user._id)
        res.json({success:true, token})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
        
    }

}
/**
 * userToken
 */
const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

// Register user

const registerUser = async (req, res) => {
    const {name, password, email} = req.body
    try {
        /**
         * checking if user is already exist
         */
        const exists = await userModel.findOne({email})
        if (exists) {
            return res.json({success:false, message:"User already exists"})
        }

        /**
         * validating email format and strong password
         */

        if (!validator.isEmail(email)) {
            return res.json({success:false, message:"Please enter a valid email"})
        }

        /**
         * checking password
         */

        if (password.length < 8) {
            return res.json({success:false, message:"Please enter a strong password"})
        }

        /**
         * hashing (encrypt) password
         */

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)


        /**
         * Creating new user
         */

        const newUser = new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })

        /**
         * Save the user
         */
        const user = await newUser.save()

        /**
         * Generate user token
         */
        const token = createToken(user._id)
        res.json({success:true,token})

    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }
}

export {loginUser, registerUser}