import * as functions from 'firebase-functions';
import { runtimeOpts } from '../utils/firebase';

import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export const authenticateDocument = functions.runWith(runtimeOpts).firestore.document('documents/{id}').onCreate(
    async (snap: FirebaseFirestore.DocumentSnapshot, eventContext: functions.EventContext) => {

            //res.set('Access-Control-Allow-Origin', '*');

            const validationConfig: AxiosRequestConfig = {
                url: `https://govcarpetaapp.mybluemix.net/apis/authenticateDocument/${snap.get('userId')}/${encodeURIComponent(snap.get('url'))}/${snap.get('fileName')}`,
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            };
    
            const govCarpetaResponse: AxiosResponse = await axios(validationConfig);
    
            if (govCarpetaResponse.status === 200) {
                
                return snap.ref.update({isAuthenticated: true}).catch(
                    error => {
                        console.error("No se actualizó isAuthenticated en BD: ", error);
                        return undefined;
                    }
                )
            }
    
            else {
                console.error("El servicio de GovCarpeta falló al autenticar el documento");
                return undefined;
            }
        
    }
)