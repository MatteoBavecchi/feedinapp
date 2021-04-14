import { Navigation } from 'react-native-navigation';
import { registerScreens } from './src/screens/screens';
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import PushNotification from "react-native-push-notification";
import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { request } from 'react-native-permissions';
console.disableYellowBox = true;
registerScreens()
let data = null;
PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },
  onNotification: function (notification) {
    console.log("NOTFICATION:", notification);

    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
  onAction: function (notification) {
    console.log("ACTION:", notification.action);
    console.log("NOTIFICATION:", notification);
  },
  onRegistrationError: function (err) {
    console.error(err.message, err);
  },
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
  popInitialNotification: true,
  requestPermissions: true,
});


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});


Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setDefaultOptions({
    statusBar: {
      visible: true,
      style: "light",
      backgroundColor: "#4bac61"
    }
  });


  Navigation.setRoot({
    root: {
      stack: {
        id: "MyStack",
        children: [
          {
            component: {
              id: 'MyComponent',
              name: 'RNFirebaseStarter.HomeScreen'
            },
            passProps: {
              data: data
            },
            options: {
              topBar: {
                visible: false,
                animate: false,
                height: 0,
              }
            }
          }
        ]
      }
    }
  })
})
