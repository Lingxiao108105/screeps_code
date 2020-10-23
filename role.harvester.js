var functionWorking = require('function.working');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        

        functionWorking.harvest(creep);

    }
};

module.exports = roleHarvester;