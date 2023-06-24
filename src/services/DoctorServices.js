import db from "../models/index";
import _ from 'lodash'

require('dotenv').config();
const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctor = (limit) => {
    return new Promise( async(resolve, reject) => { 
        try {
            let users = await db.User.findAll({
                limit: limit,
                where: {roleId: 'R2'},
                order: [['createdAt', 'DESC']],
                attributes: {
                    exclude: ['password']
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: [ 'valueEN', 'valueVN'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEN', 'valueVN'] },
                    { model: db.Allcode, as: 'roleData', attributes: ['valueEN', 'valueVN'] },
                ],
                raw: true,
                nest: true,
            })
            resolve({
                errCode: 0,
                data: users
            })
        } catch (e) { 
            reject(e);
        }
    })
}
let getAllDoctor = () => { 
    return new Promise(async(resolve, reject) => { 
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                attributes: {
                    exclude:['password', 'image']
                },
            })
            resolve({
                errCode: 0,
                data: doctors
            })   
        } catch (e) { 
            reject(e);
        }
    })
}
let checkFailed = (inputData) => { 
    let arr = ['doctorId', "contentHTML", 'contentMarkdown', "description",
        'action', 'selectedPrice', 'selectedPayment', 'selectedProvince',
        'note'
    ]
    let isValid = true
    let elemnet = ''
    for (let i = 0; i < arr.length; i++){
        if (!inputData[arr[i]])
        {
            isValid = false
            elemnet = arr[i]
            break
        }
        
    }
    return {
        isValid: isValid,
        elemnet: elemnet
    }
}
let postInforDoctor = (inputData) => { 
    return new Promise(async(resolve, reject) => {
        try {
            let check = checkFailed(inputData);
            if (check.isValid === false) { 
                resolve({
                    errCode: 1,
                    errMessage: 'Missing parameter '
                })
            }
            
            else {
                if (inputData.action === "CREATE")
                {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId

                    })
                }
                else if (inputData.action === "EDIT") {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: {
                            doctorId: inputData.doctorId,
                            
                        },
                        raw: false
                    })
                    if (doctorMarkdown)
                    {
                        doctorMarkdown.contentHTML= inputData.contentHTML;
                        doctorMarkdown.contentMarkdown= inputData.contentMarkdown;
                        doctorMarkdown.description = inputData.description;
                        await doctorMarkdown.save();
                    }
                    
                }
                // upsert doctor info
                let doctorInfo = await db.InforDoctor.findOne({
                    where: {
                        doctorId: inputData.doctorId
                    },
                    raw: false
                })
                if (doctorInfo) 
                {
                    //edit
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId= inputData.selectedPrice;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialty = inputData.specialty;
                    doctorInfo.clinicId = inputData.clinicId;
                    await doctorInfo.save();
                }
                else
                {
                    // create  
                    await db.InforDoctor.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId
                    })
                }
                resolve({
                    errCode: 0,
                    errMessage: "Save infor doctor success"
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}
let getDoctorById = (inputId) => { 
    return new Promise(async (resolve, reject) => { 
        try {
            if (!inputId) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"

                })
                
            }
            else {
                let data = await db.User.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: {
                    exclude: ['password']
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'description',
                                'contentHTML',
                                'contentMarkdown'
                            ],  
                        },
                        
                        { model: db.Allcode, as: 'positionData', attributes: [ 'valueEN', 'valueVN'] },
                        { model: db.Allcode, as: 'genderData', attributes: ['valueEN', 'valueVN'] },
                        { model: db.Allcode, as: 'roleData', attributes: ['valueEN', 'valueVN'] },
                        {
                            model: db.InforDoctor,
                            attributes: {
                                exclude: [ 'id', 'doctorId' ]
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: [ 'valueEN', 'valueVN'] },
                                { model: db.Allcode, as: 'provinceData', attributes: ['valueEN', 'valueVN'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEN', 'valueVN'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (data && data.image) {
                    data.image= new Buffer(data.image, 'base64').toString('binary');
                    
                }
                if (!data) data = { };
                resolve({
                    errCode: 0,
                    data: data,
                })
            }
        } catch (e) { 
            reject(e);
        }
    

    })
}
let bulkCreateSchedule =  (data) => {
    return new Promise(async(resolve, reject) => { 
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatedDate) {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameters",
                })
            }
            else {
                let schedule = data.arrSchedule
                if (schedule && schedule.length > 0) { 
                    schedule = schedule.map(item => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    })
                }
                //get all existing data
                let existingData = await db.Schecdule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatedDate },
                    attributes: ['timeType', 'date', 'doctorId', 'maxNumber'],
                    raw: true
                })
               
                // a = '5'
            //    b = +a => b = 5 tức là khi thêm dấu + vào trước biến thì biến STRING = > SỐ
                let toCreate = _.differenceWith(schedule, existingData, (a, b) => {
                    return a.timeType === b.timeType && +a.date === +b.date;
                });
                //create data
                if (toCreate && toCreate.length > 0) {
                    await db.Schecdule.bulkCreate(toCreate);

                 }
                 resolve({
                    errCode: 0,
                    errMessage: 'OK'

                })
            }

        } catch (e) { 
            reject(e);
        }
    })
}
let getSchDoctorByDate = (doctorId, date) => { 
    return new Promise( async(resolve, reject) => { 
        try {
            if (!doctorId || !date) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
                
            }
            else {
                let dataSch = await db.Schecdule.findAll({
                    where: {
                        doctorId: doctorId, // KeyTrongdb: Keytruyenvao
                        date: date
                    },
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEN', 'valueVN'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataSch) dataSch = [];
                resolve({
                    errCode: 0,
                    data: dataSch
                })
            }
        } catch (e) { 
            resolve(e);
        }
    })
}
let getExtraInforDoctorById = (doctorId) => { 
    return new Promise(async(resolve, reject) => { 
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
                
            }
            else {
                let dataExtra = await db.InforDoctor.findOne({
                    where: {
                        doctorId: doctorId, // KeyTrongdb: Keytruyenvao
                        
                    },
                    attributes: {
                        exclude: ['id','doctorId'], 
                    },
                    include: [
                        { model: db.Allcode, as: 'priceData', attributes: ['valueEN', 'valueVN'] },
                        { model: db.Allcode, as: 'paymentData', attributes: ['valueEN', 'valueVN'] },
                        { model: db.Allcode, as: 'provinceData', attributes: [ 'valueEN', 'valueVN'] },
                    ],
                    raw: false,
                    nest: true
                })
                if (!dataExtra) dataExtra = {};
                resolve({
                    errCode: 0,
                    data: dataExtra
                })
            }
        } catch (e) { 
            resolve(e);
        }    
    })
}
let getProfileDoctorById = (doctorId) => { 
   return new Promise(async(resolve, reject) => { 
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter'
                })
                
            }
            else {
                let dataExtra = await db.User.findOne({
                    where: {
                        id: doctorId, // KeyTrongdb: Keytruyenvao
                        
                    },
                    attributes: {
                        exclude: ['password'], 
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: [
                                'description',
                                'contentHTML',
                                'contentMarkdown'
                            ],  
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEN', 'valueVN'] },
                        {
                            model: db.InforDoctor,
                            attributes: {
                                exclude: ['id','doctorId']
                            },
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['valueEN', 'valueVN'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['valueEN', 'valueVN'] },
                                { model: db.Allcode, as: 'provinceData', attributes: [ 'valueEN', 'valueVN'] },
                            ]
                        }
                    ],
                    raw: false,
                    nest: true
                })
                if (dataExtra && dataExtra.image)
                {
                    dataExtra.image = new Buffer(dataExtra.image, 'base64').toString('binary');
                }
                if (!dataExtra) dataExtra = {};
                resolve({
                    errCode: 0,
                    data: dataExtra
                })
            }
        } catch (e) { 
            resolve(e);
        }    
    }) 
}
module.exports = {
    getTopDoctor: getTopDoctor,
    getAllDoctor: getAllDoctor,
    postInforDoctor: postInforDoctor,
    getDoctorById: getDoctorById,
    bulkCreateSchedule: bulkCreateSchedule,
    getSchDoctorByDate: getSchDoctorByDate,
    getExtraInforDoctorById: getExtraInforDoctorById,
    getProfileDoctorById: getProfileDoctorById,
}