import express from 'express';
import login from '../components/login.js';
import logout from '../components/logout.js'; // Import logout
import getContract from '../components/getContract.js';
import { Register, userdata, updateUser } from '../components/Auth/userController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
import { ntidcreation, assignNtid } from '../components/ntidCreation.js';
import getntidsetup from '../components/getntidSetup.js';
import { insertNtidSetup, assignNtidSetup } from '../components/insertNtidsetup.js';
import getTrainingData from '../components/getTrainingData.js';
import insertTrainingData from '../components/insertTrainingData.js';
import getWeeklyCounts from '../components/getWeeklyCounts.js';
import getNtidCreation from '../components/getNtidCreation.js';
import getNtidContract from '../components/getNtidContract.js';
import getTask from '../components/getTask.js';
import createTicket from '../components/CreateTicket.js';
import {
  saveContract,
  updateContract,
  assignContract,
} from '../components/contractController.js';
import { upload } from '../multer/multer.js';
import Uploadfiles from '../components/Uploadfiles.js';
import AdminDashboard from '../components/AdminDashboard.js';
import TaskDataUpload from '../components/TaskDataUpload.js';
import ViewTicket from '../components/ViewTicket.js';
import updatestatus from '../components/updatestatus.js';
import Uploadshedule from '../components/UploadShedule.js';
import getUsers from '../components/getUsers.js';
import getweekshedule from '../components/getweeklyshedule.js';
import assignTask from '../components/TaskCreation.js';
import getTaskData from '../components/getTaskdata.js';
import deleteTask from '../components/deleteTask.js';
import updatepassword from '../components/updatepassword.js';
import {
  createannouncement,
  getAnnouncement,
  comment,
  likeAnnouncement,
  dislikeAnnouncement,
} from '../components/Announcements/announcementController.js';
import getCurrentUser from '../components/Auth/getCurrentUser.js'; // Add this import

const router = express.Router();

// Public Routes (No authentication required)
router.post('/login', login);
router.post('/register', Register);
router.get('/users/me', authenticateToken, getCurrentUser);

// Protected Routes (Require authentication)
router.get('/users', authenticateToken, userdata);
router.put('/users/:id', authenticateToken, updateUser);

router.post('/savecontract', authenticateToken, saveContract);
router.put('/updatecontract/:id', authenticateToken, updateContract);
router.put('/assigncontract/:id', authenticateToken, assignContract);
router.get('/getcontract', authenticateToken, getContract);
router.get('/getntidcontract', authenticateToken, getNtidContract);

router.post('/uploadfiles', authenticateToken, upload.single('file'), Uploadfiles);
router.post('/upload-schedule', authenticateToken, upload.single('file'), Uploadshedule);
router.get('/getweekshedule/:userid', authenticateToken, getweekshedule);
router.put('/updatestatus/:id', authenticateToken, updatestatus);

router.post('/reset-password', authenticateToken, updatepassword);
router.post('/createtask', authenticateToken, assignTask);
router.get('/taskdata', authenticateToken, getTaskData);
router.delete('/deletetask', authenticateToken, deleteTask);
router.post('/addtask', authenticateToken, TaskDataUpload);
router.get('/gettasks', authenticateToken, getTask);

router.post('/ntidcreation', authenticateToken, ntidcreation);
router.post('/assign-ntid', authenticateToken, assignNtid);
router.get('/getntidcreation', authenticateToken, getNtidCreation);
router.get('/getntidsetup', authenticateToken, getntidsetup);
router.post('/insertData', authenticateToken, insertNtidSetup);
router.post('/assignNtidSetup', authenticateToken, assignNtidSetup);

router.get('/gettrainingdata', authenticateToken, getTrainingData);
router.post('/insert-training-data', authenticateToken, insertTrainingData);
router.get('/getWeeklyCounts', authenticateToken, getWeeklyCounts);

router.post('/createticket', authenticateToken, createTicket);
router.get('/viewticket', authenticateToken, ViewTicket);
router.get('/getadmindata', authenticateToken, AdminDashboard);

router.get('/getusers', authenticateToken, getUsers);

router.post('/createannouncement', authenticateToken, upload.single('image'), createannouncement);
router.get('/getannouncement', authenticateToken, getAnnouncement);
router.post('/addcomment', authenticateToken, comment);
router.post('/likeannouncement', authenticateToken, likeAnnouncement);
router.post('/dislikeannouncement', authenticateToken, dislikeAnnouncement);

// Logout Route (Moved to separate file)
router.post('/logout', authenticateToken, logout);

// Global Error Handling Middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: `File upload error: ${err.message}` });
  }
  console.error('Server Error:', err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

export default router;