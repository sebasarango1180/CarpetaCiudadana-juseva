import * as functions from 'firebase-functions';
import { adminApp, runtimeOpts } from '../utils/firebase';

const cors = require('cors')({
    origin: '*'
});

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const registerCitizen = functions.runWith(runtimeOpts).https.onRequest( async (req, res) => {

    return cors(req, res, async () => {

        res.set('Access-Control-Allow-Origin', '*');
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

        if (req.method === 'POST' && req.body.id) {

            const validationConfig: AxiosRequestConfig = {
                url: `https://govcarpetaapp.mybluemix.net/apis/validateCitizen/${req.body.id}`,
                method: 'get',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
    
            const govCarpetaResponseVal: AxiosResponse = await axios(validationConfig);
    
            if (govCarpetaResponseVal.status === 200) {
                
                const { data } = govCarpetaResponseVal;
    
                res.status(200).send({
                    "code": 200, 
                    "message": data,
                    "data": data});
            }
    
            else if (govCarpetaResponseVal.status >= 400) {
                res.set('Access-Control-Allow-Origin', '*');
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                res.status(500).send({ "code": 500, "message": 'Hubo un problema validando al ciudadano en GovCarpeta' });
            }
    
            else {

                console.log(req.body);
                res.set('Access-Control-Allow-Origin', '*');
                res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
                
    
                const registerConfig: AxiosRequestConfig = {
                    url: 'https://govcarpetaapp.mybluemix.net/apis/registerCitizen',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    data: req.body
                    //withCredentials: false
                };
        
                const govCarpetaResponseReg: AxiosResponse = await axios(registerConfig);
    
                const { data } = govCarpetaResponseReg;
    
                adminApp.firestore()
                    .collection('users')
                    .add(req.body)
                    .catch( error => {
                        console.error("No fue posible agregar al ciudadano a DB: ", error);
                        res.status(500).send({ "code": 500, "message": 'No fue posible agregar al ciudadano a DB'});
                    })
                
                res.status(201).send({
                    "code": 201, 
                    "message": `${req.body.name} fue registrado exitosamente en ${req.body.operatorName}`,
                    "data": data});
    
            }
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