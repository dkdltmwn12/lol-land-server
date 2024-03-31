import jwt from 'jsonwebtoken';
import userModel from '../models/user.js';

const authentic = async (req, res, next) => {
  const accessToken = req.cookies.ACCESS_TOKEN;
  const refreshToken = req.cookies.REFRESH_TOKEN;
    // console.log(refreshToken)
  try { // access token이 만료되기 전이면 해당 user 정보를 찾음
    if(!accessToken) return res.status(401).json({message : 'token info does not exist'})
    const user = await userModel.authenticationByToken(accessToken); 
    req.user = user;
    next();
  }
  catch (error) { // access token 만료로 인해 인증 실패
    console.log(error.message)
    try { // case 1. access token만 만료 되고 refresh token은 만료되지 않았다면, refresh token을 이용하여 access token 재발급
      const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY); // cookie에 저장된 refresh token가 유효한지 검사 > error 시 case 2 이동

      const isTokenEqual = await userModel.findOne({refresh_token : refreshToken}) // 해당 유저의 db 정보에서 refresh token과 cookie에 저장된 refresh token이 동일한지 검사
      if(!isTokenEqual) return res.status(401).json({message : 'token do not match'})

      if(error.message === 'jwt expired') { // Access Token이 만료된 경우, 새로운 Access Token 발급
        const newAccessToken = jwt.sign({ _id: decodedRefreshToken._id }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '10m' });
        res.cookie('ACCESS_TOKEN', newAccessToken, {httpOnly : true}) // 발급한 새로운 access token을 쿠키에 저장
        req.user = await userModel.authenticationByToken(newAccessToken); // 새로운 access token으로 사용자 정보 갱신
        return next();
        }
    }
    catch (error) { // case 2. access token, refresh token 둘 다 만료 시 에러(강제 로그아웃 처리)
      res.cookie('ACCESS_TOKEN', ''); // 쿠키에 저장된 token도 빈문자열로 초기화
      res.cookie('REFRESH_TOKEN', '');
      return res.status(401).json({message : 'all token invalid'}) 
    }
    return res.status(404).json({ message: error.message }); // 다른 인증 오류인 경우
  }
}

export {authentic} 