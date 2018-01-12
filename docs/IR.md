sudo apt-get install lirc -Y
sudo apt-get install liblircclient-dev -Y

sudo nano /etc/lirc/hardware.conf
to add:
########################################################
# /etc/lirc/hardware.conf
#
# Arguments which will be used when launching lircd
LIRCD_ARGS="--uinput"

# Don't start lircmd even if there seems to be a good config file
# START_LIRCMD=false

# Don't start irexec, even if a good config file seems to exist.
# START_IREXEC=false

# Try to load appropriate kernel modules
LOAD_MODULES=true

# Run "lircd --driver=help" for a list of supported drivers.
DRIVER="default"
# usually /dev/lirc0 is the correct setting for systems using udev
DEVICE="/dev/lirc0"
MODULES="lirc_rpi"

# Default configuration files for your hardware if any
LIRCD_CONF=""
LIRCMD_CONF=""
########################################################

sudo nano /etc/modules
to add:
lirc_dev
lirc_rpi gpio_in_pin=15 gpio_out_pin=14

sudo nano /boot/config.txt
dtoverlay=lirc-rpi
dtparam=gpio_in_pin=15
dtparam=gpio_out_pin=14

sudo nano /etc/lirc/lirc_options.conf
to change:
driver          = default
device          = /dev/lirc0
#driver          = devinput
#device          = auto

sudo modprobe lirc_rpi
sudo /etc/init.d/lircd stop
sudo mode2 -d /dev/lirc0

sudo service lircd stop 
sudo service lircd restart

in /home/pi, to make sure file writing works:
sudo irrecord --list-namespace

sudo irrecord --device=/dev/lirc0
sudo irrecord --device=/dev/lirc0 -u own_remote.conf

sudo irrecord --disable-namespace

sudo cp own_remote.conf /etc/lirc/lircd.conf.d/own_remote.conf
or sudo nano /etc/lirc/lircd.conf

to test:
sudo lircd --nodaemon -d /dev/lirc0 &