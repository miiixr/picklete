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
    if (excel == null) {
      let dateList = await ReportService.list();
      return res.view('promotion/controlShopReportForm', {
        pageName: '/admin/shop-report-form',
        dateList: dateList,
        message: req.flash('message', '此月份沒有訂單資料'),
      });
    } else {
      await res.download(excel);
    }

    // await fs.unlink(excel);
  },

  list: async (req, res) => {

    let list = await ReportService.list();

    return res.ok(list);
  },

};
