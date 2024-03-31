import mongoose from 'mongoose';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
const saltRounds = 10;

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        maxlength: 50,
        unique: 1
    },
    password: {
        type: String,
        minlength: 8,
    },
    role: {
        type: Number,
        default: 0,
    },
    profileImg: {
        type : String,
        default : '/img/default-profile-img.png',
    },
    refresh_token: {
        type: String,   
    },
});

userSchema.pre('save', function (next) {
    const user = this;

    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function(error, salt) {
            if(error) return next(error);

            bcrypt.hash(user.password, salt, function(error, hash) {
                if(error) return next(error);
                user.password = hash;
                next();
            });
        }); 
    }
    else {
        next();
    }

});

userSchema.methods.checkPassword = function(plainPassword) {
    return bcrypt.compare(plainPassword, this.password)
}

userSchema.methods.createRefreshToken = function(refreshToken) {
    const user = this;
    user.refresh_token = refreshToken;
    return user.save(); 
}

userSchema.statics.authenticationByToken = async function(token) {
    try {
        const decodedAccessToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    
        const user = await this.findOne({ _id: decodedAccessToken._id });

        if (!user) {
          throw new Error('Not Found User Info');
        }
    
        return user;
    } catch (error) {
        throw new Error(error.message);
    }
}

userSchema.statics.create = function(payload) {
    const user = new this(payload);
    return user.save();
}

userSchema.statics.findAll = function() {
    return this.find({});
}

const userModel = mongoose.model('User', userSchema);

export default userModel;

