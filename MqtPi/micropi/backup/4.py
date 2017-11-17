#enter sudo pigpiod in terminal
import pigpio
import time
import sys

pi = pigpio.pi()
pi.set_mode(17,pigpio.INPUT)
pi.set_pull_up_down(17,pigpio.PUD_DOWN)

global falling
global raising
global latest
global counter
falling = 0
raising = 0
latest = 0
counter = 0

def cbf(gpio, level, tick):
    global rising
    global latest
    global counter
    rising = tick
    rising = rising - latest
    latest = tick
    if rising>10000:
	print('|')
    sys.stdout.write('R' + str(rising)+' ')
    #counter = counter + 1
    if counter > 10:
	counter = 0
	print('')
    return 

def cbf1(gpio,level,tick1):
    global falling
    global latest
    global counter
    falling = tick1
    falling = falling - latest
    latest = tick1
    if falling>10000:
        print('|')
    sys.stdout.write('F' + str(falling)+' ')
    #counter = counter + 1
    if counter > 10:
        counter = 0
        print('')
    return 


cb1 = pi.callback(17, pigpio.RISING_EDGE, cbf)
cb2 = pi.callback(17, pigpio.FALLING_EDGE, cbf1)

while True:
    pass
