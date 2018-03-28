# Pilight
To work with 433Mhz sender/receiver, to remote control your power sockets,
or any other klik-aan-klik-uit related devices, you may need pilight.

## Downgrade the kernel is no longer needed since Pilight 8.0
~~## Downgrade the kernel (since 4.9 does not work for pilight)
> `sudo rpi-update 52241088c1da59a359110d39c1875cda56496764`
><br> `sudo reboot`~~

## Install pilight apt package
> `sudo nano /etc/apt/sources.list`
><br> add line `deb http://apt.pilight.org/ stable main`
><br>
><br> `wget -O - http://apt.pilight.org/pilight.key | sudo apt-key add -`
><br> `sudo apt-get update`
><br> `sudo apt-get install pilight -y`
><br> `sudo nano /etc/pilight/config.json`
><br> check and configure your pins according to:
><br> - https://pinout.xyz/#
><br> - http://manual.pilight.org/configuration/hardware.html#gpio (using wiringpi numbering)
><br> set `"webserver-enable": 0,` if you need/want to
><br> set `gpio-platform": "raspberrypizero"` if you need/want to

><br>
><br> `sudo pilight-daemon`
><br> `sudo pilight-receive` to check for 433Mhz packages

use kaku_screen in stead of kaku_switch

Example /etc/pilight/config.json:
{
        "devices": {
                "lamp": {
                        "protocol": [ "kaku_screen" ],
                        "id": [{
                                "id": xxx,
                                "unit": 1
                        }],
                        "state": "down"
                }
        },
        "rules": {},
        "gui": {
                "lamp": {
                        "name": "Lamp",
                        "group": [ "Woonkamer" ],
                        "readonly": 0
                }
        },
        "settings": {
                "log-level": 0,
                "stats-enable": 0,
                "watchdog-enable": 0,
                "standalone": 0,
                "pid-file": "/var/run/pilight.pid",
                "log-file": "/var/log/pilight.log",
                "webgui-websockets": 0,
                "webserver-enable": 0,
                "webserver-root": "/usr/local/share/pilight/webgui",
                "webserver-http-port": 5001,
                "webserver-https-port": 5002,
                "webserver-cache": 0,
                "gpio-platform": "raspberrypizero"
        },
        "hardware": {
                "433gpio": {
                        "sender": 3,
                        "receiver": -1
                }
        },
        "registry": {
                "webserver": {
                        "ssl": {
                                "certificate": {
                                        "secure": 0,
                                        "location": "/etc/pilight/pilight.pem"
                                }
                        }
                },
                "pilight": {
                        "version": {
                                "current": "8.0.5"
                        }
                }
        }
}
