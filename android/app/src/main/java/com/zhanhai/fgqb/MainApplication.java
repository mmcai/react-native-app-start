package com.zhanhai.fgqb;

import android.app.Application;
import com.facebook.react.ReactApplication;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.wonday.pdf.RCTPdfView;
import com.lynxit.contactswrapper.ContactsWrapperPackage;
import com.microsoft.appcenter.reactnative.crashes.AppCenterReactNativeCrashesPackage;
import com.microsoft.appcenter.reactnative.analytics.AppCenterReactNativeAnalyticsPackage;
import com.microsoft.appcenter.reactnative.appcenter.AppCenterReactNativePackage;
import com.microsoft.codepush.react.CodePush;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.imagepicker.ImagePickerPackage;
import com.BV.LinearGradient.LinearGradientPackage;
import com.horcrux.svg.SvgPackage;
import com.beefe.picker.PickerViewPackage;
import com.apsl.versionnumber.RNVersionNumberPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

import com.umeng.commonsdk.UMConfigure;
import com.umeng.invokenative.DplusReactPackage;
import com.umeng.invokenative.RNUMConfigure;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new RNFetchBlobPackage(),
            new RCTPdfView(),
            new AppCenterReactNativeCrashesPackage(MainApplication.this, getResources().getString(R.string.appCenterCrashes_whenToSendCrashes)),
            new AppCenterReactNativeAnalyticsPackage(MainApplication.this, getResources().getString(R.string.appCenterAnalytics_whenToEnableAnalytics)),
            new AppCenterReactNativePackage(MainApplication.this),
            new CodePush("L8qmIxzKE6h1Wsl2CKEKgL1UxHyu8ac6a78b-de9c-4a29-b2a0-b35ff8036ed4", getApplicationContext(), BuildConfig.DEBUG),
            new ContactsWrapperPackage(),
            new ReactNativeContacts(),
            new RNDeviceInfo(),
            new ImagePickerPackage(),
            new LinearGradientPackage(),
            new SvgPackage(),
            new PickerViewPackage(),
            new RNVersionNumberPackage(),
            new SplashScreenReactPackage(),
            new DplusReactPackage()
      );
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
    SoLoader.init(this, /* native exopackage */ false);
    RNUMConfigure.init(this, "5c3eddb0f1f5568035000dc9", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,"");
  }
}
