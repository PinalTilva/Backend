const express = require('express');
const { set } = require('mongoose');
const { getFun, getMembers, updateYear, create, deleteLoans, updateLoans, loginApi, Middleware } = require('./Api/apiFunctions');
const { dbData, dbMembers, login } = require('./db/mongo');

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());





// View
app.get('/get', (req, res) => getFun({req, res, dbData}));


//View Loaned members / members
app.get('/get/:year/members', (req, res) => getMembers({req, res, dbData, dbMembers}));


// Creat 
app.post('/add', (req, res) => create({req, res, dbData}));


//Update 
app.put('/update/:year', (req, res) => updateYear(req, res, dbData));


//Delete
app.put('/delete', (req, res) => deleteLoans({req, res, dbData}));


// Update Running loan
app.put('/update_loans', (req, res) => updateLoans({req, res, dbData}));


//Login 
app.post('/login', (req, res) => loginApi({req, res, login}));


app.listen(port, () => {
    console.log('hello1', port);
});

// static files (build of your frontend)
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'frontend', 'build')));
    app.get('/*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    })
  }