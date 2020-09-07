/*
 * Copyright (c) 2020 Bitmark Inc. All rights reserved.
 */
'use strict';

const {
  Caveat
} = require("ocapld");
const jsonld = require('jsonld');

module.exports = class ActionCaveat extends Caveat {
  /**
   * @param [action] {string} allowed action. For example, 'read' or 'write
   */
  constructor({
    action
  } = {}) {
    super({
      type: 'capabilityAction'
    });
    this.allowedAction = action || 'read'
  }

  /**
   * Validate capability action
   */
  async validate(caveat) {
    try {
      const action = caveat.action;
      if (action !== this.action) {
        throw new Error('action mismatched');
      }
      return {
        valid: true
      };
    } catch (error) {
      return {
        valid: false,
        error
      };
    }
  }

  /**
   * Adds this caveat to a given capability.
   */
  async update(capability) {
    const allowedAction = this.allowedAction
    jsonld.addValue(capability, 'caveat', {
      type: this.type,
      allowedAction
    });
    return capability;
  }
};
