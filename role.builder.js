var functionWorking = require('function.working');

var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {
		
		if(functionWorking.renew(creep)){
            return;
		}
		
	    functionWorking.updateWorking(creep);

	    if(creep.memory.working) {
			if(functionWorking.repair(creep) ||
				functionWorking.build(creep) ||
				functionWorking.upgrade(creep)
				){
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