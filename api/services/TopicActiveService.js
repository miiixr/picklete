import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  // getModel
  getModel: async () => {
    let topicActives = await db.TopicActive.findAll({
      include: [
        {model: db.Image,as: 'ImageA'},
        {model: db.Image,as: 'ImageA1'},
        {model: db.Image,as: 'ImageA2'},
        {model: db.Image,as: 'ImageB'},
        {model: db.Image,as: 'ImageB1'},
        {model: db.Image,as: 'ImageB2'},
        {model: db.Image,as: 'ImageC'},
        {model: db.Image,as: 'ImageC1'},
        {model: db.Image,as: 'ImageC2'}
      ],
      order: [ 'TopicActive.weight' ]
    });
    return topicActives;
  },
  // end getModel

  // save
  save: async (topicActives) => {
    try {

      // clear old topicActive data
      let oldDatas = await db.TopicActive.findAll();
      let deleteAll = await* oldDatas.map(async (oldOne) => {
        console.log('=== now destroying oldOne id ==>',oldOne.id);
        return await oldOne.destroy();
      });

      let imageNames = ['ImageA','ImageA1','ImageA2','ImageB','ImageB1','ImageB2','ImageC','ImageC1','ImageC2'];
      let topicActivesData = [];

      // create images then return topicActive with image id
      topicActivesData = await* topicActives.map(async (topicActive) => {
        topicActive = await* imageNames.map(async (imageName) => {
          let createdImageData = await db.Image.create(topicActive[imageName]);
          delete topicActive[imageName];
          topicActive[imageName+'Id'] = createdImageData.id;
          return topicActive;
        });
        return topicActive[0];
      });

      // save TopicActives
      let savedTopicActive = await* topicActivesData.map(async (topicActive) => {
        return await db.TopicActive.create(topicActive);
      });

      return {savedTopicActive, success: true};
      // return {saveSelectionActive, success};
    } catch (e) {
      let msg = e.message;
      return { msg, success: false};
    }
  }
  // end save

};
