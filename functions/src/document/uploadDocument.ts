import * as functions from 'firebase-functions';
import { adminApp, runtimeOpts } from '../utils/firebase';
import * as stream from 'stream';

const cors = require('cors')({
    origin: true
});

export const uploadDocument = functions.runWith(runtimeOpts).https.onRequest( async (req, res) => {

    return cors(req, res, async () => {

        res.set('Access-Control-Allow-Origin', '*');
    
        if (req.method === 'POST' && req.body.document) {

            const document: string = req.body.document
            let documentURL: string = `https://storage.googleapis.com/carpetaciudadana-juseva.appspot.com/documents/${req.body.userId}/${req.body.fileName}`;

            const base64EncodeddocumentString = document.replace(/^data:*\/\w+;base64,/, '')
            const documentBuffer = Buffer.from(base64EncodeddocumentString, 'base64');
            const bufferStream = new stream.PassThrough();
            bufferStream.end(documentBuffer);
            
            const file = adminApp.storage()
                .bucket("carpetaciudadana-juseva.appspot.com")
                .file(`documents/${req.body.userId}/${req.body.fileName}`)

            bufferStream.pipe(file.createWriteStream({
                metadata: {
                    contentType: req.body.fileType
                },
                public: true,
                predefinedAcl: 'publicRead',
                validation: "md5"
            }))
                .on('error', (error) => {
                    res.status(500).send({ "code": 500,
                    "message": 'Hubo un error guardando el documento en data lake',
                    "error": error});
                })
                .on('finish', () => {

                    console.info("Documento subido: ", file.name)

                    file.makePublic().then(() => {
                        documentURL = file.publicUrl()
                        console.log("Docuento publicado: ", documentURL)
                    }).catch((err) => {
                        documentURL = `https://storage.googleapis.com/carpetaciudadana-juseva.appspot.com/documents/${req.body.userId}/${req.body.fileName}`
                    });
                    
                    const docPayload = {
                        userId: req.body.userId,
                        fileName: req.body.fileName,
                        url: String(documentURL),
                        uploadedAt: new Date().getTime(),
                        isAuthenticated: false
                    }

                    adminApp.firestore().collection('documents').add(docPayload)
                    .then( (docRef) => {
                        res.status(201).send({
                            "code": 201, 
                            "message": `${req.body.fileName} fue subido y creado exitosamente`,
                            "data": docPayload});
                    })
                    .catch(
                        error => {
                            console.error("Error al crear documento en BD", error);
                            res.status(500)
                            .send({ "code": 500, "message": 'Error al crear documento en BD' });
                        }
                    )
                })

        }

        else if (req.method !== 'POST') {
        res.status(405).send({ "code": 405, "message": `${req.method} is not allowed` });
        }

        else if (req.body === undefined || req.body === null || req.body === {}) {
            res.status(400).send({ "code": 400, "message": 'Request has no data' });
        }

        else {
            res.status(500).send({ "code": 500, "message": 'Request was not processed succesfully' });
        }
    })
})
