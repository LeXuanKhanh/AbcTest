import { observer } from "mobx-react-lite"
import React, { FC, useEffect, useRef, useState } from "react"
import { ImageStyle, TextInput, TextStyle, TouchableOpacity, View, ViewStyle, Image } from "react-native"
import { Screen, Text } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import auth from '@react-native-firebase/auth';

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {

  const [authPassword, setAuthPassword] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { setName, setAuthEmail, setAuthToken, setAvatar, addUserToFireStore, validationError },
  } = useStores()

  const fbIcon = require("../../assets/icons/fbicon.png")
  const ggIcon = require("../../assets/icons/ggIcon.png")

  useEffect(() => {
    // Here is where you could fetch credentials from keychain or storage
    // and pre-fill the form fields.
    // setAuthEmail("ignite@infinite.red")
    // setAuthPassword("ign1teIsAwes0m3")

    GoogleSignin.configure({
      webClientId: '553419180597-5apuhfolh6acccrdt3fp2sb89tc9rk97.apps.googleusercontent.com',
      iosClientId: '553419180597-alvho3ce4ad0nnv7ob43dj7qp7aq5q7p.apps.googleusercontent.com'
    });

    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber
  }, [])

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    // Make a request to your server to get an authentication token.
    // If successful, reset the fields and set the token.
    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")

    // We'll mock this with a fake token.
    setAuthToken(String(Date.now()))
  }

  async function loginWithUser(user) {
    setIsSubmitted(false)
    setAuthPassword("")

    setName(user.displayName)
    setAuthEmail(user.email)
    setAvatar(user.photoURL)
    await addUserToFireStore()
    setAuthToken(String(Date.now()))
  }

  function onAuthStateChanged(user) {
    if (user) {
      console.log("sign-in with user:")
      console.log(user)
      loginWithUser(user).then(() => {
        console.log('User login!');
      })
    }
  }

  async function onGoogleButtonPress() {
    // Check if your device supports Google Play
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true }).catch(e => {
      console.error(e)
    });
    // Get the users ID token
    const { idToken } = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(googleCredential);
  }

  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }

  const IconButton = ({type, onPress}) => {
    const image = type === "facebook" ? fbIcon : ggIcon
    return (
      <TouchableOpacity onPress={onPress}>
        <View style= {$iconButtonContaner}>
          <Image style= {$iconButtonImage} source= { image } />
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <Screen
      preset="auto"
      contentContainerStyle={$screenContentContainer}
      safeAreaEdges={["top", "bottom"]}
    >
      <View style={ $viewContainer }>
        <Text style={$textLogin} text={'Login Now!!'} />
        <View style={ $viewButtonContainer }>
          <IconButton
            type = "facebook"
            onPress={() => onFacebookButtonPress()}
          />

          <View style={ $spacer }/>

          <IconButton
            type = "google"
            onPress={() => onGoogleButtonPress()}
          />
        </View>
      </View>

    </Screen>
  )
})

const $spacer: ViewStyle = {
  padding: 8
}

const $viewContainer: ViewStyle = {
  flex: 1,
  justifyContent:'center',
  alignItems: 'center'
}

const $textLogin: TextStyle = {
  paddingBottom: 16,
  fontSize: 25
}

const $viewButtonContainer: ViewStyle = {
  flexDirection: "row",
  alignItems: 'center'
}

const $screenContentContainer: ViewStyle = {
  // paddingVertical: spacing.xxl,
  // paddingHorizontal: spacing.lg,
  flex: 1,
  justifyContent:'center',
  alignItems: 'center',
}

const $iconButtonContaner: ViewStyle =  {
  justifyContent: "center",
  alignItems: "center",
}

const $iconButtonImage: ImageStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  resizeMode: "contain",
}

// @demo remove-file
