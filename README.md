# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding enhanced support for PGN 130316 Temperature, Extended Range.

## Background

Versions of Signal K released before March 2022 lack the ability to
process PGN 130316.

Later versions of Signal K handle PGN 130316 messages in a limited way:

1. A node path is selected from
   [this](https://github.com/SignalK/n2k-signalk/blob/master/temperatureMappings.js)
   mapping using the PGN 130316 ```Temperature Source``` field value
   as a key.
   Lack of support in the mapping for multiple sensor instances across
   all temperature sources raises the possibility of data loss.
   Inevitably, the default mapping locations may not be to everyone's
   taste.

2. A 'temperature' key is used to capture the value of the PGN 130316
   ```Temperature``` field; the ```Set Temperature``` field is, however,
   completely ignored.

3. PGN 130316 ```Temperature Source``` and ```Instance``` field data is
   not saved to the Signal K store (although both values can be inferred
   by reversing the mapping discussed above.
   
4. Meta data describing the created 'temperature' key is not generated.

## Description

**pdjr-skplugin-pgn130316** overcomes most of the limitations described
above by handling PGN 130316 messages in the following mechanism way:

1. A node path is selected from a user-defined mapping supplied in the
   plugin configuration using the PGN 130316 ```Temperature Source```
   field value as a key.
   The node path can be parameterised with both ```Temperature Source```
   and ```Instance``` field values.

2. A 'temperature' key captures the value of the PGN 130316
   ```Temperature``` field and a 'setTemperature' key captures the value
   of the ```Set Temperature``` field.
   
3. PGN 130316 ```Temperature Source``` and ```Instance``` data is saved
   as meta data associated with the generated keys.

4. 'unit' and 'description' properties are also included in the key meta
   data.

## Plugin configuration

On first execution the plugin will save the following default
configuration file to disk.

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
regex in turn until a match is made and a corresponding node
```path``` selected.
If the selected ```path``` contains either of the tokens '\<source\>'
or '\<instance\>' then these will be replaced respectively by the PGN's
```Temperature Source``` and ```Instance``` field values. 

The default configuration file supplied with the plugin preserves as
far as possible the legacy Signal K path allocations with some
corrections for logical inconsistencies, especially by acknowledging
that *all* PGN 130316 messages will include an ```Instance``` field
value.

The last two maps in the example configuration shown above illustrate
how to catch a specific ```Temperature Source``` PGN field value and
how to provide a catch-all.
Note that ```Temperature Source``` values for source codes 0 through
14 are mapped by Signal K into their NMEA 2000 specified semantic
names; source codes 15 and above appear as numeric values.

## Operation

The plugin will start processing PGN 130316 messages as soon as it is
installed.

## Author

Paul Reeve <*preeve_at_pdjr_dot_eu*>
