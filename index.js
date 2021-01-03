const express = require('express');
const app = express();
const port = 8000;

const { Client } = require('pg');

const client = new Client({
    host: 'ec2-52-48-65-240.eu-west-1.compute.amazonaws.com',
    user: 'hywitwnyswhegv',
    password: '55c866f1b877f2c3c561fafc7ad32a3e09a5ab94abf0e6bb5f3d8e79b3fdeeb4',
    database: 'd2pj77ksrjgc61',
    port: 5432,
    ssl: true
})
client.connect()

app.listen(port,()=> {
    console.log(`listen port ${port}`);
})
// client.query(`DROP TABLE bidder`)
// client.query(`DROP TABLE users`)
// client.query(`
//     CREATE TABLE bidder (
//         bidder_id SERIAL,
//         biddername VARCHAR NOT NULL,
//         bidderIdentity VARCHAR NOT NULL,
//         bidderEmail VARCHAR NOT NULL UNIQUE,
//         bidderPassword VARCHAR NOT NULL,
//         bidderMobile VARCHAR NOT NULL,
//         bidderActive INT NOT NULL,
//         bidderSubmitDate VARCHAR NOT NULL
//         );
// `)
// client.query(`    
// CREATE TABLE users (
//     AuthctioneerId SERIAL,
//     AuthctioneerOrgName VARCHAR NOT NULL,
//     AuthctioneerEmail VARCHAR NOT NULL UNIQUE,
//     AuthctioneerPassword VARCHAR NOT NULL,
//     AuthctioneerTelephone VARCHAR NOT NULL,
//     AuthctioneerMobile VARCHAR NOT NULL,
//     AuthctioneerContactName VARCHAR NOT NULL,
//     AuthctioneerActive INT NOT NULL,
//     AuthctioneerSubmitDate VARCHAR NOT NULL
// );`)


app.post('/signin',async (req,res)=>{
    await client.query(`SELECT AuthctioneerId FROM users
    WHERE AuthctioneerEmail='${req.query.AuthctioneerEmail}'
    AND  AuthctioneerPassword='${req.query.AuthctioneerPassword}';`
    ,(error,result)=>{
        if(error){
            res.send(false)
        }else if(result.rowCount>0){
            res.send(true);
        }else{
            res.send(false)
        }
    })
})
app.post('/signinBidder',async (req,res)=>{
    await client.query(`SELECT AuthctioneerId FROM bidder
    WHERE bidderEmail='${req.query.bidderEmail}'
    AND  bidderPassword='${req.query.bidderPassword}';`,(error,result)=>{
        if(error){
            res.send(false)
        }else 
        if(result.rowCount>0){
            res.send(true);
        }else{
            res.send(false)
        }
    })
})
app.post('/registration', async(req,res)=>{
   await client.query(`INSERT INTO users (
    AuthctioneerOrgName,
    AuthctioneerEmail,
    AuthctioneerPassword,
    AuthctioneerTelephone,
    AuthctioneerMobile,
    AuthctioneerContactName,
    AuthctioneerActive,
    AuthctioneerSubmitDate)
   VALUES (
            '${req.query.AuthctioneerOrgName}', 
            '${req.query.AuthctioneerEmail}',
            '${req.query.AuthctioneerPassword}',
            '${req.query.AuthctioneerTelephone}',
            '${req.query.AuthctioneerMobile}',
            '${req.query.AuthctioneerContactName}',
            ${(req.query.AuthctioneerActive)|1},
            '${req.query.AuthctioneerSubmitDate}');
    `,(error,result)=>{
        if(error){
            res.send({result:false,error})
        }
        if(!error){
            res.send({result:true});
        }
    })
})
app.post('/bidderRegistration', async(req,res)=>{
    await client.query(`INSERT INTO bidder (biddername, bidderIdentity, bidderEmail, bidderPassword,
        bidderMobile, bidderActive, bidderSubmitDate)
        VALUES (
            '${req.query.biddername}', 
            '${req.query.bidderIdentity}',
            '${req.query.bidderEmail}',
            '${req.query.bidderPassword}',
            '${req.query.bidderMobile}',
            ${req.query.bidderActive|1},
            '${req.query.bidderSubmitDate}');
    `,(error,result)=>{
        if(error){
            res.send({result:false,error})
        }
        if(!error&&result){
            res.send({result:true});
        }
    })
})
