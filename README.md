# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding support for PGN 130316 Temperature, Extended Range.

The plugin takes the parsed content of received PGN 130316 messages
output by
[canboatjs](https://github.com/canboat/canboatjs)
and interpolates this into Signal K as key/value pairs where each key
has the form:

**sensors**.**temperature**.*temperature_source*.*temperature_instance*.*value_name*

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
**exhaustGasTemperature**.

*temperature_instance* derives from the 'Instance' property value
returned by ```canboatjs``` and will normally be an integer in
the range 0 through 252.

*value_name* derives from ```canboatjs``` and is one of either
**actualTemperature** or
**setTemperature**.
Typically, a temperature sensor on the host system will report both
properties.

The data value of each key is the floating point number returned by
```canboatjs``` expressing a temperature in degrees Kelvin.

Paul Reeve <*preeve_at_pdjr.eu*>
