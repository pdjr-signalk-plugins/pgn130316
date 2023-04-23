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

const Delta = require("./lib/signalk-libdelta/Delta.js");

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
      },
      "default": [
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
        { "source": ".*", "path": "sensors.temperature.<source>.<instance>" }
      ]
    }
  };

  plugin.uiSchema = {};

  plugin.start = function(options) {

    var paths = new Set();
    var delta = new Delta(app, plugin.id);

    app.emitPropertyValue('pgn-to-signalk', {
      130316: [
        {
          node: function(n2k) {
            var path = getPath(options.temperatureMapping, '' + n2k.fields['Source'], n2k.fields['Instance']);
            if (path) {
              path = path + '.' + 'temperature';
              if (!paths.has(path)) {
                paths.add(path);
                delta.addMeta(path, { "units": "K", "description": "Temperature, Extended Range", "source":  "" + n2k.fields['Source'], "instance": "" + n2k.fields['Index'] });
                delta.commit();
              }
            }
            return(path);
          },
          value: function(n2k) {
            return(n2k.fields['Temperature']);
          }
        },
        {
          node: function(n2k) {
            var path = getPath(options.temperatureMapping, '' + n2k.fields['Source'], n2k.fields['Instance']);
            if (path) {
              path = path + '.' + 'setTemperature';
              if (!paths.has(path)) {
                paths.add(path);
                delta.addMeta(path, { "units": "K", "description": "Temperature, Extended Range", "source":  "" + n2k.fields['Source'], "instance": "" + n2k.fields['Index'] });
                delta.commit();
              }
            }
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

  function getPath(mapping, source, instance) {
    var retval = undefined;
    var found = mapping.find(map => source.match(map.source));
    if (found) retval = (found.path.replace('<source>', source)).replace('<instance>', instance);
    return(retval);
  }
  
  return(plugin);
}
