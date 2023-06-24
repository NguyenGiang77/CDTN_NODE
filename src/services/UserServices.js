import db from "../models/index";
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

let hashUserPassword = (password) => {
    return new Promise(async(resolve, reject) => {
        try {
           let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }

    })
}

let HanleUserLogin = (email, password) => { 
    return new Promise(async(resolve, reject) => {
        try {
            let userData = {};
            let isExist = await checkEmail(email);
            if (isExist) { 
                //user đã tồn tại
                let user = await db.User.findOne({
                    attributes:  ['email', 'roleId', 'password', 'firstName', 'lastName'],
                    where: { email: email },
                    raw: true
                });
                if (user) {
                   let check = await bcrypt.compareSync(password, user.password);// check password
                     if (check) {
                        userData.errCode = 0;
                         userData.errMessage = "ok";
                         console.log(user);
                         delete user.password;
                        userData.user = user;
                    }
                     else {
                         userData.errCode = 3;
                        userData.errMessage = "Wrong password";
                     }
                }
                else {
                    userData.errCode = 2;
                    userData.errMessage = "User not found";
                }
                // so sánh password
            }
            else {
                // return lỗi
                userData.errCode = 1;
                userData.errMessage = "Email is'nt exist";

            }
            resolve(userData)
        } catch (e) {
            reject(e)
        }
    })
}

let checkEmail = (UserEmail) => { 
    return new Promise(async(resolve, reject) => { 
        try {
            let user = await db.User.findOne({
                where: {email: UserEmail}
            })
            if (user) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        }

        catch (e) { 
            reject(e)
        }
    })
        
}
let getAllUsers = (userId) => {
    return new Promise(async(resolve, reject) => { 
        try { 
            let users = '';
            if (userId === 'ALL') {
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                    
                })

            }
            if(userId && userId !=='ALL') {
                users = await db.User.findOne({
                    attributes: {
                        exclude: ['password']
                    },
                    where: {id: userId}
                })
            }
            resolve(users)
        }
        
        catch (e) { 
            reject(e)
        }
    })
}
let createNewUser =  (data) => {
    return new Promise(async(resolve, reject) => { 
        try {
            // check email đã tồn tại chưa
            let check = await checkEmail(data.email);
            if (check === true) { 
                resolve({
                errCode: 1,
                errMessage: "Email is already exists. Try another email",
            })
            }
            else{
                let hashPasswordFromBcrypt = await hashUserPassword(data.password);
                await db.User.create({
                    email: data.email,
                    password: hashPasswordFromBcrypt,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    address: data.address,
                    phoneNumber: data.phoneNumber,
                    gender: data.gender,
                    roleId: data.roleId,
                    positionId: data.positionId,
                    image: data.image
        
                })
                resolve({
                    errCode: 0,
                    errMessage: "ok"
                })
            }
        } catch (e)
        {
            reject(e)
        }
    })
}
let deleteUser = (userId) => { 
    return new Promise(async (resolve, reject) => { 
        let FoundUser = await db.User.findOne({
            where: {id: userId}
        })
        if (!FoundUser) {
            resolve({
                errCode: 2,
                errMessage: "User not found"
            })  
        }
        // if (FoundUser) {
        //     await FoundUser.destroy()
        // }
        await db.User.destroy({
            where: {id: userId}
        })
            resolve({
                errCode: 0,
                errMessage: "User is deleted"

            })            

        })
}

let UpdateUserData = (data) => {
    return new Promise(async(resolve, reject) => { 
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                resolve({
                    errCode: 2,
                    errMessage: "User id is required"
                });
            }
            let user = await db.User.findOne({
                where:{id: data.id
                },
                raw: false
            })
            if (user) {
                user.email = data.email;
                user.password = data.password;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                
                user.image = data.image;
                await user.save();
                resolve({
                    errCode: 0,
                    errMessage: "Update user succeed"
                });

            }
            else {
                resolve({
                    errCode: 1,
                    errMessage: "User not found"
                });
            }

        } catch (e)
        {
            reject(e)
        }
    })
}
let getAllCodeService = (typeInput) => { 
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput)
            { 
                resolve({
                    errCode: 1,
                    errMessage: "Missing required parameter"
                });
            }
            else {
                let res = {};
                let allCode = await db.Allcode.findAll({
                    where: {
                        type: typeInput
                    }
                });
                res.errCode = 0;
                res.data = allCode;
                resolve(res);
            }
            
            
        } catch (e) { 
            reject(e);
        }
        
    })
}

module.exports = {
    HanleUserLogin: HanleUserLogin,
    getAllUsers: getAllUsers,
    createNewUser: createNewUser,
    deleteUser: deleteUser,
    UpdateUserData: UpdateUserData,
    getAllCodeService: getAllCodeService,
}