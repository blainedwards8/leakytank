# Leaky Tank Simulator
A simulator that connects to a MQTT server.  This is useful for teaching how to read and control a system over MQTT.  There is a web server that can be connected to for monitoring the system.

## Configuration
Before starting the system, the MQTT configuration file must be updated with a URL to connect to the MQTT Broker.  The MQTT configuration file is titled "mqtt_config.js".

## Starting the System
To start the system, enter "npm run serve" from the command line in the base directory of the system.

## Web Interface
The system includes a web interface that may be accessed after the system has been started.  In a web browser, enter "http://localhost:3000" if accessing the web interface from the same computer where the system is being run.  If the system is being run on an outside computer, access the system on the same port using the URL or IP Address of the computer (e.g. http://192.168.0.101:3000).

The default port for the web server is 3000.  This may be changed in code.

The web interface connects to the system using a websocket connection that updates every second.  The interface can only view current information releated to the system.  Updating the system is not available at this time.  Updating the system, requires changing code within the app.js file.

## MQTT Interface
| Title | Topic |
| --- | --- |
| Base Topic | "/leakytank" |
| Status Topic | "/leakytank/stat" |
| Command Topic | "/leakytank/cmnd" |

### Command Topics
| Command | Topic | Values | Description |
| --- | --- | --- | --- |
| Pump | /leakytank/cmnd/pump | 1, ON, On, on, 0, OFF, Off, off | Operate the pump that puts water into the sytem.  Turning the pump on will raise level.  Turning the pump off will result in the level lowering. |

### Status Topics
| Title | Topic | Description |
| --- | --- | --- |
| Level | /leakytank/stat/level | View the current level in the tank.  The system returns a value every second. |
| Pump | /leakytank/stat/pump | Displays the current state of the pump.  Only returns when a change has been detected. |
| High Level Alarm | /leakytank/stat/hla | Returns a value when the high level alarm has been tripped or reseted. |
| Low Level Alarm | /leakytank/stat/lla | Returns a value when the low level alarm has been tripped or reseted. |