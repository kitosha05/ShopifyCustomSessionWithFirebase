import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";
import axios from "axios";
import { ModuleFilenameHelpers } from "webpack";
import { Session } from "@shopify/shopify-api/dist/auth/session";

//GET THIS CONFIG DATA FROM THE PROJECT SETTINGS IN YOUR FIREBASE CONSOLE. JUST COPY/PASTE CONFIG OBJECT FROM SDK CONFIG CODE
var config = {
  apiKey: YOUR_FIREBASE_API_KEY,
  authDomain: YOUR_AUTH_DOMAIN,
  projectId: YOUR_PROJECT_ID,
  storageBucket:YOUR_STORAGE_BUCKET,
  messagingSenderId: YOUR_SENDER_ID,
  appId: YOUR_APP_ID,
  measurementId: YOUR_MEAUSREMENT_ID,
};
firebase.initializeApp(config);

let domainId = "";

export const storeCallBack = async (session) => {
  try {
    let data = session;
    data.onlineAccessInfo = JSON.stringify(session.onlineAccessInfo);
    if (data.id.indexOf(`${data.shop}`) > -1) {
      domainId = data.id;
    }
    const {
      shop,
      id,
      accessToken,
      state,
      isOnline,
      onlineAccessInfo,
      scope,
    } = data;
    const shopData = {
      shopUrl: `${shop}`,
      sessionId: `${id}`,
      accessToken: `${accessToken}`,
      state: `${state}`,
      isOnline,
      onlineAccessInfo: `${onlineAccessInfo}`,
      scope: `${scope}`,
      domainId,
    };
    await firestore.collection("shops").doc(shop).set(shopData);
    return true;
  } catch (e) {
    throw new Error(e);
  }
};
const setSession = async (id) => {
  let session = new Session(id);
  const shopsRef = firestore.collection("shops");

  const shopRef = await shopsRef.where("sessionId", "==", id).get();
  const data = shopRef.docs.map((doc) => {
    const {
      shopUrl,
      accessToken,
      state,
      isOnline,
      onlineAccessInfo,
      scope,
    } = doc.data();
    session = {
      ...session,
      shop: shopUrl,
      accessToken: accessToken == "undefined" ? undefined : accessToken,
      state: state == "undefined" ? undefined : state,
      isOnline: isOnline == "true" ? true : false,
      onlineAccessInfo:
        onlineAccessInfo == "undefined" ? undefined : onlineAccessInfo,
      scope: scope == "undefined" ? undefined : scope,
    };
    return session;
  });

  const date = new Date();
  date.setDate(date.getDate() + 1);
  session.expires = date;
  if (session.expires && typeof session.expires === "string") {
    session.expires = new Date(session.expires);
  }

  return session;
};
export const loadCallback = async (id) => {
  try {
    return await setSession(id);
  } catch (e) {
    throw new Error(e);
  }
};
export const deleteCallback = async (id) => {
  try {
    return false;
  } catch (e) {
    throw new Error(e);
  }
};

export const firestore = firebase.firestore();
export default firebase;
