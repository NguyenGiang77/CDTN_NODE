import bcrypt from 'bcryptjs';
import db from '../models/index';
// import { raw } from 'body-parser';
const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => { 
    return new Promise(async(resolve, reject) => { 
        try {
          let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phoneNumber: data.phoneNumber,
                gender: data.gender,
                image: data.image,
                roleId: data.roleId
    
            })
            resolve('Create a new user succeed');
            
        } catch (e)
        {
            reject(e);
        }
    })

        
}
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
//hàm promise là hàm sử lý bất đồng bộ nên sẽ cần thêm
// async trong homecontroller
let getAllUsers = () => { 
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });    
            resolve(users);
        } catch (e) {
            reject(e);
        }
    })
}
let getUserInfoById = (userId) => {
       return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
                raw: true,
                })
            if (user)
            {
                resolve(user)
            }
            else
            {
                resolve({})
                }
        } catch (e) {
            reject(e);
        }
    })
}
let getUpdateUserData = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw:false
            })
            if (user) {
                user.email = data.email;
                user.password = data.password;
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.phoneNumber = data.phoneNumber;
                user.gender = data.gender;
                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }
            else {
                reject();
            }
        }
        catch (e) {
            console.log(e);
        }
    })
}
let getdeleteUserById = (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await db.User.findOne({
                    where: { id: userId }
                })  
                if (user) {
                    await db.User.destroy({
                        where: {id: userId}
                    });
                    
                }
                resolve();
            } catch (e) {
                reject(e);
        }
    })
}

module.exports = {
    createNewUser: createNewUser,
    getAllUsers: getAllUsers,
    getUserInfoById: getUserInfoById,
    getUpdateUserData: getUpdateUserData,
    getdeleteUserById: getdeleteUserById,
}