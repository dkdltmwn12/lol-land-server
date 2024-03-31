import {searchRiotAccountInfo, searchBySummonerPUUID, searchedSummonerTierInfo, getTeamRankMatchInfoStat, getRankInfoListByStat, getSoloRankMatchInfoStatUsedPromiseAll } from '../api/summoner.js'
import articleModel from '../models/article.js'

const getAllArticleList = async(req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    try {
      
      const articles = await articleModel.findAll()
      return res.json(articles)
    }
    catch(error) {
      console.error('/board get Error', error);
      return res.status(500).json({ error: '/board get Error'})
    }
}

const boardWriteAndSummonerCheckInfo = async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  const {name, queueType} = req.body.info;
  const recentChampList = [];
  try {
    const getAccountInfo = await searchRiotAccountInfo(name.replace('#', '-'));
    const getSummoner = await searchBySummonerPUUID(getAccountInfo.puuid);
    const summonerTierInfo = await searchedSummonerTierInfo(getSummoner.id);

    let rankInfo;
    if (getAccountInfo && queueType === '솔로랭크') {
      const rankList = await getRankInfoListByStat(getAccountInfo.puuid, 420);
      rankInfo = await getSoloRankMatchInfoStatUsedPromiseAll(getAccountInfo.puuid, rankList);
      rankInfo.slice(0, 3).map(item => recentChampList.push(item.championName))
    }
    else if (getAccountInfo && queueType === '자유랭크') {
      const rankList = await getRankInfoListByStat(getAccountInfo.puuid, 440);
      rankInfo = await getTeamRankMatchInfoStat(getAccountInfo.puuid, rankList);
      rankInfo.slice(0, 3).map(item => recentChampList.push(item.championName))
    }


    const solo = summonerTierInfo.solo !== 'unranked' ? {tierName : summonerTierInfo.solo.tier, rank : summonerTierInfo.solo.rank, recentChampList} : {tierName : summonerTierInfo.solo, recentChampList}
    const team = summonerTierInfo.team !== 'unranked' ? {tierName : summonerTierInfo.team.tier, rank : summonerTierInfo.team.rank, recentChampList} : {tierName : summonerTierInfo.team, recentChampList}
    const queueTypeByTier = req.body.info.queueType === '솔로랭크' ? solo : req.body.info.queueType === '자유랭크' ? team : 'unranked';
    const newArticle = await articleModel.create({...req.body.info, tier : queueTypeByTier})
  
    return res.json(newArticle)
  }
  catch (error) {
    res.status(500).json({ error: '/board post Error' });
  }
};


export {getAllArticleList, boardWriteAndSummonerCheckInfo}