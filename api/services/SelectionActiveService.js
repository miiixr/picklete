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
      console.log('=== raw selectionActives ==>',selectionActives);

      let newImages = [];
      let newSelectionActives = [];
      let insertedImage,insertSelectionActive;

      let createdSelectionActives = await* selectionActives.map((selectionActive) => {
        // console.log('=== selectionActive ==>\n',selectionActive);
        newImages.push(selectionActive.Images);
        insertImage = db.Image.create(selectionActive.Images);
        delete selectionActive.Images;
        newSelectionActives.push(selectionActive);
        insertSelectionActive = db.SelectionActive.create(selectionActive);
        insertSelectionActive.setImages(insertImage);
      });
      console.log('=== newSelectionActives ==>\n',newSelectionActives);
      console.log('=== newImages ==>\n',newImages);

      // let createdImages = await* newImages.map((newImage) => db.Image.create(newImage));
      // let createdSelectionActive =
      //   await* newSelectionActives.map((selectionActive) => db.SelectionActive.create(selectionActive));

      // console.log('=== createdImages.length ==>\n',createdImages.length);
      // console.log('=== createdSelectionActive.length ==>',createdSelectionActive.length);

      // for( var selectionActive in createdSelectionActive){
      //   for ( var images in createdImages){
      //     await selectionActive.setImages(images);
      //   }
      // }

      return createdSelectionActives;
    } catch (e) {
      console.log('=== create err ==>',e);
      return false;
    }
  },
  // end save

};
