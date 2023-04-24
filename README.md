# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding enhanced support for PGN 130316 Temperature, Extended Range.

## Background

Versions of Signal K released before March 2022 lack the ability to
process PGN 130316.

Later versions implement an incomplete interpolation mechanism with
the following characteristics:

1. Temperature readings are inserted into Signal K at locations derived
   by translating PGN 130316 ```Temperature Source``` field values into
   node paths using a
   [statically defined mapping](https://github.com/SignalK/n2k-signalk/blob/master/temperatureMappings.js).
   This mapping derives from an NMEA 2000 specification which pre-dates
   PGN 130316 and does not support multiple sensor instances across
   all temperature sources leading to the possibility of some data
   loss.
   The consequent disposition of temperature data within Signal K
   may not be to everyone's taste.

2. PGN 130316 ```Temperature``` field data is saved to Signal K under a
   'temperature' key.
   
3. PGN 130316 ```Set Temperature``` field data is not saved to Signal
   K.

4. PGN 130316 ```Temperature Source``` field data is not saved to
   Signal K store (although it can be inferred by reversing the mapping
   described above).

5. PGN 130316 ```Instance``` field data is not saved to Signal K
   (although it can also be inferred by reversing the mapping described
   above).
   
6. Meta data describing the created temperature node paths is not
   saved to Signal K.

## Description

**pdjr-skplugin-pgn130316** implements an interpolation mechanism for
PGN 130316 with the following characteristics.

1. Temperature readings are inserted into Signal K at locations derived
   by translating PGN 130316 ```Temperature Source``` field values into
   node paths using a user-defined mapping capable of fully supporting
   PGN 130316.

2. PGN 130316 ```Temperature``` field data is saved to Signal K under a
   'temperature' key.
   
3. PGN 130316 ```Set Temperature``` data is saved to Signal K under a
   'setTemperature' key.

4. PGN 130316 ```Temperature Source``` data is saved to Signal K as
   part of the meta data associated with a generated node path.  

5. PGN 130316 ```Instance``` data is saved to Signal K as meta data
   associated with a generated node path.

6. Unit and description properties are added to Signal K as meta data
   associated with a generated node path.

## Plugin configuration

```
{
  "configuration": {
    "temperatureMapping": [
      { "source": "Sea Temperature", "path": "environment.water.<instance>" },
      { "source": "Outside Temperature", "path": "environment.outside.<instance>" },
      { "source": "Inside Temperature", "path": "environment.inside.<instance>" },
      { "source": "Engine Room Temperature", "path": "environment.inside.engineRoom.<instance>" },
      { "source": "Main Cabin Temperature", "path": "environment.inside.mainCabin.<instance>" },
      { "source": "Live Well Temperature", "path": "tanks.liveWell.<instance>" },
      { "source": "Bait Well Temperature", "path": "tanks.baitWell.<instance>" },
      { "source": "Refrigeration Temperature", "path": "environment.inside.refrigerator.<instance>" },
      { "source": "Refridgeration Temperature", "path": "environment.inside.refrigerator.<instance>" },
      { "source": "Heating System Temperature", "path": "environment.inside.heating.<instance>" },
      { "source": "Dew Point Temperature", "path": "environment.outside.dewPoint.<instance>" },
      { "source": "Apparent Wind Chill Temperature", "path": "environment.outside.apparentWindChill.<instance>" },
      { "source": "Theoretical Wind Chill Temperature", "path": "environment.outside.theoreticalWindChill.<instance>" },
      { "source": "Heat Index Temperature", "path": "environment.outside.heatIndex.<instance>" },
      { "source": "Freezer Temperature", "path": "environment.inside.freezer.<instance>" },
      { "source": "Exhaust Gas Temperature", "path": "propulsion.exhaust.<instance>" },
      { "source": "16", "path": "environment.inside.heating.thermalStore.<instance>" },
      { "source": ".*", "path": "sensors.temperature.<source>.<instance>" }
    ]                                                             
  },                                                              
  "enabled": true                                                 
}                  
```

**pdjr-skplugin-pgn130316** is configured through a
```temperatureMapping``` array which consists of an ordered list of
pairs each of which defines the mapping between a ```source``` regular
expression and a node ```path```.

When a PGN 130316 message arrives, the value of the PGN's
```Temperature Source``` field is tested against each ```source```
regex in turn until a match is made and the corresponding node
```path``` selected.
If the selected ```path``` contains either of the tokens '\<source\>'
or '\<instance\>' then these will be replaced respectively by the PGN's
```Temperature Source``` and ```Instance``` field values. 

The PGN 130316 ```Temperature Source``` field is an integer value in
the range 0 through 254.
Values in the range 0 through 15 have semantics defined in the NMEA
2000 specification and Signal K's canboat parser converts these numeric
codes into their named equivalents.
Values outside the range 0 through 15 remain numeric.

The emergence of PGN 130316 in NMEA 2000 compromised both the semantics
of temperature source codes and Signal K's mapping of codes into node
paths.
The default configuration file supplied with the plugin preserves as
far as possible the legacy Signal K path allocations with some
corrections for logical inconsistencies, especially by acknowledging
that *all* PGN 130316 messages will be characterised by an
```Instance``` field value.

The last two maps in the example configuration shown above illustrate
how to catch a specific numeric ```Temperature Source``` value and how
to provide a catch-all.

## Author

Paul Reeve <*preeve_at_pdjr.eu*>
