import xlsx from 'node-xlsx';
import moment from 'moment';
import fs from 'fs';
import _ from 'lodash';

module.exports = {

  create: async (date) => {
    try {

      // [ sheets
      //   { sheet
      //     data:[ SheetData 存放單頁試算表資料
      //       [ ] singleSheetData 存放單頁單行試算表資料
      //     ]
      //     name: 存放單頁試算表頁面名稱
      //   }
      // ]
      let startDate = moment(date, 'YYYY-MM').startOf('month');
      let endDate = moment(date, 'YYYY-MM').endOf('month');
      var totalPrice = 0;

      // sheetHeader 存放單頁試算表表頭
      var sheetHeader = [
        '訂單編號',
        '數量',
        '狀態',
        '購買人',
        '訂單日期',
      ];
      var sheetData = [];
      var sheet = {};
      var sheets = [];
      let allOrder = await OrderService.findAllByDateComplete(startDate, endDate);
      sheetData.push([]);
      sheetData.push(sheetHeader);

      _.forEach(allOrder, function(eachReport) {
        let singleSheetData = [];
        let eachReportData = eachReport.dataValues;
        let orderItems = eachReportData.OrderItems;

        singleSheetData.push(eachReportData.serialNumber);
        singleSheetData.push(eachReportData.quantity);
        singleSheetData.push(eachReportData.status);
        singleSheetData.push(eachReportData.User.dataValues.username);
        singleSheetData.push(eachReportData.updatedAt);

        _.forEach(orderItems, function(orderItem) {
          let quantity = orderItem.dataValues.quantity;
          let price = orderItem.dataValues.price;
          totalPrice += quantity * price;
        });

        sheetData.push(singleSheetData);
        sheetData[0].push('總金額', totalPrice);

        sheet.data = sheetData;
        sheet.name = 'Report-' + date;
      });

      sheets.push(sheet);

      let excel = await ReportService.buildExcel(sheets, date, date);
      console.log(excel);
      return excel;
    } catch (error) {
      console.error(error);
    }
  },

  buildExcel: async (data, startDate, endDate) => {
    try {
      var excelData = {};
      var filename = '';
      if (startDate === endDate) {
        filename = 'Report-' + startDate;
      } else {
        filename = 'Report-' + startDate + '-' + endDate;
      }

      if (!fs.existsSync('report')) {
        fs.mkdirSync('report');
      }

      let filePath = 'report/' + filename + '.xlsx';
      var buffer = await xlsx.build(data);
      fs.writeFileSync(filePath, buffer);
      return filePath;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
