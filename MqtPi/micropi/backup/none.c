#include <wiringPi.h>
int main (void)
{
  wiringPiSetup () ;
  pinMode (3, INPUT) ;
pullUpDnControl(3, PUD_OFF);
}




