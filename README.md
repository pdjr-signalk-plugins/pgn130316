# pdjr-skplugin-pgn130316

Map PGN 130316 into Signal K.

**pdjr-skplugin-pgn130316** extends Signal K's NMEA 2000 interface by
adding enhanced support for PGN 130316 Temperature, Extended Range.

## Background

Versions of Signal K released before March 2022 lack the ability to
process PGN 130316.

Later versions of Signal K handle PGN 130316 in a way which is
problematic for the following reasons.

1. A node path is selected from
   [this](https://github.com/SignalK/n2k-signalk/blob/master/temperatureMappings.js)
   mapping using the PGN 130316 ```Temperature Source``` field value
   as a key.

   Unfortunately, the mapping lacks comprehensive support for multiple
   sensor instances raises the possibility of data loss.
   Inevitably, the system default mapping locations may not be to
   everyone's taste.

2. The PGN 130316 ```Set Temperature``` field is not parsed into Signal K.

3. PGN 130316 ```Temperature Source``` and ```Instance``` field data is
   not saved to the Signal K store (although both values can be inferred
   by reversing the mapping discussed above).
   
4. Meta data describing the created 'temperature' key is not generated.

## Description

**pdjr-skplugin-pgn130316** overcomes most of the limitations described
above by handling PGN 130316 messages in the following way:

1. A node path is selected from a user-defined mapping supplied in the
   plugin configuration.
   Node paths can be parameterised with the ```Temperature Source```
   and ```Instance``` field values derived from the PGN and also with
   a 'name' property value drawn from plugin configuration.

2. The PGN 130316 ```Set Temperature``` field value is parsed into
   Signal K.

3. PGN 130316 ```Temperature Source``` and ```Instance``` field values
   are saved in meta data associated with the generated Signal K keys.

4. 'unit' and 'description' properties are also included in the key
   meta data.

## Plugin configuration

The plugin includes the following embedded default configuration.

```
"configuration": {
  "temperatureMapping": [
    { "source": "0",  "path": "environment.water.${instance}", "name": "Sea Temperature" },
    { "source": "1",  "path": "environment.outside.${instance}", "name": "Outside Temperature" },
    { "source": "2",  "path": "environment.inside.${instance}", "name": "Inside Temperature" },
    { "source": "3",  "path": "environment.inside.engineRoom.${instance}", "name": "Engine Room Temperature" },
    { "source": "4",  "path": "environment.inside.mainCabin.${instance}", "name": "Main Cabin Temperature" },
    { "source": "5",  "path": "tanks.liveWell.${instance}", "name": "Live Well Temperature" },
    { "source": "6",  "path": "tanks.baitWell.${instance}", "name": "Bait Well Temperature" },
    { "source": "7",  "path": "environment.inside.refrigerator.${instance}", "name": "Refrigeration Temperature" },
    { "source": "7",  "path": "environment.inside.refrigerator.${instance}", "name": "Refridgeration Temperature" },
    { "source": "8",  "path": "environment.inside.heating.${instance}", "name": "Heating System Temperature" },
    { "source": "9",  "path": "environment.outside.dewPoint.${instance}", "name": "Dew Point Temperature" },
    { "source": "10", "path": "environment.outside.apparentWindChill.${instance}", "name": "Apparent Wind Chill Temperature" },
    { "source": "11", "path": "environment.outside.theoreticalWindChill.${instance}", "name": "Theoretical Wind Chill Temperature" },
    { "source": "12", "path": "environment.outside.heatIndex.${instance}", "name": "Heat Index Temperature" },
    { "source": "13", "path": "environment.inside.freezer.${instance}", "name": "Freezer Temperature" },
    { "source": "14", "path": "propulsion.exhaust.${instance}", "name": "Exhaust Gas Temperature" },
    { "source": "*",  "path": "sensors.temperature.${source}.${instance}" }
  ]                                                             
}                                                              
```

The 'temperatureMapping' array property is an ordered list of triples,
each of which defines the mapping between a 'source' property
and a Signal K 'path'.

When a PGN 130316 message arrives, its ```Source``` field value will
be compared sequentially with each 'source' value in
'temperatureMapping' and a Signal K storage path selected from the
first match.
The 'source' wildcard "*" can be used to match all ```Source``` field
values.

The optional 'name' property is generally used to introduce some
arbitrary text that will be embedded in the generated key meta data.
A parsing curiosity of canboatjs usesrequires that the 'name'
property of sources 0 through 14 be used as an aid to message
parsing and these values must not be changed or deleted in the plugin
configuration.

The default configuration file supplied with the plugin preserves as
far as possible the legacy Signal K path allocations with some
corrections for logical inconsistencies, especially by acknowledging
that *all* PGN 130316 messages will include an ```Instance``` field
value.

The last map in the example configuration shown above illustrates how
to provide a catch-all.

## Operation

The plugin will start processing PGN 130316 messages as soon as it is
installed.

## Author

Paul Reeve <*preeve_at_pdjr_dot_eu*>
