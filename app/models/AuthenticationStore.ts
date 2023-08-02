import { Instance, SnapshotOut, types } from "mobx-state-tree"
import firestore from "@react-native-firebase/firestore"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    name: "",
    authToken: types.maybe(types.string),
    authEmail: "",
    avatar: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    setAvatar(value: string) {
      store.avatar = value
    },
    setName(value: string) {
      store.name = value
    },
    async addUserToFireStore() {
      await firestore()
        .collection('Users')
        .add({
          name: store.name,
          avatar: store.avatar,
          email: store.authEmail
        })
    },
    logout() {
      store.avatar = ''
      store.name = ''
      store.authToken = undefined
      store.authEmail = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file
