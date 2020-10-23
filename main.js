var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleCarrier = require('role.carrier');
var functionSpawning = require('function.spawning');

module.exports.loop = function () {
    
    functionSpawning.clearMemory();

    functionSpawning.spawning();
    
    if(Game.spawns['Spawn1'].spawning) { 
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1, 
            Game.spawns['Spawn1'].pos.y, 
            {align: 'left', opacity: 0.8});
    }
    

    /** 
     * create the road
    let default_room = Game.spawns['Spawn1'].room;
    let path = default_room.findPath(Game.spawns['Spawn1'].pos,default_room.find(FIND_SOURCES)[0].pos,{ignoreCreeps: false});
    for(var i = 0;i<path.length;i++){
        let step = path[i];
        default_room.createConstructionSite(step.x, step.y, STRUCTURE_ROAD);
        console.log(step.x);
    }

    * Game.spawns['Spawn1'].room.createConstructionSite(5,18,STRUCTURE_EXTENSION);
    */
    
    var tower = Game.getObjectById('ca513ac7e41cc1db0d5e8094');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'carrier'){
            roleCarrier.run(creep);
        }
    }
}