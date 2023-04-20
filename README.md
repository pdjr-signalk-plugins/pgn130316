# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding support for PGN 130316 Temperature, Extended Range.

Signal K's [canboatjs](https://github.com/canboat/canboatjs) component
is already able to parse PGN 130316 messages and **pdjr-skplugin-pgn130316**
interpolates this parsed data into Signal K as key/value pairs where
each key has the form:

*root*.*source*.*instance*.*name*

*root* defaults to 'temperature.sensors' but this value can be changed
in the plugin configuration file. 

*source* derives from the 'Source' property value returned by
```canboatjs``` and will normally be one of the following values
defined by the Signal K specification:
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

*instance* derives from the 'Instance' property value returned by
```canboatjs``` and will normally be an integer in the range 0 through
252.

*name* derives from ```canboatjs``` and by default will be one
of either
**actualTemperature** or
**setTemperature**.
Typically, a temperature sensor on the host system will report both
properties.
The actual values used for *name* can be overridden in the plugin
configuration.

The data value of each key is the floating point number returned by
```canboatjs``` expressing a temperature in degrees Kelvin.

## Plugin configuration

The default plugin configuration has the following form:
```
{
  "enabled": true,
  "configuration: {
    "root": "temperature.sensors",
    "actual": "actualTemperature",
    "set": "setTemperature"
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
