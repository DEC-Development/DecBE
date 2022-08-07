scoreboard objectives add dierandom dummy
scoreboard objectives add dietest dummy
scoreboard players set @a dietest 0
scoreboard players set @e[type=player] dietest 1
tag @a[scores={dietest=0}] add alreadydie
tag @a[scores={dietest=0}] add dienow
scoreboard players random @a[tag=dienow,tag=!dieok,tag=!diemode] dierandom 1 3
execute @a[tag=dienow,tag=!dieok,tag=!diemode] ~~~ summon dec:gravestone 墓碑 ~~~
execute @a[tag=dienow,tag=!dieok,scores={dierandom=1},tag=!diemode] ~~~ summon dec:player_ghost 鬼魂 ~~~
execute @a[tag=dienow,tag=!dieok,tag=diemode] ~~~ summon dec:vengeful_ghost 怨魂 ~~~
xp -1L @a[tag=dienow,tag=!dieok]
tag @a[tag=dienow,tag=!dieok] add dieok
tag @e[tag=dienow,tag=dieok,type=player] remove dienow
tag @e[tag=!dienow,tag=dieok,type=player] remove dieok
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=wither] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:leaves_golem] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:entity_soul] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:entity_soul_1] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:shadow_soul_1] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:shadow_soul_2] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:predators] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:abyssal_controller] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:king_of_pillager] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:ash_knight] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:enchant_illager] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:enchant_illager_1] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:enchant_illager_2] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:everlasting_winter_ghast] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:everlasting_winter_ghast_1] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:host_of_deep] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:host_of_deep_1] add win_next
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:host_of_deep_2] add win
execute @a[scores={dietest=0}] ~~~ tag @e[r=64,type=dec:radiate_crystal] add win
execute @a[scores={dietest=0}] ~~~ tp @e[tag=win_next,type=!player] ~ -40 ~
execute @a[scores={dietest=0}] ~~~ kill @e[tag=win_next,type=!player]
execute @e[tag=win] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:killed_by_boss.name" } ] }
execute @a[scores={dietest=0}] ~~~ kill @e[tag=win_next,type=!player]
execute @a[scores={dietest=0}] ~~~ tp @e[tag=win,type=!player] ~ -40 ~
execute @a[scores={dietest=0}] ~~~ kill @e[tag=win,type=!player]

##召唤标语
execute @a[tag=entity_soul_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_entity_soul.name" } ] }
execute @a[tag=predators_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_predators.name" } ] }
execute @e[tag=abyssal_controller_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_abyssal_controller.name" } ] }
execute @e[tag=king_of_pillager_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_king_of_pillager.name" } ] }
execute @e[tag=ash_knight_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_ash_knight.name" } ] }
execute @e[tag=enchant_illager_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_enchant_illager.name" } ] }
execute @e[tag=host_of_deep_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_host_of_deep.name" } ] }
execute @e[tag=radiate_crystal_spawn] ~~~ tellraw @a { "rawtext" : [ { "translate" : "text.dec:summon_radiate_crystal.name" } ] }

tag @a[tag=abyssal_controller_spawn] remove abyssal_controller_spawn
tag @a[tag=king_of_pillager_spawn] remove king_of_pillager_spawn
tag @a[tag=predators_spawn] remove predators_spawn
tag @a[tag=entity_soul_spawn] remove entity_soul_spawn
tag @a[tag=ash_knight_spawn] remove ash_knight_spawn
tag @a[tag=enchant_illager_spawn] remove enchant_illager_spawn
tag @a[tag=host_of_deep_spawn] remove host_of_deep_spawn
tag @a[tag=radiate_crystal_spawn] remove radiate_crystal_spawn

##实体灵魂
execute @e[type=dec:shadow_soul_1] ~~~ effect @e[type=dec:entity_soul_1,c=1] strength 2 1
execute @e[type=dec:shadow_soul_2] ~~~ effect @e[type=dec:entity_soul_1,c=1] speed 2 1

##储存者召唤（不是BOSS！！！！！）
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§r魔法箱子碎片§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:chester
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§r魔法箱子碎片§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s

##Boss召唤

execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c神秘的邀请函§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add king_of_pillager_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c神秘的邀请函§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:king_of_pillager
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c神秘的邀请函§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s


execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c黑暗石§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add abyssal_controller_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c黑暗石§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:abyssal_controller
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c黑暗石§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s


execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c实体灵魂§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add entity_soul_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c实体灵魂§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:entity_soul
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c实体灵魂§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s


execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c灰烬挑战书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add ash_knight_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c灰烬挑战书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:ash_knight
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c灰烬挑战书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s


execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c蝙蝠诱饵§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add predators_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c蝙蝠诱饵§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:predators
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c蝙蝠诱饵§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s

execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c暗黑珍珠§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add enchant_illager_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c暗黑珍珠§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:enchant_illager
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c暗黑珍珠§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s

execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c深渊之书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add host_of_deep_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c深渊之书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 particle dec:host_of_deep_spawn_particle ~~~
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c深渊之书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:host_of_deep
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c深渊之书§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s

execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c辐射水晶§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 tag @p add radiate_crystal_spawn
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c辐射水晶§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 summon dec:radiate_crystal
execute @e[type=item,name=§r§r§r§r§r§r§r§r§r§c辐射水晶§r§r§r§r§r§r§r§r§r§r] ~~~ detect ~~-0.1~ dec:summoner 0 kill @s