import axios from 'axios';

export async function searchRiotAccountInfo(summonerName) {
  try {
    const name = summonerName.split('-')[0] ? summonerName.split('-')[0] : summonerName;
    const tag = summonerName.split('-')[1] ? summonerName.split('-')[1] : 'KR1';
    const response = await axios.get(
      `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${name}/${tag}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    return response.data;
  } 
  catch (error) {
    console.log('searched target account info API call Error:', error.response.status, error.response.statusText);
    return ({status : error.response.status, statusText : error.response.statusText})
    // throw error;
  }
};

export async function searchBySummonerPUUID(puuid) {
  try {
    const response = await axios.get(
      `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    return response.data;
  } 
  catch (error) {
    console.log('searched target API call Error:', error.response.status, error.response.statusText);
  }
};

export async function searchedSummonerTierInfo(id) {
  try {
    const response = await axios.get(
      `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    const soloRankTier = response.data.find(res => res.queueType === 'RANKED_SOLO_5x5');
    const teamRankTier = response.data.find(response => response.queueType === 'RANKED_FLEX_SR');
    const tierInfo = {soloRankTier, teamRankTier}
    return {solo : tierInfo.soloRankTier ? tierInfo.soloRankTier : 'unranked', team : tierInfo.teamRankTier ? tierInfo.teamRankTier : 'unranked'}
  } 
  catch (error) {
    console.log('searched target tier info API call Error:', error.response.status, error.response.statusText);
    // throw error;
  }
};

export async function getMatchListByPUUID(puuid, start = 0) {
  try {
    const response = await axios.get(
      `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?&start=${start * 15}&count=15`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    return response.data
  }
  catch (error) {
    console.log('get matchList API call Error:', error.response.status, error.response.statusText);
    // throw error;
  }
};

export async function getSelectedTypeOfMatchListByPUUID(puuid, queue, start = 0) {
  try {
    const response = await axios.get(
      ` https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?${queue !== 'ALL' ? `queue=${queue}` : ''}&start=${start * 15}&count=15`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    return response.data
  }
  catch (error) {
    console.log('get selected matchList API call Error:', error.response.status, error.response.statusText);
    // throw error;
  }
    
}

export async function getMatchInfoByMatchId(matchIds) {
  try {
    const queueType = [420, 490, 440, 450];
    const matchInfoList = [];
    const seasonStartTime = new Date('2024-01-10T12:00:00Z').getTime()
    await Promise.all(
      matchIds.map(async (matchId) => {
        const matchResponse = await axios.get(
          `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
          {
            headers: {
              'X-Riot-Token': process.env.RIOT_API_KEY,
            },
          }
        );

        if (queueType.includes(matchResponse.data.info.queueId)) {
          matchInfoList.push(matchResponse.data);
        }

        // 각 요청 사이에 2초(2000ms) 딜레이
        await new Promise(resolve => setTimeout(resolve, 300));
      })
    );

    return matchInfoList.sort((a, b) => b.info.gameEndTimestamp - a.info.gameEndTimestamp);

  } catch (error) {
    console.log('get match info API call Error:', error.response.status, error.response.statusText);
  }
}

