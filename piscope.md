# piscope (oscilloscope view for Raspberry Pi)
To check GPIO pin state, piscope is very convenient!
<br>you need to install Xming - http://www.straightrunning.com/XmingNotes/
<br>and set Putty to X11 by SSH - X11 - Enable X11 Forwarding in the Putty properties

## Start Pigpio Daemon
> `sudo pigpiod`
><br> `wget abyz.co.uk/rpi/pigpio/piscope.tar`
><br> `tar xvf piscope.tar`
><br> `cd PISCOPE`
><br> `make hf`
><br> `make install`

><br> `piscope &` to run piscope as background 
><br>(be sure to have the X11 enabled, and server started)

><br> `sudo npm install --unsafe-perm pigpio` to use pigpio for node.js