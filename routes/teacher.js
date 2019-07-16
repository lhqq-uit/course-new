//TODO: instructor-courses, this's Manage Courses teacher
exports.Teacher_Manage_Courses = (req, res) => {
    res.render("instructor-courses");
};

//TODO: dashboard teacher
exports.Teacher_Dashboard = (req, res) => {
    res.render("instructor-dashboard");
};

//TODO: instructor-earnings, teacher dashboard reports
exports.Teacher_Dashboard_Report = (req, res) => {
    res.render("instructor-earnings");
};

//TODO: instructor-edit-course, add course for teacher
exports.Teacher_Dashboard_Add_Course = (req, res) => {
    res.render("instructor-edit-course");
};

//TODO: instructor-edit-quiz, add quiz for course
exports.Teacher_Dashboard_Add_Quiz_For_Course = (res, req) => {
    res.render("instructor-edit-quiz");
};

//TODO: Manage Quizzes, Dashboard teacher
// exports.Teacher_Dashboard_Manage_Quizzes = (res, req) => {
//     res.render("instructor-quizzes");
// };

//TODO: Dashboard>Reports>Statement, instructor-statement
exports.Teacher_Dashboard_Statement = (res, req) => {
    res.render("instructor-statement");
};