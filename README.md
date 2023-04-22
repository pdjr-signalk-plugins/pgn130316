# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding enhanced support for PGN 130316 Temperature, Extended Range.

## Background

Versions of Signal K release before March 2022 lack the ability to
interpolate PGN 130316.

Later versions implement an incomplete interpolation mechanism with
the following characteristics:

1. Temperature readings are inserted into the Signal K store at
   locations derived by mapping PGN 130316 ```Temperature Source```
   into a path using 
   [this](https://github.com/SignalK/n2k-signalk/blob/master/temperatureMappings.js)
   statically defined mapping.
   The resulting disposition of keys across the Signal K store may not
   be to everyone's taste.

2. PGN 130316 ```Temperature Source``` data is not explicitly saved in
   the store (although it can be intuited by reversing the mapping
   described above).
   
3. PGN 130316 ```Set Temperature``` data is not made available in
   Signal K.

**pdjr-skplugin-pgn130316** provides a more flexible and comprehensive
mechanism for the handling PGN 130316 with the following characteristics.

1. Temperature readings are mapped into the Signal K store using
   a user-configurable mapping from PGN 130316 ```Temperature Source```
   into a Signal K path.

2. ```Temperature Source``` data is explicitly saved in the store as
   part of the data value description.  

3. ```Set Temperature``` data is interpolated into the tree as an
   additional 'setTemperature' key value alongside the actual
   temperature reading.

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

* Inserting `unit` and `description` properties into the meta
  data associated with each generated key.

## Plugin configuration

The default plugin configuration has the following form:
```
{
  "enabled": true,
  ": {
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
