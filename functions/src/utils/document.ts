import { adminApp } from '../utils/firebase';

export const getDocumentInfoQuery = async (uid: number) => {
    return adminApp.firestore()
        .collection('documents')
        .where('userId', '==', uid)
        .limit(1)
        .get()
};

export const getDocumentsInfoQuery = async (uid: number) => {
    return adminApp.firestore()
        .collection('documents')
        .where('userId', '==', uid)
        .get()
};