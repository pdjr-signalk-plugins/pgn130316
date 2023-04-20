# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding support for PGN 130316 Temperature, Extended Range.

The plugin takes parsed data derived from
[canboatjs](https://github.com/canboat/canboatjs)
and interpolates this into the Signal K data tree as key names of
the form:

**sensors**.**temperature**.*temperature_source*.*temperature_instance*.*value_name*

Where:

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

*value_name* is one of the data value names defined in the NMEA 2000
specification, either
**actualTemperature** or
**setTemperature**.
Typically, each temperature sensor reporting on the host system
will report both properties.

The data value of each key is the floating point number returned by
```canboatjs``` expressing a temperature in degrees Kelvin.

Paul Reeve <*preeve_at_pdjr.eu*>
