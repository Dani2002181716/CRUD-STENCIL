import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";

const app= express();
app.use(bodyParser.json());

const readData = () =>{
    try{
      const data=fs.readFileSync("./db.json");
     return JSON.parse(data);
    } catch(error){
        console.log(error);
    }
};

const writeData =(data) =>{
    try{
      fs.writeFileSync("./db.json",JSON.stringify(data));
    } catch(error){
            console.log(error);
    }
};
 
app.get("/",(req, res) => {
   res.send("Welcome to my first API with Node js!");
});

app.get("/gestiontareas",(req,res) =>{
    const data = readData();
    res.json(data.gestiontareas);
});

app.get("/gestiontareas/:id",(req, res) => {
    const data =readData();
    const id= parseInt(req.params.id);
    const tarea = data.gestiontareas.find((tarea) => tarea.id === id);
    res.json(tarea);
});

app.post("/gestiontareas",(req,res) => {
    const data =readData();
    const body=req.body;
    const newTarea={
        id: data.gestiontareas.length + 1,
        ...body,
    };
    data.gestiontareas.push(newTarea);
    writeData(data);
    res.json(newTarea);
});

app.put("/gestiontareas/:id",(req, res) => {
    const data =readData();
    const body=req.body;
    const id= parseInt(req.params.id);
    const tareaIndex = data.gestiontareas.findIndex((tarea) => tarea.id === id);
    data.gestiontareas[tareaIndex]= {
        ...data.gestiontareas[tareaIndex],
        ...body,
    };
    writeData(data);
    res.json({message: "Tarea actualizada existosamente"});
});

app.delete("/gestiontareas/:id",(req,res) =>{ 
    const data =readData();
    const id= parseInt(req.params.id);
    const tareaIndex = data.gestiontareas.findIndex((tarea) => tarea.id === id);
    if (tareaIndex !== -1) {
        data.gestiontareas.splice(tareaIndex, 1);
        writeData(data);
        res.json({message: "Tarea eliminada existosamente"});
    } else {
        res.status(404).json({message: "Tarea no encontrada"});
    }
});

// Iniciamos el servidor
app.listen(4000, () => {
    console.log("Server is running on port 4000");
});