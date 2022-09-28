const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Sign up authentication
exports.signUp = async(req, res, next) => {

    const { userName, email, password } = req.body;

    let userNameExisting;
    let emailExisting;

    // We verify if the username and/or email exist
    try {
        userNameExisting = await User.findOne({
            where: { userName }
        });

        emailExisting = await User.findOne({
            where: { email }
        });

    } catch (error) {
        console.log(`An error occured with username and email: ${error}`);
    }

    if (userNameExisting) {
        return res.status(400).json({ message: `This username -- ${userNameExisting.userName} -- already exists | Login instead !` });
    }

    if (emailExisting) {
        return res.status(400).json({ message: `This email -- ${emailExisting.email} -- already exists | Login instead !` });
    }

    // We create an username account
    try {
        const user = await User.create({
            userName,
            email,
            password
        });

        res.status(201).json({
            message: `The account *${user.userName}* has successfully created !`,
            user
        });

    } catch (error) {
        console.log('An error accurs with creating user account : ' + error);
        res.status(400).json({ message: "Checked all the values passed. Something went wrong !" });
    }
};

// Sign in authentication
exports.signIn = async(req, res, next) => {
    const { userName, password } = req.body;

    let userNameExisting;
    try {
        userNameExisting = await User.findOne({
            where: { userName }
        });

    } catch (error) {
        console.log(`An error occured with login : ${error}`);
    }

    if (!userNameExisting) {
        return res.status(400).json({ message: "This username doesn't exist | Sign up instead !" });
    }

    const isPasswordCorrect = bcrypt.compareSync(password, userNameExisting.password);

    if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Your password is invalid " });
    }

    const token = jwt.sign({ id: userNameExisting.uuid },
        process.env.JWT_SECRET_KEY, { expiresIn: "24hr" }
    );

    return res
        .status(201)
        .json({ message: "Successfully logged in !", token });

}

// Authguard to generate the jwt which has the secret in the .env (define it before)
exports.authGuard = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        const message = "You are not logged in to access the resource | Please log in!";
        res.status(401).json({ message });
    }

    const token = authorizationHeader.split(' ')[1];

    const decodedToken = jwt.verify(String(token), process.env.JWT_SECRET_KEY, (error, user) => {
        if (error) {
            const message = "You are not authorized to access this resource...";
            return res.status(401).json({ message });
        }

        const userId = user.id;
        if (req.body.userId && req.body.uuid !== id) {
            const message = "The user ID is invalid...";
            res.status(401).json({ message });
        } else {
            next();
        }
    });
}