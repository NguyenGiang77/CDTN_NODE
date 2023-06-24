import db from "../models/index";
require('dotenv').config();
let createSpecialty = (data) => { 
    return new Promise(async (resolve, reject) => { 
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkown)
            {
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }
            else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.image,
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
let getAllSpecialty = () => { 
    return new Promise(async(resolve, reject) => { 
        try {
            let infor = await db.Specialty.findAll({
               
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
let getDetailSpecialtyById = (inputId,location) => { 
    return new Promise(async(resolve, reject) => { 
        try {
            if (!inputId  || !location) {
               resolve({
                    errCode: 1,
                    errMessage: "Missing parameter required"
                }) 
            }
            else {
                
                let data = await db.Specialty.findOne({
                    where: {
                        id: inputId
                    },
                    attributes: 
                    ['descriptionMarkown', 'descriptionHTML']

                })
                if (data)
                {
                    let doctorSpecialty = [];
                    if (location === "ALL")
                    {
                        doctorSpecialty = await db.InforDoctor.findAll({
                            where: { specialtyId: inputId },
                            attributes: ['doctorId', 'provinceId'],
                        
                        })
                    }
                    else {
                            doctorSpecialty = await db.InforDoctor.findAll({
                                where: {
                                    specialtyId: inputId,
                                    provinceId: location
                                },
                                attributes: ['doctorId', 'provinceId'],
                            })
                    }
                    data.doctorSpecialty = doctorSpecialty
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
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getDetailSpecialtyById: getDetailSpecialtyById
}