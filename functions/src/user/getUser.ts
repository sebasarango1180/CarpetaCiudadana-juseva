import * as functions from 'firebase-functions';
import { getUserInfoQuery } from "../utils/user";
import { getDocumentsInfoQuery } from "../utils/document";

const cors = require('cors')({
    origin: '*'
});

export const getUser = functions.https.onRequest( async (req, res) => {

    return cors(req, res, async () => {

        res.set('Access-Control-Allow-Origin', '*');

        if (req.method === 'GET' && req.query.id) {

            const userQuery: FirebaseFirestore.QuerySnapshot = await getUserInfoQuery(Number(req.query.id));
            const user: FirebaseFirestore.QueryDocumentSnapshot = userQuery.docs[0];

            const documentQuery: FirebaseFirestore.QuerySnapshot = await getDocumentsInfoQuery(Number(req.query.id));

            let userData = user.data()
            let documentData = new Array();

            documentQuery.docs.forEach((doc) => {
                documentData.push(doc.data())
            })

            userData.files = documentData;

            res.status(200).send({
                "code": 200, 
                "message": `Ciudadano ${req.query.id} encontrado exitosamente`,
                "data": userData});
        }

        else if (req.method !== 'GET') {
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
