const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const verify = require('../middleware/authMiddleware');

// CREATE: Add a new movie (Private)
router.post('/', verify, async (req, res) => {
    const newMovie = new Movie({ ...req.body, userId: req.user.id });
    try {
        const savedMovie = await newMovie.save();
        res.status(201).json(savedMovie);
    } catch (err) { res.status(500).json(err); }
});

// READ: Get all movies for the logged-in user (Private)
router.get('/', verify, async (req, res) => {
    try {
        const movies = await Movie.find({ userId: req.user.id });
        res.status(200).json(movies);
    } catch (err) { res.status(500).json(err); }
});

// UPDATE: Edit a movie or toggle favorite (Private)
router.put('/:id', verify, async (req, res) => {
    try {
        const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.status(200).json(updatedMovie);
    } catch (err) { res.status(500).json(err); }
});

// DELETE: Remove a movie (Private)
router.delete('/:id', verify, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json("Movie deleted successfully!");
    } catch (err) { res.status(500).json(err); }
});

router.get('/:id', verify, async (req, res) => {
    try {
        const movie = await Movie.findById(req.params.id);
        if (!movie) return res.status(404).json("Movie not found!");
        
        // Security check: Make sure this movie actually belongs to the logged-in user
        if (movie.userId.toString() !== req.user.id) {
            return res.status(401).json("You can only view your own movies!");
        }

        res.status(200).json(movie);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;