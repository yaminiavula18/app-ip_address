/*
  Import the ip-cidr npm package.
  See https://www.npmjs.com/package/ip-cidr
  The ip-cidr package exports a class.
  Assign the class definition to variable IPCIDR.
*/
const IPCIDR = require('ip-cidr');

/*
  Import the built-in path module.
  See https://nodejs.org/api/path.html
  The path module provides utilities for working with file and directory paths.
  IAP requires the path module to access local file modules.
  The path module exports an object.
  Assign the imported object to variable path.
*/
const path = require('path');

/**
 * Import helper function module located in the same directory
 * as this module. IAP requires the path object's join method
 * to unequivocally locate the file module.
 */
const { getIpv4MappedIpv6Address } = require(path.join(__dirname, 'ipv6.js'));


class IpAddress {
  constructor() {
    // IAP's global log object is used to output errors, warnings, and other
    // information to the console, IAP's log files, or a Syslog server.
    // For more information, consult the Log Class guide on the Itential
    // Developer Hub https://developer.itential.io/ located
    // under Documentation -> Developer Guides -> Log Class Guide
    log.info('Starting the IpAddress product.');
  }

  /**
  * Calculate and return the first host IP address from a CIDR subnet.
  * @param {string} cidrStr - The IPv4 subnet expressed
  *                 in CIDR format.
  * @param {callback} callback - A callback function.
  * @return {object} (firstIpAddress) - An object with two properties, ipv4 and ipv6,  
  *                 whose values are strings.  The ipv4 property will hold a four decimal
  *                 octets, dotted IPv4 address, e.g. 172.16.4.33.  The ipv6 propterty 
  *                 will hold an IPv6 address, e.g. 0:0:0:0:0:ffff:ac10:0421.       
  */
  getFirstIpAddress(cidrStr, callback) {

    // Initialize return arguments for firstIpAddress object and callback
    let firstIpAddress = {
        ipv4: null,
        ipv6: null
    };
    let callbackError = null;
  
    // Instantiate an object from the imported class and assign the instance to variable cidr.
    const cidr = new IPCIDR(cidrStr);
    // Initialize options for the toArray() method.
    // We want an offset of one and a limit of one.
    // This returns an array with a single element, the first host address from the subnet.
    const options = {
      from: 1,
      limit: 1
    };

    // Use the object's isValid() method to verify the passed CIDR.
    if (!cidr.isValid()) {
      // If the passed CIDR is invalid, set an error message.
      callbackError = 'Error: Invalid CIDR passed to getFirstIpAddress.';
    } else {
        // If the passed CIDR is valid, call the object's toArray() method.
        // Notice the destructuring assignment syntax to get the value of the first array's element.
        // Then retrieve an IPv6 mapped, IPv4 string by calling the getIpv4MappedIpv6Address() method.
        [firstIpAddress.ipv4] = cidr.toArray(options);
        firstIpAddress.ipv6 = getIpv4MappedIpv6Address(firstIpAddress.ipv4);
    }
    // Call the passed callback function.
    // Node.js convention is to pass error data as the first argument to a callback.
    // The IAP convention is to pass returned data as the first argument and error
    // data as the second argument to the callback function.
    return callback(firstIpAddress, callbackError);
  }
}


module.exports = new IpAddress;