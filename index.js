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
            "source" : {
              "type": "string"
            },
            "path" : {
              "type": "string"
            }
          }
        }
      }
      "default": [
        { "source": "Sea Temperature", "path": "environment.water.<index>" },
        { "source": "Outside Temperature", "path": "environment.outside.<index>" },
        { "source": "Inside Temperature", "path": "environment.inside.<index>" },
        { "source": "Engine Room Temperature", "path": "environment.inside.engineRoom.<index>" },
        { "source": "Main Cabin Temperature", "path": "environment.inside.mainCabin.<index>" },
        { "source": "Live Well Temperature", "path": "tanks.liveWell.<index>" },
        { "source": "Bait Well Temperature", "path": "tanks.baitWell.<index>" },
        { "source": "Refrigeration Temperature", "path": "environment.inside.refrigerator.<index>" },
        { "source": "Refridgeration Temperature", "path": "environment.inside.refrigerator.<index>" },
        { "source": "Heating System Temperature", "path": "sensors.temperature.heating.<index>" },
        { "source": "Dew Point Temperature", "path": "environment.outside.dewPoint.<index>" },
        { "source": "Apparent Wind Chill Temperature", "path": "environment.outside.apparentWindChill.<index>" },
        { "source": "Theoretical Wind Chill Temperature", "path": "environment.outside.theoreticalWindChill.<index>" },
        { "source": "Heat Index Temperature", "path": "environment.outside.heatIndex.<index>" },
        { "source": "Freezer Temperature", "path": "environment.inside.freezer.<index>" },
        { "source": "Exhaust Gas Temperature", "path": "propulsion.exhaust.<index>" },
        { "source": ".*", "path": "sensors.temperature.<source>.<index>" }
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

  function getPath(mapping, source, index) {
    var retval = undefined;
    var found = mapping.find((s,p) => source.match(s));
    if (found) retval = found.path.replace('<source>', source).replace('<index>', index);
    return(retval);
  }
  
  return(plugin);
}
