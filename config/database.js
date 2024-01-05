// mongoDb.js
const {MongoClient, ObjectId} = require('mongodb');

let db;

const closeDatabaseConnection = async () => {
    if (db) {
        await db.client.close();
        console.log('Disconnected from the database');
    }
};

const createDocument = async (collectionName, document) => {
    try {
        const result = await db.collection(collectionName).insertOne(document);
        console.log('Document created:', result.ops[0]);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const createNoteForUser = async (noteContent, user_id) => {
    try {
        const result = await db.collection('notes').insertOne({noteContent});
        await db.collection('users').updateOne({_id: new ObjectId(user_id)}, {$push: {created_notes: result.insertedId}});
        console.log('Note created:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const getAllNotesForUser = async (user_id) => {
    try {
        const result = await db.collection('users').findOne({_id: new ObjectId(user_id)}, {created_notes: 1, shared_with_notes : 1});
        const notes = await db.collection('notes').find({_id: { $in : [...result.created_notes, ...result.shared_with_notes]}}, {noteContent: 1, _id: 1}).toArray();
        console.log('Note found:',notes);
        return notes;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const getNoteByIdForUser = async (user_id, note_id) => {
    try {
        const noteUid = new ObjectId(note_id);
        const result = await db.collection('users').findOne({_id: new ObjectId(user_id), $or : [{created_notes: noteUid}, {shared_with_notes: noteUid}]}, {_id:1});
        if(result) {
            const note = await db.collection('notes').findOne({_id: noteUid});
                console.log('Note found:', note);
                return note;
        }
        return null;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const updateNoteByIdForUser = async (user_id, note_id, content) => {
    try {
        const noteUid = new ObjectId(note_id);
        const result = await db.collection('users').findOne({_id: new ObjectId(user_id), $or : [{created_notes: noteUid}, {shared_with_notes: noteUid}]}, {_id:1});
        if(result) {
            const note = await db.collection('notes').findOneAndUpdate({_id: noteUid}, {$set : {noteContent: content}}, {returnDocument: 'after'});
            console.log('Note found:', note);
            return note;
        }
        return null;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const deleteNoteByIdForUser = async (user_id, note_id) => {
    try {
        const noteUid = new ObjectId(note_id);
        const result = await db.collection('users').findOne({_id: new ObjectId(user_id), $or : [{created_notes: noteUid}, {shared_with_notes: noteUid}]}, {_id:1});
        if(result) {
            const note = await db.collection('notes').findOneAndDelete({_id: noteUid});
            console.log('Note deleted:', note);
            return note;
        }
        return null;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const createUser = async (document) => {
    try {
        const result = await db.collection('users').insertOne(document);
        console.log('Document created:', result.insertedId);
        return result.insertedId;
    } catch (error) {
        console.error('Error creating document:', error.message);
        throw error;
    }
};

const findDocuments = async (collectionName, query = {}) => {
    try {
        const documents = await db.collection(collectionName).find(query).toArray();
        console.log('Documents found:', documents);
        return documents;
    } catch (error) {
        console.error('Error finding documents:', error.message);
        throw error;
    }
};

const findUserByEmail = async (email) => {
    try {
        const documents = await db.collection('users').findOne({email});
        console.log('Documents found:', documents);
        return documents;
    } catch (error) {
        console.error('Error finding documents:', error.message);
        throw error;
    }
};

const findOneDocument = async (collectionName, query = {}) => {
    try {
        const documents = await db.collection(collectionName).findOne(query);
        console.log('Documents found:', documents);
        return documents;
    } catch (error) {
        console.error('Error finding documents:', error.message);
        throw error;
    }
};

const updateDocument = async (collectionName, id, update) => {
    try {
        const result = await db.collection(collectionName).updateOne({_id: new ObjectId(id)}, {$set: update});
        console.log('Document updated:', result.modifiedCount > 0);
        if (result.modifiedCount > 0) {
            const updatedDocument = await db.collection(collectionName).findOne({_id: new ObjectId(id)});
            return updatedDocument;
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error updating document:', error.message);
        throw error;
    }
};

const addNoteToUser = async (user_id, note_id) => {
    try {
        const result = await db.collection('users').updateOne({_id: new ObjectId(user_id)}, {$push: {created_notes: note_id}});
        console.log('Document updated:', result.modifiedCount > 0);
    } catch (error) {
        console.error('Error updating document:', error.message);
        throw error;
    }
};

const deleteDocument = async (collectionName, id) => {
    try {
        const result = await db.collection(collectionName).deleteOne({_id: new ObjectId(id)});
        console.log('Document deleted:', result.deletedCount > 0);
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting document:', error.message);
        throw error;
    }
};

const initDataBase = async () => {
    try {
        const client = await MongoClient.connect(process.env.MONGO_URI);
        db = client.db('local');
        console.log('Connected to the database');
        await db.createCollection('notes');
        await db.createCollection('users');

        await db.collection('notes').createIndex({content: 'text'});
    } catch (e) {
        console.log("init database : ", e);
    }
}

module.exports = {
    closeDatabaseConnection,
    createDocument,
    findDocuments,
    updateDocument,
    deleteDocument,
    initDataBase,
    addNoteToUser,
    findUserByEmail,
    createUser,
    createNoteForUser,
    getNotesForUser: getAllNotesForUser,
    getNoteByIdForUser,
    updateNoteByIdForUser,
    deleteNoteByIdForUser
};
