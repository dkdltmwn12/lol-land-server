import 
  {
    searchRiotAccountInfo,
    searchBySummonerPUUID,
    getMatchListByPUUID,
    getMatchInfoByMatchId,
    getParticipantsInfoByList,
    getParticipantsTierInfo,
    searchedSummonerTierInfo,
    getRankInfoListByStat,
    getSoloRankMatchInfoStat,
    getTeamRankMatchInfoStat,
    getSelectedTypeOfMatchListByPUUID
  } 
  from '../api/summoner.js'

const summonerSearch = async (req, res) => {
    const summonerName = req.params.name;
    res.header("Access-Control-Allow-Origin", "*")
    try {
      const getAccountInfo = await searchRiotAccountInfo(summonerName);
      const getSummoner = await searchBySummonerPUUID(getAccountInfo.puuid);
      if(!getSummoner.puuid) {
        return res.status(404).json({ error: '소환사를 찾을 수 없습니다.' });
      }
      const getSearchedSummonerTier = await searchedSummonerTierInfo(getSummoner.id)
  
      return res.json({summonerInfo: {...getSummoner, inGameName : summonerName.split('-')[0], tagName : summonerName.split('-')[1]}, summonerTierInfo: getSearchedSummonerTier});
    } 
    catch (error) {
      console.log('서버 에러:', error);
      res.status(500).json({ error: '서버 오류' });
    }
};

const searchedSummonerALLMatchInfo = async (req, res) => {
    const puuid = req.params.puuid;
    res.header("Access-Control-Allow-Origin", "*")
    try {
      if(!puuid) {
        return res.status(404).json({ error: '소환사를 찾을 수 없습니다.' });
      }
      const getMatchList = await getMatchListByPUUID(puuid)
      const getMatchInfo = await getMatchInfoByMatchId(getMatchList)
  
      return res.json({matchList : getMatchInfo, searchedTargetPuuid : puuid});
    } 
    catch (error) {
      console.log('서버 에러:', error);
      res.status(500).json({ error: '서버 오류' });
    }
};

const searchedSummonerSelectedTypeMatchInfo = async (req, res) => {
  const {type, puuid} = req.body.info;
  try {
    if(!puuid) {
      return res.status(404).json({ error: '소환사를 찾을 수 없습니다.' });
    }
    if(type === 'ALL') {
      const getMatchList = await getMatchListByPUUID(puuid)
      const getMatchInfo = await getMatchInfoByMatchId(getMatchList)
      return res.json({matchList : getMatchInfo, type, searchedTargetPuuid : puuid});
    }
    else {
      const getMatchList = await getSelectedTypeOfMatchListByPUUID(puuid, type)
      const getMatchInfo = await getMatchInfoByMatchId(getMatchList)
      return res.json({matchList : getMatchInfo, type, searchedTargetPuuid : puuid});
    }
  } 
  catch (error) {
    console.log('서버 에러:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

const searchedSummonerAddedMatchInfo = async (req, res) => {
  const puuid = req.params.puuid;
  const page = req.query.page;
  const id = req.query.id;
  const type = req.query.type;

  try {
    if(!puuid) {
      return res.status(404).json({ error: '소환사를 찾을 수 없습니다.' });
    }
    if(type === 'ALL') {
      const getMatchList = await getMatchListByPUUID(puuid, page)
      const getMatchInfo = await getMatchInfoByMatchId(getMatchList)
      return res.json({name : id, type, addedMatchList : getMatchInfo});
    }
    else {
      const getMatchList = await getSelectedTypeOfMatchListByPUUID(puuid, type, page)
      const getMatchInfo = await getMatchInfoByMatchId(getMatchList)
      return res.json({name : id, type: parseInt(type) , addedMatchList : getMatchInfo});
    }
  } catch (error) {
    console.error('서버 에러:', error);
    res.status(500).json({ error: '서버 오류' });
  }
};

const participantsInfo = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  const participantsList = req.body.Ids;
  try {
    const getParticipantsID = await getParticipantsInfoByList(participantsList)
    const getParticipantsTier = await getParticipantsTierInfo(getParticipantsID)
    return res.json(getParticipantsTier)
  } catch (error) {
    console.error('API 호출 에러:', error);
    res.status(500).json({ error: '서버 오류' });
  }
}

const searchedSummonerSoloRankMatchInfoForStat = async (req, res) => {
  const puuid = req.body.info
  try {
    const soloRankList = await getRankInfoListByStat(puuid, 420);
    const soloRankInfo = await getSoloRankMatchInfoStat(puuid, soloRankList);
    if(soloRankList.length === 0) {
      return res.status(204).json({message : '솔로 랭크 정보가 없습니다.'})
    }
    res.status(200).json(soloRankInfo)
  }
  catch (error) {
    return res.status(500).json({error : '솔로 랭크 매치 정보 가져오기 실패'})
  }
}

const searchedSummonerTeamRankMatchInfoForStat = async (req, res) => {
  const puuid = req.body.info
  try {
    const teamRankList = await getRankInfoListByStat(puuid, 440);
    const teamRankinfo = await getTeamRankMatchInfoStat(puuid, teamRankList);
    if(teamRankList.length === 0) {
      return res.status(204).json({message : '솔로 랭크 정보가 없습니다.'})
    }
    res.status(200).json(teamRankinfo)
  }
  catch (error) {
    return res.status(500).json({error : '솔로 랭크 매치 정보 가져오기 실패'})
  }
}


export {
  summonerSearch,
  searchedSummonerALLMatchInfo,
  searchedSummonerSelectedTypeMatchInfo,
  searchedSummonerSoloRankMatchInfoForStat, 
  searchedSummonerTeamRankMatchInfoForStat,
  searchedSummonerAddedMatchInfo,
  participantsInfo
}