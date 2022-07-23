const NoteSchema = require("../models/noteSchema");
const TagSchema = require("../models/tagSchema");

const getAll = async (req, res) => {
    try {
        const allNotes = await NoteSchema.find();
        res.status(200).send(allNotes);
    } catch(err) {
        console.error(err)
    };
};

const getNotesWithTags = async (req, res) => {
    const allNotes = await NoteSchema.find(
        { tag: { $exists: true } }
        );

    res.status(200).send(allNotes);
};


const getNotesWithStudyTag = async (req, res) => { 
    const allNotesWithStudyTag = await NoteSchema.find(
        { tag: { $eq: "62b3b9576049dc2130e87872" } }
    );

    res.status(200).send(allNotesWithStudyTag);
}


const createNote = async (req, res) => {
     try {
         // acessar informações do body
         const { author, title, tag } = req.body;

         // criar o esqueleto da nova nota, sem o id da tag
         const newNote = await NoteSchema.create({ author, title });
         console.log("NOVA NOTA CONSTRUÍDA", newNote)

         if(tag) {
             // criar o esqueleto da nova tag
             const newTag = await new TagSchema({name: tag, notes: newNote});
             console.log("NOVA TAG A SER SALVA", newTag)
    
             // salvar a nova tag
             await newTag.save();
    
             // atribuir o valor de tag dentro de note ao id da nova tag
             newNote.tag = newTag._id;
         }

         // salvar a nota
         const savedNote = await newNote.save();
         console.log("NOTA SALVA NO BANCO", savedNote)

         // retornar a nota!
         if(savedNote) {
             res.status(201).send({
                 "message": "Nota criada com sucesso",
                 savedNote
             })
         }
     } catch(e) {
         console.error(e)
     }
};

const updateNote = async (req, res) => {
    try {
        // atualizar o documento a partir id
            // receber esse id da requisição
        // encontrar o documento que possui aquele id
        const findNote = await NoteSchema.findById(req.params.id)
        console.log("NOTA ENCONTRADA", findNote);

        if(!findNote){
            res.status(404).send({
                "message": "Nota não encontrada",
                "statusCode": 404
            })
        }

        // confiro as informações atualizadas
        findNote.author = req.body.author || findNote.author
        findNote.title = req.body.title || findNote.title

        // salvo as atualizações
        const savedNote = await findNote.save()

        // envio a resposta
        res.status(200).send({
            "message": "Nota atualizada com sucesso",
            savedNote
        })

    } catch(err) {
        console.error(err)
    }
   
};

const deleteNote = async (req,res) => {
    try {
        // acessar o documento a ser deletado
        // const findNote = await NoteSchema.findById(req.params.id)

        // deletar esse documento
        // await findNote.delete()

        const deletedNote = await NoteSchema.findByIdAndDelete(req.params.id)

        res.status(200).send({
            "message": "Nota deletada com sucesso",
            deletedNote
        })
    } catch(err) {
        console.error(err);
    };
};

module.exports = {
    getAll,
    getNotesWithTags,
    getNotesWithStudyTag,
    createNote,
    updateNote,
    deleteNote
};