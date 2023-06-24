// nơi một lần truy cập vào đường link của web thì sẽ chạy vào file này đầu tiên
import express  from "express";  
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";
//là 1 đích danh, 1 object của file wen
let router = express.Router();
let initWebRouter = (app) => {
    router.get('/',homeController.getHomPage);// hiển thị trang động /
    router.get('/about',homeController.getAboutPage);
    router.get('/crub',homeController.getCrubPage);
    //router.get('/links',(req,res)=>{
    //    return res.send("Hello 3")
    //}); // hiển thị sang đường link /links
    router.post('/post-crub',homeController.getPostCrubPage);
    router.get('/get-crub',homeController.displayGetCrubPage);
    router.get('/edit-crub', homeController.getEditCrubPage);
    router.post('/put-crub', homeController.pustCrubPage);
    router.get('/delete-crub', homeController.deleteCrubPage);
    router.post('/api/login', userController.HandleLogin);
    router.get('/api/get-all-users', userController.HandleGetAllUsers);
    router.post('/api/create-new-user', userController.HandleCreateNewUser);
    router.put('/api/edit-user', userController.HandleEditUser);
    router.delete('/api/delete-user', userController.HandleDeleteUser);
    router.get('/api/allcode', userController.getAllCode);
    router.get('/api/top-doctor', doctorController.getTopDoctor);
    router.get('/api/all-doctor', doctorController.getAllDoctor);
    router.post('/api/save-infor-doctor', doctorController.postInforDoctor);
    router.get('/api/get-doctor-by-id', doctorController.getDoctorById);
    router.post('/api/bulk-create-schedule', doctorController.bulkCreateSchedule);  
    router.get('/api/get-schedule-doctor-by-date', doctorController.getSchDoctorByDate);
    router.get('/api/get-extra-infor-doctor-by-id', doctorController.getExtraInforDoctorById);
    router.get('/api/get-profile-doctor-by-id', doctorController.getProfileDoctorById);
    router.post('/api/patient-book-appointment', patientController.postBookingSchedule);
    router.post('/api/verify-book-appointment', patientController.postVerifyBook);
    //chuyên khoa
    router.post('/api/create-new-specialty', specialtyController.createSpecialty);
    router.get('/api/get-specialty', specialtyController.getAllSpecialty);
    router.get('/api/get-detail-specialty-by-id', specialtyController.getDetailSpecialtyById); 

    // phòng khám
    router.post('/api/create-new-clinic', clinicController.createClinic);
    router.get('/api/get-clinic', clinicController.getAllClinic);
    router.get('/api/get-detail-clinic-by-id', clinicController.getDetailClinicById); 

    return app.use("/", router);

}
module.exports = initWebRouter;
