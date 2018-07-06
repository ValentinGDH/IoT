#include <Bridge.h>
#include <BridgeClient.h>
#include <MQTTClient.h>

BridgeClient net;
MQTTClient client;
int L = 7;

unsigned long lastMillis = 0;

void setup() {
  Bridge.begin();
  Serial.begin(9600);
  client.begin("broker.shiftr.io", net);

  connect();
}

void connect() {
  Serial.print("connecting...");
  client.onMessage(messageReceived);
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
  if(millis() - lastMillis > 1000) {
    lastMillis = millis();
    client.publish("/light", "on");
  }
}

void messageReceived(String &topic, String &payload) {
  Serial.print("incoming: ");
  Serial.print(topic);
  Serial.print(" - ");
  Serial.print(payload);
  Serial.println();
}
