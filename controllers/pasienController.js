import bcrypt from 'bcryptjs';
import pasienModel from '../models/pasienModel.js';
import userModel from '../models/userModel.js';
import historyXrayModel from '../models/historyXrayModel.js';

const getProfilePasien = async (req, res) => {
    const id = req.params.id;

    let profilePasien = await pasienModel.where('id_pasien', '=', id).first();
    if(profilePasien[0] === undefined) {
      res.status(500).send('Pasien tidak ditemukan');
      return;
    }

    const {id_user} = profilePasien[0];
    const userProfile = await userModel.where('id', '=', id_user).first();

    profilePasien[0].email = userProfile[0].email;
    profilePasien[0].user_type = userProfile[0].user_type;

    res.status(200).json(profilePasien);
}

const updateProfilePasien = async (req, res) => {
    const { name, gender, birth, address } = req.body[0];

    if(name && gender && birth && address === undefined || name && gender && birth && address === null) {
      res.status(401).send('Please fill all the form input');
      return;
    }
    
    try {
      const result = await pasienModel.where('id_pasien', '=', req.params.id).update({
        name, gender, birth, address
      });

      if(result.code !== undefined) {
        throw new Error('Update Profile Failed');
      } else {
        res.status(200).send('Update Profile Success!');
      }
    } catch(err) {
        res.status(500).send(err.message);
    }
}

const updateUserPasien = async (req, res) => {
  const { email, password, verifyPassword } = req.body[0];

  if( email && password && verifyPassword === undefined || email && password && verifyPassword === null ) {
    res.status(401).send('Please fill out the form correctly');
    return;
  }

  if(password !== verifyPassword){
    res.status(401).send('Password and Verify Password does not macth!');
    return;
  }
  
  try {
    const hashPassword = await bcrypt.hash(password, 8);
    const id = await pasienModel.where('id_pasien', '=', req.params.id).value('id_user');
    const result = await userModel.where('id', '=', id).update({
      email, password: hashPassword
    });

    if(result.code !== undefined) {
      throw new Error('Update Profile Failed');
    } else {
      res.status(200).send('Update Profile Success!');
    }
  } catch(err) {
    res.status(500).send(err.message);
  }
}

const getHistoryPasien = (req, res) => {
  try {
    const id = userModel.where('id', '=', req.params.id).value('id_user');
    const result = historyXrayModel.where('id_user', '=', id).get();

    if(result.code !== undefined) {
      throw new Error('Failed to get History');
    } else {
      res.status(200).json(result);
    }
  } catch(err) {
    res.status(500).send(err.message);
  }
}

const getDetailHistoryPasien = (req, res) => {
    // 
}

const saveHistoryPasien = (req, res) => {
    // 
}

export { getProfilePasien, updateProfilePasien, updateUserPasien, getHistoryPasien, getDetailHistoryPasien, saveHistoryPasien };