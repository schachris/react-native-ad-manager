require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
folly_compiler_flags = '-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1 -Wno-comma -Wno-shorten-64-to-32'

google_mobile_ads_sdk_version = package['sdkVersions']['ios']['googleMobileAds']
google_ump_sdk_version = package['sdkVersions']['ios']['googleUmp']

Pod::Spec.new do |s|
  s.name         = "react-native-admanager-mobile-ads"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/schachris/react-native-admanager-mobile-ads.git.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm}"
  s.weak_frameworks     = "AppTrackingTransparency"

  # Use install_modules_dependencies helper to install the dependencies if React Native version >=0.71.0.
  # See https://github.com/facebook/react-native/blob/febf6b7f33fdb4904669f99d795eba4c0f95d7bf/scripts/cocoapods/new_architecture.rb#L79.
  if respond_to?(:install_modules_dependencies, true)
    install_modules_dependencies(s)
  else
    s.dependency "React-Core"

    # Don't install the dependencies when we run `pod install` in the old architecture.
    if ENV['RCT_NEW_ARCH_ENABLED'] == '1' then
      s.compiler_flags = folly_compiler_flags + " -DRCT_NEW_ARCH_ENABLED=1"
      s.pod_target_xcconfig    = {
          "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\"",
          "OTHER_CPLUSPLUSFLAGS" => "-DFOLLY_NO_CONFIG -DFOLLY_MOBILE=1 -DFOLLY_USE_LIBCPP=1",
          "CLANG_CXX_LANGUAGE_STANDARD" => "c++17"
      }
      s.dependency "React-Codegen"
      s.dependency "RCT-Folly"
      s.dependency "RCTRequired"
      s.dependency "RCTTypeSafety"
      s.dependency "ReactCommon/turbomodule/core"
    end
  end

    # Other dependencies
    if defined?($RNGoogleUmpSDKVersion)
      Pod::UI.puts "#{s.name}: Using user specified Google UMP SDK version '#{$RNGoogleUmpSDKVersion}'"
      google_ump_sdk_version = $RNGoogleUmpSDKVersion
    end
  
    if !ENV['MAC_CATALYST']
    s.dependency          'GoogleUserMessagingPlatform', google_ump_sdk_version
    end
  
    if defined?($RNAdManagerMobileAdsSDKVersion)
      Pod::UI.puts "#{s.name}: Using user specified Google Mobile-Ads SDK version '#{$RNAdManagerMobileAdsSDKVersion}'"
      google_mobile_ads_sdk_version = $RNAdManagerMobileAdsSDKVersion
    end
  
    # AdMob dependencies
    if !ENV['MAC_CATALYST']
    s.dependency          'Google-Mobile-Ads-SDK', google_mobile_ads_sdk_version
    end
  
    if defined?($RNAdManagerMobileAdsAsStaticFramework)
      Pod::UI.puts "#{s.name}: Using overridden static_framework value of '#{$RNAdManagerMobileAdsAsStaticFramework}'"
      s.static_framework = $RNAdManagerMobileAdsAsStaticFramework
    else
      s.static_framework = false
    end
end
