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
   The resulting disposition of keys across the Signal K store may not
   be to everyone's taste.

2. PGN 130316 ```Temperature Source``` data is not explicitly saved in
   the store (although it can be intuited by reversing the mapping
   described above).

3. PGN 130316 ```Index``` data (the NMEA 2000 instance of the
   transmitting sensor) is not explicitly saved in the store (although
   it can be intuited by reversing the mapping described above).
   
4. PGN 130316 ```Set Temperature``` data is not made available in
   Signal K.

**pdjr-skplugin-pgn130316** provides a more flexible and comprehensive
mechanism for the handling PGN 130316 with the following characteristics.

1. Temperature readings are mapped into the Signal K store using
   a user-configurable mapping from PGN 130316 ```Temperature Source```
   into a Signal K node path.

2. ```Temperature Source``` data is explicitly saved in the store as
   part of the data value description.  

3. ```Set Temperature``` data is interpolated into the tree as an
   additional 'setTemperature' key value alongside the actual
   temperature reading.

4. ```Index``` data and some other properties are saved into the tree
   as meta data associated with the node path.

## Description

**pdjr-skplugin-pgn130316** interpolates PGN 130316 messages received
from a sensor by:

* creating a key in the Signal K store for the sensor's reported actual
  temperature.
  The key path is derived from the sensor's reported temperature source
  through the mapping defined in the plugin configuration.
  The terminal component of the key name is 'temperature'.

* creating a key in the Signal K store for the sensor's reported set
  temperature.
  The key path is derived from the sensor's reported temperature source
  through the mapping defined in the plugin configuration.
  The terminal component of the key name is 'setTemperature'

* setting the key description property to the sensor's reported
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

* Inserting 'unit' and 'description' and 'index' properties into the
  meta data associated with each generated key.

## Plugin configuration

The default plugin configuration has the following form:
```
{
  "enabled": true,
  "temperatureMapping": [
    { key: '*', path: 'sensors.temperature.<index>' },
    { key: 'Sea Temperature', path: 'environment.water.<index>' },
    { key: 'Outside Temperature', path: 'environment.outside.<index>' },
    { key: 'Inside Temperature', path: 'environment.inside.<index>' },
    { key: 'Engine Room Temperature', path: 'environment.inside.engineRoom.<index>' },
    { key: 'Main Cabin Temperature', path: 'environment.inside.mainCabin.<index>' },
    { key: 'Live Well Temperature', path: 'tanks.liveWell.<index>' },
    { key: 'Bait Well Temperature', path: 'tanks.baitWell.<index>' },
    { key: 'Refrigeration Temperature', path: 'environment.inside.refrigerator.<index>' },
    { key: 'Refridgeration Temperature', path: 'environment.inside.refrigerator.<index>' },
    { key: 'Heating System Temperature', path: 'environment.inside.heating.<index>' },
    { key: 'Dew Point Temperature', path: 'environment.outside.dewPoint.<index>' },
    { key: 'Apparent Wind Chill Temperature', path: 'environment.outside.apparentWindChill.<index>' },
    { key: 'Theoretical Wind Chill Temperature', path: 'environment.outside.theoreticalWindChill.<index>' },
    { key: 'Heat Index Temperature', path: 'environment.outside.heatIndex.<index>' },
    { key: 'Freezer Temperature', path: 'environment.inside.freezer.<index>' },
    { key: 'Exhaust Gas Temperature', path: 'propulsion.exhaust.<index> }'
  ]
}
```

The 'temperatureMapping' property value is an ordered list of pairs
each of which defines a node 'path' to be used when processing
received messages with a ```Source``` field value which matches the
regular expression specified by 'key'.
The value specified for 'path' can include the token '<index>' which
will be replaced with the value of the ```Index``` field in the PGN
130316 message that is being processed.

In selecting a path, the 'temperatureMapping' array is processed in
order and the first 'key' which matches the received ```Source```
value is selected.
In the default configuration, all PGN 130316 data will be stored under
the 'sensors.temperature' node.
Deleting the map containg "key: '*'" will revert more-or-less to the
default Signal K behaviour with some slight corrections for typographic
and logical inconsistencies.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
