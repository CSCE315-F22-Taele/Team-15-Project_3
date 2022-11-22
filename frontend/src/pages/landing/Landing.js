import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import jwt_decode from 'jwt-decode'
import { useEffect, useState } from "react";
import { url } from '../../config/global'
import axios from 'axios'

let isSpanish = true;

const origText = [
  "Manager",
  "Cashier",
  "Driver",
  "Customer",
  "Translate to Spanish"
]

let pageText = [
  "Manager",
  "Cashier",
  "Driver",
  "Customer",
  "Translate to Spanish"
]

export default function Landing() {

  const [text, setText] = useState([...origText]);
  const [googleIdentityID, setGoogleIdentityID] = useState(null)
  // const [userInfo, setUserInfo] = useState({})

  useEffect(() => {
    let options = {
      method: 'GET',
      url: `${url}/googleIdentity`
    }
    axios.request(options).then((res) => {
      setGoogleIdentityID(res.data.id)
    })

    // let data = JSON.parse(window.localStorage.getItem("PAGE_TEXT"));
    // if (data !== null) {
    //   pageText = data;
    // }

    // data = window.localStorage.getItem("IS_SPANISH");
    // if (data !== "true") {
    //   isSpanish = false;
    // }
  }, [])

  async function translateText(textToTranslate) {

    let options = {
      method: 'GET',
      url: `${url}/translate`,
      params: {text: textToTranslate}
    }
  
  
    let val;
    
    await axios.request(options).then((res) => {
        console.log(res.data);
        val = res.data;
    })

    return val;

  }

  function translateWords(orig) {
    let thing = [];

    orig.forEach(async (element, index) => {
      thing.push(await translateText(element));
    });

    return thing;
  }

  async function changeLanguage() {
    isSpanish = !isSpanish;

    await (() => {
      if (isSpanish) {
        pageText = translateWords(origText);
      } else {
        pageText.forEach((element, index) => {
          pageText[index] = origText[index];
        });
      }
    });
  
    console.log(pageText);
  
    window.localStorage.setItem("PAGE_TEXT", JSON.stringify(pageText));
    window.localStorage.setItem("IS_SPANISH", JSON.stringify(isSpanish));
  }

  return (
    <div>
      <Header name={"Landing"} />

      <div id="google">
          <GoogleOAuthProvider clientId={googleIdentityID}>
            <GoogleLogin
              onSuccess={credentialResponse => {
                googleSignIn(credentialResponse)
              }}
              onError={() => {
                console.log('Login Failed');
              }}
            />
          </GoogleOAuthProvider>
        </div>

      <div>
        <ButtonGroup
          variant="contained"
          aria-label="outlined primary button group"
        >
          <Link to="/manager">
            <Button>{text[0]}</Button>
          </Link>
          <Link to="/cashier">
            <Button>{text[1]}</Button>
          </Link>
          <Link to="/driver">
            <Button>{text[2]}</Button>
          </Link>
        </ButtonGroup>
        <div>
          <Link to="/customer">
            <Button variant="contained">{text[3]}</Button>
          </Link>
          <Link to="/">
            <Button variant="contained" onClick={() => changeLanguage()}>{text[4]}</Button>
          </Link>
        </div>
      </div>
    </div>
  );

  function googleSignIn(response) {
    let decoded = jwt_decode(response.credential)
    let name = {first: decoded.given_name, last: decoded.family_name}
    let email = decoded.email
    let options = {
      method: 'GET',
      url: `${url}/permission`,
      params: {email: email, name: name}
    }
    axios.request(options).then((res) => {
      let permission = res.data.permission // permission (0 = customer, 1 = cashier / driver, 2 = manager)
      let err = res.data.err // will send error if there was an error
      let message = res.data.message // will send a message if user is returned
      console.log(message)
      console.log(permission)
      // setUserInfo({name: name, email: email, permission: permission})
      if(err) console.log(err)
      // probably want to save permission somewhere and also probably want to move this stuff to its own page
    })
  }
}

