var functionWorking = {

    collectionThreshold: 200,
    renewThreshold: 300,

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
        var harvestSource = creep.memory.harvestSource;
        //define the source it will harvest
        if(harvestSource == undefined){
            if(Game.spawns['Spawn1'].memory.harvestSource != 1){
                Game.spawns['Spawn1'].memory.harvestSource = 1;
            }
            else{
                Game.spawns['Spawn1'].memory.harvestSource = 0;
            }
            creep.memory.harvestSource = Game.spawns['Spawn1'].memory.harvestSource;
            harvestSource = creep.memory.harvestSource;
        }

        if(creep.harvest(sources[harvestSource]) == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[harvestSource], {visualizePathStyle: {stroke: '#ffaa00'}});
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
            (   (structure.structureType == STRUCTURE_CONTAINER && structure.hits < 100000) ||
                (structure.structureType == STRUCTURE_ROAD && structure.hits < 1000) ||
                structure.hits < 50
            )
            
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

    /** 
     * @param {Creep} creep 
     * @returns false means cannot go near controller
    **/
    upgrade: function(creep) {
        if(!creep.memory.upgrade){
            var controllerPos = creep.room.controller.pos;
            var path = creep.room.findPath(creep.pos, controllerPos);
            var nextDistance = controllerPos.getRangeTo(path[path.length-1].x, path[path.length-1].y);
            var distance = controllerPos.getRangeTo(creep.pos);

            if(path.length && distance != 1 && nextDistance < distance ){
                creep.moveByPath(path, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            else{
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                    return false;
                }
                else{
                    creep.memory.upgrade = true;
                }
            }
            return true;
        }
        else{
            if(creep.upgradeController(creep.room.controller) != OK){
                creep.memory.upgrade = false;
            }
        }
    },

    /** @param {Creep} creep **/
    pickup: function(creep) {
        var target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => resource.amount > this.collectionThreshold
        });
        return this.pickup(creep,target);
    },

    /** @param {Creep} creep 
     *  @param {Resource} target
    **/
    pickup: function(creep, target) {
        if(target) {
            if(creep.pickup(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },

    /** @param {Creep} creep **/
    withdrawFromContainer: function(creep){
        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > this.collectionThreshold
        });
        return withdrawFromContainer(creep,target);
    },

    /** @param {Creep} creep 
     *  @param {Resource} target
    **/
    withdrawFromContainer: function(creep, target){
        if(target) {
            if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return true;
        }
        return false;
    },

    /** @param {Creep} creep **/
    collect: function(creep){
        //the closest will be target
        var dropResource = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: (resource) => resource.amount > this.collectionThreshold
        });
        var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[RESOURCE_ENERGY] > this.collectionThreshold
        });

        if(dropResource && container){
            if(creep.pos.getRangeTo(dropResource) <= creep.pos.getRangeTo(container)){
                this.pickup(creep,dropResource);
            }
            else{
                this.withdrawFromContainer(creep,container);
            }
        }
        else if(dropResource){
            this.pickup(creep,dropResource);
        }
        else if(container){
            this.withdrawFromContainer(creep,container);
        }
        else{
            return false;
        }
        return true;
    },

    /** @param {Creep} creep **/
    renew: function(creep){
        if(creep.ticksToLive < this.renewThreshold){
            creep.memory.renew = true;
        }
        if(creep.memory.renew){
            if(creep.ticksToLive != creep.CREEP_LIFE_TIME){
                var status = Game.spawns['Spawn1'].renewCreep(creep);
                creep.say(status);
                if(status == OK || status == ERR_BUSY){
                    ;
                }
                else if(status == ERR_NOT_IN_RANGE){
                    creep.moveTo(Game.spawns['Spawn1'].pos);
                }
                else{
                    creep.memory.renew = false;
                }
            }
            else{
                creep.memory.renew = false;
            }
        }
        return creep.memory.renew;
    }
}

module.exports = functionWorking;