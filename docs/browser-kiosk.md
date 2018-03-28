#enable LXDM:
sudo apt install lxdm
sudo dpkg-reconfigure lxdm

sudo systemctl --force enable lxdm
check:
sudo systemctl status lxdm

#disable tty:
sudo systemctl disable getty@tty1.service

/etc/lxdm/lxdm.conf
-->
#autologin=dgod -->> autologin=pi

sudo nano /etc/xdg/openbox/autostart
-->
chromium-browser -disk-cache-dir=/tmp/chromium/cache/ --user-data-dir=/tmp/chromium/user_data/  --disable --disable-translate --disable-infobar --disable-suggestions-service --disable-save-password-bubble --start-maximized --incognito --no-default-browser-check --no-first-run --fast-start --bwsi --kiosk --use-gpu-in-tests "http://jonajona.nl/dash.php"

set lxdm to load openbox:
sudo nano /etc/lxdm/lxdm.conf
session=/usr/bin/openbox-session

to change/remove menu items:
sudo nano /etc/xdg/openbox/menu.xml

sudo apt install unclutter

sudo nano ~/.config/lxsession/LXDE-pi/autostart
-->
@unclutter -idle 0

====

sudo plymouth-set-default-theme -l
sudo plymouth-set-default-theme -R tribar
plymouthd
plymouth --show-splash
plymouth --quit

sudo plymouth-set-default-theme -R tribar

sudo nano /boot/cmdline.txt
splash quiet plymouth.ignore-serial-consoles logo.nologo vt.global_cursor_default=0

Choose to disable splashscreen
sudo nano /boot/config.txt
disable_splash=1

change release:
sudo cp /etc/os-release /etc/os-release.bak
sudo nano /etc/os-release
