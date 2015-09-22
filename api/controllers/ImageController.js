import Promise from "bluebird";
let domain = sails.config.domain || process.env.domain || 'http://localhost:1337';
import fs from 'fs-extra';

module.exports = {
  upload: async (req, res) => {

    var object = {
      filename: req.body['filename'] || req.query['filename'] || '',
      width: parseInt(req.body['width'], 10) || req.query['width'] || 0,
      height: parseInt(req.body['height'], 10) || req.query['height'] || 0,
    }
    console.log(object);

    let promise = new Promise((resolve, reject) => {
      req.file("uploadfile").upload(async(err, files) => {
        resolve(files);
      });
    });

    let files = await promise.then();
    // console.log('files >>>>', files);


    try {
      for (let i in files) {
        await ImageService.resize({
          src: files[i].fd,
          dst: files[i].fd,
          width: object.width,
          height: object.height
        });

        files[i].fd = domain + ImageService.processPath(files[i].fd);
      }

      object[0] = files[0];
      res.ok(object);
    } catch (e) {
      res.ok([]);
      console.error(e);
    }

    // req.file("uploadfile").upload(async (err, files) => {

    //   if ( ! files.length)
    //     return res.ok([]);



    //   for (let i in files) {
    //     try {
    //       files[i] = await ImageService.resize({
    //         src: files[i].fd,
    //         dst: files[i].fd,
    //         width: object.width,
    //         height: object.height
    //       });
    //     } catch (e){
    //       console.error(e);
    //     }

    //     files[i].fd = domain + ImageService.processPath(files[i].fd);
    //   }
    //   object[0] = files[0];
    //   res.ok(object);
    // });

  },
  ckeditorUpload: function (req, res) {
    // handle ckeditor image upload
    var dest, fileName, l, tmpPath;

    tmpPath = req.files.upload.path;
    l = tmpPath.split('/').length;
    fileName = tmpPath.split('/')[l - 1] + "_" + req.files.upload.name;

    dest = __dirname + "/public/uploads/" + fileName;
    fs.readFile(req.files.upload.path, function(err, data) {
      if (err) {
        console.log(err);
        return;
      }

      fs.writeFile(dest, data, function(err) {
        var html;
        if (err) {
          console.log(err);
          return;
        }

        html = "";
        html += "<script type='text/javascript'>";
        html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
        html += "    var url     = \"/uploads/" + fileName + "\";";
        html += "    var message = \"Uploaded file successfully\";";
        html += "";
        html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
        html += "</script>";

        res.send(html);
      });
    });
  }
};
