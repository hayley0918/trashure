const express = require('express')
const app = express()
const port = 8080
const db = require('./models/config')
// const pg = require('pg')
// installed bcrypt, express-session, passport-local, bodyParser
const bcrypt = require('bcrypt')
const saltRounds = 10;
var session = require('express-session')

var bodyParser = require('body-parser')

// when you set it from the form  // .json from ajax(axios) request
app.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/login', (req, res)=>{
    res.render('log-in')
})

app.get('/signup', (req, res)=>{
    res.render('sign-up')
})

// insert the data to db when user sign-up
// encrypted password will be stored to db
app.post('/signup', (req, res)=>{

    const hash = bcrypt.hashSync(req.body.password, 10);

    db.query(
        'insert into users (username, name, email, password, avatar_url) values ($1, $2, $3, $4, $5)', [req.body.username, req.body.name, req.body.email, hash, req.body.avatar_url], (err, dbRes)=>{

            res.json({
                username: req.body.username, 
                name: req.body.name, 
                email: req.body.email,
                avatar_url: req.body.avatar_url
            })
            
            res.redirect('/')
    })

})

app.get('/myitems', (req,res)=>{
    res.render('view-my-items')
})

app.get('/new', (req, res) => {
    res.render('new-item')
})

app.post('/new', (req,res) => {
     
    const sql = 'INSERT INTO trashure_items (owner_id, name,item_type, lat, long, address, image_url, pickup_date, pickup_start_time, pickup_end_time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);'

    // need to get owner_id from db, at the moment it's hard coded
    db.query(sql, [1, req.body.name, req.body.item_type, req.body.latitude, req.body.longitude, req.body.address, req.body.image_url, req.body.pickup_date,req.body.pickup_start_time,req.body.pickup_end_time], (err,dbRes) => {
        res.json({
           owner_id: 1, 
           name: req.body.name,
           item_type: req.body.item_type,
           lat: req.body.latitude,
           long: req.body.longitude,
           address: req.body.address,
           image_url: req.body.image_url,
           pickup_date: req.body.pickup_date,
           pickup_start_time: req.body.pickup_start_time,
           pickup_end_time: req.body.pickup_end_time

        })
        // res.redirect('/')
    })
})

app.get('/update/:id', (req,res) => {

    db.query('SELECT * FROM trashure_items WHERE id = $1;', [req.params.id], (err, dbRes) => {
        // need help to get data from db for specific item id
        res.render('edit-item', { item: dbRes})
    })
})

// didn't solve yet how to get item with specific id
app.post('/update/:id', (req, res) => {

    const sql = 'UPDATE trashure_items SET name = $1,item_type = $2, lat = $3, long = $4, address = $5, image_url = $6, pickup_date = $7, pickup_start_time = $8, pickup_end_time = $9 WHERE id = req.params.id;'

    db.query(sql, [req.body.name, req.body.item_type, req.body.latitude, req.body.longitude, req.body.address, req.body.image_url, req.body.pickup_date,req.body.pickup_start_time,req.body.pickup_end_time], (err,dbRes) => {
        res.json({
           owner_id: 1, 
           name: req.body.name,
           item_type: req.body.item_type,
           lat: req.body.latitude,
           long: req.body.longitude,
           address: req.body.address,
           image_url: req.body.image_url,
           pickup_date: req.body.pickup_date,
           pickup_start_time: req.body.pickup_start_time,
           pickup_end_time: req.body.pickup_end_time
        })
    })
})


app.listen(port, () => {
    console.log(`listening on ${port}`)
})


