import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  // getModel
  getModel: async () => {
    let selectionActives = await db.SelectionActive.findAll({
      include: [ { model: db.Image } ],
      order: [ 'SelectionActive.weight' ]
    });
    return selectionActives;
  },
  // end getModel

  // save
  save: async (selectionActives) => {
    try {
      // delete old one.
      let oldDatas = await db.SelectionActive.findAll();
      let deleteAll = await* oldDatas.map(async (oldOne) => {
        console.log('=== now destroying oldOne id ==>',oldOne.id);
        await oldOne.destroy();
      });

      // take out images from input raw selectionActives.
      let newImages = await* selectionActives.map(async (selectionActive) => {
        return await selectionActive.Images;
      });

      // sperate selectionActives.
      let newSelectionActives = [];
      await* selectionActives.map(async (selectionActive) => {
        delete selectionActive.Images;
        newSelectionActives.push(selectionActive);
        return selectionActive;
      });

      // save SelectionActives.
      let saveSelectionActive = await* newSelectionActives.map(async (selectionActive) =>
        await db.SelectionActive.create(selectionActive)
      );

      // save images
      let saveImages = [];
      for( var i=0;i<newImages.length;i++ ){
        saveImages.push(await* newImages[i].map(async (image) => await db.Image.create(image)));
        await saveSelectionActive[i].setImages(saveImages[i]);
      }

      return {saveSelectionActive, success: true};
      // return {saveSelectionActive, success};
    } catch (e) {
      let msg = e.message;
      return { msg, success: false};
    }
  }
  // end save

};
