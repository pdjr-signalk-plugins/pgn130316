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
    type: "object",
    properties : {
      root: {
        type: "string",
        title: "Root in the data store where keys should be placed",
        default: "sensors.temperature"
      },
      actualtemperature_keyname: {
        type: "string",
        title: "Name for the final element of the key",
        default: "actualTemperature"
      },
      settemperature_metaname: {
        type: "string",
        title: "Name for the meta property holding the temperature set point"
      }
    }
  };

  plugin.uiSchema = {};

  plugin.start = function(options) {
    app.emitPropertyValue('pgn-to-signalk', {
      130316: [
        {
          node: function(n2k) {
            var source = n2k.fields['Source'];
            var instance = n2k.fields['Instance'];
            if (typeof source == 'string') {
              source = source.replace(/ /g, '');
              source = source[0].toLowerCase() + source.slice(1);
            } else {
              source = 'undefined' + source;
            }
            return(options.root + '.' + source + '.' + instance + options.actualtemperature_keyname);
          },
          value: function(n2k) {
            return(n2k.fields['Temperature']);
          },
          meta: function(n2k) {
            var retval = {}; 
            retval["units"] = "K";
            retval["description"] = "Actual sensor temperature";
            retval[options.settemperature_metaname] = n2k.fields['Set Temperature']; 
            return(retval);
          }
        }
      ]
    });
  }

  plugin.stop = function() {
  }
  
  return(plugin);
}
