const express = require('express');
const fs = require('fs')
const path = require('node:path')
const PORT = 3000;

const app = express();

// file path 
const filePath = path.join(__dirname,'hospitalDetails.json') 

//middlewares
app.use(express.json());
app.use(express.urlencoded());

// READ
app.get('/hospital',(req,res)=>{
    // read object array
    fs.readFile(filePath,(err,data)=>{
        if(err){
            console.log(`readfile error:${err}`);
        }else{
        const parsedData = JSON.parse(data);
        // create response
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(parsedData));

        }
    })
})

// CREATE
app.post('/hospital',(req,res)=>{
    //read file
    const existingData = fs.readFileSync(filePath,'utf-8');
    const arrayObjects = JSON.parse(existingData);
    // take new object value
    const data =req.body;
    // push the new object to array
    if(Object.keys(data).length === 0){
        console.log("add some data");
    }else{
        arrayObjects.push(data);
    }
    const stringData = JSON.stringify(arrayObjects);
    // write file
    fs.writeFile(filePath,stringData,(err)=>{
        if(err){
        console.log(`writeFile error:${err}`);
        }else{
            console.log("file written successfully");
        }
    });
    // create response
    res.setHeader('Content-Type', 'application/json');
    res.end(stringData);
})

// UPDATE
app.put('/hospital/:id',async(req,res)=>{
    // take object id
    const updateId = req.params.id;
    // read object array
    const jsonData = fs.readFileSync(filePath,'utf8');
    const hospitalArray = JSON.parse(jsonData);
    // finding the targetted hopital
    const hospital = hospitalArray.find(hospital=> hospital.id == updateId);
    console.log("before");
    // take update content from client
    const frombody = req.body; 

    if(hospital){
        // assign new values 
        hospital.hospital = frombody.hospital;
        hospital.patients = frombody.patients;
        hospital.location = frombody.location;
        // write data again
        fs.writeFile(filePath,JSON.stringify(hospitalArray),(err)=>console.log(err));
        // create response 
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(hospitalArray));
    }else{
        console.log("cant find a hospital");
    }
})

// DELETE
app.delete('/hospital/:id', async(req,res)=>{
    // take object id
    const deleteId = req.params.id;
    // read file
    const jsonData =  fs.readFileSync(filePath,'utf-8');
    const hospitalArray = JSON.parse(jsonData);
    // find index
    const findIndex = hospitalArray.findIndex((element)=>element.id == deleteId);
    // delete from array
    hospitalArray.splice(findIndex,1);
    // write again 
    fs.writeFile(filePath,JSON.stringify(hospitalArray),(err)=>console.log(err));
    // give response
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(hospitalArray));
})

app.listen(PORT, ()=>{
    console.log(`server running on port:${PORT}`);
})