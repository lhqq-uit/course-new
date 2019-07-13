//TODO: student-dashboard
exports.Student_Dashboard = (res, req) => {
    res.render("student-dashboard");
};

//TODO: Student Dashboard>Discussions
exports.Student_Discussions = (res, req) => {
    res.render("student-discussions");
};

//TODO: Student Dashboard> Edit Account> Basic Information
exports.Student_Edit_Account = (res, req) => {
    res.render("student-edit-account");
};

//TODO: Student Dashboard>Change Password
exports.Student_Edit_Account_Password = (res, req) => {
    res.render("student-edit-account-password");
};

//TODO: Student Dashboard>student-edit-account-profile
exports.Student_Edit_Account_Profile = (res, req) => {
    res.render("student-edit-account-profile");
};

//TODO: Student Dashboard> student-my-courses
exports.Student_My_Courses = (res, req) => {
    res.render("student-my-courses");
};

//TODO: Student > student-take-course
exports.Student_Take_Course = (res, req) => {
    res.render("student-take-course");
};

//TODO: Student > student-take-lesson
exports.Student_Take_Lesson = (res, req) => {
    res.render("student-take-lesson");
};

//TODO: Student > student-take-quiz
exports.Student_Take_Quiz = (res, req) => {
    res.render("student-take-quiz");
};