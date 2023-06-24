import PatientServices from "../services/PatientServices";
let postBookingSchedule = async (req, res) => { 
    try {
        let infor = await PatientServices.postBookingSchedule(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}
 let postVerifyBook = async (req, res) => { 
    try {
        let infor = await PatientServices.postVerifyBook(req.body);
        return res.status(200).json(infor);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from the server'
        })
    }
}

module.exports = {
    postBookingSchedule: postBookingSchedule,
    postVerifyBook:postVerifyBook
}