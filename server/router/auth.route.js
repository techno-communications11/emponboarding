import express from 'express';
 import register from '../components/register.js'
 import login from '../components/login.js';
 import Contract from '../components/contract.js';
 import getContract from '../components/getContract.js';
 import ntidcreation from '../components/ntidCreation.js';
 import getntidsetup from '../components/getntidSetup.js'
 import insertNtidsetup from '../components/insertNtidsetup.js';
import getTrainingData from '../components/getTrainingData.js';
import insertTrainingData from '../components/insertTrainingData.js';
import getWeeklyCounts from '../components/getWeeklyCounts.js';


const router = express.Router();

// Register route
router.post('/register', register);
router.post('/contract', Contract);
router.get('/getcontract',getContract);
router.post('/assign-ntid',ntidcreation)
router.get('/getntidsetup',getntidsetup)
router.post('/insertData',insertNtidsetup)
router.get('/gettrainingdata',getTrainingData)
router.get('/getWeeklyCounts',getWeeklyCounts)
router.post('/insert-training-data',insertTrainingData)

// Login route
router.post('/login', login);

// Logout route

// Export the router
export default router;