//import { json } from 'body-parser';
import db from '../models/index';
import CrubServices from '../services/CrubServices';
let getHomPage = async (req,res) => {
    try {
        let data = await db.User.findAll();// tên class trong các file của models
        console.log('------------')
        console.log(data)
        console.log('------------')

        return res.render('homepage.ejs',{
            data: JSON.stringify(data)
        });
    }catch (e)
    {
        console.log(e)
    }

}
let getAboutPage = (req,res) =>
{
    return res.render('test/about.ejs');
}
// Trang sign in backend
let getCrubPage = (req, res) => {
    return res.render('crub.ejs')
}
let getPostCrubPage = async (req, res) => { 
    let message = await CrubServices.createNewUser(req.body);
    console.log(message);
    return res.send('post crub view')
}
let displayGetCrubPage = async (req, res) => {
    let data = await CrubServices.getAllUsers();
    console.log('----------------------')
    console.log(data)
    console.log('----------------------')
    // tên class trong các file của models
    return res.render('displayCrub.ejs', {
        dataTable: data
    })
}
let getEditCrubPage = async(req, res) => {
    let userId = req.query.id;
    console.log(userId)
    if (userId)
    {
        let userData = await CrubServices.getUserInfoById(userId);
        return res.render('editCrub.ejs', {
            user: userData
        });
    }
    else {
        return res.send('user_not_found');

    }
}
let pustCrubPage = async (req, res) => {
    let data = req.body
    let allUsers = await CrubServices.getUpdateUserData(data);
    return res.render('displayCrub.ejs', {
        dataTable: allUsers
    })
}
let deleteCrubPage = async (req, res) => {
    let id = req.query.id;
    if (id) {
        await CrubServices.getdeleteUserById(id);
        return res.send('delete crub view');
        
    }
    else {
            return res.send('user_not_found');
        }

}
module.exports = {
    getHomPage: getHomPage,
    getAboutPage: getAboutPage,
    getCrubPage: getCrubPage,
    getPostCrubPage: getPostCrubPage,
    displayGetCrubPage: displayGetCrubPage,
    getEditCrubPage: getEditCrubPage,
    pustCrubPage: pustCrubPage,
    deleteCrubPage: deleteCrubPage
}
