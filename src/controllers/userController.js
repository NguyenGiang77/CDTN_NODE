import userServices from "../services/UserServices";
// Login 
let HandleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;
    //check email có tồn tại k
    //check password có đúng k
    if (!email || !password) { 
        return res.status(500).json({
            errCode: 1,
            errMessage: "Email or password incorrect"
         })
    }

    let userData = await userServices.HanleUserLogin(email, password);
    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {}
    })
}
//lấy ra thông tin user
let HandleGetAllUsers = async (req, res) => { 
    let id = req.query.id; 
    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters",
            users: []
        })
    }
    let users = await userServices.getAllUsers(id);
    console.log(users);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users
    })
}
///thêm mới 1 user trên front end
let HandleCreateNewUser = async (req, res) => { 
    let message = await userServices.createNewUser(req.body);
    // console.log(message);
    return res.status(200).json(message);
}

//sửa thông tin user trên front end
let HandleEditUser = async(req, res) => { 
    let data = req.body;
    let message = await userServices.UpdateUserData(data);
    return res.status(200).json(message);
}
// xóa thông tin user trên front end
let HandleDeleteUser = async(req, res) => { 
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: "Missing required parameters"
        })
    }
    let message = await userServices.deleteUser(req.body.id);
    return res.status(200).json(message);
}

let getAllCode = async (req, res) => { 
    try {
        setTimeout(async() => {
        let data = await userServices.getAllCodeService(req.query.type);
        return res.status(200).json(data);
        }, 3000)
        
        
    } catch (e) {
        console.log('get all code error', e)
        return res.status(200).json({
            errCode: -1,
            errCodeMsg: "Error from server"
        })
    }
}
module.exports = {
    HandleLogin: HandleLogin,
    HandleGetAllUsers: HandleGetAllUsers,
    HandleCreateNewUser: HandleCreateNewUser,
    HandleEditUser: HandleEditUser,
    HandleDeleteUser: HandleDeleteUser,
    getAllCode: getAllCode
}