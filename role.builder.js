var functionWorking = require('function.working');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    functionWorking.updateWorking(creep);

	    if(creep.memory.working) {
			if(functionWorking.repair(creep) ||
				functionWorking.build(creep) ||
				functionWorking.transfer(creep)){
				return;
			}
		}
		else{
			if(functionWorking.collect(creep)){
                return;
            }
            else{
                functionWorking.harvest(creep);
            }
		}
	}
};

module.exports = roleBuilder;