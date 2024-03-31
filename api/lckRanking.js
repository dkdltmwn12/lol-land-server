const axios = require('axios');
const cheerio = require('cheerio');

async function fetchingRanking() {
  try {
    const response = await axios.get('https://search.naver.com/search.naver?where=nexearch&sm=top_sly.hst&fbm=0&acr=1&ie=utf8&query=lck+%EC%88%9C%EC%9C%84')
    const html = response.data;
    const $ = cheerio.load(html);
  
    const dataList = [];
    for(let i=1; i<=2; i++) {
      for(let j=1; j<=5; j++) {
        $(`#main_pack > div.sc_new.cs_common_module.case_normal._kgs_esports.color_6 > div.cm_content_wrap > 
        div > div > div > div > div.inner > div > table:nth-child(${i}) > tbody > tr:nth-child(${j})`)
        .each((_, td) => {
          const info = {
            ranking : $(td).find('span.rank_num').text(),
            teamName : $(td).find('span.text').text(),
            teamImg : $(td).find('span.team_thumb > img').attr('src'),
            win : $(td).find(':nth-child(2) > span').text(),
            // lose : $(td).find(':nth-child(3) > span').text().replace(/\D/g, ''),
            lose : $(td).find(':nth-child(3) > span').text().replace($(td).find('span.text').text(), ''),
            winRate : $(td).find(':nth-child(4) > span').text(),
            score : $(td).find(':nth-child(5) > span').text(),
          };
            dataList.push(info)
        });
      }
    }
    return dataList;
  }
  catch (error) {
    console.error('랭킹 검색 에러:', error);
    throw error;
  }
}

module.exports = {fetchingRanking}

// const dataList = [];

// axios.get('https://search.naver.com/search.naver?where=nexearch&sm=top_sly.hst&fbm=0&acr=1&ie=utf8&query=lck+%EC%88%9C%EC%9C%84')
// .then(response => {
//     const html = response.data;
//     const $ = cheerio.load(html);
//     for(let i=1; i<=2; i++) {
//         for(let j=1; j<=5; j++) {
//             $(`#main_pack > div.sc_new.cs_common_module.case_normal._kgs_esports.color_6 > div.cm_content_wrap > 
//             div > div > div > div > div.inner > div > table:nth-child(${i}) > tbody > tr:nth-child(${j})`)
//             .each((_, td) => {
//                 const info = {
//                     ranking : $(td).find('span.rank_num').text(),
//                     teamName : $(td).find('span.text').text(),
//                     teamImg : $(td).find('span.team_thumb > img').attr('src'),
//                     win : $(td).find(':nth-child(2) > span').text(),
//                     // lose : $(td).find(':nth-child(3) > span').text().replace(/\D/g, ''),
//                     lose : $(td).find(':nth-child(3) > span').text().replace($(td).find('span.text').text(), ''),
//                     winRate : $(td).find(':nth-child(4) > span').text(),
//                     score : $(td).find(':nth-child(5) > span').text(),
//                 }
//                 dataList.push(info)
//             })
//         }
//     }
//    console.log(dataList);
//    const jsonData = JSON.stringify(dataList)
//    fs.writeFile(`../client/public/data/lck-Ranking.json`, jsonData, 'utf-8', (err) => {
//     if(err) {
//        console.error(err);
//     }
//     else {
//        console.log('json file upload');
//     }})
// })
// .catch(error => {
//     console.error(error);
// })