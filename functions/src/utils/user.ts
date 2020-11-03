 import { adminApp } from '../utils/firebase';

export const getUserInfoQuery = async (uid: number) => {
    return adminApp.firestore()
        .collection('users')
        .where('id', '==', uid)
        .limit(1)
        .get()
};