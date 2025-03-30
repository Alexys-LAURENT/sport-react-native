import 'dotenv/config';

export default {
  expo: {
    owner: "weexo",
    name: "FitTrack",
    slug: "fittrack",
    description: "Application de suivi de sport",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true
    },
    backgroundColor: "#161819",
    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      adaptiveIcon: {
        foregroundImage: "./assets/images/icon.png",
        backgroundColor: "#ffffff"
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "ACCESS_BACKGROUND_LOCATION",
        "FOREGROUND_SERVICE"
      ],
      package: "com.anonymous.FitTrack"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Autoriser $(PRODUCT_NAME) à accéder à votre position",
          "locationAlwaysPermission": "Autoriser $(PRODUCT_NAME) à accéder à votre position",
          "locationWhenInUsePermission": "Autoriser $(PRODUCT_NAME) à accéder à votre position",
          "isAndroidBackgroundLocationEnabled": true,
          "isIosBackgroundLocationEnabled": true
        }
      ],
      [
        "expo-splash-screen",
        {
          "backgroundColor": "#1e1f24",
          "image": "./assets/images/splash-icon.png",
          "dark": {
            "image": "./assets/images/splash-icon.png",
            "backgroundColor": "#1e1f24"
          },
          "imageWidth": 200
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    // Ajout de la section extra pour les variables d'environnement
    extra: {
      GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
      API_URL: process.env.API_URL,
      eas: {
        "projectId": "50cdd12c-75bf-40a3-a4dd-a657a341e72a"
      }
    }
  }
}