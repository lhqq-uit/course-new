const express = require("express");
const router = express.Router();
const domain = require("./../config/domain");

const axios = require("axios");
const jwtDecode = require("jwt-decode");
const FormData = require("form-data");
const multer = require("multer");
const fs = require("fs");

var storage = multer.diskStorage({
  // file upload destination
  destination: function(req, file, callback) {
    callback(null, "./public/upload/tmp");
  },
  filename: function(req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({
  storage: storage
}).fields([
  {
    name: "image"
  },
  {
    name: "video"
  },
  {
    name: "document"
  }
]);

//TODO: Student Dashboard>Change Password
router.get("/edit-account-password", async (req, res) => {
  if (req.session.token) {
    //decode token
    let getInfoUser = jwtDecode(req.session.token);
    var getTotalIq = null;
    if (getInfoUser.role == "Teacher") {
      var url = `${domain}/api/teacher/info/${getInfoUser._id}`;
    } else {
      var url = `${domain}/api/student/info/${getInfoUser._id}`;

      await axios({
        method: "get",
        url: `${domain}/api/student/total-iq`,
        headers: {
          Authorization: req.session.token
        }
      })
        .then(response => {
          // handle success
          //console.log(response.data.total_iq);

          getTotalIq = response.data.total_iq;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
    axios({
      method: "get",
      url: url,
      headers: {
        Authorization: req.session.token
      }
    }).then(response => {
      data = response.data;
      res.render("user/edit-account-password", {
        data,
        getTotalIq,
        getInfoUser
      });
    });
  } else {
    res.redirect("../login");
  }
});

router.post("/edit-account-password", (req, res) => {
  if (!req.session.token) {
    res.redirect("../login");
  } else {
    try {
      axios({
        method: "post",
        url: `${domain}/api/change-password`,
        headers: {
          Authorization: req.session.token
        },
        data: {
          Oldpassword: req.body.Oldpassword,
          newPassword: req.body.newPassword,
          confirmPassword: req.body.confirmPassword
        }
      })
        .then(Response => {
          res.redirect("../login");
        })
        .catch(err => {
          res.redirect("/user/edit-account-password");
        });
    } catch (error) {
      res.redirect("/user/edit-account-password");
    }
  }
});

//TODO: Student Dashboard>student-edit-account-profile
router.get("/edit-account", async (req, res) => {
  if (req.session.token) {
    //decode token
    let getInfoUser = jwtDecode(req.session.token);
    var getTotalIq = null;
    if (getInfoUser.role == "Teacher") {
      var url = `${domain}/api/teacher/info/${getInfoUser._id}`;
    } else {
      var url = `${domain}/api/student/info/${getInfoUser._id}`;

      await axios({
        method: "get",
        url: `${domain}/api/student/total-iq`,
        headers: {
          Authorization: req.session.token
        }
      })
        .then(response => {
          // handle success
          //console.log(response.data.total_iq);

          getTotalIq = response.data.total_iq;
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
    axios({
      method: "get",
      url: url,
      headers: {
        Authorization: req.session.token
      }
    }).then(response => {
      data = response.data;
      console.log(data);
      res.render("user/edit-account", {
        data,
        getTotalIq,
        getInfoUser
      });
    });
  } else {
    res.redirect("../login");
  }
});

//TODO: Student Dashboard>student-edit-account-profile
router.post("/edit-account", upload, async (req, res) => {
  if (req.session.token) {
    let formData = await new FormData();
    let readStream = fs.createReadStream(
      `./public/upload/tmp/${req.files.image[0].originalname}`
    );

    const formHeaders = formData.getHeaders();
    formData.append("fullname", req.body.fullname);
    formData.append("email", req.body.email);
    formData.append("about", req.body.about);
    formData.append("connect", req.body.connect);
    formData.append("image", readStream);
    console.log(formData);
    let config_axios = {
      headers: {
        Authorization: req.session.token,
        ...formHeaders
      }
    };
    await axios({
      method: "put",
      url: `${domain}/api/profile`,
      data: formData,
      headers: config_axios.headers
    })
      .then(response => {
        if (response.data.as == true) {
          res.redirect("/user/edit-account");
        }
      })
      .catch(err => {
        console.log(err);
      });
  } else {
    res.redirect("../login");
  }
});

module.exports = router;
