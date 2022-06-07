# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

This plugin extends Signal K's support for NMEA 2000
[PGN 130316 Temperature, Extended Range](https://www.nmea.org/Assets/nmea%202000%20pgn%20130316%20corrigenda%20nmd%20version%202.100%20feb%202015.pdf)
by injecting data received over this PGN into the Signal K data store.

The plugin builds data paths (keys) of the form:

**sensors**.**temperature**.*temperature_source*.*temperature_instance*.*value_name*

Where:

*temperature_source* derives almost directly from the 'Source'
property value returned by ```canboatjs```.
For NMEA defined sources this will result be one of
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

*temperature_instance* derives directly from the 'Instance' property
value returned by ```canboatjs``` and will typically be an integer in
the range 0 through 252.

*value_name* is one of
**actualTemperature** or
**setTemperature**.

The actual data value of each key is a floating point temperature value
in degrees Kelvin.

Paul Reeve <*preeve_at_pdjr.eu*>
