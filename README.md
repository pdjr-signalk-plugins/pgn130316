# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding support for PGN 130316 Temperature, Extended Range.

Signal K's [canboatjs](https://github.com/canboat/canboatjs) component
is already able to parse PGN 130316 messages and **pdjr-skplugin-pgn130316**
interpolates this parsed data into Signal K as key/value pairs where
each key has the form:

*temperature_root*.*temperature_source*.*temperature_instance*.*value_name*

*temperature_root* defaults to 'temperature.sensors' but this can be
overridden in an optional plugin configuration file. 

*temperature_source* derives from the 'Source' property value returned
by ```canboatjs``` and will normally be one of the following values
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
**exhaustGasTemperature** or
'undefined' if the received PGN 130316 message is not compliant with
the NMEA 2000 specification.

*temperature_instance* derives from the 'Instance' property value
returned by ```canboatjs``` and will normally be an integer in
the range 0 through 252.

*value_name* derives from ```canboatjs``` and by default will be one
of either
**actualTemperature** or
**setTemperature**.
Typically, a temperature sensor on the host system will report both
properties and the actual property names can be overridden in the
optional plugin configuration.

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
