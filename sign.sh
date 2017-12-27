#!/bin/bash
set -ex
APP="RTH Toolbox"
electron-packager . \
  "$APP" \
  --asar \
  --asar-unpack=protocol-link.html \
  --overwrite \
  --platform=mas \
  --app-bundle-id=tk.rthsoftware.rthtoolbox.mac \
  --app-version="$npm_package_version" \
  --build-version="4.3.0" \
  --arch=x64 \
  --icon=./electron/electron.icns \
  --prune=true \
  --out=electron/out \
  --extend-info=./electron/info.plist \
  --electron-version=1.7.9
APP_PATH="./electron/out/$APP-mas-x64/$APP.app"
RESULT_PATH="./electron/out/$APP.pkg"
APP_KEY="3rd Party Mac Developer Application: Shangzhen Yang (7564J9XM8X)"
INSTALLER_KEY="3rd Party Mac Developer Installer: Shangzhen Yang (7564J9XM8X)"
FRAMEWORKS_PATH="$APP_PATH/Contents/Frameworks"
CHILD_PLIST="./electron/child.plist"
PARENT_PLIST="./electron/parent.plist"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Electron Framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework/Versions/A/Libraries/libnode.dylib"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/Electron Framework.framework"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/Contents/MacOS/$APP Helper"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper EH.app/Contents/MacOS/$APP Helper EH"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper EH.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper NP.app/Contents/MacOS/$APP Helper NP"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$FRAMEWORKS_PATH/$APP Helper NP.app/"
codesign -s "$APP_KEY" -f --entitlements "$CHILD_PLIST" "$APP_PATH/Contents/MacOS/$APP"
codesign -s "$APP_KEY" -f --entitlements "$PARENT_PLIST" "$APP_PATH"
productbuild --component "$APP_PATH" /Applications --sign "$INSTALLER_KEY" "$RESULT_PATH"
