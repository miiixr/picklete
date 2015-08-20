import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  findAll: async () => {
    let groups = await db.UserGroup.findAll();
    return groups;
  },

  findOne: async (id) => {
    let group = await db.UserGroup.findById(id);
    return group;
  }

};
