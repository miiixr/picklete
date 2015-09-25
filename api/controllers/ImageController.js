import Promise from "bluebird";
let domain = sails.config.domain || process.env.domain || 'http://localhost:1337';
import fs from 'fs-extra';

module.exports = {
  upload: async(req, res) => {

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
  ckeditorUpload: async (req, res) => {

    // e.g.
    // 0 => infinite
    // 240000 => 4 minutes (240,000 miliseconds)
    // etc.
    //
    // Node defaults to 2 minutes.
    // res.setTimeout(30000);
    try{
      let files = await req.file('upload').upload(async(err, files) => {
          console.log(files);
          let file = files[0];
          file.fd = domain + ImageService.processPath(file.fd);
          let fileName = file.fd;
          if (err) throw err;
          else {
            let html = "";
            html += "<script type='text/javascript'>";
            html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
            html += "    var url     = \"" + fileName + "\";";
            html += "    var message = \"Uploaded file successfully\";";
            html += "";
            html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
            html += "</script>";

            res.send(html);
          }
        });
    } catch (error) {
      console.error(error.stack);
      let msg = error.message;
      return res.serverError({msg});
    }
  }
};
