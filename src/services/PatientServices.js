import db from "../models/index";
require('dotenv').config();
    import { v4 as uuidv4 } from 'uuid';
import EmailServices from './EmailServices';
import { defaults } from "lodash";

let buildUrlEmail = (doctorId,token) => { 
    // let id = uuidv4();
    let result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`// lấy ra tham số trực tiếp k cần nối chuỗi
    return result;
}

let postBookingSchedule = (data) => { 
    return new Promise(async(resolve, reject) => { 
        try {
            if (!data.email || !data.doctorId || !data.timeType || !data.date
                || !data.Name 
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }
            else {
                let token = uuidv4();
                
                await EmailServices.sendSimpleEmail({
                    reciverEmail: data.email,
                    patientName: data.Name,
                    time: data.timeString,
                    doctorName: data.doctorName,
                    language: data.language,
                    redirectLink: buildUrlEmail(data.doctorId,token),
                    
                })
                let user = await db.User.findOrCreate({
                    where: {
                        email: data.email
                    },
                    defaults: {
                        email: data.email,
                        firstName: data.Name,
                            address: data.address,
                            gender: data.selectedGenders,
                            phoneNumber: data.phoneNumber,
                        positionId:"P5",
                        roleId: "R3"
                    }
                    // raw:true// = true nếu tạo mới, = false là update
                    
                });
                if(user && user[0])
                    {
                    await db.Booking.findOrCreate({
                        where: {
                            patientId: user[0].id,
                        },
                        defaults: {
                            statusId: "S1",
                            doctorId: data.doctorId,
                            patientId: user[0].id,
                            date: data.date,
                            timeType: data.timeType,
                            token: token
                        }
                            
                    })
                    }

                resolve({
                    
                    errCode: 0,
                    errMessage: "Save infor patient success"
                })
            }
            
        } catch (e) {
            reject(e);
        }
    })
}
let postVerifyBook = (data) => { 
    return new Promise(async(resolve, reject) => {
        try {
            if (!data.token || !data.doctorId
                
            ) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }
            else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: data.doctorId,
                        token: data.token,
                        statusId: "S1"
                    },
                    raw: false
                })
                if (appointment)
                {
                    appointment.statusId = "S2";
                    await appointment.save(); 
                    
                    resolve({
                        errCode: 0,
                        errMessage: "Update the appointment succeed!"
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: "Appointment has been activated or does not exist"
                    })
                }
            }
            
            
        } catch (e) {
            reject(e);
        }
    })
}
module.exports = {
    postBookingSchedule: postBookingSchedule,
    postVerifyBook: postVerifyBook
}