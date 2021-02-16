# npm install
sed '/\"type\": \"module\"/d' node_modules/uvm/node_modules/flatted/package.json > node_modules/uvm/node_modules/flatted/package2.json
rm node_modules/uvm/node_modules/flatted/package.json
mv node_modules/uvm/node_modules/flatted/package2.json node_modules/uvm/node_modules/flatted/package.json
rm -rf out_native_bin
mkdir -p out_native_bin/macos64
pkg -t node12-macos-x64 . -o out_native_bin/macos64/ml-ttk-macos
cp -R spec_files out_native_bin/macos64
cp -R public_html out_native_bin/macos64
cp -R examples out_native_bin/macos64
cp native-app-generation/assets/macos/start.sh out_native_bin/macos64
