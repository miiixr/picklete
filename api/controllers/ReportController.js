/**
 * ReportController
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let fs = require('fs');
let xlsx = require('node-xlsx');
import moment from 'moment';

module.exports = {
  export: async (req, res) => {
    let date = req.body.date;
    console.log("-----------------------");
    console.log(moment(date));
    console.log(moment(date).month(1));
    console.log("-----------------------");
    await OrderService.findAllByDateComplete(date, function(error, result) {
      ReportService.buildExcel(result, function(error, excelPath) {
        res.download(excelPath, function(err) {
          if (err) {
            return res.serverErrorWithSocket(ParserService.errorToJson(err));
          }

          return fs.unlink(excelPath, function(err) {
            if (err) {
              return res.serverErrorWithSocket(ParserService.errorToJson(err));
            }
          });
        });
      });
    });
  },

};
