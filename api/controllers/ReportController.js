/**
 * ReportController
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
import fs from 'fs';
import xlsx from 'node-xlsx';
import _ from 'lodash';
import moment from 'moment';

module.exports = {
  export: async (req, res) => {
    let date = req.body.date;

    let excel = await ReportService.create(date);

    await res.download(excel);

    // await fs.unlink(excel);
  },

};
