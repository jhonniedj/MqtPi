# MqtPi
IOT/Home Automation with MQTT on Raspberry Pi
Maker: Jonathan van Rijn (jhonniedj)

## Install pilight
### Downgrade the kernel (since 4.9 does not work with a lot su)
>`sudo rpi-update 52241088c1da59a359110d39c1875cda56496764`
>`sudo reboot`
### Install pilight APT
>`sudo nano /etc/apt/sources.list`
>add 'deb http://apt.pilight.org/ stable main'

>`wget -O - http://apt.pilight.org/pilight.key | apt-key add -`
>`sudo apt-get update`
>`sudo apt-get install pilight`
>`sudo nano /etc/pilight/config.json`
>check and configure your pins according to
>-https://pinout.xyz/#
>-
>`sudo reboot`
>`sudo reboot`
>`sudo reboot`
## Install piscope
## Install pigpio






>To get started, we need to initialise some settings on the raspberry pi.
><br>First we start with a clean Raspberry pi, with a Raspbian Lite or Full/Desktop OS

### **Updating the Rpi**:
>`sudo apt-get update`
><br>`sudo apt-get upgrade`
><br>`sudo rpi-update`

### **Customizing your Rpi:** *(optional)*
>`sudo raspi-config`
><br>(change hostname)
><br>(chang password)