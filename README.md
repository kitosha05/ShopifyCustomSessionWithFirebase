# ShopifyCustomSessionWithFirebase
Base Firebase Config For Setting Up Custom Session Storage with Shopify CLI Node App and Firebase

Instructions:
1. npm install firebase
2. Add a firebase folder to the server folder in your Shopify CLI Node App, and add this file.
3. Update the config object in firebase.utils.js with your firebase config data (found in project settings under SDK)

4. Add the following import to server.js:  
 import {
  storeCallBack,
  loadCallback,
  deleteCallback,
} from "./firebase/firebase.utils";

5.Change SESSION_STORAGE to CustomSessionStorage and provide the callback function parameters:

SESSION_STORAGE: new Shopify.Session.CustomSessionStorage(
    storeCallBack,
    loadCallback,
    deleteCallback
  )
  
  
