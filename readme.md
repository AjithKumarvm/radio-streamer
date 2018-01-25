//Android bundle up
react-native bundle --platform android --dev false --entry-file index.android.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/

//iOS bundle up
react-native bundle --platform ios --dev false --entry-file index.ios.js --bundle-output ios/Example/main.jsbundle