var functionSpawning = {

    roles: {
        carrier:{number:1, body:[CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]},
        harvester:{number:3, body:[WORK,WORK,WORK,MOVE]},
        builder:{number:1, body:[WORK,CARRY,CARRY,MOVE,MOVE,MOVE]},
        upgrader:{number:1, body:[WORK,WORK,CARRY,MOVE]},
    },

    clearMemory: function() {
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                console.log('Clearing non-existing creep memory:', name);
            }
        }
    },

    spawning: function() {
        for(var key in functionSpawning.roles){
            var number = _.filter(Game.creeps, (creep) => creep.memory.role == key.toString()).length;
            var role = functionSpawning.roles[key];
            if(number < role.number){
                functionSpawning.spawnCreep(key,role.body);
                return;
            }
        }
    },

    /** 
     * @param {String} role the role of new creep
     * @param {Array<String>} body the body of new creep
    **/
    spawnCreep: function(role, body) {
        var newName = role + Game.time;
        if(Game.spawns['Spawn1'].spawnCreep(body, newName, {memory: {role: role}}) == 0){
            console.log('Spawning new ' + role + ' : ' + newName);
        }
    },

}

module.exports = functionSpawning;