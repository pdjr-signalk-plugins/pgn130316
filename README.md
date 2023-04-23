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

```
{
  "configuration": {
    "temperatureMapping": [
      { "source": "Sea Temperature", "path": "environment.water.<index>" },
      { "source": "Outside Temperature", "path": "environment.outside.<index>" },
      { "source": "Inside Temperature", "path": "environment.inside.<index>" },
      { "source": "Engine Room Temperature", "path": "environment.inside.engineRoom.<index>" },
      { "source": "Main Cabin Temperature", "path": "environment.inside.mainCabin.<index>" },
      { "source": "Live Well Temperature", "path": "tanks.liveWell.<index>" },
      { "source": "Bait Well Temperature", "path": "tanks.baitWell.<index>" },
      { "source": "Refrigeration Temperature", "path": "environment.inside.refrigerator.<index>" },
      { "source": "Refridgeration Temperature", "path": "environment.inside.refrigerator.<index>" },
      { "source": "Heating System Temperature", "path": "environment.inside.heating.<index>" },
      { "source": "Dew Point Temperature", "path": "environment.outside.dewPoint.<index>" },
      { "source": "Apparent Wind Chill Temperature", "path": "environment.outside.apparentWindChill.<index>" },
      { "source": "Theoretical Wind Chill Temperature", "path": "environment.outside.theoreticalWindChill.<index>" },
      { "source": "Heat Index Temperature", "path": "environment.outside.heatIndex.<index>" },
      { "source": "Freezer Temperature", "path": "environment.inside.freezer.<index>" },
      { "source": "Exhaust Gas Temperature", "path": "propulsion.exhaust.<index>" },
      { "source": "16", "path": "environment.inside.heating.thermalStore.<index>" },
      { "source": ".*", "path": "sensors.temperature.<source>.<index>" }
    ]                                                             
  },                                                              
  "enabled": true                                                 
}                  
```

The plugin is configured through a ```temperatureMapping``` array
property value which consists of an ordered list of pairs each of which
defines the mapping between a ```source``` regular expression and a
node ```path```.

When a PGN 130316 message arrives, the value of the PGN's ```Source```
field is tested against each ```source``` value in turn until a match
is made and the corresponding ```source``` path selected.
If the selected ```path``` contains either of the tokens '<source>' or
'<index>' then these will be replaced respectively by the PGN's
```Source``` and ```Index``` field values. 

The PGN ```Source``` field is an integer value in the range 0 through
254 with the meaning of codes 0 through 15 defined in the NMEA 2000
specification.
Signal K's canboat parser converts these sixteen numeric codes into
their semantic equivalents leaving un-defined values as the raw numeric
code.

The emergence of PGN 130316 in NMEA 2000 compromised both the semantics
of temperature source codes and Signal K's mapping of codes into node
paths.
The default configuration file supplied with the plugin implements to
preserve the legacy Signal K path allocations with some corrections for
logical inconsistencies especially by acknowledging that *all* PGN
130316 messages will include an ```Index``` field value.

The last two maps in the example configuration shown above illustrate
how to catch a specif numeric ```Source``` value and how to provide
a catch-all.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
