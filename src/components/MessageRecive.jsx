import React, { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";

import { messaging } from "../firebase";
function MessageRecive() {
  useEffect(async() => {
  reciveToken()
  }, []);
  const reciveToken=async()=>
  {
    const { REACT_APP_VAPID_KEY } = process.env
    const publicKey = REACT_APP_VAPID_KEY
        const token=await getToken(messaging,{vapidKey:publicKey})
        console.log(token);
  }
  return <></>;
}

export default MessageRecive;
