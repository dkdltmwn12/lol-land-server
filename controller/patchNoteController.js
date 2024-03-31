import { fetchingPatchNote } from '../api/patchNote.js';
import pacthNoteModel from '../models/patchNote.js';

const fetchPatchNote = async (req, res) => {
    try {
      const getPatchNoteDatas = await fetchingPatchNote();

      await Promise.all(getPatchNoteDatas.map(async (data) => { 
        try {
          const existingPatchNote = await pacthNoteModel.findOne({ patchVersion : data.patchVersion });

          if (!existingPatchNote) { // DB에 데이터가 존재하지 않는다면 생성 및 저장
            await pacthNoteModel.create(data);
          }
        }
        catch (error) {
          res.status(500).json({message : error})
        }
      }));
      res.json({message : '패치노트 데이터를 성공적으로 가져왔습니다.'});
    }
    catch (error) {
      res.status(500).json({ error: '서버 오류' });
    }
}

const getPatchNote = async (req, res) => {
    try {
    const patchNote = await pacthNoteModel.find({patchVersion : 'patch-14-5'})
    res.json(patchNote)
    } catch (error) {
    res.status(500).json({ error: '서버 오류' });
  }
}

export {fetchPatchNote, getPatchNote}