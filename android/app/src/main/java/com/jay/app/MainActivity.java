package com.jay.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.microsoft.appcenter.AppCenter;
import com.microsoft.appcenter.analytics.Analytics;
import com.microsoft.appcenter.crashes.Crashes;

public class MainActivity extends BridgeActivity {
  @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Initialize AppCenter
        AppCenter.start(
            getApplication(),
            "de46b2b8-e98c-4f45-aeb4-d144e5c74113",  // Replace with your actual AppCenter secret
            Analytics.class,
            Crashes.class
        );
        
        // Optional: Enable verbose logging (remove for production)
        AppCenter.setLogLevel(android.util.Log.VERBOSE);
    }
}
