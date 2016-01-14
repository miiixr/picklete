import moment from 'moment';
import xlsx from 'xlsx-style';
import fs from 'fs';

function basicallyEquals(left, right) {
  if (Array.isArray(left) && Array.isArray(right)) {
    for (var i = 0 ; i < left.length ; i++) {
      if (!basicallyEquals(left[i], right[i])) {
        return false;
      }
    }

    return true;
  } else if (typeof left == 'object' && typeof right == 'object') {
    for (var key in left) {
      if (key != 'bgColor') {
        if (!basicallyEquals(left[key], right[key])) {
          if (JSON.stringify(left[key]) == '{}' && right[key] == undefined) return true;
          if (JSON.stringify(right[key]) == '{}' && left[key] == undefined) return true;
          return false;
        }
      }
    }

    return true;
  } else {
    if (left != right) {
      return false;
    }

    return true;
  }
}

describe('about report service', () => {

  // before(async (done) => {
  //
  // });

  it('report Excel build', async (done) => {
    let startMonth = moment().format('YYYY-MM').toString();
    let endMonth = moment().format('YYYY-MM').toString();

    let sheetName = 'Report-' + startMonth;
    var workbook = {
      SheetNames: [sheetName],
      Sheets: {},
    };
    workbook.Sheets[sheetName] = {
      "B2": {v: "Top left", s: { border: { top: { style: 'medium', color: { rgb: "FFFFAA00"}}, left: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "C2": {v: "Top right", s: { border: { top: { style: 'medium', color: { rgb: "FFFFAA00"}}, right: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "B3": {v: "Bottom left", s: { border: { bottom: { style: 'medium', color: { rgb: "FFFFAA00"}}, left: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "C3": {v: "", s: { border: { bottom: { style: 'medium', color: { rgb: "FFFFAA00"}}, right: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "!ref":"B2:C3"
    };

    try {
      let excel = await ReportService.buildExcel(workbook, startMonth, endMonth);
      let excelPath = 'report/Report-' + startMonth + '.xlsx';
      var workbook2 = xlsx.readFile(excel, {cellStyles: true});

      excel.should.be.equal(excelPath);
      basicallyEquals(workbook.Sheets, workbook2.Sheets).should.be.true;

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
    let startMonth = moment().format('YYYY-MM').toString();
    let endMonth = moment().add(1, 'M').format('YYYY-MM').toString();

    let sheetName = 'Report-' + startMonth;
    let sheetName2 = 'Report-' + endMonth;
    var workbook = {
      SheetNames: [sheetName, sheetName2],
      Sheets: {},
    };
    workbook.Sheets[sheetName] = {
      "B2": {v: "Top left", s: { border: { top: { style: 'medium', color: { rgb: "FFFFAA00"}}, left: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "C2": {v: "Top right", s: { border: { top: { style: 'medium', color: { rgb: "FFFFAA00"}}, right: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "B3": {v: "Bottom left", s: { border: { bottom: { style: 'medium', color: { rgb: "FFFFAA00"}}, left: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "C3": {v: "", s: { border: { bottom: { style: 'medium', color: { rgb: "FFFFAA00"}}, right: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "!ref":"B2:C3"
    };
    workbook.Sheets[sheetName2] = {
      "B2": {v: "Top left", s: { border: { top: { style: 'medium', color: { rgb: "FFFFAA00"}}, left: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "C2": {v: "Top right", s: { border: { top: { style: 'medium', color: { rgb: "FFFFAA00"}}, right: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "B3": {v: "Bottom left", s: { border: { bottom: { style: 'medium', color: { rgb: "FFFFAA00"}}, left: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "C3": {v: "", s: { border: { bottom: { style: 'medium', color: { rgb: "FFFFAA00"}}, right: { style: 'medium', color: { rgb: "FFFFAA00"}} }}},
      "!ref":"B2:C3"
    };

    try {
      let excel = await ReportService.buildExcel(workbook, startMonth, endMonth);
      let excelPath = 'report/Report-' + startMonth + '-' + endMonth + '.xlsx';
      var workbook2 = xlsx.readFile(excel, {cellStyles: true});

      excel.should.be.equal(excelPath);
      basicallyEquals(workbook.Sheets, workbook2.Sheets).should.be.true;

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
