import app from '../utils/app.js'
import { isEmpty, validateUsername, validateEmail, validatePassword } from '../utils/validation.js'

app.post('/api/v1/users/register', async (req, res) => {
    const {userName, firstName, lastName, email, phoneNo, password} = req.body
    const details = [userName, firstName, lastName, email, phoneNo, password]
    details.forEach(element => {
        if(element != undefined && isEmpty(element)){
            return res.status(400).json(`${element} can't be empty`)
        }
    })
    if (!validateUsername(userName)) {
        return res.status(400).json({ error: 'userName not available' });
    }
    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Enter a valid email' });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ error: "Password doesn't meet security requirements" });
    }

})