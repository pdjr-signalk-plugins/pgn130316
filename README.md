# pdjr-skplugin-pgn130316
Map PGN130316 into Signal K

This plugin extends Signal K's support for NMEA 2000 PGN130316 Extended
Temperature by injecting the data recovered from the CAN bus into the
Signal K data model.
This is necessary because although canboat.js (Signal K's default CAN
interface) can decode PGN130316 there is currently no intrinsic support
for transferring this data into the Signal K data model.

The plugin builds data paths (keys) of the form:

vessels.self.sensors.temperature.*temperature_source*.*temperature_instance*.*value_name*

Where:

*temperature_source* is one of seaTemperature, outsideTemperature,
insideTemperature, engineRoomTemperature, mainCabinTemperature,
liveWellTemperature, baitWellTemperature, refrigerationTemperature,
heatingSystemTemperature, dewPointTemperature,
apparentWindChillTemperature, theoreticalWindChillTemperature,
heatIndexTemperature, freezerTemperature, exhaustGasTemperature or
genericTemperature*nnn* (where *nnn* is a value in the range 129
through 252).

*temperature_instance* is an instance number in the range 0 through
252.

*value_name* is one of actualTemperature or setTemperature.

The actual data value of each key is a floating point temperate value
expressed in degrees Kelvin.

Paul Reeve <preeve_at_pdjr.eu>
