import fs from 'fs';
import mime from "mime";
import util from "util";

module.exports = {

  findAll: async () => {
    let userGroupIds = await db.UserGroup.findAll();
    return userGroupIds;
  },

  findOne: async (id) => {
    let userGroup = await db.UserGroup.findById(id);
    return userGroup;
  }

};
