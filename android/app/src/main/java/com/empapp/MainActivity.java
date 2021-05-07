package com.empapp;

import android.content.Intent; 
import com.facebook.react.ReactActivity;
import com.tkporter.sendsms.SendSMSPackage;

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "EmpApp";
  }

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data){
    super.onActivityResult(requestCode, resultCode, data);
    SendSMSPackage.getInstance().onActivityResult(requestCode, resultCode, data);
  }

}
