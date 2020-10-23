var functionWorking = require('function.working');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        functionWorking.updateWorking(creep);

	    if(creep.memory.working) {
            functionWorking.upgrade(creep);
        }
        else {
            functionWorking.harvest(creep);
        }
	}
};

module.exports = roleUpgrader;