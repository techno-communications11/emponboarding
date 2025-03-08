import express from 'express';
 import register from '../components/register.js'
 import login from '../components/login.js';
//  import Contract from '../components/contract.js';
 import getContract from '../components/getContract.js';
 
 import { ntidcreation, assignNtid } from '../components/ntidCreation.js';
 import getntidsetup from '../components/getntidSetup.js'
 import { insertNtidSetup, assignNtidSetup } from '../components/insertNtidsetup.js';
import getTrainingData from '../components/getTrainingData.js';
import insertTrainingData from '../components/insertTrainingData.js';
import getWeeklyCounts from '../components/getWeeklyCounts.js';
import getNtidCreation from '../components/getNtidCreation.js';
import getNtidContract from '../components/getNtidContract.js';
import getTask from '../components/getTask.js'
import createTicket from '../components/CreateTicket.js';
import {
    saveContract,
    updateContract,
    assignContract,
  } from "../components/contractController.js";
  import { upload } from '../multer/multer.js';
  import Uploadfiles from '../components/Uploadfiles.js';
  import AdminDashboard from '../components/AdminDashboard.js';
  import TaskDataUpload from '../components/TaskDataUpload.js';
  import ViewTicket from '../components/ViewTicket.js';
import updatestatus from '../components/updatestatus.js';
import Uploadshedule from '../components/UploadShedule.js'
// Create the router
import getUsers from '../components/getusers.js';
import getweekshedule from "../components/getweeklyshedule.js";
import assignTask from '../components/TaskCreation.js';
import getTaskData from '../components/getTaskdata.js';


const router = express.Router();

router.post("/savecontract", saveContract);
router.get("/getntidcontract", getNtidContract);
router.post('/upload-schedule', upload.single('file'), Uploadshedule);
router.get("/getweekshedule/:userid", getweekshedule);
router.put("/updatestatus/:id",updatestatus)
router.post('/createtask',assignTask)

// Update Contract
router.put("/updatecontract/:id", updateContract);
router.get('/getusers',getUsers);
router.get('/taskdata',getTaskData);

// Assign Contract
router.put("/assigncontract/:id", assignContract);
router.post("/uploadfiles", upload.single('file'), Uploadfiles);
router.post("/createticket", createTicket);

router.post('/register', register);
router.post('/addtask', TaskDataUpload);
// router.post('/contract', Contract);
router.get('/getcontract',getContract);
router.get('/gettasks',getTask);
router.get('/viewticket',ViewTicket);
router.get('/getadmindata',AdminDashboard);

router.post('/ntidcreation', ntidcreation);
router.post('/assign-ntid', assignNtid);
router.get('/getntidcreation',getNtidCreation)
router.get('/getntidsetup',getntidsetup)
router.post('/insertData', insertNtidSetup);
router.post('/assignNtidSetup', assignNtidSetup);
router.get('/gettrainingdata',getTrainingData)
router.get('/getWeeklyCounts',getWeeklyCounts)
router.post('/insert-training-data',insertTrainingData)

// Login route
router.post('/login', login);

// Logout route

// Export the router
export default router;