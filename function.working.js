var functionWorking = {

    /** @param {Creep} creep **/
    updateWorking: function(creep) {
        if(creep.memory.working && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.working = false;
            creep.say('🔄 Collecting');
	    }
	    if(!creep.memory.working && creep.store.getFreeCapacity() == 0) {
	        creep.memory.working = true;
	        creep.say('🚧 Working');
	    }
    },

    /** @param {Creep} creep **/
    harvest: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
        }
        return true;
    },

    /** @param {Creep} creep **/
    transfer: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER) && 
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if(target) {
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        return false;
    },

    /** @param {Creep} creep **/
    repair: function(creep) {
        var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType != STRUCTURE_CONTROLLER &&
            structure.structureType != STRUCTURE_WALL &&
            structure.hits < 50
        });
        if(closestDamagedStructure) {
            if(creep.repair(closestDamagedStructure)==ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDamagedStructure.pos, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        else{
            return false;
        }
    },

    /** @param {Creep} creep **/
    build: function(creep) {
        var closestConstructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if(closestConstructionSite) {
            if(creep.build(closestConstructionSite) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestConstructionSite, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            return true;
        }
        return false;
    },

    /** @param {Creep} creep **/
    upgrade: function(creep) {
        if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
        }
        return true;
    },

    pickup: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },

}

module.exports = functionWorking;