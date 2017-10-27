# DMX

## Set Raspberry Pi UART
change /boot/config.txt
<br> `sudo nano /boot/config.txt` to add:
<br> `init_uart_clock=16000000`
<br> `dtoverlay=pi3-disable-bt` or `dtoverlay=pi3-miniuart-bt` for pi3/pi zero w to free GPIO 14/15
<br> `sudo systemctl disable hciuart` to disable rest of bluetooth
<br> `sudo raspi-config` serial, to disable serial port on startup (leave hw enabled)
<br> `gpio readall` and make sure RX and TX are configured as ALT0 (for pi3/pi zero w)
<br> `sudo reboot`
<br> now your raspberry should be ready to use higher UART speeds
<br>
<br> `echo "AA" >/dev/ttyAMA0` to send a test message for piscope
<br>
<br> `sudo apt-get install minicom -y` to install serial terminal
<br> `sudo stty -F /dev/ttyAMA0 230400` to set general UART speed (230400, 250000, 1000000)
<br> `minicom -b 1000000 -D /dev/ttyAMA0` to test at 1.000.000 baud terminal
<br>
<br> `sudo npm install --unsafe-perm serialport` to use the serialport for node.js