export async function getParticipantsInfoByList(list) {
  try {
    const particiapntPromises = list.map(async (id) => {
      const particiapntResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${id}`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          }
        }
      );
      return {id: particiapntResponse.data.id, name : particiapntResponse.data.name, level: particiapntResponse.data.summonerLevel}
    })

    const participantsIdList = await Promise.all(particiapntPromises)
    return participantsIdList
  } catch (error) {
    console.log('get participants info API call Error:', error.response.status, error.response.statusText);
    // throw error;
  }
} 

export async function getParticipantsTierInfo(IdList) {
  try {
    const otherParticiapntsPromises = IdList.map(async ({id, name, level}) => {
      const otherParticiapntsResponse = await axios.get(
        `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${id}`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          }
        }
      );
      const soloRankTier = otherParticiapntsResponse.data.find(response => response.queueType === 'RANKED_SOLO_5x5');
      return soloRankTier ? {name, tier: soloRankTier.tier, rank: soloRankTier.rank, level} : {name, tier: 'unranked', level}
    });

    const participantsInfoList = await Promise.all(otherParticiapntsPromises)
    return participantsInfoList

  } catch (error) {
    console.log('get participants tier info API call Error:', error.response.status, error.response.statusText);
    // throw error;
  }
}

export async function getRankInfoListByStat(puuid, queue) {
  try {
    const response = await axios.get(
      ` https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?queue=${queue}&start=0&count=10`,
      {
        headers: {
          'X-Riot-Token': process.env.RIOT_API_KEY,
        },
      }
    );
    return response.data
  }
  catch (error) {
    console.log('get soloRank matchList API call Error:', error.response.status, error.response.statusText);
    // throw error;
  }
    
}

export async function getSoloRankMatchInfoStat(puuid, soloMatchIds) {
  const matchInfoList = [];
  const seasonStartTime = new Date('2024-01-10T12:00:00Z').getTime()

  try {
    for (const matchId of soloMatchIds) {
      const matchResponse = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        }
      );
      const filteredMatch = matchResponse.data.info.gameStartTimestamp >= seasonStartTime ? matchResponse.data : null;
      if(filteredMatch === null) {
        return [];
      }

      const filteredTarget = filteredMatch.info.participants.filter(data => data.puuid === puuid).map(data => ({
        kda: data.challenges.kda,
        championName : data.championName,
        kills : data.kills,
        deaths : data.deaths,
        assists : data.assists,
        cs : data.totalMinionsKilled + data.neutralMinionsKilled,
        win : data.win ? 1 : 0,
        lose : !data.win ? 1 : 0,
        played : 1,
        totalDamageDealtToChampions : data.totalDamageDealtToChampions,
        totalDamageTaken : data.totalDamageTaken,
        goldEarned : data.goldEarned,
        doubleKills : data.doubleKills,
        tripleKills : data.tripleKills,
        quadraKills : data.quadraKills,
        pentaKills : data.pentaKills,
        visionScore : data.visionScore,
      }))
      matchInfoList.push(filteredTarget);   
    }
    const concatData = matchInfoList.flatMap(data => data).reduce((acc, cur) => {
      const existingDataIndex = acc.findIndex(item => item.championName === cur.championName);
      if (existingDataIndex !== -1) {
        if (cur.win === 1) {
          acc[existingDataIndex].win++;
        } else if (cur.lose === 1) {
          acc[existingDataIndex].lose++;
        }
        acc[existingDataIndex].kda += cur.kda
        acc[existingDataIndex].kills += cur.kills;
        acc[existingDataIndex].deaths += cur.deaths;
        acc[existingDataIndex].assists += cur.assists;
        acc[existingDataIndex].cs += cur.cs;
        acc[existingDataIndex].played += cur.played;
        acc[existingDataIndex].totalDamageDealtToChampions += cur.totalDamageDealtToChampions;
        acc[existingDataIndex].totalDamageTaken += cur.totalDamageTaken;
        acc[existingDataIndex].goldEarned += cur.goldEarned;
        acc[existingDataIndex].doubleKills += cur.doubleKills;
        acc[existingDataIndex].tripleKills += cur.tripleKills;
        acc[existingDataIndex].quadraKills += cur.quadraKills;
        acc[existingDataIndex].pentaKills += cur.pentaKills;
        acc[existingDataIndex].visionScore += cur.visionScore;

        if (cur.kills > acc[existingDataIndex].maximumKills) {
          acc[existingDataIndex].maximumKills = cur.kills;
        }

        // 최대 데스 업데이트
        if (cur.deaths > acc[existingDataIndex].maximumDeaths) {
          acc[existingDataIndex].maximumDeaths = cur.deaths;
        }
      }
      else {
        acc.push({
          ...cur,
          maximumKills: cur.kills,
          maximumDeaths: cur.deaths
        });

      }
      return acc;
    }, []);
    return concatData
  } catch (error) {
    console.log(`Error fetching soloRank match info for matchId ${matchId}:`, error);
    return null;
  }
}

export async function getSoloRankMatchInfoStatUsedPromiseAll(puuid, soloMatchIds) {
  const seasonStartTime = new Date('2024-01-10T12:00:00Z').getTime()
  try {
    const matchPromises = soloMatchIds.map(async (matchId) => {
    const matchResponse = await axios.get(
      `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        }
    );
    const filteredMatch = matchResponse.data.info.gameStartTimestamp >= seasonStartTime ? matchResponse.data : null;
    if (filteredMatch === null) {
      return [];
    }
    const filteredTarget = filteredMatch.info.participants.filter(data => data.puuid === puuid).map(data => ({
      kda: data.challenges.kda,
      championName: data.championName,
      kills: data.kills,
      deaths: data.deaths,
      assists: data.assists,
      cs: data.totalMinionsKilled + data.neutralMinionsKilled,
      win: data.win ? 1 : 0,
      lose: !data.win ? 1 : 0,
      played: 1,
      totalDamageDealtToChampions: data.totalDamageDealtToChampions,
      totalDamageTaken: data.totalDamageTaken,
      goldEarned: data.goldEarned,
      doubleKills: data.doubleKills,
      tripleKills: data.tripleKills,
      quadraKills: data.quadraKills,
      pentaKills: data.pentaKills,
      visionScore: data.visionScore,
    }));
    return filteredTarget;
    });
  
    const matchInfoList = await Promise.all(matchPromises);
  
    const concatData = matchInfoList.flatMap(data => data).reduce((acc, cur) => {
      const existingDataIndex = acc.findIndex(item => item.championName === cur.championName);
      if (existingDataIndex !== -1) {
        if (cur.win === 1) {
          acc[existingDataIndex].win++;
        }
        else if (cur.lose === 1) {
          acc[existingDataIndex].lose++;
        }
        acc[existingDataIndex].kda += cur.kda;
        acc[existingDataIndex].kills += cur.kills;
        acc[existingDataIndex].deaths += cur.deaths;
        acc[existingDataIndex].assists += cur.assists;
        acc[existingDataIndex].cs += cur.cs;
        acc[existingDataIndex].played += cur.played;
        acc[existingDataIndex].totalDamageDealtToChampions += cur.totalDamageDealtToChampions;
        acc[existingDataIndex].totalDamageTaken += cur.totalDamageTaken;
        acc[existingDataIndex].goldEarned += cur.goldEarned;
        acc[existingDataIndex].doubleKills += cur.doubleKills;
        acc[existingDataIndex].tripleKills += cur.tripleKills;
        acc[existingDataIndex].quadraKills += cur.quadraKills;
        acc[existingDataIndex].pentaKills += cur.pentaKills;
        acc[existingDataIndex].visionScore += cur.visionScore;
  
        if (cur.kills > acc[existingDataIndex].maximumKills) {
          acc[existingDataIndex].maximumKills = cur.kills;
        }
  
        if (cur.deaths > acc[existingDataIndex].maximumDeaths) {
          acc[existingDataIndex].maximumDeaths = cur.deaths;
          }
        }
        else {
          acc.push({
            ...cur,
            maximumKills: cur.kills,
            maximumDeaths: cur.deaths,
          });
        }
      return acc;
    }, []);
  
    return concatData;
  }
  catch (error) {
    console.log(`Error fetching TeamRank match info for matchId ${matchId}:`, error);
    return null;
  }
}

