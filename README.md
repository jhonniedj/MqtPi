# MqtPi
IOT/Home Automation with MQTT on Raspberry Pi
Maker: Jonathan van Rijn (jhonniedj)

## Get Started
>To get started, we need to initialise some settings on the raspberry pi.
><br>First we start with a clean Raspberry pi, with a Raspbian Lite or Full/Desktop OS

### **Updating the Rpi**:
>`sudo rpi-update` for latest kernel
><br>`sudo rpi-update 52241088c1da59a359110d39c1875cda56496764` for kernel 4.4.50+ (stable for pilight)
><br>`sudo rpi-update b9becbbf3f48e39f719ca6785d23c53ee0cdbe49` for kernel 4.9.41+
><br>`sudo apt-get update`
><br>`sudo apt-get upgrade`
><br>`sudo apt-get dist-upgrade`

### **Customizing your Rpi:** *(optional)*
>`sudo raspi-config`
><br>(change hostname)
><br>(change password)

### **Installing latest LTS node.js:**
>`sudo apt-get install node` (will install node )
><br>(updating)
><br>`wget https://nodejs.org/dist/v6.11.3/node-v6.11.3-linux-armv6l.tar.xz` for LTS
><br>`tar -xvf node-v6.11.3-linux-armv6l.tar.xz`
><br>`cd node-v6.11.3-linux-armv6l/`
><br>`sudo cp -R * /usr/local/`
><br>(cleaning up)
><br>`cd && rm node-v6.11.3-linux-armv6l.tar.xz && rm -rf node-v6.11.3-linux-armv6l/`
><br>(checking if version is updated)
><br>`node -v`


### **Installing latest current node.js:**
>`sudo apt-get install node`
><br>(updating)
><br>`wget https://nodejs.org/dist/v8.7.0/node-v8.7.0-linux-armv6l.tar.xz` for current
><br>`tar -xvf node-v8.7.0-linux-armv6l.tar.xz`
><br>`cd node-v8.7.0-linux-armv6l/`
><br>`sudo cp -R * /usr/local/`
><br>(cleaning up)
><br>`cd && rm node-v8.7.0-linux-armv6l.tar.xz && rm -rf node-v8.7.0-linux-armv6l/`
><br>(checking if version is updated)
><br>`node -v`

### **Installing NPM (node package manager):**
>`sudo apt-get install npm`
### **Installing NPM-packages**
>`sudo apt-get install pigpio`
><br>`sudo npm install pigpio -g && npm link pigpio`
><br>`sudo npm install mqtt -g && npm link mqtt`
### **Installing PM2** *(optional)*
>`sudo npm install pm2 -g`
><br>*PM2 can be used to run node.js scripts at startup,*
><br>*monitor scripts or to keep scripts running*

### **Installing MQTT Broker Mosquitto:**
>`sudo apt-get install mosquitto mosquitto-clients`
><br>subscribe test with:`mosquitto_sub -t topic`
><br>publish test with:`mosquitto_pub -t topic -m message`

## Usefull Tools
>- **Midnight commander:**
><br>`sudo apt-get install mc`
><br>run with `sudo mc`
>
>- **Screen:**
><br>`sudo apt-get install screen`
><br>`screen`
><br>can be used with CTRL+A, C to go to create new screen
><br>can be used with CTRL+A, N to go to next screen
><br>can be used with CTRL+A, P to go to previous screen
><br>can be used with CTRL+A, D to go to discard screen
><br>can be used with CTRL+D to go to destroy session
><br>`screen-r` *(to recover session)*
