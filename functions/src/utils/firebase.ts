import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


export const adminApp = admin.initializeApp();

export const runtimeOpts: functions.RuntimeOptions = {
    timeoutSeconds: 300,
    memory: '512MB'
  }