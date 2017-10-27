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
><br>Removing MOTD:
>`sudo nano /etc/motd`, then remove all lines and save with CTRL+X, Y

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
><br>`sudo npm install pigpio`
><br>`sudo npm install mqtt`
### **Installing PM2** *(optional)*
>`sudo npm install pm2 -g`
>`sudo pm2 startup` to run at startup
><br>*PM2 can be used to run node.js scripts at startup,*
><br>*monitor scripts or to keep scripts running*

### **Run a script as a PM2 service (optional)**
> `sudo pm2 start test.js -e test-err.log -o test-out.log --watch -i max`
><br> `sudo pm2 start test.js -e test-err.log -o test-out.log -i max`
><br> `sudo pm2 list`
><br> `sudo pm2 delete all`
><br> `sudo pm2 save`
><br> `sudo reboot` to check if the scripts runs at startup
><br> 
><br> You can check logs from your: `nano test-err.log`
><br> You can check errors from your: `nano test-out.log`
><br> `ps aux | grep pm2` to check if nodes are running
><br> `sudo kill -9 <PROCESS ID>` to kill nodes


### **Installing MQTT Broker Mosquitto:**
>`sudo apt-get install mosquitto mosquitto-clients`
><br>subscribe test with:`mosquitto_sub -t topic`
><br>publish test with:`mosquitto_pub -t topic -m message`

### **Installing Samba:**
>`sudo apt-get install samba samba-common-bin`
><br>`sudo nano /etc/samba/smb.conf`
><br>
><br>Copy/Paste:
>```
>[root]
>Comment = Pi shared folder
>Path = /
>Browseable = yes
>Writeable = Yes
>only guest = no
>create mask = 0777
>directory mask = 0777
>Public = yes
>Guest ok = yes
>```
>`sudo smbpasswd -a pi`
>`sudo /etc/init.d/samba restart`

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
>
>- **Crontab (scheduled run):**
><br>`sudo crontab -e` to edit
><br>then add something like `*/1 * * * * node debug.js > /logs/debug.log 2>&1` 
><br>to run debug.js every minute
><br>`sudo crontab -l` to list
><br>
><br>`sudo nano /etc/rsyslog.conf`
><br>uncomment `# cron.*                        /var/log/cron.log` by removing the `#`
><br>`sudo apt-get install postfix` (choose no config)
><br>`nano /etc/log/cron.log` to read output

>- **NTP Time:** (not needed, just setup timezone)
><br>`sudo raspi-config` to set timezone
><br>~~`sudo apt-get install ntpdate`~~
><br>~~`sudo ntpdate nl.pool.ntp.org`~~
