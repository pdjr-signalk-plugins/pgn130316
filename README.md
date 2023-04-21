# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding support for PGN 130316 Temperature, Extended Range.

Early versions of Signal K are able to parse received PGN 130316
messages, but lack the ability to interpolate the resulting data
into the Signal K data model.
**pdjr-skplugin-pgn130316** addresses this lacuna by generating
key/value pairs from received PGN 130316 messages.

PGN 130316 compliant temperature sensors report two data values:
the actual temperature sensed by the device and a set-point
temperature configured by the installer or user.
Each temperature sensor is represented in Signal K by a pair of
keys of the form:

```
*root*.*source*.*instance*.*actual-temperature*
*root*.*source*.*instance*.*set-temperature*
```

where:

*root* defaults to 'temperature.sensors' but this value can be changed
in the plugin configuration file. 

*source* will normally be one of the following values defined by the
Signal K specification:
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

*instance* will normally be an integer in the range 0 through 252.

*actual-temperature* defaults to 'actualTemperature' buth this value
can be changed in the plugin configuration file.

*set-temperature* defaults to 'setTemperature' buth this value
can be changed in the plugin configuration file.

The data value of each key is a floating point number expressing a
temperature in degrees Kelvin.

## Plugin configuration

The default plugin configuration has the following form:
```
{
  "enabled": true,
  "configuration: {
    "root": "temperature.sensors",
    "actual-temperature": "actualTemperature",
    "set-temperature": "setTemperature"
  }
}
```

The *root* property value defines the prefix which will be prepended to
all keys inserted into Signal K.

The *actual* property value defines the name which will be used
for the final component of the key representing the PGN 130316 actual
temperature value.

The *set* property value defines the name which will be used for the
final component of the key representing the PGN 130316 set temperature
value.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
