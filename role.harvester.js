var functionWorking = require('function.working');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {

        functionWorking.updateWorking(creep);
        
	    if(!creep.memory.working) {
            functionWorking.harvest(creep);
        }
        else {
            if(functionWorking.transfer(creep)) {
                return;
            }
            else if(functionWorking.repair(creep)) {
                return;
            }
            else if(functionWorking.build(creep)){
                return;
            }
            else{
                functionWorking.upgrade(creep);
                return;
            }
        }
	}
};

module.exports = roleHarvester;