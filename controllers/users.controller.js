const { User } = require('../models');

exports.updateUser = async(req, res) => {
    const userUuid = req.params.uuid;
    const { password, email, role } = req.body;

    try {
        const user = await User.findOne({
            where: { uuid: userUuid }
        });

        user.email = email;
        user.role = role;
        user.password = password;

        await user.update({
            email,
            password,
            role
        });

        return res.status(200).json({ message: `Updated successfully the user : ${user.userName}`, user });
    } catch (err) {
        console.log('An error occured at with updated account : ' + err);
        return res.status(500).json({ err });
    }
};

exports.getOneUser = async(req, res) => {
    const uuid = req.params.uuid;
    try {
        const user = await User.findOne({
            attributes: {
                exclude: ['uuid', 'password', 'createdAt', 'updatedAt', 'role']
            }
        });

        return res.status(200).json(user);
    } catch (error) {
        console.log('An error accurs at ! : ' + error);
        return res.status(400).json({
            message: `Verify your identity because you entered : - ${uuid} -`
        });
    }
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: {
                exclude: ['uuid', 'password', 'createdAt', 'updatedAt']
            },
            order: [
                ['createdAt', 'DESC']
            ]
        });
        const userCount = await User.count();

        return res.status(200).json({
            message: userCount > 1 ? `There are ${userCount} users` : `There is ${userCount} user`,
            users
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong ! " });
    }
}

exports.deleteUser = async(req, res) => {
    const userUuid = req.params.uuid;
    try {
        const user = await User.findOne({
            where: { uuid: userUuid }
        });

        await user.destroy();

        return res.status(200).json({ message: `User name : -- ${user.userName} -- deleted well !` });

    } catch (err) {
        console.log('An error occured at : ' + err);
        return res.status(500).json({ error: "Something went wrong ! " });
    }

};

exports.deleteAllUsers = async(req, res) => {
    try {

        await User.destroy({
            truncate: true
        });

        return res.status(200).json({ message: "You have deleted all the users :|" })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong ! " });
    }
}