package com.matteobavecchi.feedinapp;

import android.app.Application;
import android.content.Context;
import com.reactnativenavigation.NavigationApplication;
import com.facebook.react.ReactNativeHost;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.facebook.react.ReactPackage;

import java.lang.reflect.InvocationTargetException;
import java.util.List;


import com.facebook.react.ReactApplication;
import com.mackentoch.beaconsandroid.BeaconsAndroidPackage;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnativecommunity.rnpermissions.RNPermissionsPackage;
import org.reactnative.camera.RNCameraPackage;
import com.reactnativenavigation.react.NavigationPackage;
import com.oblador.vectoricons.VectorIconsPackage;

import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.PackageList;

public class MainApplication extends NavigationApplication {
  private final ReactNativeHost mReactNativeHost =

      new NavigationReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
          return BuildConfig.DEBUG;
        }
        @Override
        protected List<ReactPackage> getPackages() {
          @SuppressWarnings("UnnecessaryLocalVariable")
          List<ReactPackage> packages = new PackageList(this).getPackages();
          // Packages that cannot be autolinked yet can be added manually here, for example:
          // packages.add(new MyReactNativePackage());
          return packages;
        }
        @Override
        protected String getJSMainModuleName() {
          return "index";
        }
      };
      @Override
      public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
      }
      @Override
      public void onCreate() {
        super.onCreate();

      }
    }
