/**********************************************************************
 * Copyright 2022 Paul Reeve <preeve@pdjr.eu>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you
 * may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
 * implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

const PLUGIN_ID = "pgn130316";
const PLUGIN_NAME = "pdjr-skplugin-pgn130316";
const PLUGIN_DESCRIPTION = "Map PGN 130316 into Signal K";

module.exports = function(app) {
  var plugin = {};

  plugin.id = PLUGIN_ID;
  plugin.name = PLUGIN_NAME;
  plugin.description = PLUGIN_DESCRIPTION;

  plugin.schema = {
    "title": "Configuration for pdjr-skplugin-pgn130316",
    "type": "object",
    "required": [ "temperatureMapping" ],
    "properties": {
      "temperatureMapping": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "key" : {
              "type": "string"
            },
            "path" : {
              "type": "string"
            }
          }
        }
      }
      "default": [
        { "key": "Sea Temperature", "path": "environment.water.<index>" },
        { "key": "Outside Temperature", "path": "environment.outside.<index>" },
        { "key": "Inside Temperature", "path": "environment.inside.<index>" },
        { "key": "Engine Room Temperature", "path": "environment.inside.engineRoom.<index>" },
        { "key": "Main Cabin Temperature", "path": "environment.inside.mainCabin.<index>" },
        { "key": "Live Well Temperature", "path": "tanks.liveWell.<index>" },
        { "key": "Bait Well Temperature", "path": "tanks.baitWell.<index>" },
        { "key": "Refrigeration Temperature", "path": "environment.inside.refrigerator.<index>" },
        { "key": "Refridgeration Temperature", "path": "environment.inside.refrigerator.<index>" },
        { "key": "Heating System Temperature", "path": "sensors.temperature.heating.<index>" },
        { "key": "Dew Point Temperature", "path": "environment.outside.dewPoint.<index>" },
        { "key": "Apparent Wind Chill Temperature", "path": "environment.outside.apparentWindChill.<index>" },
        { "key": "Theoretical Wind Chill Temperature", "path": "environment.outside.theoreticalWindChill.<index>" },
        { "key": "Heat Index Temperature", "path": "environment.outside.heatIndex.<index>" },
        { "key": "Freezer Temperature", "path": "environment.inside.freezer.<index>" },
        { "key": "Exhaust Gas Temperature", "path": "propulsion.exhaust.<index>" }
      ]
    }
  };

  plugin.uiSchema = {};

  plugin.start = function(options) {

    app.emitPropertyValue('pgn-to-signalk', {
      130316: [
        {
          node: function(n2k) {
            var path = getPath(options.temperatureMapping, '' + n2k.fields['Source'], n2k.fields['Instance']);
            if (path) path = path + '.' + 'temperature';
            return(path);
          },
          value: function(n2k) {
            return(n2k.fields['Temperature']);
          }
        },
        {
          node: function(n2k) {
            var path = getPath(options.temperatureMapping, '' + n2k.fields['Source'], n2k.fields['Instance']);
            if (path) path = path + '.' + 'setTemperature';
            return(path);
          },
          value: function(n2k) {
            return(n2k.fields['Set Temperature']);
          }
        }
      ]
    });
  }

  plugin.stop = function() {
  }

  function getPath(mapping, key, index) {
    var retval = undefined;
    mapping.forEach(map => {
      if ((key.match(map.key)) && (!retval)) retval = map.path;
    });
    if (retval) retval = retval.replace('<index>', index);
    return(retval);
  }
  
  return(plugin);
}
