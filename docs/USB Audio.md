lsusb

aplay -l

sudo nano /usr/share/alsa/alsa.conf

defaults.ctl.card 1 
defaults.pcm.card 1 

sudo nano .asoundrc
and
sudo nano /etc/asound.conf
===
pcm.!default {
        type hw
        card 1
}

ctl.!default {
        type hw
        card 1
}
===

sudo nano /boot/config.txt
dtparam=audio=on => dtparam=audio=off

sudo nano /lib/modprobe.d/aliases.conf
options snd-usb-audio index=-2 ==> options snd-usb-audio index=0

cat /proc/asound/modules 

speaker-test -c2 -D plughw:1,0
aplay -D plughw:1,0 example.mp3
aplay -D plughw:1,0 /usr/share/scratch/Media/Sounds/Vocals/Singer1.wav

mplayer -ao alsa:device=plughw=1.0 test.mp3
mpg321 test.mp3 --stereo -o alsa -a plughw:1,0

mplayer -ao alsa:device=plughw=1.0 http://stream.sublimefm.nl/SublimeFM_mp3

#maybe dependencies
sudo apt-get install mpg123
sudo apt-get install libsamplerate0
sudo apt-get install alsa-oss

modprobe snd_pcm_oss
sudo modprobe snd_pcm_oss
sudo modprobe snd_mixer_oss


mplayer -ao alsa:device=plughw=1.0 http://stream.sublimefm.nl/SublimeFM_mp3 -af volume=-40:1
ffmpeg -i http://stream.sublimefm.nl/SublimeFM_aac -f alsa plughw:1,0 -vol 1
omxplayer http://stream.sublimefm.nl/SublimeFM_mp3 -o alsa:plughw:1,0
omxplayer http://stream.sublimefm.nl/SublimeFM_mp3 -o alsa:plughw:0,0 --vol "-2000" --no-keys &
pkill omxplayer 
