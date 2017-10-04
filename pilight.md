# Install pilight
To work with 433Mhz sender/receiver, to remote control your power sockets,
or any other klik-aan-klik-uit related devices, you may need pilight.

## Downgrade the kernel (since 4.9 does not work with a lot su)
> `sudo rpi-update 52241088c1da59a359110d39c1875cda56496764`
><br> `sudo reboot`
## Install pilight APT
> `sudo nano /etc/apt/sources.list`
><br> add line `deb http://apt.pilight.org/ stable main`
><br>
><br> `wget -O - http://apt.pilight.org/pilight.key | sudo apt-key add -`
><br> `sudo apt-get update`
><br> `sudo apt-get install pilight`
><br> `sudo nano /etc/pilight/config.json`
><br> check and configure your pins according to:
><br> - https://pinout.xyz/#
><br> - http://manual.pilight.org/configuration/hardware.html#gpio
><br>
><br> `sudo pilight-daemon`
><br> `sudo pilight-receive`

## Install as service (optional)
> `sudo nano /etc/init.d/MqtPi`
><br> copy contents of MqtPi file
><br> `sudo chmod 755 /etc/init.d/MqtPi`
><br> `sudo sh /etc/init.d/MqtPi start` (or `sudo service MqtPi start` after reboot)
><br> `sudo update-rc.d MqtPi defaults` to run service on startup
><br> 
><br> You can check logs from your: `nano /var/log/MqtPi.log`
><br> You can check errors from your: `nano /var/log/MqtPi.err`
><br> `ps aux | grep node` to check if nodes are running
><br> `sudo kill -9 <PROCESS ID>` to kill nodes


 

