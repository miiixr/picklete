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
    let startDate = moment(date, 'YYYY-MM').startOf('month');
    let endDate = moment(date, 'YYYY-MM').endOf('month');

    // console.log(startDate, endDate);
    let allOrder = await OrderService.findAllByDateComplete(startDate, endDate);
    console.log(allOrder[0].dataValues);
    _.forEach({ 'a': 1, 'b': 2 }, (n, key) => {
      console.log(n, key);
    });

    let excel = await ReportService.buildExcel(result);
    res.download(excel, function(err) {
      if (err) {
        return res.serverErrorWithSocket(ParserService.errorToJson(err));
      }

      return fs.unlink(excelPath, function(err) {
        if (err) {
          return res.serverErrorWithSocket(ParserService.errorToJson(err));
        }
      });
    });
  },

};
