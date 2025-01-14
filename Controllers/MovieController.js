const Movie = require('../Models/MovieModel')
const Favorite = require('../Models/FavoriteMovieModel');
const Banner = require('../Models/BannerModel')
const Watched = require('../Models/WatchedModel')
const SeriesModel = require('../Models/SeriesModel')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

class MovieController {
    static GetAllMovie = async (req, res) => {
        try {

            const categories = [
                "Bollywood",
                "Hollywood",
                "Pakistani",
                "Punjabi",
                "Action",
                "Adventure",
                "Comedies",
                "Dramas",
                "Horror",
                "Romance",
                "Science fiction",
                "Tamil",
                "Thriller",
                "Action & Adventure",
                "Action Comedies",
                "Action Sci-Fi & Fantasy",
                "Action Thrillers",
                "Adult Animation",
                "African Movies",
                "Alien Sci-Fi",
                "Animal Tales",
                "Anime",
                "Anime Action",
                "Anime Comedies",
                "Anime Dramas",
                "Anime Fantasy",
                "Anime Features",
                "Anime Horror",
                "Anime Sci-Fi",
                "Anime Series",
                "Art House Movies",
                "Asian Action Movies",
                "Australian Movies",
                "B-Horror Movies",
                "Baseball Movies",
                "Basketball Movies",
                "Belgian Movies",
                "Biographical Documentaries",
                "Biographical Dramas",
                "Boxing Movies",
                "British Movies",
                "British TV Shows",
                "Campy Movies",
                "Children & Family Movies",
                "Chinese Movies",
                "Classic Action & Adventure",
                "Classic Comedies",
                "Classic Dramas",
                "Classic Foreign Movies",
                "Classic Movies",
                "Classic Musicals",
                "Classic Romantic Movies",
                "Classic Sci-Fi & Fantasy",
                "Classic Thrillers",
                "Classic TV Shows",
                "Classic War Movies",
                "Classic Westerns",
                "Comic Book and Superhero Movies",
                "Country & Western/Folk",
                "Courtroom Dramas",
                "Creature Features",
                "Crime Action & Adventure",
                "Crime Documentaries",
                "Crime Dramas",
                "Crime Thrillers",
                "Crime TV Shows",
                "Cult Comedies",
                "Cult Horror Movies",
                "Cult Movies",
                "Cult Sci-Fi & Fantasy",
                "Cult TV Shows",
                "Dark Comedies",
                "Deep Sea Horror Movies",
                "Disney",
                "Disney Musicals",
                "Documentaries",
                "Dramas based on Books",
                "Dramas based on real life",
                "Dutch Movies",
                "Eastern European Movies",
                "Education for Kids",
                "Epics",
                "Experimental Movies",
                "Faith & Spirituality",
                "Faith & Spirituality Movies",
                "Family Features",
                "Fantasy Movies",
                "Film Noir",
                "Food & Travel TV",
                "Football Movies",
                "Foreign Action & Adventure",
                "Foreign Comedies",
                "Foreign Documentaries",
                "Foreign Dramas",
                "Foreign Gay & Lesbian Movies",
                "Foreign Horror Movies",
                "Foreign Movies",
                "Foreign Sci-Fi & Fantasy",
                "Foreign Thrillers",
                "French Movies",
                "Gangster Movies",
                "Gay & Lesbian Dramas",
                "German Movies",
                "Greek Movies",
                "Historical Documentaries",
                "Horror Comedy",
                "Horror Movies",
                "Independent Action & Adventure",
                "Independent Comedies",
                "Independent Dramas",
                "Independent Movies",
                "Independent Thrillers",
                "Indian Movies",
                "Irish Movies",
                "Italian Movies",
                "Japanese Movies",
                "Jazz & Easy Listening",
                "Kids Faith & Spirituality",
                "Kids Music",
                "Kids’ TV",
                "Korean Movies",
                "Korean TV Shows",
                "Late Night Comedies",
                "Latin American Movies",
                "Latin Music",
                "Martial Arts Movies",
                "Martial Arts, Boxing & Wrestling",
                "Middle Eastern Movies",
                "Military Action & Adventure",
                "Military Documentaries",
                "Military Dramas",
                "Military TV Shows",
                "Miniseries",
                "Mockumentaries",
                "Monster Movies",
                "Movies based on children’s books",
                "Movies for ages 0 to 2",
                "Movies for ages 2 to 4",
                "Movies for ages 5 to 7",
                "Movies for ages 8 to 10",
                "Movies for ages 11 to 12",
                "Music & Concert Documentaries",
                "Music",
                "Musicals",
                "Mysteries",
                "New Zealand Movies",
                "Period Pieces",
                "Political Comedies",
                "Political Documentaries",
                "Political Dramas",
                "Political Thrillers",
                "Psychological Thrillers",
                "Quirky Romance",
                "Reality TV",
                "Religious Documentaries",
                "Rock & Pop Concerts",
                "Romantic Comedies",
                "Romantic Dramas",
                "Romantic Favorites",
                "Romantic Foreign Movies",
                "Romantic Independent Movies",
                "Romantic Movies",
                "Russian",
                "Satanic Stories",
                "Satires",
                "Scandinavian Movies",
                "Sci-Fi & Fantasy",
                "Sci-Fi Adventure",
                "Sci-Fi Dramas",
                "Sci-Fi Horror Movies",
                "Sci-Fi Thrillers",
                "Science & Nature Documentaries",
                "Science & Nature TV",
                "Screwball Comedies",
                "Showbiz Dramas",
                "Showbiz Musicals",
                "Silent Movies",
                "Slapstick Comedies",
                "Slasher and Serial Killer Movies",
                "Soccer Movies",
                "Social & Cultural Documentaries",
                "Social Issue Dramas",
                "Southeast Asian Movies",
                "Spanish Movies",
                "Spiritual Documentaries",
                "Sports & Fitness",
                "Sports Comedies",
                "Sports Documentaries",
                "Sports Dramas",
                "Sports Movies",
                "Spy Action & Adventure",
                "Spy Thrillers",
                "Stage Musicals",
                "Stand-up Comedy",
                "Steamy Romantic Movies",
                "Steamy Thrillers",
                "Supernatural Horror Movies",
                "Supernatural Thrillers",
                "Tearjerkers",
                "Teen Comedies",
                "Teen Dramas",
                "Teen Screams",
                "Teen TV Shows",
                "Thrillers",
                "Travel & Adventure Documentaries",
                "TV Action & Adventure",
                "TV Cartoons",
                "TV Comedies",
                "TV Documentaries",
                "TV Dramas",
                "TV Horror",
                "TV Mysteries",
                "TV Sci-Fi & Fantasy",
                "TV Shows",
                "Urban & Dance Concerts",
                "Vampire Horror Movies",
                "Werewolf Horror Movies",
                "Westerns",
                "World Music Concerts",
                "Zombie Horror Movies",
            ]

            const PageNumber = parseInt(req.query.page) || 1;
            const PageLimitData = 10;
            const obj = [];

            const startIndex = (PageNumber - 1) * PageLimitData;
            const endIndex = startIndex + PageLimitData;
            const categoriesToFetch = categories.slice(startIndex, endIndex);

            for (const category of categoriesToFetch) {
                const movies = await Movie.paginate({ movieCategory: category }, { page: 1, limit: PageLimitData });
                obj.push({ category, movies });
            }

            return res.status(200).json({
                success: true,
                path: process.env.movieDomainURL,
                data: obj
            });

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }

    }

