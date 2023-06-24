import db from "../models/index";
require('dotenv').config();
let createClinic = (data) => { 
    return new Promise(async (resolve, reject) => { 
        try {
            if (!data.name || !data.image || !data.address
                || !data.descriptionHTML || !data.descriptionMarkown)
            {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }
            else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.image,
                    address: data.address,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkown: data.descriptionMarkown
                })
                 resolve({
                    errCode: 0,
                    errMessage: "ok"
                })
            }
           
        } catch (e) { 
            reject(e);
        }
    })

}
let getAllClinic = () => { 
    return new Promise(async(resolve, reject) => { 
        try {
            let infor = await db.Clinic.findAll({
               
            })
            if (infor && infor.length > 0) { 
                infor.map(item => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item
                })
            }
            resolve({
                errCode: 0,
                data: infor
            })   
        } catch (e) { 
            reject(e);
        }
    })
}
let getDetailClinicById = (inputId) => { 
    return new Promise(async(resolve, reject) => { 
        try {
            if (!inputId) {
               resolve({
                    errCode: 1,
                    errMessage: "Missing parameter required"
                }) 
            }
            else {
                
                let data = await db.Clinic.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: 
                    ['descriptionMarkown', 'descriptionHTML', 'name', 'address']

                })
                if (data)
                {
                    let doctorClinic = [];
                        doctorClinic = await db.InforDoctor.findAll({
                            where: { ClinicId: inputId },
                            attributes: ['doctorId'],
                        
                        })
                    data.doctorClinic = doctorClinic
                }
                else data = {}
                resolve({
                errCode: 0,
                data
            })
            }
              
        } catch (e) { 
            reject(e);
        }
    })
}
module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getDetailClinicById: getDetailClinicById
}