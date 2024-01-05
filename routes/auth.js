var express = require('express');
var router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {createDocument, findDocuments, findUserByEmail, createUser} = require("../config/database");
/* Sign up. */
router.post('/signup', async function (req, res, next) {
    try {
        const {firstName, lastName, email, password} = req.body;
        if (!(email && password && firstName && lastName))
            return res.status(400).send('All input is needed!');
        const existingUser = await findUserByEmail(email);
        if (existingUser)
            return res.status(409).send('User already exist.')

        let encryptedPassword = await bcrypt.hash(password, 10);

        const user = createUser({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(), // sanitize
            password: encryptedPassword,
            created_notes: [],
            shared_with_notes: []
        });

        user.token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h",
            }
        );
        user.response = 'Successfully registered';
        res.status(201).json(user);
    } catch (e) {
        console.log(e);
    }
});

// login
router.post("/login", async (req, res) => {

    try {
        const {email, password} = req.body;

        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        const user = await findUserByEmail(email);

        if (user && (await bcrypt.compare(password, user.password))) {
            // save user token
            user.token = jwt.sign(
                {user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h",
                }
            );

            // user
            return res.status(200).json(user.token);
        }
        return res.status(400).send("Invalid Credentials");

        // Our login logic ends here
    } catch (e) {
        console.log(e);
    }
});

module.exports = router;
