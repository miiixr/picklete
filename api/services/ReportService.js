// import xlsx from 'node-xlsx';
import xlsx from 'xlsx-style';
import moment from 'moment';
import fs from 'fs';
import _ from 'lodash';

module.exports = {

  create: async (date) => {
    try {
      let startDate = moment(date, 'YYYY-MM').startOf('month');
      let endDate = moment(date, 'YYYY-MM').endOf('month');

      var wsName = date;

      var wscols = [
        { wch:10 },
        { wch:10 },
        { wch:10 },
        { wch:20 },
      ];
      function Workbook() {
        if (!(this instanceof Workbook)) return new Workbook();
        this.SheetNames = [];
        this.Sheets = {};
      }

      var wb = new Workbook();
      var header = [
        '訂單編號',
        '貨號',
        '品牌名稱',
        '商品名稱',
        '定價',
        '數量',
        '售價',
        '運費',
        '包裝費',
        '折扣碼',
        '總計',
        '付款方式',
        '購買人',
      ];

      function sheetFromArrayOfArrays(data, opts) {
        var ws = {};
        var range = { s: { c:10000000, r:10000000 }, e: { c:0, r:0 } };
        for (var R = 0; R != data.length; ++R) {
          for (var C = 0; C != data[R].length; ++C) {
            if (range.s.r > R) range.s.r = R;
            if (range.s.c > C) range.s.c = C;
            if (range.e.r < R) range.e.r = R;
            if (range.e.c < C) range.e.c = C;
            if (R == 0) {
              var cell = { v: data[R][C] };
              // var cell = { v: data[R][C] , s: { fill: { fgColor: 'FF686667', } } };
            } else {
              var cell = { v: data[R][C] };
            }
            if (cell.v == null) continue;
            var cellRef = xlsx.utils.encode_cell({ c:C, r:R });

            /* TEST: proper cell types and value handling */
            if (typeof cell.v === 'number') cell.t = 'n';
            else if (typeof cell.v === 'boolean') cell.t = 'b';
            else if (cell.v instanceof Date) {
              cell.t = 'n'; cell.z = xlsx.SSF._table[14];
              cell.v = datenum(cell.v);
            } else cell.t = 's';
            ws[cellRef] = cell;
          }
        }

        /* TEST: proper range */
        if (range.s.c < 10000000) ws['!ref'] = xlsx.utils.encode_range(range);
        return ws;
      }

      var sheetData = [];
      sheetData.push(header);
      let allOrdertest = await OrderService.findAllByDateComplete(startDate, endDate);

      if (allOrdertest.length != 0) {
        _.forEach(allOrdertest, function(eachReport) {
          let singleSheetData = [];
          let eachReportData = eachReport.dataValues;
          let orderItems = eachReportData.OrderItems;

          var count = 0;
          _.forEach(orderItems, function(orderItem) {
            if (count == 0) singleSheetData.push(eachReportData.serialNumber);
            else {
              singleSheetData.push([]);
            }

            singleSheetData.push(orderItem.dataValues.Product.dataValues.productNumber);
            if (orderItem.dataValues.Product.dataValues.ProductGm) {
              singleSheetData.push(orderItem.dataValues.Product.dataValues.ProductGm.dataValues.Brand.dataValues.name);
            } else {
              singleSheetData.push([]);
            }

            singleSheetData.push(orderItem.dataValues.Product.dataValues.name);
            singleSheetData.push(orderItem.dataValues.Product.dataValues.price);
            singleSheetData.push(orderItem.dataValues.quantity);
            singleSheetData.push(orderItem.dataValues.price);
            if (count == 0) {
              singleSheetData.push(eachReportData.Shipment.dataValues.shippingFee);
              singleSheetData.push(eachReportData.packingFee);
              if (eachReportData.ShopCode) {
                singleSheetData.push(eachReportData.ShopCode.dataValues.restriction);
              } else {
                singleSheetData.push([]);
              }

              singleSheetData.push(eachReportData.paymentTotalAmount);
              singleSheetData.push(eachReportData.allPayPaymentType);
              singleSheetData.push(eachReportData.paymentConfirmName);
            } else {
              singleSheetData.push([]);
              singleSheetData.push([]);
              singleSheetData.push([]);
              singleSheetData.push([]);
              singleSheetData.push([]);
              singleSheetData.push([]);
            }

            sheetData.push(singleSheetData);
            singleSheetData = [];
            count++;
          });
        });
      };

      var ws = sheetFromArrayOfArrays(sheetData);

      wb.SheetNames.push(wsName);
      wb.Sheets[wsName] = ws;

      /* TEST: column widths */
      ws['!cols'] = wscols;

      let excel = await ReportService.buildExcel(wb, date, date);
      return excel;
    } catch (error) {
      sails.log.error(error);
    }
  },

  buildExcel: async (workbook, startDate, endDate) => {
    try {
      let filename = '';
      if (startDate === endDate) {
        filename = 'Report-' + startDate;
      } else {
        filename = 'Report-' + startDate + '-' + endDate;
      }

      if (!fs.existsSync('report')) {
        fs.mkdirSync('report');
      }

      let filePath = 'report/' + filename + '.xlsx';

      await xlsx.writeFile(
        workbook,
        filePath,
        {
          bookType: 'xlsx',
          bookSST: false,
        }
      );

      return filePath;
    } catch (error) {
      console.error(error);
      return error;
    }
  },

  list: async () => {
    try {
      let maxDate = await db.Order.min('paymentConfirmDate');
      maxDate = moment(maxDate);
      let now = moment();
      let startYear = maxDate.get('year');
      let startMonth = maxDate.get('month') + 1;
      let nowYear = now.get('year');
      let nowMonth = now.get('month') + 1;

      // for Debug
      // startYear = 2015;
      // startMonth = 10;
      // nowYear = 2017;
      // nowMonth = 2;
      let dateList = [];

      if (startYear == nowYear) {
        for (; nowMonth >= startMonth; startMonth++) {
          if (startMonth < 10) {
            let month = _.padLeft(startMonth.toString(), 2, '0');
            dateList.push([startYear.toString(), month]);
          } else {
            dateList.push([startYear.toString(), startMonth.toString()]);
          }

        }
      } else if (startYear < nowYear) {

        for (let startMonthCopy = startMonth; startMonthCopy <= 12; startMonthCopy++) {
          if (startMonthCopy < 10) {
            let month = _.padLeft(startMonthCopy.toString(), 2, '0');
            dateList.push([startYear.toString(), month]);
          } else {
            dateList.push([startYear.toString(), startMonthCopy.toString()]);
          }
        }

        startYear++;

        if ((nowYear - startYear) >= 1) {
          let mediumYear = nowYear - startYear - 1;
          let countYear = 0;
          while (countYear <= mediumYear) {
            for (let countMonth = 1; countMonth <= 12; countMonth++) {
              if (countMonth < 10) {
                let month = _.padLeft(countMonth.toString(), 2, '0');
                dateList.push([startYear.toString(), month]);
              } else {
                dateList.push([startYear.toString(), countMonth.toString()]);
              }
            }

            startYear++;
            countYear++;
          }
        }

        for (let countMonth = 1; countMonth <= nowMonth; countMonth++) {
          if (countMonth < 10) {
            let month = _.padLeft(countMonth.toString(), 2, '0');
            dateList.push([startYear.toString(), month]);
          } else {
            dateList.push([startYear.toString(), countMonth.toString()]);
          }
        }
      }

      return dateList;
    } catch (error) {
      console.error(error);
    }
  },
};
