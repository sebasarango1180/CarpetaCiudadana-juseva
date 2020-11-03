// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

export * from './user/registerUser';
export * from './user/getUser';
export * from './document/uploadDocument';
export * from './document/authenticateDocument';
