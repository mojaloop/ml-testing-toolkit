HelpMessage () {
  echo "Usage: $0 -platform [macos|linux|win] -arch [x64|x86|armv6|armv7]"
}

ARCH=""
PLATFORM=""

while [ $# -gt 0 ]
do
  case $1 in
      -platform) PLATFORM=$2 ;;
      -arch) ARCH=$2 ;;
      -h) HelpMessage; exit 1 ;;
      -*) echo "$0: Invalid option $1" ; HelpMessage; exit 2 ;;
      *) echo "$0: Invalid option $1" ; HelpMessage; exit 2 ;;
  esac
  shift
  shift
done

if [ ! -d "node_modules" ]; then
  echo "Folder node_modules doesn't exist"
  exit 1
fi

if [ -z $ARCH ]; then
  echo "arch is not specified"
  exit 1
fi
if [ -z $PLATFORM ]; then
  echo "platform is not specified"
  exit 1
fi
### Some tweak for postman-sandbox libray to be compatible for packaging
sed '/\"type\": \"module\"/d' node_modules/uvm/node_modules/flatted/package.json > node_modules/uvm/node_modules/flatted/package2.json
rm node_modules/uvm/node_modules/flatted/package.json
mv node_modules/uvm/node_modules/flatted/package2.json node_modules/uvm/node_modules/flatted/package.json
### Start packaging
rm -rf out_native_bin/$PLATFORM-$ARCH
mkdir -p out_native_bin/$PLATFORM-$ARCH
pkg -t node12-$PLATFORM-$ARCH . -o out_native_bin/$PLATFORM-$ARCH/ml-ttk
cp -R spec_files out_native_bin/$PLATFORM-$ARCH
cp -R public_html out_native_bin/$PLATFORM-$ARCH
cp -R examples out_native_bin/$PLATFORM-$ARCH

### Copy files specific to platform
if [ "$PLATFORM" == "macos" ]; then
  cp native-app-generation/assets/$PLATFORM/start.sh out_native_bin/$PLATFORM-$ARCH
fi
