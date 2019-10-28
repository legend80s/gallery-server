/**
 * fix "You attempted to import ../../lib/constants which falls outside of the project src/ directory. Relative imports outside of src/ are not supported."
 */
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const path = require("path");

module.exports = function override(config) {
  config.resolve.plugins.forEach(plugin => {
    if (plugin instanceof ModuleScopePlugin) {
      plugin.allowedFiles.add(path.resolve('../lib/constants'));
    }
  });

  return config;
};
