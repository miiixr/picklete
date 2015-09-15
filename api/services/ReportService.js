import xlsx from 'node-xlsx';
import moment from 'moment';
import fs from 'fs';

module.exports = {

  buildExcel: async (data, startDate, endDate) => {
    try {
      var excelData = {};
      var filename = '';
      if (startDate === endDate) {
        filename = 'Report-' + startDate;
      } else {
        filename = 'Report-' + startDate + '-' + endDate;
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
