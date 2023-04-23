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
   The mapping in use derives from an NMEA 2000 specification which
   pre-dates and is not entirely compatible with the features of PGN
   130316.
   The consequent disposition of temperature data across the Signal K
   store may not be to everyone's taste.

2. PGN 130316 ```Temperature``` data is saved to the Signal K data
   store under a 'temperature' key.
   
3. PGN 130316 ```Set Temperature``` data is not saved into the Signal K
   store.

4. PGN 130316 ```Temperature Source``` data is not saved in the Signal
   K store (although it can be inferred by reversing the mapping
   described above).

5. PGN 130316 ```Index``` data (i.e. the NMEA 2000 instance of the
   transmitting sensor) is not saved in the Signal K store (although it
   can also be inferred by reversing the mapping described above).
   
6. Meta data describing the created temperature node paths is not
   saved to to the Signal K store.

## Description

**pdjr-skplugin-pgn130316** implements an interpolation mechanism for
PGN 130316 with the following characteristics.

1. Temperature readings are mapped into the Signal K store using a
   user-defined mapping from PGN 130316 ```Temperature Source``` to a
   Signal K node path.

2. PGN 130316 ```Temperature``` data is saved to the Signal K data
   store under a 'temperature' key.
   
3. PGN 130316 ```Set Temperature``` data is saved to the Signal K
   store under a 'setTemperature' key.

4. PGN 130316 ```Temperature Source``` data is saved to the Signal K
   store as part of the node source description.  

5. PGN 130316 ```Index``` data is saved to the Signal K store as meta
   data associated with the node path.

6. Unit and description properties are added to the Signal K store as
   meta data associated with the node path.

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
If the selected ```path``` contains either of the tokens '\<source\>'
or '\<index\>' then these will be replaced respectively by the PGN's
```Source``` and ```Index``` field values. 

The PGN 130316  ```Source``` field is an integer value in the range 0
through 254.
Source values in the range 0 through 15 have semantics defined in the
NMEA 2000 specification and Signal K's canboat parser converts these
numeric codes into their named equivalents.
Source values outside the range 0 through 15 remain numeric.

The emergence of PGN 130316 in NMEA 2000 compromised both the semantics
of temperature source codes and Signal K's mapping of codes into node
paths.
The default configuration file supplied with the plugin preserves as far
as possible the legacy Signal K path allocations with some corrections for
logical inconsistencies especially by acknowledging that *all* PGN
130316 messages will include an ```Index``` field value.

The last two maps in the example configuration shown above illustrate
how to catch a specific numeric ```Source``` value and how to provide
a catch-all.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
