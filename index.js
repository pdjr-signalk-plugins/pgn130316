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
const PLUGIN_NAME = "PGN 130316";
const PLUGIN_DESCRIPTION = "Map PGN 130316 into Signal K";

module.exports = function(app) {
  var plugin = {};

  plugin.id = PLUGIN_ID;
  plugin.name = PLUGIN_NAME;
  plugin.description = PLUGIN_DESCRIPTION;

  plugin.schema = {};

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
              source = 'genericTemperature' + source;
            }
            return('sensors.temperature.' + source + '.' + instance + '.actualTemperature');
          },
          value: function(n2k) {
            return(n2k.fields('Temperature'));
          }
        },
        {
          node: function(n2k) {
            var source = n2k.fields['Source'];
            var instance = n2k.fields['Instance'];
            if (typeof source == 'string') {
              source = source.replace(/ /g, '');
              source = source[0].toLowerCase() + source.slice(1);
            } else {
              source = 'genericTemperature' + source;
            }
            return('sensors.temperature.' + source + '.' + instance + '.setTemperature');
          },
          value: function(n2k) {
            return(n2k.fields('Set Temperature'));
          }          
        }
      ]
    });
  }

  plugin.stop = function() {
  }
  
  return(plugin);
}

