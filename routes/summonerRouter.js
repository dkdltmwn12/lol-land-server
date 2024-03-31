import express from 'express';
import { 
    summonerSearch,
    searchedSummonerALLMatchInfo,
    searchedSummonerSoloRankMatchInfoForStat,
    searchedSummonerAddedMatchInfo,
    participantsInfo,
    searchedSummonerTeamRankMatchInfoForStat,
    searchedSummonerSelectedTypeMatchInfo,
} from "../controller/summonerController.js";

const router = express.Router()


router.get('/summoner/:name', summonerSearch);
router.get('/summonermatch/:puuid', searchedSummonerALLMatchInfo);
router.post('/summonermatch/selectedType', searchedSummonerSelectedTypeMatchInfo)
router.post('/summonermatch/solorank/stat', searchedSummonerSoloRankMatchInfoForStat);
router.post('/summonermatch/teamrank/stat', searchedSummonerTeamRankMatchInfoForStat);
router.get('/summoner/:puuid/addedmatch', searchedSummonerAddedMatchInfo);
router.post('/match/participants', participantsInfo);

export default router;