    static GetMovieTitles = async (req, res) => {
        try {
            const title = req.query.title

            const AllMovieTitles = await Movie.find({ movieTitle: { $regex: title, $options: 'i' } }).select('movieTitle');

            res.status(200).json({
                success: true,
                data: AllMovieTitles
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }

    }

    static GetMoviesByTitle = async (req, res) => {
        try {
            const title = req.params.title
            const PageNumber = req.query.page || 1;
            const PageLimitData = 10;

            const AllMovie = await Movie.paginate({ movieTitle: { $regex: title, $options: 'i' } }, { page: PageNumber, limit: PageLimitData })

            if(AllMovie.docs.length > 0){
                res.status(200).json({
                    success: true,
                    data: AllMovie.docs,
                    totalDocs: AllMovie.totalDocs,
                    limit: AllMovie.limit,
                    totalPages: AllMovie.totalPages,
                    currentPage: AllMovie.page,
                    pagingCounter: AllMovie.pagingCounter,
                    nextPage: AllMovie.nextPage
                })
            }
            else{
                const AllMovie = await Movie.aggregate([ { $sample: { size: 10 } } ]);

                res.status(200).json({
                    success: true,
                    data: AllMovie,
                    totalDocs: 10,
                    limit: 10,
                    totalPages: 1,
                    currentPage: 1,
                    pagingCounter: 1,
                    nextPage: null
                })
            }


        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetMoviesByCategory = async (req, res) => {
        try {
            const category = req.params.category
            const PageNumber = req.query.page || 1;
            const PageLimitData = 10;

            const AllMovie = await Movie.paginate({ movieCategory: { $elemMatch: { $regex: category, $options: 'i' } } }, { page: PageNumber, limit: PageLimitData })

            res.status(200).json({
                success: true,
                data: AllMovie.docs,
                totalDocs: AllMovie.totalDocs,
                limit: AllMovie.limit,
                totalPages: AllMovie.totalPages,
                currentPage: AllMovie.page,
                pagingCounter: AllMovie.pagingCounter,
                nextPage: AllMovie.nextPage
            })

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetTrendingMovies = async (req, res) => {
        try {
            const GetTrendingMovie = await Movie.find({ movieTrending: true }).sort({ _id: 1 }).limit(3);

            res.status(200).json({
                success: true,
                data: GetTrendingMovie
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

    static WatchNowPost = async (req, res) => {
        try {
            const UserId = req.user._id
            const MovieId = req.params.movieId

            const ExistWatch = await Watched.findOne({ UserId: UserId, MovieId: MovieId })
            if (ExistWatch) {
                return res.status(200).json({
                    success: true,
                    message: "Already added in watch now history"
                })
            }

            const newWatched = new Watched({
                _id: new mongoose.Types.ObjectId(),
                UserId: UserId,
                MovieId: MovieId
            })
            await newWatched.save()

            res.status(200).json({
                success: true,
                message: "Added in watch now history"
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllWatchNow = async (req, res) => {
        try {
            const UserId = req.user._id
            const GetAllWatch = await Watched.find({ UserId: UserId })

            if (GetAllWatch) {
                const movieObj = []

                for (let i = 0; i < GetAllWatch.length; i++) {
                    const MovieDetail = await Movie.findOne({ _id: GetAllWatch[i].MovieId })
                    movieObj.push({
                        _id: GetAllWatch._id,
                        UserId: UserId,
                        MovieId: MovieDetail?._id,
                        movieTitle: MovieDetail?.movieTitle,
                        movieCategory: MovieDetail?.movieCategory,
                        movieDescription: MovieDetail?.movieDescription,
                        thumbnailLink: MovieDetail?.thumbnailLink,
                        movieLink: MovieDetail?.movieLink,
                    })
                }

                res.status(200).json({
                    success: true,
                    data: movieObj
                })
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "No watch history found."
                })
            }

        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

    static WatchLater = async (req, res) => {
        try {
            const MovieId = req.params.movieId
            const UserId = req.user._id

            const MovieExist = await Movie.findOne({ _id: MovieId })

            if (MovieExist) {

                const AddedFavorite = await Favorite.findOne({ UserId: UserId, MovieId: MovieId })
                if (AddedFavorite) {
                    await Favorite.deleteOne({ _id: AddedFavorite._id });
                    return res.status(200).json({
                        success: true,
                        message: "Removed from watch later."
                    })
                }
                const AddFavorite = new Favorite({
                    _id: new mongoose.Types.ObjectId(),
                    UserId: req.user._id,
                    MovieId: MovieId
                })
                await AddFavorite.save()

                res.status(200).json({
                    success: true,
                    message: "Added in watch later."
                })
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "Movie doesn't exist."
                })
            }

        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

    static GetAllWatchLater = async (req, res) => {
        try {
            const AllFavorite = await Favorite.find()
            const MovieObj = []

            if (AllFavorite.length > 0) {

                for (let i = 0; i < AllFavorite.length; i++) {
                    const MoveInfo = await Movie.findById(AllFavorite[i].MovieId)
                    MovieObj.push({
                        _id: AllFavorite[i]._id,
                        UserId: req.user._id,
                        MovieId: MoveInfo._id,
                        movieTitle: MoveInfo.movieTitle,
                        movieCategory: MoveInfo.movieCategory,
                        movieDescription: MoveInfo.movieDescription,
                        thumbnailLink: MoveInfo.thumbnailLink,
                        movieLink: MoveInfo.movieLink,
                    })

                    res.status(200).json({
                        success: true,
                        data: MovieObj
                    })
                }
            }
            else {
                res.status(200).json({
                    success: false,
                    message: "No watch later found."
                })
            }


        } catch (error) {
            res.status(200).json({
                success: false,
                data: error.message
            })
        }
    }

    static GetBanner = async (req, res) => {
        try {
            const GetBanner = await Banner.findOne()

            res.status(200).json({
                success: true,
                path: process.env.movieDomainURL,
                data: GetBanner
            })
        } catch (error) {
            res.status(200).json({
                success: false,
                message: error.message
            })
        }
    }

}



module.exports = MovieController