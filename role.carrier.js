var functionWorking = require('function.working');

var roleCarrier = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(functionWorking.renew(creep)){
            return;
        }
        
        functionWorking.updateWorking(creep);
        
	    if(!creep.memory.working) {
            functionWorking.collect(creep);
        }
        else {
            if(functionWorking.transfer(creep)) {
                return;
            }
        }
	}
};

module.exports = roleCarrier;