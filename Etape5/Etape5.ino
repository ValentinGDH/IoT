#include <Bridge.h>
#include <BridgeClient.h>
#include <MQTTClient.h>

BridgeClient net;
MQTTClient client;

#include <dht.h>

dht DHT;

#define DHT11_PIN A1

unsigned long lastMillis = 0;

void setup() {
  Bridge.begin();
  Serial.begin(9600);
  client.begin("broker.shiftr.io", net);
  
  connect();
}

void connect() {
  Serial.print("connecting...");
  while (!client.connect("SamGoe", "UsernameToken", "MdpUsername")) {
    Serial.print(".");
  }

  Serial.println("\nconnected!");

  client.subscribe("/light");
  // client.unsubscribe("/example");
}

void loop() {
  client.loop();

  if(!client.connected()) {
    connect();
  }

  // publish a message roughly every second.
  if(millis() - lastMillis > 10000) {
    lastMillis = millis();
    int chk = DHT.read11(DHT11_PIN);
    String varStringify =  String(DHT.temperature);   
    client.publish("/temp", varStringify);
  }
}

