import { renderTemplate, sendMail } from "../api/sendMail.js";
import userModel from "../models/user.js";
import jwt from 'jsonwebtoken'

const userRegiser = async (req, res) => {
    const {email, password, confirmPassword} = req.body.info
    try{
      const existingUser = await userModel.findOne({email});
      if(existingUser) return res.status(401).json({message : '이미 존재하는 회원입니다.'});
  
      if(password !== confirmPassword) return res.status(401).json({message : '비밀번호가 일치하지 않습니다.'});
  
      if(password.length <= 7) return res.status(401).json({message : '비밀번호를 8자리 이상 입력해주세요.'});
  
      await userModel.create(req.body.info)
      return res.json({message : 'user register success'})
    }
    catch(error) {
      return res.status(500).json({message : error.message})
    }
}

const userLogin = async (req, res) => {
  const loginUserData = req.body.info;
  try {
    const findUser = await userModel.findOne({email : loginUserData.loginEmail}); // 1단계. mongo db에서 전달받은 데이터를 통해 user 정보 찾음
    if(!findUser) {
      return res.status(404).json({message : '회원 정보가 존재하지 않습니다.'})
    }
    const isMatched = await findUser.checkPassword(loginUserData.password); //  2단계. mongo db에서 user 정보를 찾았다면 전달 받은 데이터를 통해 db에 저장된 user의 비밀번호와 비교
    if(!isMatched) {
      return res.status(500).json({message: '비밀번호가 일치하지 않습니다.'})
    }
    // 3단계. refresh, access token 발급 >  access token, refresh token 쿠키에 저장, refresh token만 db에 업데이트 (최초 로그인을 하지 않았을 시 빈문자열) 
    const accessToken = jwt.sign({_id : findUser._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn : '10m'}); 
    const refreshToken = jwt.sign({_id : findUser._id}, process.env.REFRESH_TOKEN_KEY, {expiresIn : '30m'});
    await findUser.createRefreshToken(refreshToken);
    res.cookie('ACCESS_TOKEN', accessToken, {httpOnly : true});
    res.cookie('REFRESH_TOKEN', refreshToken, {httpOnly : true});
  
    return res.json({loginStatus : true}) // client의 asyncThunck 함수에게 로그인 상태 전달 
  }
  catch(error) {
    return res.status(500).json(error)
  }
}

const userLogout = async (req, res) => {
    const {email} = req.user;
    try {
      await userModel.findOneAndUpdate({email}, {refresh_token : ''}) // 로그인 했을 때 발급했던 refresh token을 빈문자열로 초기화
      res.cookie('ACCESS_TOKEN', ''); // 쿠키에 저장된 token도 빈문자열로 초기화
      res.cookie('REFRESH_TOKEN', '');
      return res.json({loginStatus : false});
    }
    catch(error) {
      return res.status(500).json(error)
    }
}

const userProfileChange = async (req, res) => {
    const {email, newName} = req.body.info;
    const refreshToken = req.cookies.REFRESH_TOKEN;
    try {
      const decodedToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
    
      const findUser = await userModel.findOne({_id: decodedToken._id});
      if(!findUser) return res.status(409).json({message : 'user found fail'})
  
      findUser.name = newName;
      await findUser.save();
      return res.json({message : 'user info update success'})
    }
    catch (error) {
      console.log(error)
    }
}

const userProfileImgChange = async(req, res) => {
  const {file, user} = req;
  try {
    if(!file) return res.status(204).json({message : '선택한 사진이 없습니다. 기존 이미지를 그대로 사용합니다.'})
    user.profileImg = file.location;
    await user.save();
  
    return res.status(201).json({message : '프로필 이미지를 변경이 완료되었습니다.'})
  }
  catch (error) {
    res.status(500).json({ message : error});
  }
}

const userProfileImgDelete = async (req, res) => {
  const {user} = req;
  try {
    user.profileImg = '/img/default-profile-img.png'
    await user.save();
    return res.status(201).json({message : '프로필 이미지 기본으로 변경 완료'})
  }
  catch (error) {
    return res.status(500).json({message : error})
  }
}

const userNewPasswordChange = async (req, res) => {
    const {nowPW, changePW, changeConfirmPW} = req.body.info
    try {
      const isnowPassWordEqual = await req.user.checkPassword(nowPW);
      if(!isnowPassWordEqual) return res.status(401).json({message : '현재 비밀번호가 일치하지 않습니다.'});
      if(changePW !== changeConfirmPW) return res.status(401).json({message : '새 비밀번호가 일치하지 않습니다.'});
      if(nowPW === changePW && nowPW === changeConfirmPW) return res.status(401).json({message : '현재 비밀번호와 동일합니다.'});
  
      req.user.password = changePW;
      await req.user.save();
      return res.status(200).json({message : 'password change success'})
      
    }
    catch (error) {
      return res.status(500).json({message : 'password change fail'})
    }
}

const userFindPasswordByEmail = async (req, res) => {
    const {email} = req.body;
    try {
      const findUser = await userModel.findOne({email});
      if(!findUser) return res.status(401).json({message : '회원이 존재하지 않습니다.'})
  
      const findPasswordToken = jwt.sign({_id : findUser._id}, process.env.ACCESS_TOKEN_KEY, {expiresIn : '10m'});
      sendMail(email, '비밀번호 찾기', renderTemplate(findPasswordToken))
      return res.status(200).json({message : '이메일을 확인해주세요.'})
    }
    catch (error) {
      res.status(500).json({message : error})
    }
}

const userNewPassWordForm = async (req, res) => {
    const {token, newPassword, confirmNewPassword} = req.body.info;
    try {
      const verifyToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
  
      if(newPassword !== confirmNewPassword) return res.status(401).json({message : '비밀번호가 일치하지 않습니다.'})
  
      const findUser = await userModel.findOne({_id: verifyToken._id});
      const isNewPassWordEqual = await findUser.checkPassword(newPassword);
      if(isNewPassWordEqual) return res.status(401).json({message : '현재 비밀번호와 동일합니다. 새로운 비밀번호로 설정하세요.'})
  
      findUser.password = newPassword;
      await findUser.save();
      return res.status(200).json({message : '비밀번호 변경 완료'})
  
    }
    catch (error) {
      if(error.message === 'jwt expired') {
        return res.status(500).json({message : '토큰 만료, 이메일을 다시 전송 후 시도하세요.'})
      }
      else {
        return res.status(500).json({message : error})
      }
    }
}

const userAuthenticate = (req, res) => {
    try {
      const {_id, name, email, role, profileImg, refresh_token} = req.user
      return res.json({
      _id,
      name,
      email,
      role,
      profileImg,
      isAdmin : role === 0 ? false : true,
      isAuth : true,
      })
    }
    catch(error) {
      return res.status(500).json({message : '인증이 완료되지 않았습니다.'})
    }
}

const userRecreateToken = (req, res) => {
    try {
      res.status(200).json('token recreate')
    }
    catch (error) {
      res.status(500).json(error)
    }
}

export {userRegiser, userLogin, userLogout, userProfileChange, userProfileImgChange, userProfileImgDelete, userNewPasswordChange, userFindPasswordByEmail, userNewPassWordForm, userAuthenticate, userRecreateToken}