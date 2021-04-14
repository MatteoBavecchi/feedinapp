#!/bin/bash
#
# This script is used to fix the version number problem that prevents
# the react-native-beacons-manager from working properly.
#
#     node_modules/react-native-beacons-manager/android/build.gradle
#     -> change to dependencies { ... compile 'com.facebook.react:react-native:0.61.+' }

echo 'patching beacons manager package with correct react native version'
sed -i.bak 's/com\.facebook\.react:react-native:0\.20\.\+/com\.facebook\.react:react-native:0\.61\.\+/g' node_modules/react-native-beacons-manager/android/build.gradle