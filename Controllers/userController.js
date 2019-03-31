const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
const LoginVerification = require('../Models/LoginVerification');

exports.getAllUsers = (req, res) => {
    User.find()
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Users received',
                users: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.getArtists = (req, res) => {
    User.find({role: "Artist"})
        .then((result) => {
            res.status(200).json({
                success: true,
                msg: 'Users received',
                users: result
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })
}

exports.resetPassword = (req, res) => {
    console.log(req.body.email)
    if (!req.body.email) {
        return res.status(422).json({
            success: false,
            msg: 'Please enter the email',
        });
    }

    bcrypt.hash(req.body.password, 12, (err, hashPassword) => {
        if (err) {
            console.log(err)
            return res.status(422).json({
                success: false,
                msg: err
            });
        }
        User.findOneAndUpdate({
            email: req.body.email
        }, {
                password: hashPassword
            })
            .then(_ => {
                res.status(201).json({
                    success: true,
                    msg: 'Password resetted'
                });
            })
            .catch(msg => {
                res.status(422).json({
                    success: false,
                    msg
                });
            });
    })
}

exports.checkOtp = (req, res) => {
    LoginVerification.find({
        email: req.body.email,
        otp: req.body.otp
    })
        .then(user => {
            if (!user || user.length <= 0) {
                return res.status(422).json({
                    success: false,
                    msg: "Access Denied",
                });
            }
            res.status(200).json({
                success: true,
                msg: 'User Verified',
                email: user.email
            });
        })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })

}

exports.forgotPassword = (req, res) => {
    const {
        email
    } = req.body;

    if (!email) {
        return res.status(422).json({
            success: false,
            msg: 'Please enter the email',
        });
    }
    User.find({
        email: req.body.email
    }).then(user => {
        if (!user || user.length <= 0) {
            return res.status(422).json({
                success: false,
                msg: "User doesn't exist",
            });
        }
    })
        .catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        })

    const otp = otpGenerator.generate(6, {
        alphabets: true,
        upperCase: true,
        specialChars: false
    });

    const loginVerfication = new LoginVerification({
        email: req.body.email,
        otp: otp
    });
    loginVerfication.save()
        .then(_ => {
            let transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: 'syal25121997@gmail.com',
                    pass: 'ssdps@7925'
                }
            });

            let mailOptions = {
                from: "<innocentsandeep1@gmail.com>",
                to: req.body.email,
                subject: 'OTP ',
                text: `OTP to create new password:-${otp}`,
                // html: '<b>Hello World</b>'
            }

            transporter.sendMail(mailOptions)
                .then(info => {
                    res.status(201).json({
                        success: true,
                        msg: 'OTP sent to your Email id',
                    });
                })
                .catch(msg => {
                    res.status(422).json({
                        success: false,
                        msg
                    });
                });

        }).catch(msg => {
            res.status(422).json({
                success: false,
                msg
            });
        });
}


exports.saveUser = (req, res) => {
    const {
        email,
        password
    } = req.body;

    if (!email) {
        return res.status(422).json({
            success: false,
            msg: 'Please enter the email',
        });
    }

    User.find({
        email: email
    })
        .then(user => {
            if (user.length >= 1) {
                return res.status(422).json({
                    success: false,
                    msg: 'User already exist'
                });
            } else if (!password) {
                return res.status(422).json({
                    success: false,
                    msg: 'Password not found'
                });
            }

            bcrypt.hash(password, 12, (err, hashPassword) => {
                if (err) {
                    return res.status(422).json({
                        success: false,
                        msg: err
                    });
                }
                const user = new User({
                    ...req.body,
                    password: hashPassword,
                });
                user.save()
                    .then(_ => {
                        res.status(201).json({
                            success: true,
                            msg: 'User saved'
                        });
                    })
                    .catch(msg => {
                        res.status(422).json({
                            success: false,
                            msg
                        });
                    });
            })
        })

}

exports.loginUser = (req, res) => {
    const {
        email,
        password,
    } = req.body;

    if (!email) {
        console.log(req.body.email)
        return res.status(422).json({
            success: false,
            msg: 'Access Denied'
        });
    }

    User.findOne({
        email: email
    }).then(user => {
        if (!user || user.length > 1) {
            return res.status(422).json({
                success: false,
                msg: 'Access Denied'
            });
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(422).json({
                        success: false,
                        msg: err
                    });
                } else if (result) {
                    const token = jwt.sign({
                        email: email,
                        userId: user._id,
                        role: user.role
                    }, "324324ui24hkb2k4b231k4k12kkfbdkbi24bib21", {
                        expiresIn: '1d'
                    });
                    return res.status(200).json({
                        success: true,
                        msg: 'Auth successful',
                        access_token: token,
                        role: user.role,
                    });
                } else {
                    return res.status(422).json({
                        success: false,
                        msg: 'Access Denied'
                    });
                }
            })
        }
    })
}

exports.artistLogin = (req, res) => {
    const {
        email,
        password,
    } = req.body;

    if (!email) {
        console.log(req.body.email)
        return res.status(422).json({
            success: false,
            msg: 'Access Denied'
        });
    }

    User.findOne({
        email: email , role : "Artist"
    }).then(user => {
        if (!user || user.length > 1 || user === null) {
            return res.status(422).json({
                success: false,
                msg: 'Access Denied'
            });
        } else {
            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(422).json({
                        success: false,
                        msg: err
                    });
                } else if (result) {
                    const token = jwt.sign({
                        email: email,
                        userId: user._id,
                        role: user.role
                    }, "324324ui24hkb2k4b231k4k12kkfbdkbi24bib21", {
                        expiresIn: '1d'
                    });
                    return res.status(200).json({
                        success: true,
                        msg: 'Auth successful',
                        access_token: token,
                        role: user.role,
                    });
                } else {
                    return res.status(422).json({
                        success: false,
                        msg: 'Access Denied'
                    });
                }
            })
        }
    })
}