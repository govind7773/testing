#include <WiFi.h>
#include <HTTPClient.h>
int integer_to_be_sent=0;

// Set our wifi name and password

const char* ssid = "rootusr";
const char* password = "12345678";

String serverName = "https://api.thingspeak.com/update?api_key=IQWJOS1OC7BIGVWR&field1=0";



unsigned long lastTime = 0;
unsigned long timerDelay = 10000;
unsigned long begin_time=millis();



void setup() {

  Serial.begin(9600); // Opens up the serial port with a baudrate of 9600 bits per second
//  WiFi.begin(ssid, password); // Attempt to connect to wifi with our password
  WiFi.begin("Wokwi-GUEST", "", 6);

  Serial.println("Connecting"); // Print our status to the serial monitor

  // Wait for wifi to connect

  while(WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");

  }
  Serial.println("");
  Serial.print("Connected to WiFi network with IP Address: ");
  Serial.println(WiFi.localIP());

}

void loop() {
   if ((millis() - lastTime) > timerDelay) { // Check if its been a 10secs

    if(WiFi.status()== WL_CONNECTED){ // Check to make sure wifi is still connected
      if(integer_to_be_sent<11){
        Serial.println(integer_to_be_sent);
     sendData(integer_to_be_sent); // Call the sendData function defined below

      }
      else{
        integer_to_be_sent=1;
        sendData(integer_to_be_sent);
      }
      integer_to_be_sent++;
    }

    else {

      Serial.println("WiFi Disconnected from rootusr network ");
    }
    lastTime = millis();
  }
}
void sendData(int data){
  HTTPClient http; // Initialize our HTTP client
Serial.println(data);
  String url = serverName + "&field1=" + data; // Define our entire url  
  http.begin(url.c_str()); // Initialize our HTTP request    
  int httpResponseCode = http.GET(); // Send HTTP request  

  if (httpResponseCode > 0){ // Check for good HTTP status code
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
  }
  else{
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
   http.end();
}
/////////////////////////////////////////////////////////////////////////////////////////////////
#define BLYNK_TEMPLATE_ID "TMPL3GLvqGIQo"
#define BLYNK_TEMPLATE_NAME "rootusr Control LED"
#define BLYNK_AUTH_TOKEN "58bTrtGae8McRPrmOrVqJX19PPiRdaaT"


#define BLYNK_PRINT Serial


#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

// Your WiFi credentials.
// Set password to "" for open networks.
char ssid[] = "Wokwi-GUEST";
char pass[] = "";

BlynkTimer timer;

// This function is called every time the Virtual Pin 0 state changes
BLYNK_WRITE(V0)
{
  // Set incoming value from pin V0 to a variable
  int value = param.asInt();

  // Update state
  Blynk.virtualWrite(V1, value);
}

// This function is called every time the device is connected to the Blynk.Cloud
BLYNK_CONNECTED()
{

  Blynk.setProperty(V3, "offImageUrl", "https://static-image.nyc3.cdn.digitaloceanspaces.com/general/fte/congratulations.png");
  Blynk.setProperty(V3, "onImageUrl",  "https://static-image.nyc3.cdn.digitaloceanspaces.com/general/fte/congratulations_pressed.png");
  Blynk.setProperty(V3, "url", "https://docs.blynk.io/en/getting-started/what-do-i-need-to-blynk/how-quickstart-device-was-made");
}

// This function sends Arduino's uptime every second to Virtual Pin 2.
void myTimerEvent()
{
  // You can send any value at any time.
  // Please don't send more that 10 values per second.
  Blynk.virtualWrite(V2, millis() / 1000);
}

void setup()
{
  // Debug console
  Serial.begin(115200);

  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
  // You can also specify server:
  //Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass, "blynk.cloud", 80);
  //Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass, IPAddress(192,168,1,100), 8080);
 Serial.print("Connecting to WiFi");
 
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println(" Connected!");
  // Setup a function to be called every second
  timer.setInterval(1000L, myTimerEvent);
}

void loop()
{
 
  Blynk.run();
  timer.run();
  // You can inject your own code or combine it with other sketches.
  // Check other examples on how to communicate with Blynk. Remember
  // to avoid delay() function!
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <uri/UriBraces.h>

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""
// Defining the WiFi channel speeds up the connection:
#define WIFI_CHANNEL 6

WebServer server(80);

const int LED1 = 26;
const int LED2 = 27;

bool led1State = false;
bool led2State = false;

void sendHtml() {
  String response = R"(
    <!DOCTYPE html><html>
      <head>
        <title>ESP32 Web Server Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          html { font-family: sans-serif; text-align: center; }
          body { display: inline-flex; flex-direction: column; }
          h1 { margin-bottom: 1.2em; }
          h2 { margin: 0; }
          div { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; grid-auto-flow: column; grid-gap: 1em; }
          .btn { background-color: #5B5; border: none; color: #fff; padding: 0.5em 1em;
                 font-size: 2em; text-decoration: none }
          .btn.OFF { background-color: #333; }
        </style>
      </head>
           
      <body>
        <h1>ESP32 Web Server</h1>

        <div>
          <h2>LED 1</h2>
          <a href="/toggle/1" class="btn LED1_TEXT">LED1_TEXT</a>
          <h2>LED 2</h2>
          <a href="/toggle/2" class="btn LED2_TEXT">LED2_TEXT</a>
        </div>
      </body>
    </html>
  )";
  response.replace("LED1_TEXT", led1State ? "ON" : "OFF");
  response.replace("LED2_TEXT", led2State ? "ON" : "OFF");
  server.send(200, "text/html", response);
}

void setup(void) {
  Serial.begin(115200);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD, WIFI_CHANNEL);
  Serial.print("Connecting to WiFi ");
  Serial.print(WIFI_SSID);
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println(" Connected!");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", sendHtml);

  server.on(UriBraces("/toggle/{}"), []() {
    String led = server.pathArg(0);
    Serial.print("Toggle LED #");
    Serial.println(led);

    switch (led.toInt()) {
      case 1:
        led1State = !led1State;
        digitalWrite(LED1, led1State);
        break;
      case 2:
        led2State = !led2State;
        digitalWrite(LED2, led2State);
        break;
    }

    sendHtml();
  });

  server.begin();
  Serial.println("HTTP server started (http://localhost:8180)");
}

void loop(void) {
  server.handleClient();
  delay(2);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////
#include <WiFi.h>
#include <WiFiClient.h>
#include <WebServer.h>
#include <uri/UriBraces.h>

#define WIFI_SSID "Wokwi-GUEST"
#define WIFI_PASSWORD ""
// Defining the WiFi channel speeds up the connection:
#define WIFI_CHANNEL 6

WebServer server(80);

const int LED1 = 26;
const int LED2 = 27;

bool led1State = false;
bool led2State = false;

void sendHtml() {
  String response = R"(
    <!DOCTYPE html><html>
      <head>
        <title>ESP32 Web Server Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          html { font-family: sans-serif; text-align: center; }
          body { display: inline-flex; flex-direction: column; }
          h1 { margin-bottom: 1.2em; }
          h2 { margin: 0; }
          div { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto; grid-auto-flow: column; grid-gap: 1em; }
          .btn { background-color: #5B5; border: none; color: #fff; padding: 0.5em 1em;
                 font-size: 2em; text-decoration: none }
          .btn.OFF { background-color: #333; }
        </style>
      </head>
           
      <body>
        <h1>ESP32 Web Server</h1>

        <div>
          <h2>LED 1</h2>
          <a href="/toggle/1" class="btn LED1_TEXT">LED1_TEXT</a>
          <h2>LED 2</h2>
          <a href="/toggle/2" class="btn LED2_TEXT">LED2_TEXT</a>
        </div>
      </body>
    </html>
  )";
  response.replace("LED1_TEXT", led1State ? "ON" : "OFF");
  response.replace("LED2_TEXT", led2State ? "ON" : "OFF");
  server.send(200, "text/html", response);
}

void setup(void) {
  Serial.begin(115200);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);

  WiFi.begin(WIFI_SSID, WIFI_PASSWORD, WIFI_CHANNEL);
  Serial.print("Connecting to WiFi ");
  Serial.print(WIFI_SSID);
  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(100);
    Serial.print(".");
  }
  Serial.println(" Connected!");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/", sendHtml);

  server.on(UriBraces("/toggle/{}"), []() {
    String led = server.pathArg(0);
    Serial.print("Toggle LED #");
    Serial.println(led);

    switch (led.toInt()) {
      case 1:
        led1State = !led1State;
        digitalWrite(LED1, led1State);
        break;
      case 2:
        led2State = !led2State;
        digitalWrite(LED2, led2State);
        break;
    }

    sendHtml();
  });

  server.begin();
  Serial.println("HTTP server started (http://localhost:8180)");
}

