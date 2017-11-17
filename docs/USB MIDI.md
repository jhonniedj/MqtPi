# USB MIDI

### **Checking MIDI Devices**:
>`aconnect -o` for connected MIDI Devices
><br>`sudo aconnect 20:0 24:0` to bridge client 20, port 0 to client 24, port 0
><br>`sudo apt-get install libasound2-dev -y` to install dependency that may be needed
><br>`sudo npm install --unsafe-perm midi` to install midi npm for node.js use