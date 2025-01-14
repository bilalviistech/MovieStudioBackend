// const s3 = require('../Utils/utils')
const { Upload } = require('@aws-sdk/lib-storage');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const mongoose = require('mongoose')
const Movie = require('../Models/MovieModel')
const Banner = require('../Models/BannerModel')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../Models/UserModel')
const Suggestion = require('../Models/Suggestion')
const dotenv = require('dotenv')
dotenv.config()

const s3 = new S3Client({
    credentials: {
        accessKeyId: process.env.accessKeyId,
        secretAccessKey: process.env.secretAccessKey
    },
    region: process.env.region

})

let clients = [];

class AuthController {
    static Register = async (req, res) => {
        const { email, password, name } = req.body
        try {
            const existingUser = await User.findOne({ email: email });
            if (existingUser) {
                res.status(200).json({
                    success: "false",
                    message: "Email Already Exists."
                });
            }
            else {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);

                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    password: hash,
                });
                await newUser.save();

                res.status(200).json({
                    success: "true",
                    message: "User Created"
                });
            }
        } catch (err) {
            console.error(err);
            res.status(200).json({
                success: false,
                message: err.message
            });
        }
    }

    static SocialAuthRegister = async (req, res) => {
        const { name, email } = req.body
        try {
            const UserExist = await User.findOne({email, email})
            if(UserExist)
            {
                bcrypt.compare('123456789', UserExist.password, (err, result) => {
                    if (result) {
                        const token = jwt.sign({
                            id: UserExist._id,
                            name: UserExist.name,
                            email: UserExist.email,
                        },
                            process.env.AppToken
                        )
                        res.status(200).json({
                            success: true,
                            data: {
                                id: UserExist._id,
                                name: UserExist.name,
                                email: UserExist.email,
                                token: token
                            }
    
                        });
                    }
                    else {
                        res.status(200).json({
                            success: false,
                            message: "Password doesn't match."
                        })
                    }
                })
                 
            }
            else
            {
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash('123456789', salt);
    
                const newUser = new User({
                    _id: new mongoose.Types.ObjectId(),
                    name: name,
                    email: email,
                    password: hash,
                })
                await newUser.save()
    
                if(newUser){
    
                    const token = jwt.sign({
                        id: newUser._id,
                        name: newUser.name,
                        email: newUser.email,
                    },
                        process.env.AppToken
                    )
                    res.status(200).json({
                        success: true,
                        data: {
                            id: newUser._id,
                            name: newUser.name,
                            email: newUser.email,
                            token: token
                        }
                    });
                }
                else{
                    res.status(200).json({
                        success: false,
                        message: "Something went wrong."
                    });
                }
            }
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            });
        }
    }

    static Login = async (req, res) => {
        const { email, password } = req.body
        const UserExist = await User.findOne({ email: email })
        if (UserExist) {
            bcrypt.compare(password, UserExist.password, (err, result) => {
                if (result) {
                    const token = jwt.sign({
                        id: UserExist._id,
                        name: UserExist.name,
                        email: UserExist.email,
                    },
                        process.env.AppToken
                    )
                    return res.status(200).json({
                        success: true,
                        data: {
                            id: UserExist.id,
                            name: UserExist.name,
                            email: UserExist.email,
                            token: token
                        }

                    });
                }
                else {
                    res.status(200).json({
                        success: false,
                        message: "Password Doesn't Match"
                    })
                }
            })
        }

        else {
            res.status(200).json({
                success: false,
                message: "Email doesn't exist."
            })
        }

    }

    static AddMovie = async (req, res) => {
        const thumbnail = req.file;
        const { movieTitle, movieCategory, movieDescription, movieLink } = req.body

        // Validate required fields
        if (!thumbnail || !movieTitle || !movieCategory || !movieDescription || !movieLink) {
            return res.status(200).json({
                success: false,
                message: "All fields are required, including a thumbnail."
            });
        }

        const currentDate = Date.now()

        const thumbnailParams = {
            Bucket: process.env.Bucketname,
            Key: `Movie/Thumbnail/${currentDate}_thumbnail_${thumbnail.originalname}`,
            Body: thumbnail.buffer,
            ContentType: thumbnail.mimetype,
        };

        try {
            const thumbnailUpload = new Upload({
                client: s3,
                params: thumbnailParams,
                leavePartsOnError: false,
            });

            await thumbnailUpload.done();

            if (thumbnailUpload) {
                const newMovie = Movie({
                    _id: new mongoose.Types.ObjectId(),
                    movieTitle: movieTitle,
                    movieCategory: JSON.parse(movieCategory),
                    movieDescription: movieDescription,
                    movieLink: movieLink,
                    thumbnailLink: thumbnailParams.Key
                })
                await newMovie.save()
            }

            res.status(200).json({
                success: true,
                message: "Your Video Has Been Uploaded."
            });


        } catch (error) {
            console.error('Error uploading:', error);
            res.status(200).json({
                success: false,
                message: error.message
            });
        }

    }

    static TrendingMovie = async (req, res) => {
        try {
            const MovieId = req.params.Movieid

            const MovieExist = await Movie.findOneAndUpdate({_id: MovieId}, {
                $set: {
                    movieTrending: true
                }
            })
            
            if(!MovieExist){
                return res.status(200).json({
                    success: false,
                    message: "No movie found."
                })
            }
    
            res.status(200).json({
                success: true,
                message: "Movie has been trending now."
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }

    }

    static AddBanner = async (req, res) => {

        const currentDate = Date.now()
        const BannerObj = req.file;

        const BannerParams = {
            Bucket: process.env.Bucketname,
            Key: `Banner/${currentDate}_${BannerObj.originalname}`,
            Body: BannerObj.buffer,
            ContentType: BannerObj.mimetype,
        };

        try {
            const BannerUpload = new Upload({
                client: s3,
                params: BannerParams,
                leavePartsOnError: false,
            });
            await BannerUpload.done();

            if (BannerUpload) {
                const newBanner = new Banner({
                    _id: new mongoose.Types.ObjectId(),
                    Banner: BannerParams.Key,
                })
                await newBanner.save()
            }

            res.status(200).json({
                success: true,
                message: "Your Banner Has Been Uploaded."
            });

        } catch (error) {
            console.error('Error uploading:', error);
            res.status(200).json({
                success: false,
                message: error.message
            });
        }
    }

    static Events = async (req, res) => {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        clients.push(res);

        req.on('close', () => {
            clients = clients.filter(client => client !== res);
        });
    };

    static Suggestion = async (req, res) => {
        const {AnySuggestion} = req.body
        try {
            const newSuggestion =  new Suggestion ({
                UserId: req.user._id,
                AnySuggestion: AnySuggestion
            })
            await newSuggestion.save()
    
            res.status(200).json({
                success: true,
                message: "Your suggestion has been sent."
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllSuggestion = async (req,res) =>{
        try {
            const GetAllSuggestion = await Suggestion.find()
            let AllDetail = []

            for(let i=0; i< GetAllSuggestion.length;i++){
                const UserDetail = await User.findById(GetAllSuggestion[i].UserId)

                AllDetail.push({
                    name: UserDetail.name,
                    email: UserDetail.email,
                    AnySuggestion: GetAllSuggestion[i].AnySuggestion,
                })
            }

            res.status(200).json({
                success: true,
                data: AllDetail
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

    static GetAllUser = async (req, res) => {
        try {
            const AlUsers = await User.find({})

            res.status(200).json({
                success: true,
                data: AlUsers
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }
}



module.exports = AuthController