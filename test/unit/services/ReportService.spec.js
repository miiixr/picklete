import moment from 'moment';
import fs from 'fs';
describe('about report service', () => {

  // before(async (done) => {
  //
  // });

  it('report Excel build', async (done) => {
    let sheet = {};
    let data = [];
    let startMonth = moment().format('YYYY-MM').toString();
    let endMonth = moment().format('YYYY-MM').toString();

    sheet.data = [
      [1, 2, 3],
      [true, false, null, 'sheetjs'],
      ['foo', 'bar', 41689.604166666664, '0.3'],
      ['baz', null, 'qux'],
    ];
    sheet.name = 'Report-' + startMonth;
    data.push(sheet);

    try {
      let excel = await ReportService.buildExcel(data, startMonth, endMonth);
      let excelPath = 'report/Report-' + startMonth + '.xlsx';
      excel.should.be.equal(excelPath);

      fs.unlink(excel, function(error) {
        if (error) {
          return done(error);
        }
      });

      done();
    } catch (error) {
      done(error);
    }
  });

  it('report Excel build with multi sheet', async (done) => {
    let sheet = {};
    let sheet2 = {};
    let data = [];
    let startMonth = moment().format('YYYY-MM').toString();
    let endMonth = moment().add(1, 'M').format('YYYY-MM').toString();

    sheet.data = [
      [1, 2, 3],
      [true, false, null, 'sheetjs'],
      ['foo', 'bar', 41689.604166666664, '0.3'],
      ['baz', null, 'qux'],
    ];
    sheet2.data = [
      [1, 2, 3],
      [true, false, null, 'sheetjs'],
      ['foo', 'bar', 41689.604166666664, '0.3'],
      ['baz', null, 'qux'],
    ];
    sheet.name = 'Report-' + startMonth;
    data.push(sheet);
    sheet2.name = 'Report-' + endMonth;
    data.push(sheet2);

    try {
      let excel = await ReportService.buildExcel(data, startMonth, endMonth);
      let excelPath = 'report/Report-' + startMonth + '-' + endMonth + '.xlsx';
      excel.should.be.equal(excelPath);

      fs.unlink(excel, function(error) {
        if (error) {
          return done(error);
        }
      });

      done();
    } catch (error) {
      done(error);
    }
  });

});
