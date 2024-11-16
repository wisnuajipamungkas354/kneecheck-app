import pasienModel from '../models/pasienModel.js';
import userModel from '../models/userModel.js';

const getProfilePasien = async (req, res) => {
    const id = req.params.id;

    let profilePasien = await pasienModel.where('id_pasien', '=', id).first();
    const { id_user } = profilePasien[0];
    const userProfile = await userModel.where('id', '=', id_user).first();

    profilePasien[0].email = userProfile[0].email;
    profilePasien[0].user_type = userProfile[0].user_type;

    res.status(200).json(profilePasien);
}

const updateProfilePasien = (req, res) => {
    // 
}

const getHistoryPasien = (req, res) => {
    // 
}

const getDetailHistoryPasien = (req, res) => {
    // 
}

const saveHistoryPasien = (req, res) => {
    // 
}

export { getProfilePasien, updateProfilePasien, getHistoryPasien, getDetailHistoryPasien, saveHistoryPasien };