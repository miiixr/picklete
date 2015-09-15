import xlsx from 'node-xlsx';
import moment from 'moment';
import fs from 'fs';

module.exports = {

  buildExcel: async (param) => {
    try {
      console.log(param);
      var excelData = {};

      excelData.data = param;
      excelData.name = 'Report-' + moment().format('YYYY-MM').toString();
      let filePath = 'report/' + excelData.name + '.xlsx';

      var data = [];
      data.push(excelData);
      var buffer = await xlsx.build(data);
      fs.writeFileSync(filePath, buffer);
      return filePath;
    } catch (error) {
      console.error(error);
      return error;
    }
  },
};
