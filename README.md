# pgn130316

Map PGN 130316 into Signal K.

**pgn130316** extends Signal K's NMEA 2000 interface by
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
   Inevitably, these default storage paths may not be to everyone's taste.

2. The mapping lacks comprehensive support for the NMEA ```Instance```
   field meaning that for some ```Temperature Source``` values PGN 130316
   messages from different sensor instances map to the same storage path.

3. The PGN 130316 ```Set Temperature``` field is not parsed into Signal K.

4. PGN 130316 ```Temperature Source``` and ```Instance``` field data is
   not saved to the Signal K store (although both values can be inferred
   by reversing the mapping discussed above).

5. Meta data describing the created 'temperature' key is not generated.

## Description

**pdjr-skplugin-pgn130316** overcomes the limitations described above
by handling PGN 130316 messages in the following way:

1. A node path is selected from a user-defined mapping supplied in the
   plugin configuration allowing PGN 130316 message data to be saved
   where the user wishes.

2. All storage paths can be parameterised with the ```Temperature Source```
   and ```Instance``` field values derived from the PGN and also with
   a 'name' property value drawn from plugin configuration.

3. The PGN 130316 ```Set Temperature``` field value is parsed into
   Signal K.

4. PGN 130316 ```Temperature Source``` and ```Instance``` field values
   are saved in meta data associated with the generated Signal K keys.

5. 'unit' and 'description' properties are included in the key meta
   data.

## Configuration

The plugin configuration has the following properties.

| Property name      | Value type | Value default | Description |
| :----------------- | :----------| :------------ | :-----------|
| temperatureMapping | Array      | (see above)   | Collection of *temperatureMap* objects.

The *temperatureMapping* array is an treated as an ordered list.

Each *temperatureMap* object has the following properties.

| Property name      | Value type | Value default | Description |
| :----------------- | :----------| :------------ | :-----------|
| source             | String     | (none)        | Integer in the range '0'..'253' or '*'. |
| path               | String     | (none)        | Signal K path where PGN 130316 data should be stored. |
| name               | String     | ''            | Identifying text to be used in Signal K meta data. |


The plugin includes the following embedded default configuration which
preserves as far as possible the stock Signal K path allocations with
some corrections for logical inconsistencies, mostly by acknowledging
that *all* PGN 130316 messages will include an ```Instance``` field
value.

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

## Operation

When a PGN 130316 message arrives, its ```Temperature Source``` field
value is compared with each *source* value in *temperatureMapping* and
a Signal K storage *path* and *name* selected from the first match.
The *source* wildcard '*' can be used to match any
```Temperature Source``` field value.

Path selection happens a little differently for PGNs with a
```Temperature Source``` field value in the range 0 through 14.
The meaning of these source codes is defined by the NMEA standard and
the low-level parser used in Signal K converts the numeric value into
its defined name, discarding the numeric value.

The plugin undoes this mangling by comparing the defined name
supplied by Signal K with the *name* field in the configuration data
and so identifies both a Signal K path and the original NMEA
```Temperature Source``` field value.
If you want to preserve the default mappings used in Signal K, then
do not change the 'name' properties for sources 0 through 14.

The last map in the example configuration shown above illustrates how
to provide a catch-all.

The plugin will start processing PGN 130316 messages as soon as it is
installed.

## Author

Paul Reeve <*preeve_at_pdjr_dot_eu*>
