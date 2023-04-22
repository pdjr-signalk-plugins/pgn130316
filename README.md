# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding enhanced support for PGN 130316 Temperature, Extended Range.

## Background

Versions of Signal K released before March 2022 lack the ability to
interpolate PGN 130316.

Later versions implement an incomplete interpolation mechanism with
the following characteristics:

1. Temperature readings are inserted into the Signal K store at
   locations derived by translating the ```Temperature Source``` field
   of a received PGN 130316 message into a node path using 
   [this](https://github.com/SignalK/n2k-signalk/blob/master/temperatureMappings.js)
   statically defined mapping.
   The resulting disposition of temperature data across the Signal K
   store may not be to everyone's taste.

2. PGN 130316 ```Temperature Source``` data is not explicitly saved in
   the store (although it can be intuited by reversing the mapping
   described above).

3. PGN 130316 ```Index``` data (i.e. the NMEA 2000 instance of the
   transmitting sensor) is not explicitly saved in the store (although
   it can be intuited by reversing the mapping described above).

4. PGN 130316 ```Set Temperature``` data is not made available in
   Signal K.

**pdjr-skplugin-pgn130316** implements a more flexible and comprehensive
mechanism for the handling PGN 130316 with the following characteristics.

1. Temperature readings are mapped into the Signal K store using
   a user-configurable mapping from PGN 130316 ```Temperature Source```
   into a Signal K node path.

2. ```Temperature Source``` data is explicitly saved in the store as
   part of the node path description.  

3. ```Set Temperature``` data is interpolated into the tree at a
   node path adjacent to the actual temperature reading.

4. ```Index``` data and some other properties are saved into the tree
   as meta data associated with the node path.

## Description

**pdjr-skplugin-pgn130316** interpolates PGN 130316 messages received
from a sensor by:

* Creating a node path in the Signal K store for the sensor's reported
  actual temperature.
  This node path is derived from the sensor's reported temperature
  source through a mapping defined in the plugin configuration.
  The terminal component of the node path name is 'temperature'.

* Creating a node path in the Signal K store for the sensor's reported
  set temperature.
  This node path is derived from the sensor's reported temperature
  source through a mapping defined in the plugin configuration.
  The terminal component of the node path name is 'setTemperature'

* Setting the node path description property to the sensor's reported
  source type name which will be one of
  **Sea Temperature**,
  **Outside Temperature**,
  **Inside Temperature**,
  **Engine Room Temperature**,
  **Main Cabin Temperature**,
  **Live Well Temperature**,
  **Bait Well Temperature**,
  **Refrigeration Temperature**,
  **Heating System Temperature**,
  **Dew Point Temperature**,
  **Apparent Wind Chill Temperature**,
  **Theoretical Wind Chill Temperature**,
  **Heat Index Temperature**,
  **Freezer Temperature**,
  **Exhaust Gas Temperature**.

* Inserting 'unit', 'description' and 'index' properties into the
  meta data associated with each generated node path.

## Plugin configuration

The default plugin configuration has the following form:
```
{
  "configuration": {
    "temperatureMapping": [
      { "key": "Sea Temperature", "path": "environment.water.<index>" },
      { "key": "Outside Temperature", "path": "environment.outside.<index>" },
      { "key": "Inside Temperature", "path": "environment.inside.<index>" },
      { "key": "Engine Room Temperature", "path": "environment.inside.engineRoom.<index>" },
      { "key": "Main Cabin Temperature", "path": "environment.inside.mainCabin.<index>" },
      { "key": "Live Well Temperature", "path": "tanks.liveWell.<index>" },
      { "key": "Bait Well Temperature", "path": "tanks.baitWell.<index>" },
      { "key": "Refrigeration Temperature", "path": "environment.inside.refrigerator.<index>" },
      { "key": "Refridgeration Temperature", "path": "environment.inside.refrigerator.<index>" },
      { "key": "Heating System Temperature", "path": "environment.inside.heatingSystem.<index>" },
      { "key": "Dew Point Temperature", "path": "environment.outside.dewPoint.<index>" },
      { "key": "Apparent Wind Chill Temperature", "path": "environment.outside.apparentWindChill.<index>" },
      { "key": "Theoretical Wind Chill Temperature", "path": "environment.outside.theoreticalWindChill.<index>" },
      { "key": "Heat Index Temperature", "path": "environment.outside.heatIndex.<index>" },
      { "key": "Freezer Temperature", "path": "environment.inside.freezer.<index>" },
      { "key": "Exhaust Gas Temperature", "path": "propulsion.exhaust.<index>" },
      { "key": ".*", "path": "sensors.temperature.fallback.<index>" }
    ]                                                             
  },                                                              
  "enabled": true                                                 
}                  
```

The "temperatureMapping" property value is an ordered list of pairs
each of which defines a node 'path' to be used when processing
received messages with a ```Source``` field value which matches the
regular expression specified by "key".
The value specified for "path" includes the token '<index>' which
will be replaced with the value of the ```Index``` field in the PGN
130316 message that is being processed.

In selecting a path, the "temperatureMapping" array is processed in
order and the first "key" which matches the received ```Source```
value is selected.

This default configuration mostly implements the default Signal K
behaviour with some slight corrections for typographic and logical
inconsistencies and acknowledging that all PGN 130316 messages will
include an ```Index``` field value that should be honoured.

The default configuration also includes a catch-all "key" value as
part of the last mapping, ensuring that any data that is received
with an invalid ```Source``` property is put somewhere.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
