import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from "@aws-sdk/client-s3";
import {authentic} from '../middleware/auth.js';
import dotenv from 'dotenv';
import { 
  userAuthenticate,
  userFindPasswordByEmail,
  userLogin, userLogout,
  userNewPassWordForm,
  userNewPasswordChange,
  userProfileChange,
  userProfileImgChange,
  userProfileImgDelete,
  userRecreateToken,
  userRegiser 
} from '../controller/userController.js';

dotenv.config();

const router = express.Router();

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId : process.env.AWS_ACCESS_KEY,
      secretAccessKey : process.env.AWS_SECRET_KEY
    }
});
  
const upload = multer({
    storage: multerS3({
      s3 : s3Client,
      bucket : process.env.AWS_BUCKET_NAME,
      acl : 'public-read',
      key: (req, file, cb) => {
        cb(null, file.originalname);
      },
    })
});

router.get('/refresh', authentic, userRecreateToken)

router.get('/auth', authentic, userAuthenticate)

router.put('/resetPassword', userNewPassWordForm)

router.post('/findPassword', userFindPasswordByEmail)

router.put('/newPassword', authentic, userNewPasswordChange)

router.get('/profile/delete', authentic, userProfileImgDelete)

router.post('/profile/upload', authentic, upload.single('profileImg'),  userProfileImgChange)

router.put('/profile', userProfileChange)

router.get('/logout', authentic, userLogout)

router.post('/login', userLogin)

router.post('/register', userRegiser)

export default router;