# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding support for PGN 130316 Temperature, Extended Range.

Versions of Signal K which use [canboatjs]() are able to parse
PGN 130316 messages, but lack the ability to interpolate the
derived data into the Signal K data model.
**pdjr-skplugin-pgn130316** addresses this issue by generating
key/value pairs from parsed PGN 130316 messages.

PGN 130316 compliant temperature sensors report two temperatures:
a dynamic value representing the actual temperature sensed by the
device and a static value reporting a set-point temperature
configured by the installer or user.
A temperature sensor is represented in the Signal K store by a key
of the form:

*root*.*source*.*instance*.*actual-temperature*

where:

*root* defaults to 'temperature.sensors' but can be changed in the
plugin configuration file. 

*source* derives from a received PGN 130316 message and will normally
be one of the following values defined by the Signal K specification:
**seaTemperature**,
**outsideTemperature**,
**insideTemperature**,
**engineRoomTemperature**,
**mainCabinTemperature**,
**liveWellTemperature**,
**baitWellTemperature**,
**refrigerationTemperature**,
**heatingSystemTemperature**,
**dewPointTemperature**,
**apparentWindChillTemperature**,
**theoreticalWindChillTemperature**,
**heatIndexTemperature**,
**freezerTemperature**,
**exhaustGasTemperature**.

*instance* derives from a received PGN 130316 message and will normally
be an integer in the range 0 through 252.

*actual-temperature* defaults to 'actualTemperature' but can be changed
in the plugin configuration file.

The plugin inserts `unit` and `description` properties into the meta
value associated with each generated key and am additional property
called (by default) 'setTemperature' which has as its value the
set temperature derived from PGN 130316.
The name of the set temperature property can be changed in the
plugin configuration.

## Plugin configuration

The default plugin configuration has the following form:
```
{
  "enabled": true,
  "configuration: {
    "root": "temperature.sensors",
    "keyname": "temperature",
    "metaname": "setTemperature"
  }
}
```

The `root` property value defines a prefix which will be prepended to
all keys inserted into Signal K.

The `keyname` property value defines the name which will be used
as the final component of the key name for each sensor value that
is inserted into Signal K.

The `metaname` property value defines the name which will be used
for the meta property used to report a sensor's set temperature.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
