import axios from 'axios';
import cheerio from 'cheerio'

export async function fetchingPatchNote() {
  try {
    const UPDATE_VERSION = 'patch-14-5';
    const response = await axios.get(`https://www.leagueoflegends.com/ko-kr/news/game-updates/${UPDATE_VERSION}-notes/`);
    const html = response.data;
    const $ = cheerio.load(html);

    const dataList = [];
    for (let i = 9; i <= 28; i++) {
      $(`#patch-notes-container > div:nth-child(${i}) > div > div`).each((_, div) => {
        const championStatAbility1ChangeList = [];
        const championStatAbility2ChangeList = [];
        const championStatAbility3ChangeList = [];
        const championStatAbility4ChangeList = [];
        const championStatAbility5ChangeList = [];
        const championStatAbility6ChangeList = [];
        const championName = $(div).find('h3').text();
        const championImg = $(div).find('img').attr('src') === undefined ? '' :  $(div).find('img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        const championChangeSummary = $(div).find('p.summary').text().replace(/[\n\t]/g, '');;
        const championChangePurpose = $(div).find('blockquote').text().replace(/[\n\t]/g, '');;
        // #patch-notes-container > div:nth-child(9) > div > div > p
        // #patch-notes-container > div:nth-child(9) > div > div > blockquote

        const ability1Title = $(div).find('h4:nth-child(6)').text();
        // const ability1Value = $(div).find('ul:nth-child(7) > li').text().replace(/[\n\t]/g, '');
        $(div).find('ul:nth-child(7) > li').each((_, li) => {
          const championStatValueChange = $(li).text().replace(/[\n\t]/g, '');
          championStatAbility1ChangeList.push(championStatValueChange);
        });
        const ability1Img = $(div).find('h4:nth-child(6) > img').length > 0 
        ? $(div).find('h4:nth-child(6) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : $(div).find('h4:nth-child(7) > img').length > 0 ? $(div).find('h4:nth-child(7) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : ''
        
        
        const ability2Title = $(div).find('h4:nth-child(9)').text();
        // const ability2Value = $(div).find('ul:nth-child(10) > li').text().replace(/[\n\t]/g, '');
        $(div).find('ul:nth-child(10) > li').each((_, li) => {
          const championStatValueChange = $(li).text().replace(/[\n\t]/g, '');
          championStatAbility2ChangeList.push(championStatValueChange);
        });
        const ability2Img = $(div).find('h4:nth-child(9) > img').length > 0 
        ? $(div).find('h4:nth-child(9) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : $(div).find('h4:nth-child(9) > img').length > 0 ? $(div).find('h4:nth-child(9) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : ''
        

        const ability3Title = $(div).find('h4:nth-child(12)').text();
        // const ability3Value = $(div).find('ul:nth-child(13) > li').text().replace(/[\n\t]/g, '');
        $(div).find('ul:nth-child(13) > li').each((_, li) => {
          const championStatValueChange = $(li).text().replace(/[\n\t]/g, '');
          championStatAbility3ChangeList.push(championStatValueChange);
        });
        const ability3Img = $(div).find('h4:nth-child(12) > img').length > 0 
        ? $(div).find('h4:nth-child(12) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : $(div).find('h4:nth-child(11) > img').length > 0 ? $(div).find('h4:nth-child(11) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : ''

        const ability4Title = $(div).find('h4:nth-child(15)').text();
        // const ability4Value = $(div).find('ul:nth-child(16) > li').text().replace(/[\n\t]/g, '');
        $(div).find('ul:nth-child(16) > li').each((_, li) => {
          const championStatValueChange = $(li).text().replace(/[\n\t]/g, '');
          championStatAbility4ChangeList.push(championStatValueChange);
        });
        const ability4Img = $(div).find('h4:nth-child(15) > img').length > 0 
        ? $(div).find('h4:nth-child(15) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : $(div).find('h4:nth-child(13) > img').length > 0 ? $(div).find('h4:nth-child(13) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : ''

        const ability5Title = $(div).find('h4:nth-child(18)').text();
        // const ability5Value = $(div).find('ul:nth-child(19) > li').text().replace(/[\n\t]/g, '');
        $(div).find('ul:nth-child(19) > li').each((_, li) => {
          const championStatValueChange = $(li).text().replace(/[\n\t]/g, '');
          championStatAbility5ChangeList.push(championStatValueChange);
        });
        const ability5Img = $(div).find('h4:nth-child(18) > img').length > 0 
        ? $(div).find('h4:nth-child(18) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : $(div).find('h4:nth-child(15) > img').length > 0 ? $(div).find('h4:nth-child(15) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : ''

        const ability6Title = $(div).find('h4:nth-child(21)').text();
        // const ability6Value = $(div).find('ul:nth-child(22) > li').text().replace(/[\n\t]/g, '');
        $(div).find('ul:nth-child(22) > li').each((_, li) => {
          const championStatValueChange = $(li).text().replace(/[\n\t]/g, '');
          championStatAbility6ChangeList.push(championStatValueChange);
        });
        const ability6Img = $(div).find('h4:nth-child(21) > img').length > 0 
        ? $(div).find('h4:nth-child(21) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : $(div).find('h4:nth-child(18) > img').length > 0 ? $(div).find('h4:nth-child(18) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        : ''

        const info = {
          patchVersion: UPDATE_VERSION,
          championName,
          championImg,
          championChangeSummary,
          championChangePurpose,
          abilityImg: {
            ability1Img,
            ability2Img,
            ability3Img,
            ability4Img,
            ability5Img,
            ability6Img,
          },
          statTitle: {
            ability1Title,
            ability2Title,
            ability3Title,
            ability4Title,
            ability5Title,
            ability6Title,
          },
          statValue : {
            ability1Value : championStatAbility1ChangeList,
            ability2Value : championStatAbility2ChangeList,
            ability3Value : championStatAbility3ChangeList,
            ability4Value : championStatAbility4ChangeList,
            ability5Value : championStatAbility5ChangeList,
            ability6Value : championStatAbility6ChangeList,
          },
        };
        dataList.push(info);
      });
    }

    for (let i = 30; i <= 41; i++) {
      $(`#patch-notes-container > div:nth-child(${i}) > div > div`).each((_, div) => {
        const itemValueChangeList = [];
        const itemName = $(div).find('h3').text();
        const itemImg = $(div).find('img').attr('src') === undefined ? '' :  $(div).find('img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '')
        const itemChangePurpose = $(div).find('blockquote').text().replace(/[\n\t]/g, '');;

        $(div).find('ul > li').each((_, li) => {
          const itemValueChange = $(li).text().replace(/[\n\t]/g, '');
          itemValueChangeList.push(itemValueChange);
        });

        const info = {
          patchVersion: UPDATE_VERSION,
          itemName,
          itemImg,
          itemChangePurpose,
          itemValueChange : {
            itemValueChangeList
          },
        };
        dataList.push(info);
      });
    }
    return dataList
  } catch (error) {
    console.error('패치노트 에러:', error);
    throw error;
  }
  // try {
  //   const UPDATE_VERSION ='patch-14-5';
  //   const response = await axios.get(`https://www.leagueoflegends.com/ko-kr/news/game-updates/${UPDATE_VERSION}-notes/`);
  //   const html = response.data;
  //   const $ = cheerio.load(html);
  //   const dataList = [];
  //   for(let i=9; i <= 35; i++) {
  //     $(`#patch-notes-container > div:nth-child(${i}) > div > div`).each((_, div) => {
  //       const info = {
  //         championName : $(div).find('h3').text(),
  //         //description : $(div).find('p').text() || $(div).find('blockquote').text().trim(''),
  //         championImg : $(div).find('img').attr('src') === undefined ? '' :  $(div).find('img').attr('src').replace('https://am-a.akamaihd.net/image?f=', ''),
  //         abilityImg: 
  //         {
  //           ability1Img : $(div).find('h4:nth-child(6) > img').length > 0 ? $(div).find('h4:nth-child(6) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ($(div).find('h4:nth-child(7) > img').length > 0 ? $(div).find('h4:nth-child(7) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ''),
  //           ability2Img : $(div).find('h4:nth-child(9) > img').length > 0 ? $(div).find('h4:nth-child(9) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ($(div).find('h4:nth-child(9) > img').length > 0 ? $(div).find('h4:nth-child(9) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ''),
  //           ability3Img : $(div).find('h4:nth-child(12) > img').length > 0 ? $(div).find('h4:nth-child(12) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ($(div).find('h4:nth-child(11) > img').length > 0 ? $(div).find('h4:nth-child(11) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ''),
  //           ability4Img : $(div).find('h4:nth-child(15) > img').length > 0 ? $(div).find('h4:nth-child(15) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ($(div).find('h4:nth-child(13) > img').length > 0 ? $(div).find('h4:nth-child(13) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ''),
  //           ability5Img : $(div).find('h4:nth-child(18) > img').length > 0 ? $(div).find('h4:nth-child(18) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ($(div).find('h4:nth-child(15) > img').length > 0 ? $(div).find('h4:nth-child(15) > img').attr('src').replace('https://am-a.akamaihd.net/image?f=', '') : ''),
  //         },
  //         statTitle : 
  //         {
  //           ability1Title : $(div).find('h4:nth-child(6)').length > 0 ? $(div).find('h4:nth-child(6)').text() : ($(div).find('h4:nth-child(7)').length > 0 ? $(div).find('h4:nth-child(7)').text() : ''),
  //           ability2Title : $(div).find('h4:nth-child(9)').length > 0 ? $(div).find('h4:nth-child(9)').text() : ($(div).find('h4:nth-child(10)').length > 0 ? $(div).find('h4:nth-child(10)').text() : ''),
  //           ability3Title : $(div).find('h4:nth-child(12)').length > 0 ? $(div).find('h4:nth-child(12)').text() : ($(div).find('h4:nth-child(13)').length > 0 ? $(div).find('h4:nth-child(13)').text() : ''),
  //           ability4Title : $(div).find('h4:nth-child(15)').length > 0 ? $(div).find('h4:nth-child(15)').text() : ($(div).find('h4:nth-child(16)').length > 0 ? $(div).find('h4:nth-child(16)').text() : ''),
  //           ability5Title : $(div).find('h4:nth-child(18)').length > 0 ? $(div).find('h4:nth-child(18)').text() : ($(div).find('h4:nth-child(19)').length > 0 ? $(div).find('h4:nth-child(19)').text() : ''),
  //           ability6Title : $(div).find('h4:nth-child(21)').length > 0 ? $(div).find('h4:nth-child(21)').text() : ($(div).find('h4:nth-child(22)').length > 0 ? $(div).find('h4:nth-child(22)').text() : ''),
  //         },
  //         statValue : 
  //         {
  //           ability1Value : $(div).find('ul:nth-child(7) > li').length > 0 ? $(div).find('ul:nth-child(7) > li').text().replace(/[\n\t]/g, '') : ($(div).find('ul:nth-child(8) > li ').text().replace(/[\n\t]/g, '')),
  //           ability2Value : $(div).find('ul:nth-child(10) > li').length > 0 ? $(div).find('ul:nth-child(10) > li').text().replace(/[\n\t]/g, '') : ($(div).find('ul:nth-child(11) > li').text().replace(/[\n\t]/g, '')),
  //           ability3Value : $(div).find('ul:nth-child(13) > li').length > 0 ? $(div).find('ul:nth-child(13) > li').text().replace(/[\n\t]/g, '') : ($(div).find('ul:nth-child(14) > li').text().replace(/[\n\t]/g, '')),
  //           ability4Value : $(div).find('ul:nth-child(16) > li').length > 0 ? $(div).find('ul:nth-child(16) > li').text().replace(/[\n\t]/g, '') : ($(div).find('ul:nth-child(17) > li').text().replace(/[\n\t]/g, '')),
  //           ability5Value : $(div).find('ul:nth-child(19) > li').length > 0 ? $(div).find('ul:nth-child(19) > li').text().replace(/[\n\t]/g, '') : ($(div).find('ul:nth-child(21) > li').text().replace(/[\n\t]/g, '')),
  //           ability5Value : $(div).find('ul:nth-child(22) > li').length > 0 ? $(div).find('ul:nth-child(22) > li').text().replace(/[\n\t]/g, '') : ($(div).find('ul:nth-child(24) > li').text().replace(/[\n\t]/g, '')),
  //         },
  //         patchVersion : UPDATE_VERSION
  //       };
  //       dataList.push(info)
  //     })
  //   }
  //   const filteredDataList = dataList.filter((item, index, self) => (
  //     index === self.findIndex((i) => i.championName === item.championName) && item.championName !== ""
  //   ));
  //   return filteredDataList
  // }
  // catch (error) {
  //   console.error('패치노트 에러:', error);
  //   throw error
  // }
}