void loop(void) {
  server.handleClient();
  delay(2);
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Question: Study various application layer protocols used in IoT.
 Answer:
There are 3 application layer protocols that are commonly used in IoT, including

 MQTT (Message Queuing Telemetry Transport): MQTT is a publish-subscribe messaging protocol that is designed to work in low-bandwidth, high-latency environments. It is widely used in IoT applications for efficient communication between devices and the cloud.

CoAP (Constrained Application Protocol): CoAP is a lightweight protocol that is designed for resource-constrained devices in IoT. It provides simple request/response methods for accessing and manipulating resources, making it suitable for low-power, low-memory devices. AMQP (Advanced Message Queuing Protocol): 

AMQP is a messaging protocol that is designed to support reliable, asynchronous communication between applications. It provides a flexible, interoperable messaging infrastructure for IoT applications
///////////////////////////////////////////////////////////////////////////////////
Question: What is https://thingsboard.io/ all about? Study the services provided.
 Answer:
TextGuru is a bulk SMS service provider based in India that offers a wide range of services for businesses to reach their target audience through SMS marketing. Here are some key features and services provided by TextGuru:

●	SMS Gateway: TextGuru offers an SMS gateway that enables businesses to send SMS messages to their customers and subscribers. The gateway is easy to use and can be integrated with various applications and platforms.
●	Personalization: TextGuru allows businesses to personalize their SMS messages by adding the recipient's name, company name, or any other relevant information. This helps in building a strong relationship with the customers and makes them feel valued.
●	Customized Sender ID: TextGuru allows businesses to customize their sender ID, which means the sender's name that appears on the recipient's phone can be personalized. This helps in building brand identity and brand recall.
●	Analytics and Reports: TextGuru provides detailed analytics and reports on the SMS campaigns sent by businesses. The reports include information such as delivery rate, open rate, click rate, and conversion rate. This helps businesses to track the performance of their campaigns and optimize them for better results.
●	API Integration: TextGuru provides API integration with various platforms and applications, making it easy for businesses to send SMS messages from their existing systems.
●	Multiple SMS Routes: TextGuru uses multiple SMS routes to ensure the timely delivery of SMS messages to the recipients. This ensures the maximum reach and delivery of SMS messages.
●	24x7 Support: TextGuru provides 24x7 support to its customers through email and phone. This ensures that any issues or queries are resolved in a timely manner.

Overall, TextGuru is a reliable and cost-effective bulk SMS service provider in India that offers a wide range of features and services to businesses for effective SMS marketing. Its user-friendly interface, customization options, and analytics and reporting features make it a popular choice among businesses.
