const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password').lean();

    if(!users?.length)
        return res.status(400).json({ message: 'No users found' });
    
    res.json(users);
});

// @desc Create new user
// @route POST /users
// @access Private
const createUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    // Check required field
    if(!username || !password || !Array.isArray(roles) || !roles.length)
        return res.status(400).json({ message: 'All field are required' });

    // Check duplicate username
    const duplicateUser = await User.findOne({ username }).lean().exec();

    if(duplicateUser)
        return res.status(409).json({ message: 'Duplicate username' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = { 
        username,
        "password": hashedPassword,
        roles, 
    }

    //Create and store user
    const user = await User.create(userObject);

    if(user)
        res.status(201).json({ message: `New user ${ username } created` });
    else
        res.status(400).json({ message: 'Invalid user data received' });

});

// @desc Update user
// @route PATCH /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body;

    if(!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean')
        return res.status(400).json({ message: 'All field are required' });

    const foundedUser = await User.findById(id).exec();

    if(!foundedUser)
        return res.status(400).json({ message: 'User not found' });

    const duplicateUser = await User.findOne({ username }).lean().exec();
    if(duplicateUser && duplicateUser?._id.toString() !== id)
        return res.status(409).json({ message: 'Duplicate username' });
    
    foundedUser.username = username;
    foundedUser.roles = roles;
    foundedUser.active = active;

    if(password)
        foundedUser.password = await bcrypt.hash(password, 10)
    
    const updateUser = await foundedUser.save();

    res.json({ message: `User ${ updateUser.username } updated` });

});

// @desc Delete user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.body;

    if(!id)
        return res.status(400).json({ message: 'Id field required' });

    const userNotes = await Note.findOne({ user: id }).lean().exec();

    if(userNotes?.length)
        return res.status(400).json({ message: 'The user has assigned notes' });

    const user = await User.findById(id).exec();

    if(!user)
        return res.status(400).json({ message: 'User not found' });

    const deletedUser = await user.deleteOne();

    res.json({ message: `Username: ${ deletedUser.username } -- Id: ${ deletedUser._id } deleted` });
});

module.exports = {
    getAllUsers,
    createUser,
    updateUser,
    deleteUser
};