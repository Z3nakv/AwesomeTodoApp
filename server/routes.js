import express from 'express';
import { getConnectedClient } from './database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

const getCollection = async () => {
    const client = await getConnectedClient();
    const collection = await client.db("todosdb").collection("todos");
    return collection;
}

router.get('/todos', async (req, res) => {
    const collection = await getCollection();
    const todos = await collection.find({}).toArray();
    res.status(200).json(todos)
})
router.post('/todos', async (req, res) => {
    const collection = await getCollection();
    let {todo} = req.body;
    if(!todo){
        return res.status(400).json({msg: "error no todo found"})
    }
    todo = (typeof todo === "string") ? todo : JSON.stringify(todo)
    const newTodo = await collection.insertOne({todo, status: false})

    res.status(200).json({todo, status: false, _id: newTodo.insertedId})
})
router.put('/todos/:id', async (req, res) => {
    const collection = await getCollection();
    const _id = new ObjectId(req.params.id);
    const { status } = req.body;

    if(typeof status !== "boolean"){
        return res.status(400).json({msg:"invalid status"})
    }

    const updatedTodo = await collection.updateOne({_id}, {$set: {status: !status}})
    res.status(200).json(updatedTodo)
})
router.delete('/todos/:id', async (req, res) => {
    const collection = await getCollection();
    const _id = new ObjectId(req.params.id);
    const deletedTodo = await collection.deleteOne({_id});

    res.status(200).json(deletedTodo)
})

export default router;