export async function getTeamRankMatchInfoStat(puuid, teamMatchIds) {
  const seasonStartTime = new Date('2024-01-10T12:00:00Z').getTime()
  try {
    const matchPromises = teamMatchIds.map(async (matchId) => {
      const matchResponse = await axios.get(
        `https://asia.api.riotgames.com/lol/match/v5/matches/${matchId}`,
        {
          headers: {
            'X-Riot-Token': process.env.RIOT_API_KEY,
          },
        }
      );
      const filteredMatch = matchResponse.data.info.gameStartTimestamp >= seasonStartTime ? matchResponse.data : null;
      if (filteredMatch === null) {
        return []; // 빈 배열 반환
      }
      const filteredTarget = filteredMatch.info.participants.filter(data => data.puuid === puuid).map(data => ({
        kda: data.challenges.kda,
        championName: data.championName,
        kills: data.kills,
        deaths: data.deaths,
        assists: data.assists,
        cs: data.totalMinionsKilled + data.neutralMinionsKilled,
        win: data.win ? 1 : 0,
        lose: !data.win ? 1 : 0,
        played: 1,
        totalDamageDealtToChampions: data.totalDamageDealtToChampions,
        totalDamageTaken: data.totalDamageTaken,
        goldEarned: data.goldEarned,
        doubleKills: data.doubleKills,
        tripleKills: data.tripleKills,
        quadraKills: data.quadraKills,
        pentaKills: data.pentaKills,
        visionScore: data.visionScore,
      }));
      return filteredTarget;
    });

    const matchInfoList = await Promise.all(matchPromises);

    const concatData = matchInfoList.flatMap(data => data).reduce((acc, cur) => {
      const existingDataIndex = acc.findIndex(item => item.championName === cur.championName);
      if (existingDataIndex !== -1) {
        if (cur.win === 1) {
          acc[existingDataIndex].win++;
        } else if (cur.lose === 1) {
          acc[existingDataIndex].lose++;
        }
        acc[existingDataIndex].kda += cur.kda;
        acc[existingDataIndex].kills += cur.kills;
        acc[existingDataIndex].deaths += cur.deaths;
        acc[existingDataIndex].assists += cur.assists;
        acc[existingDataIndex].cs += cur.cs;
        acc[existingDataIndex].played += cur.played;
        acc[existingDataIndex].totalDamageDealtToChampions += cur.totalDamageDealtToChampions;
        acc[existingDataIndex].totalDamageTaken += cur.totalDamageTaken;
        acc[existingDataIndex].goldEarned += cur.goldEarned;
        acc[existingDataIndex].doubleKills += cur.doubleKills;
        acc[existingDataIndex].tripleKills += cur.tripleKills;
        acc[existingDataIndex].quadraKills += cur.quadraKills;
        acc[existingDataIndex].pentaKills += cur.pentaKills;
        acc[existingDataIndex].visionScore += cur.visionScore;

        if (cur.kills > acc[existingDataIndex].maximumKills) {
          acc[existingDataIndex].maximumKills = cur.kills;
        }

        // 최대 데스 업데이트
        if (cur.deaths > acc[existingDataIndex].maximumDeaths) {
          acc[existingDataIndex].maximumDeaths = cur.deaths;
        }
      } else {
        acc.push({
          ...cur,
          maximumKills: cur.kills,
          maximumDeaths: cur.deaths,
        });
      }
      return acc;
    }, []);

    return concatData;
  } catch (error) {
    console.log(`Error fetching TeamRank match info for matchId ${matchId}:`, error);
    return null;
  }
}