gamerule commandblockoutput false
gamerule doimmediaterespawn false

function boss
function block
function magic

tag @s remove shot
tag @s remove shot_offhand

execute @e[type=fireball] ~~~ particle dec:fire_wake_particle ~~~
execute @e[type=dragon_fireball] ~~~ particle dec:ender_wake_particle ~~~

##房主标记
execute @a[tag=owner] ~~~ tag @a add ownertest
execute @a[tag=!ownertest] ~~~ tag @a[tag=!ownertest] add owner

##死亡模式组件
execute @a[tag=diemode] ~~~ tag @a[tag=!diemode] add diemode
execute @a[tag=diemode] ~~~ title @a[tag=alreadydie] actionbar §4§lYou are Died
execute @a[tag=diemode] ~~~ tp @a[tag=alreadydie] 0 1000 0
execute @a[tag=diemode] ~~~ effect @a[tag=alreadydie] invisibility 20 0 true
execute @a[tag=diemode] ~~~ effect @a[tag=alreadydie] blindness 20 0 true
execute @a[tag=diemode] ~~~ effect @a[tag=alreadydie] night_vision 20 0 true
execute @a[tag=diemode] ~~~ gamerule sendcommandfeedback false