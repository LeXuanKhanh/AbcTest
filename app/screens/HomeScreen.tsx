import React, { FC, useEffect, useState } from "react"
import { ActivityIndicator, FlatList, ImageStyle,  View, ViewStyle } from "react-native"
import { AutoImage, Screen, Text } from "../components"
import { DemoTabScreenProps } from "../navigators/DemoNavigator"
import { colors, spacing } from "../theme"
import firestore from "@react-native-firebase/firestore"

const chainReactLogo = require("../../assets/images/cr-logo.png")
const reactNativeLiveLogo = require("../../assets/images/rnl-logo.png")
const reactNativeRadioLogo = require("../../assets/images/rnr-logo.png")
const reactNativeNewsletterLogo = require("../../assets/images/rnn-logo.png")

export const HomeScreen: FC<DemoTabScreenProps<"DemoCommunity">> =
  function DemoCommunityScreen(_props) {
    const [loading, setLoading] = useState(true); // Set loading to true on component mount
    const [users, setUsers] = useState([]);
    const [refreshing, setRefreshing] = React.useState(false)
    const subscriber = firestore()
      .collection('Users')

    useEffect(() => {
      reloadData()
    }, [])

    function reloadData() {
      setLoading(true);
      subscriber
        .onSnapshot(querySnapshot => {
          // see next step
          const users = [];

          querySnapshot.forEach(documentSnapshot => {
            users.push({
              ...documentSnapshot.data(),
              key: documentSnapshot.id,
            });
          });

          setUsers(users);
          setLoading(false);
        });
    }

    return (
      <Screen
        preset="fixed"
        safeAreaEdges={["top"]}
        contentContainerStyle={$screenContentContainer}
      >
        <FlatList
          data={users}
          contentContainerStyle={$flatListContentContainer}
          refreshing={refreshing}
          onRefresh={reloadData}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator />
            ) : (
              <View/>
            )
          }
          renderItem={({ item }) => (
            <View style={ $listItem }>
              <AutoImage
                style = {$avatarImageStyle}
                source={{ uri: item.avatar }}
                maxWidth={200}
                maxHeight={200}
              />
              <View style = { $listTextContainer }>
                <Text>{item.name}</Text>
                <Text>ID: {item.key}</Text>
                <Text>Email: {item.email}</Text>
              </View>
            </View>
          )}
        />
      </Screen>
    )
  }


const $flatListContentContainer: ViewStyle = {
  paddingHorizontal: spacing.lg,
  paddingTop: spacing.lg + spacing.xl,
  paddingBottom: spacing.lg,
}

const $screenContentContainer: ViewStyle = {
  flex: 1,
}

const $avatarImageStyle: ViewStyle & ImageStyle = {
  width: 50,
  height: 50,
  borderRadius: 25,
  resizeMode: 'contain'
}

const $listItem: ViewStyle = {
  flexDirection: 'row',
  borderWidth: 1,
  padding: 8,
  borderColor: colors.palette.neutral500,
  margin: 4
}

const $listTextContainer: ViewStyle = {
  flexDirection: 'column',
  flex: 3,
  paddingLeft: 8
}


// @demo remove-file
