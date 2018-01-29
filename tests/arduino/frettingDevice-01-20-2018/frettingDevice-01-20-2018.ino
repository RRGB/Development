#include <Servo.h>

Servo testServo;
int servoPin = 3;
byte incomingBytes[6];
int angle = 0;

void setup() {
  // opens serial port, sets data rate to 9600 bps
  Serial.begin(9600);
  testServo.attach(servoPin);
}

void loop() {
  if(Serial.available() > 0) {
    Serial.readBytes(incomingBytes, 6);
    angle = incomingBytes[0];
  }
  testServo.write(angle);
}
