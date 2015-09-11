import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  // getModel
  getModel: async () => {
    let selectionActives = await db.SelectionActive.findAll({
      include: [ { model: db.Image } ],
      order: [ 'SelectionActive.id' ]
    });
    return selectionActives;
  },
  // end getModel

  // save
  save: async (selectionActives) => {
    try {
      // take out images from input raw selectionActives.
      let newImages = await* selectionActives.map((selectionActive) => {
        return selectionActive.Images;
      });

      // sperate selectionActives.
      let newSelectionActives = [];
      await* selectionActives.map((selectionActive) => {
        delete selectionActive.Images;
        newSelectionActives.push(selectionActive);
      });

      // save SelectionActives.
      let saveSelectionActive = await* newSelectionActives.map((selectionActive) =>
        db.SelectionActive.create(selectionActive)
      );

      // save images
      let saveImages = [];
      for( var i=0;i<newImages.length;i++ ){
        saveImages.push(await* newImages[i].map((image) => db.Image.create(image)));
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
