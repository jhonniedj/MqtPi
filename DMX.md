# DMX

## Set Raspberry Pi UART
>change /boot/config.txt
><br> `sudo nano /boot/config.txt` to add:
><br> `init_uart_clock=16000000`
><br> `dtoverlay=pi3-disable-bt` or `dtoverlay=pi3-miniuart-bt` for pi3 an bluetooth uart??
><br>
><br> `make install`
