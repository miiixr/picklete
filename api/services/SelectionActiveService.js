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
      let createSelectionActives = await db.Promotion.create(createSelectionActives);
      console.log('=== createSelectionActives ==>',createSelectionActives);
      return createSelectionActives;
    } catch (e) {
      console.log('=== create err ==>',e);
      return false;
    }
  },
  // end save

};
